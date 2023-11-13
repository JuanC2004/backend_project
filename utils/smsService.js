require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const smsSend = () => {


    client.messages
    .create({
        body: 'Hola Camilo',
        from: '+12054985500',
        to: '+573017457749'
    })
    .then(message => console.log("message.sid", message.sid));
}
module.exports={
    smsSend
}