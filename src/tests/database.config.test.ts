import AWS from "aws-sdk";
import { DynamoDB } from "../Configurations/database.config";

jest.mock("aws-sdk");

describe("Dynamo DB function testing", () => {
  test("should connect to dynamo db", () => {
    const spy = jest.spyOn(AWS, "DynamoDB");

    expect(DynamoDB).toBeInstanceOf(AWS.DynamoDB);
    expect(spy).toHaveBeenCalledWith({ region: "ap-south-1" });

    spy.mockRestore();
  });
});
