import express from "express";
import multer from "multer";
import fs from "fs";
import { s3FileUpload } from "../Utils/s3-file-upload";
import { addUser } from "../Utils/add-user";

export const router = express.Router();

const uploadDir = "./tmp/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./tmp/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/health", (req, res) => {
  res.status(200).json({ message: "ok" });
});
router.post("/users", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    if (!req.body.firstName || !req.body.lastName) {
      res.status(400).json({ message: "Please provide all necesary fields." });
    }
    s3FileUpload(
      `${req.file.originalname}`,
      `tmp/images/${req.file.originalname}`
    );
    fs.unlinkSync(`${uploadDir}/${req.file.originalname}`);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      originalUrl: `https://originalimagesbkt.s3.ap-south-1.amazonaws.com/${req.file.originalname}`,
    };
    addUser(user);
    res.status(200).json({ message: "User creation Success." });
  } catch (e: any) {
    res.status(500).json({ message: `${e.message}` });
  }
});
