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
      upload: jest.fn((params, callback) => {
        if (params.Key === "error.jpg") {
          callback(new Error("Upload failed"), null);
        } else {
          callback(null, { Location: "https://s3.amazonaws.com/bucket/file.jpg" });
        }
      }),
    })),
  };
});

describe("Test s3 file upload function", () => {
  const mockCreateReadStream = jest.fn();
  beforeEach(() => {
    (fs.createReadStream as jest.Mock).mockImplementation(mockCreateReadStream);
  });

  it("should successfully upload a file", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    s3FileUpload("test.jpg", "filepath");

    expect(AWSConfig).toHaveBeenCalled();
    expect(fs.createReadStream).toHaveBeenCalledWith("filepath"); 
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "File uploaded successfully. File location:",
      "https://s3.amazonaws.com/bucket/file.jpg"
    );
  });

  it("should log an error when upload fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "log").mockImplementation();
    s3FileUpload("error.jpg", "filepath");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error uploading file:",
      expect.any(Error)
    );
  });

  it("should throw an error when an unexpected error occurs", () => {
    (AWSConfig as jest.Mock).mockImplementationOnce(() => {
      throw new Error("AWS setup error");
    });

    expect(() => s3FileUpload("test.jpg", "filepath")).toThrow(
      "Error occured while uploading file, AWS setup error"
    );
  });
});
