const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT;


const users =[{}];
const server = http.createServer(app);
const io= socketIO(server);
app.use(cors());
io.on('connection',(socket)=>{
    console.log('new connection');
    socket.on('joined',({user})=>{
    users[socket.id]=user;
    
    socket.broadcast.emit('userJoined',{user:"admin",message:`${users[socket.id]} has joined`});
    socket.emit('welcome',{user:"Admin",message:`welcome to the chat,${users[socket.id]}`});
    });

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} has left`});

    })
    
    
})
app.get('/',(req,res)=>{
    res.send('HI');
})
server.listen(port,()=>{
    console.log("server is listening at port",port);
})