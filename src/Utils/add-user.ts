import { AWSConfig } from "../Configurations/aws.config";
import { DynamoDB } from "../Configurations/database.config";

export function addUser(user: any) {
  try {
    AWSConfig();
    const params = {
      TableName: "users",
      Item: {
        firstName: { S: user.firstName },
        lastName: { S: user.lastName },
        originalUrl: { S: user.originalUrl },
      },
    };

    DynamoDB.putItem(params, function (err) {
      if (err) {
        console.error(`Unable to add user ${err.message}`);
      } else {
        console.log(`Added item to db`);
      }
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
