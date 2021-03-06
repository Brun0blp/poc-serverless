import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {

  const params = {
    TableName: process.env.tableName,
    KeyConditionExpression: "osId = :osId",
    ExpressionAttributeValues: {
      ":osId": event.pathParameters.osId
    }
  };

  const result = await dynamoDb.query(params);
  if ( ! result.Items) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Items;
});
