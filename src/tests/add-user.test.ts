import { AWSConfig } from "../Configurations/aws.config";
import { DynamoDB } from "../Configurations/database.config";
import { addUser } from "../Utils/add-user";

jest.mock("../Configurations/aws.config", () => ({
  AWSConfig: jest.fn(),
}));

jest.mock("../Configurations/database.config", () => ({
  DynamoDB: {
    putItem: jest.fn(),
  },
}));

describe("Add user function", () => {
  it("It should call AWSConfig and DynamoDB.putItem with correct parameters", () => {
    const user = {
      firstName: "Usha",
      lastName: "Sri",
      originalUrl: "www.usha.com",
    };

    addUser(user);
    expect(AWSConfig).toHaveBeenCalled();

    expect(DynamoDB.putItem).toHaveBeenCalledWith(
      {
        TableName: "users",
        Item: {
          firstName: { S: "Usha" },
          lastName: { S: "Sri" },
          originalUrl: { S: "www.usha.com" },
        },
      },
      expect.any(Function)
    );
  });
  it("should log an error if DynamoDB.putItem fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (DynamoDB.putItem as jest.Mock).mockImplementationOnce((_, callback) =>
      callback(new Error("DynamoDB Error"))
    );

    const user = {
      firstName: "Usha",
      lastName: "Sri",
      originalUrl: "www.usha.com",
    };
    addUser(user);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unable to add user DynamoDB Error"
    );
    consoleErrorSpy.mockRestore();
  });
  it("should not throw any error and add to db", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    (DynamoDB.putItem as jest.Mock).mockImplementationOnce((_, callback) =>
      callback()
    );

    const user = {
      firstName: "Usha",
      lastName: "Sri",
      originalUrl: "www.usha.com",
    };
    addUser(user);
    expect(consoleLogSpy).toHaveBeenCalledWith("Added item to db");
    consoleLogSpy.mockRestore();
  });
  it("should throw error if something goes wrong", () => {
    (AWSConfig as jest.Mock).mockImplementationOnce(() => {
      throw new Error("AWS Config Error");
    });

    const user = {
      firstName: "Usha",
      lastName: "Sri",
      originalUrl: "www.usha.com",
    };

    expect(() => addUser(user)).toThrow("AWS Config Error");
  });
});
