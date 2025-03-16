import AWS from "aws-sdk";
import { AWSConfig } from "../Configurations/aws.config";

jest.mock('aws-sdk')

describe("AWSConfig function", () => {
  test("should update AWS SDK configuration with environment variables", () => {
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
    const updateMock = jest.spyOn(AWS.config, "update");
    AWSConfig();
    expect(updateMock).toHaveBeenCalledWith({
      region: "ap-south-1",
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
    });
    updateMock.mockRestore();
  });
});
