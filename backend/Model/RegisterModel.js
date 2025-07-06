const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regiSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    gmail:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model(
    "RegisterModel",//file name
    regiSchema // function name
)