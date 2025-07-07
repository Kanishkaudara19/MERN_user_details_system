const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Image Model
const imgSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    size: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model(
    "ImgModel",//file name
    imgSchema // function name
)