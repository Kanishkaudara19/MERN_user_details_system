
//pass = bVCL0qs6IOzwSstm

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");


const app = express();
const cors = require("cors");

//Middleware
app.use(express.json());
app.use(cors());
app.use("/users", router);


mongoose.connect("mongodb+srv://admin:bVCL0qs6IOzwSstm@cluster0.ynvi0rx.mongodb.net/")
.then(()=>console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err) =>console.log(err));
