import {createServer} from 'http'
import {WebSocket, WebSocketServer } from "ws";
import redis, { Redis } from 'ioredis'


const server = createServer();
const wss = new WebSocketServer({ server });

const sub = new redis();
const pub = new redis();



sub.subscribe("chat_message")
sub.on('message', (channel, msg) => {
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg)
        }
    }
})

wss.on('connection', client => {
    //When a new message is received from a connected client,
    client.on('message', msg => {
        const message = msg.toString()
        console.log(message)

        pub.publish('chat_message', message)
    })
})



// const redisClient = new Redis();
// const redisClientXRead = new redis();

// wss.on('connection', client => {
//     //When a new message is received from a connected client,
//     client.on('message', msg => {
//         const message = msg.toString()
//         console.log(message )
//         redisClient.xadd('chat_message', message)
//     })
// })


server.listen(process.argv[2] || 8000, () => {
    console.log("Server is running on 8000");
})