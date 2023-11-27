const mongoose = require("mongoose");


const ItemSchema = mongoose.Schema({
    Photo:String,
    Price:Number,
    Title:String,
    Text:String,
    Categorie:String,
    Active:Boolean,
    Showcase:Boolean,
});

module.exports = mongoose.model("Item",ItemSchema);