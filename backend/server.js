
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import chats from "./data/data.js";
import colors from 'colors';
import connectToMongoDB from "./config/connectToMongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import cookieParser from 'cookie-parser';

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import {errorHandler, notFound} from "./middleware/errorMiddleware.js";

import { Server } from "socket.io";
import {sessionMiddleware} from "./middleware/sessionMiddleware.js";
import crypto  from 'crypto';

const PORT  = process.env.PORT || 5000;
const app = express();
//app.use(cors());
dotenv.config();
connectToMongoDB();


const corsOptions = {
    origin: 'http://localhost:3000', // URL вашого фронтенду
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.json());  //to parse the incoming requests with JSON payloads (from req.body)

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);
connectCloudinary();

const server = app.listen(PORT, ()=> {
    // connectToMongoDB();
    console.log(`Server running onon port ${PORT} також внатурі`.rainbow.bold);
    console.log(`Server running onon port ${PORT} тttакож ввнатурі`.cyan.bold);
    console.log(`Server running onon port ${PORT} також внатурі`.america.bold);
});

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT"],
    },
});

io.on("connection", (socket) => {
    //console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        //console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

