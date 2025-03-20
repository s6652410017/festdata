const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { request } = require("http");
const { response } = require("express");
const { info } = require("console");
 
const prisma = new PrismaClient();
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "user_" +
        Math.floor(Math.random() * Date.now()) +
        path.extname(file.originalname)
    );
  },
});
 
exports.uploadUser = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only");
  },
}).single("userImage");
 
// Create User
exports.createUser = async (req, res) => {
  try {
    const result = await prisma.user_tb.create({
      data: {
        userFullname: req.body.userfullname,
        userName: req.body.userName,
        userPassword: req.body.userPassword,
        userImage: req.file ? req.file.path.replace("images\\users\\", "") : "",
      },
    });
 
    res.status(200).json({
      message: "User created successfully",
      info: result,
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error Occurred" });
    console.log(`Error: ${err.message}`);
  }
};
 
exports.checkUserLogin = async (req, res) => {
  try {
    const result = await prisma.user_tb.findFirst({
      where: {
        userName: req.params.userName,
        userPassword: req.params.userPassword,
      },
    });
 
    if (result) {
      res.status(200).json({
        message: "User found",
        info: result,
      });
    } else {
      res.status(404).json({
        message: "User not found",
        info: result,
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Error Occurred" });
    console.log(`Error: ${err.message}`);
  }
};
 
exports.updateUser = async (req, res) => {
  try {
    let result = {};
    if (req.file) {
      let userResault = await prisma.user_tb.findFirst({
        where: {
          userId: parseInt(req.params.userId),
        },
      });
      if (userResault.userImage) {
        fs.unlinkSync(path.join("images/users", userResault.userImage));
      }
      result = await prisma.user_tb.update({
        where: {
          userId: parseInt(req.params.userId),
        },
        data: {
          userFullname: req.body.userfullname,
          userName: req.body.userName,
          userPassword: req.body.userPassword,
          userImage: req.file
            ? req.file.path.replace("images\\users\\", "")
            : "",
        },
      });
    } else {
      result = await prisma.user_tb.update({
        where: {
          userId: parseInt(req.params.userId),
        },
        data: {
          userFullname: req.body.userfullname,
          userName: req.body.userName,
          userPassword: req.body.userPassword,
        },
      });
    }
    res.status(200).json({
      // also fixed response to res
      massage: "ok",
      info: result,
    });
  } catch (error) {
    res.status(500).send({ massage: "พบปัญหา: ${error} " });
    console.log(`Error: ${error}`);
  }
};
 