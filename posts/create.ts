import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();

export const create: Handler = async (event, context) => {
  const timestamp = new Date().getTime();
  const { content } = JSON.parse(event.body);
  if (typeof content !== "string") {
    console.error("Validation Failed");
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Item: {
      id: uuid.v1(),
      userId: context.identity?.cognitoIdentityId,
      content,
      likes: 0,
      createdAt: timestamp,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    const res = await dynamoDb
      .get({
        TableName: process.env.DYNAMODB_TABLE as string,
        Key: { id: params.Item.id },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(res.Item),
    };
  } catch (e) {
    console.error("Error:", e);
    return {
      statusCode: 500,
      body: "Couldn't create the post.",
    };
  }
};
