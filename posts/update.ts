import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const update: Handler = async (event, context) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.content !== "string") {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the post item.",
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      "#content": "content",
    },
    ExpressionAttributeValues: {
      ":content": data.content,
    },
    UpdateExpression: "SET #content = :content",
    ReturnValues: "ALL_NEW",
  };

  try {
    const res = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `Couldn't fetch the todo item. Error: ${e}`,
    };
  }
};
