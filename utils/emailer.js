require('dotenv').config();

const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

const EmailSend = (verifyCode) => {
    const messageData = {
      from: 'Excited User <raquetrush@gmail.com>',
      to: 'juanc.quinteroh@autonoma.edu.co',
      subject: 'verification Code',
      text: `Hola Camilo, este es el codigo de verificación: ${verifyCode}`
    };
  
    client.messages.create(DOMAIN, messageData)
      .then((res) => {
        console.log("respuesta dentro del emailer", res);
      })
      .catch((err) => {
        console.error("error dentro del emailer", err);
      });
  };

module.exports = {
    EmailSend
};
