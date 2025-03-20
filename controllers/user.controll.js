const {PrismaClient} = require("@prisma/client")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { response } = require("express")
 
const prisma = PrismaClient();
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/user");
    } ,
    filename: (req, file, cb) => {
        cb(null, 'user_'+ Math.floor(Math.random()* Date.now()) + path.extname(file.originalname));
    }
})
 
exports.uploadUser = multer({
     storage: storage,
     limits: {
         fileSize: 1000000
     },
     fileFilter: (req, file, cb) => {
         const fileTypes = /jpeg|jpg|png/;
         const mimeType = fileTypes.test(file.mimetype);
         const extname = fileTypes.test(path.extname(file.originalname));
         if(mimeType && extname) {
             return cb(null, true);
         }
         cb("Error: Images Only");
     }
}).single("userImage");
 
exports.createUser = async  (req, res) => {
    try{
        const resault = await prisma.user_tb.create({
            data : {
                      userFullname: request.body.userfullname,
            userName: request.body.userName,
            userPassword: request.body.userPassword,
            userImage:request.file ? require.file.path.replace("images\\user\\,") : "" ,
            }
      
    })
    response.status(200).json({
        message: "OK",
        info: resault
    });
    }catch(err){
        response.status(500).send({ message: err.message || "Error Occured" });
        console.log(`Error: ${error}`);
    }
}