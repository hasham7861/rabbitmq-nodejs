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

    channel.assertQueue(queue, {
       // to not lose message incase of server crash
      durable: true
    });

    // process one message at a time for worker, not just rounrobin assign tasks to overbudden worker
    channel.prefetch(1);
    
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    }, {
      // manual acknowledgment mode,
      // see /docs/confirms for details
      // incase of server crash, it will requeue the message to another worker
      noAck: false
    });
  });
});