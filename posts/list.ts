import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const list: Handler = async (event, context) => {
  try {
    const res = await dynamoDb
      .scan({
        TableName: process.env.DYNAMODB_TABLE as string,
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(res.Items ?? []),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `Couldn't fetch the post item. Error: ${e}`,
    };
  }
};
