const bcrypt = require("bcryptjs");
const Item = require("../models/item");
const image = require("../utils/image");

async function getItems(req, res) {
    try {
        const { active } = req.query;
        let response = null;

        if (active === undefined) {
            response = await Item.find();
        }else{
            response = await Item.find({ Active });
        }

        res.status(200).send(response);
    }catch (error) {
        console.error("Error al obtener los items: ",error);
        res.status(500).send({ msg: "Error interno del servidor" });
    }
}

async function createItem(req, res) {
    try{
        const item = new Item({ ...req.body, Active: false, Showcase: false});


        const itemStored = await item.save();
        console.log("Se ha creado el item", item);
        res.status(201).send(itemStored);
    }catch (error){
        console.error("Error al crear el item: ",error);
        res.status(400).send({ msg: "Error al crear el item" });
    }
}

async function updateItem(req, res){
    try {
        const { id } = req.params;
        const itemData = req.body;

        await Item.findByIdAndUpdate({ _id: id }, itemData).exec();
        console.log("Item actualizado", itemData);
        res.status(200).send({ msg: "Actualización correcta" });
    }catch (error) {
        console.error("Error al actualizar el item:", error);
        res.status(400).send({ msg: "Error al actualizar el item" });
    }
}

async function deleteItem(req, res) {
    try {
        const { id } = req.params;

        await Item.findByIdAndDelete(id).exec();
        res.status(200).send({ msg: "item eliminado"});
    } catch (error) {
        console.error("Error al eliminar el item: ",error);
        res.status(400).send({ msg: "Error al eliminar el item" });
    }
}

module.exports = {
    getItems,
    createItem,
    updateItem,
    deleteItem,
};