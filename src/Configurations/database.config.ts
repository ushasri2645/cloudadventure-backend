import AWS from "aws-sdk";

export const DynamoDB = new AWS.DynamoDB({
  region: "ap-south-1",
});
