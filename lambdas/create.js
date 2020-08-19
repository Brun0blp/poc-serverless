import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

async function getDelivery(data) {

  const params = {
    TableName: process.env.tableName,
    Key: {
      osId: data.osId,
      deliveryId: data.deliveryId
    }
  };

  const result = await dynamoDb.get(params);

  return result.Item;
}

export const main = handler(async (event, context) => {

  const data = JSON.parse(event.body);
  const delivery = await getDelivery(data);

  const params = {
    TableName: process.env.tableName,
    Item: {
      osId: data.osId,
      deliveryId: data.deliveryId
    }
  };

  if (!delivery) {

    params.Item.creationTime = Date.now();
    params.Item.locations = data.locations;

  } else {

    params.Item.locations = delivery.creationTime;
    params.Item.locations = delivery.locations.concat(data.locations);
  }

  await dynamoDb.put(params);

  return params.Item;
});
