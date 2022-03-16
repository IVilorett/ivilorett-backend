import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const get: Handler = async (event, context) => {
  try {
    const res = await dynamoDb
      .query({
        TableName: process.env.DYNAMODB_TABLE as string,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": event.pathParameters.id,
        },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(res.Items?.[0] ?? []),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `Couldn't fetch the post item. Error: ${e}`,
    };
  }
};
