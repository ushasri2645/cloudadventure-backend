import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
import { AWSConfig } from "../Configurations/aws.config";
dotenv.config();

export const s3FileUpload = async(fileName: string, path: string) => {
  try {
    AWSConfig();
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'originalimagesbkt',
      Key: fileName,
      Body: fs.createReadStream(path),
      ACL: "public-read",
    };
    // s3.upload(params, (err: any, data: { Location: any }) => {
    //   if (err) {
    //     console.log("Error uploading file:", err);
    //   } else {
    //     console.log(
    //       "File uploaded successfully. File location:",
    //       data.Location
    //     );
    //   }
    // });
    const data = await s3.upload(params).promise();
    console.log("image added succesfully"+data.Location)
  } catch (e:any) {
    throw new Error(`Error occured while uploading file, ${e.message}`)
  }
};
