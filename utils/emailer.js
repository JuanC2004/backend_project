require('dotenv').config();

const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');


const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});

const EmailSend = (clientEmail) => {
    const messageData = {
        from: 'Excited User <raquetRush@gmail.com',
        to: clientEmail,
        subject: 'Hola',
        text: 'probando el mailgun'
    };

    client.message.create(DOMAIN, messageData)
        .then((res) => {
            console.log("respuesta dentro del emailer", res);
        })
        .catch((err) => {
            console.log("error dentro del emailer", err);
        });
};

module.exports = {
    EmailSend
};