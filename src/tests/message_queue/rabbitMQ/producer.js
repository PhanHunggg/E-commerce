"use strict";
const amqp = require("amqplib");

const message = "Hello, RabbitMQ";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:PhanHung28@@localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    //send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("Message sent: ", message);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
