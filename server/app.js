import express from 'express';
const app = express();

import cors from 'cors';
const port = 3000;
import { Server } from 'socket.io';
import { createServer } from 'http';

const server = createServer(app);
const io = new Server(server,{
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
});

// app.use(
//     cors({
//       origin: 'http://localhost:5173', // Allowed origin
//       methods: 'GET,POST', // Allowed methods
//       credentials: true, // Agar aapko cookies wagaira bhi chahiye ho
//     })
// );

app.get('/', (req,res) => {
    res.send("Hello");
})

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    //socket.emit("welcome", `Welcome to the server, ${socket.id}`);
    //socket.broadcast.emit("welcome", `${socket.id} joined the server`);

    // socket.on("message", (data) => {
    //     console.log(data);
    //     // io.emit("receive-message", data);
    //     socket.broadcast.emit("receive-message", data);
    // })

    socket.on("message", ({room, message}) => {
        console.log({ room, message });
        io.to(room).emit("receive-message", message); // both syntax same work io and socket work in room
        //socket.to(room).emit("receive-message", message);
    })

    socket.on("join-room", (room) =>{
        console.log(room);
        socket.join(room.id);
        console.log(`User joined room ${room.id}`);
    })

    socket.on("disconnect",() => {
        console.log(`User disconnected ${socket.id}`);
    })
})


server.listen(port, (req, res) => {
    console.log(`Server listen on port ${port}`);
})