
//pass = bVCL0qs6IOzwSstm

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");
const path = require("path");
const fs = require('fs');
const jwt = require("jsonwebtoken");
require("dotenv").config();
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
            const token = jwt.sign(
        { id: user._id, gmail: user.gmail,name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return res.send({ status: "ok", token });
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

//image part

 require("./Model/ImgModel");

 const ImgModel = mongoose.model("ImgModel");

// const multerimg = require("multer");

// const storageimg = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../frontend/src/Components/Gallery/files');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + file.originalname);
//     }
// });

// const uploadimg = multerimg({storage:storage});

// app.post("/uploadImg",upload.single("image"),async(req,res)=>{
//     console.log(req.body);
//     const imageName = req.file.filename;

//     try {
//         await imgSchema.create({Image:imageName});
//         res.json({status:"ok"});
        
//     } catch (error) {
//         res.json({status:error});
//     }
// });

// //Display image

// app.get("/getImage",async(req,res) =>{
//     try {
//         imgSchema.find({}).then((data)=>{
//             res.send({status:"ok",data:data});
//         })
//     } catch (error) {
//         res.json({status:error});
//     }
// })

/////////////////////////////////////////////////////
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../frontend/public/images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve static files from uploads directory
app.use('../frontend/public/images', express.static(uploadsDir));

// Multer configuration for file upload
const storageimg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadimg = multer({ 
    storage: storageimg,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
        }
    }
});

// Upload image endpoint
app.post("/uploadImg", uploadimg.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                status: "error", 
                message: "No file uploaded" 
            });
        }

        console.log("File uploaded:", req.file);
        
        const newImage = new ImgModel({
            image: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });

        await newImage.save();
        
        res.json({ 
            status: "ok",
            message: "Image uploaded successfully",
            data: newImage
        });
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error uploading image",
            error: error.message 
        });
    }
});

// Get all images endpoint
app.get("/getImage", async (req, res) => {
    try {
        const images = await ImgModel.find({}).sort({ uploadDate: -1 });
        res.json({ 
            status: "ok", 
            data: images 
        });
    } catch (error) {
        console.error("Get images error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error fetching images",
            error: error.message 
        });
    }
});

// Delete image endpoint
app.delete("/deleteImage/:id", async (req, res) => {
    try {
        const image = await ImgModel.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ 
                status: "error", 
                message: "Image not found" 
            });
        }

        // Delete file from filesystem
        const filePath = path.join(uploadsDir, image.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await ImgModel.findByIdAndDelete(req.params.id);
        
        res.json({ 
            status: "ok", 
            message: "Image deleted successfully" 
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error deleting image",
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    res.status(500).json({
        status: 'error',
        message: error.message || 'Something went wrong!'
    });
});
