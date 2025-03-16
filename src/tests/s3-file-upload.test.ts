import fs from "fs";
import { s3FileUpload } from "../Utils/s3-file-upload";
import { AWSConfig } from "../Configurations/aws.config";

jest.mock("fs");
jest.mock("../Configurations/aws.config", () => ({
  AWSConfig: jest.fn(),
}));

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      upload: jest.fn().mockReturnThis(),
      promise: jest.fn().mockImplementation(function (this: { Key: string }) {
        if ((this as any).Key === "error.jpg") {
          return Promise.reject(new Error("Upload failed"));
        }
        return Promise.resolve({ Location: "https://s3.amazonaws.com/bucket/file.jpg" });
      }),
    })),
  };
});

describe("Test s3 file upload function", () => {
  const mockCreateReadStream = jest.fn();

  beforeEach(() => {
    (fs.createReadStream as jest.Mock).mockImplementation(mockCreateReadStream);
  });

  it("should successfully upload a file", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    await s3FileUpload("test.jpg", "filepath");
    expect(AWSConfig).toHaveBeenCalled();
    expect(fs.createReadStream).toHaveBeenCalledWith("filepath"); 
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "image added succesfully" + "https://s3.amazonaws.com/bucket/file.jpg"
    );
  });
  it("should throw an error when an unexpected error occurs", async () => {
    (AWSConfig as jest.Mock).mockImplementationOnce(() => {
      throw new Error("AWS setup error");
    });
    await expect(s3FileUpload("test.jpg", "filepath")).rejects.toThrow(
      "Error occured while uploading file, AWS setup error"
    );
  });
});
