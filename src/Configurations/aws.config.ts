import AWS from "aws-sdk";

export const AWSConfig = () => {
  console.log(process.env.AWS_ACCESS_KEY_ID,process.env.AWS_SECRET_ACCESS_KEY)
  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
};
