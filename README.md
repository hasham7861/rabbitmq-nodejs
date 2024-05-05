# Basic work queue example with rabitmq

- start the rabitmq service with docker-compose.yml
- you can run as many workers you want with node worker.js
- then to send new task, you can run node new_task.js and it will send the messages to available workers