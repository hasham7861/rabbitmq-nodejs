#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(queue, {
      // to not lose message incase of server crash
      durable: true
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      // save the message to disk on worker
      persistent: true
    });
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});