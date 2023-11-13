const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const axios = require("axios");
const emailer = require("../utils/emailer")
const smsmailer = require("../utils/smsService")

//registro de un usuario nuevo en el sistema
const register = async (req, res) => {
    const { 
            firstname, 
            lastname, 
            email, 
            password, 
            country, 
            department, 
            municipality, 
            document_type, 
            document
        } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es requerido "});
    if (!password) return res.status(400).send({ msg: "La contraseña es requerida "});
    if (!document) return res.status(400).send({ msg: "El documento es requerida "});

    const response = await axios.get("https://www.datos.gov.co/resource/xdk5-pm3f.json");
    const data = response.data;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const generateRandomCode = () => Math.floor(Math.random()*(999999 - 100000 +1)) + 100000;
    const verifyCode = generateRandomCode();

    const Mun = data.filter(register => register.municipio === municipality);
    const Dep = data.filter(register => register.departamento === department);

   
    console.log("Mun",Mun);
    console.log("Dep",Dep);

    if (Dep.length === 0) return res.status(400).send({msg: "El departamento no se encuentra" });
    if (Mun.length === 0) return res.status(400).send({msg: "El Municipio no se encuentra"});
    

    //const hashPassword = await bcrypt.hash(password,salt);

    const user = new User({
        firstname,
        lastname,
        country: "Colombia",
        department,
        municipality,
        document_type,
        document,
        email: email.toLowerCase(),
        password: hashPassword,
        role: "user",
        active: false,
        verifyCode,
    });

    try {
        const userStorage = await user.save();
        res.status(201).send(userStorage);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el usuario" + error});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!password) {
            throw new Error("la contraseña es obligatoria");
        }
        if(!email){
            throw new Error("El email es obligatorio");
        }
        const emailLowerCase = email.toLowerCase();
        const userStore = await User.findOne({ email: emailLowerCase }).exec();
        if (!userStore){
            throw new Error("El usuario no existe");
        }
        const check = await bcrypt.compare(password, userStore.password);
        if (!check){
            throw new Error("Contraseña incorrecta");
        }
        if (!userStore.active){
            throw new Error("Usuario no autorizado o no activo");
        }
        res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
        })
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
};

async function refreshAccessToken(req, res){
    const {token} = req.body;
    if (!token){
        return res.status(401).send({ msg: "Token requerido"});
    }
    try {
        const { user_id } = jwt.decoded(token);
        const userStorage = await User.findOne({_id: user_id});
        if (!userStorage) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }
        const accessToken = jwt.createAccessToken(userStorage);
        return res.status(200).send({ accessToken });
    } catch (error) {
        console.error("Error del servidor: ", error);
        return res.status(500).send({ msg: "Error del servidor "});
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken
};
