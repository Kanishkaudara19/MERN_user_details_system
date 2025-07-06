
//pass = bVCL0qs6IOzwSstm

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");
const path = require("path");

const app = express();
const cors = require("cors");

//Middleware
app.use(express.json());
app.use(cors());
app.use("/users", router);
app.use("/files", express.static("files"));


mongoose.connect("mongodb+srv://admin:bVCL0qs6IOzwSstm@cluster0.ynvi0rx.mongodb.net/")
.then(()=>console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err) =>console.log(err));

//Call Register Model

require("./Model/RegisterModel");
const User = mongoose.model("RegisterModel");
app.post("/register",async(req,res)=>{
    const {name,gmail,password} = req.body;
    try{
        await User.create({
            name,
            gmail,
            password,
        })
        res.send({status:"ok"});
    }catch{
        res.send({status:"err"});
    }
});

//Login 
app.post("/login", async (req, res) => {
    const { gmail, password } = req.body;
    try {
        const user = await User.findOne({ gmail })
        if (!user) {
            return res.json({ err: "User not found" });
        }
        if (user.password === password) {
            return res.send({ status: "ok" });
        } else {
            return res.send({ err: "incorrect password" });
        }
    } catch (err){
        console.error(err);
        res.status(500).json({ err: " server err" });
    }
});

//Pdf Storage Configuration
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './file')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});

//Insert Pdf part
require("./Model/PdfModel");
const pdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage });

app.post("/uploadfile", upload.single("file"), async (req, res) => {
    console.log("File received:", req.file);
    console.log("Request body:", req.body);
    
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).send({ 
            status: 400, 
            message: "No file uploaded" 
        });
    }
    
    const title = req.body.title;
    const pdf = req.file.filename;

    // Validate title
    if (!title || title.trim() === '') {
        return res.status(400).send({ 
            status: 400, 
            message: "Title is required" 
        });
    }

    try {
        await pdfSchema.create({ title: title.trim(), pdf: pdf });
        console.log("PDF Upload Successfully");
        res.send({ 
            status: 200, 
            message: "PDF uploaded successfully",
            data: { title: title.trim(), pdf: pdf }
        });
    } catch (err) {
        console.log("Database error:", err);
        res.status(500).send({ 
            status: 500, 
            message: "Database error occurred" 
        });
    }
});

// Get all PDFs
app.get("/getfile", async (req, res) => {
    try {
        const pdfs = await pdfSchema.find({});
        res.send({
            status: 200,
            data: pdfs
        });
    } catch (err) {
        console.log("Error fetching PDFs:", err);
        res.status(500).send({
            status: 500,
            message: "Error fetching PDFs"
        });
    }
});

// Delete PDF
app.delete("/deletefile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pdfSchema.findByIdAndDelete(id);
        res.send({
            status: 200,
            message: "PDF deleted successfully"
        });
    } catch (err) {
        console.log("Error deleting PDF:", err);
        res.status(500).send({
            status: 500,
            message: "Error deleting PDF"
        });
    }
});

// Serve PDF files
app.get("/files/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'file', filename);
    res.sendFile(filePath);
});

app.get("/getFile",async(req,res)=>{
    try{
        const data = await pdfSchema.find({});
        res.send({status:200,data:data});
    }catch(err){
        console.log(err);
        res.status(500).send({ status: "error" });
    }
});

