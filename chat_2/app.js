const express = require("express")
const http = require('http');
const WebSocket = require('ws')

const port = 8000;
const server = http.createServer(express);
const wss = new WebSocket.Server({server})

server.listen(port, function(){
    console.log(`Server is listening on ${port}!`);
})

wss.broadcast = (message) => {
    wss.clients.forEach((client) => {
        client.send(message);
    });
};

wss.on("connection", function (ws) {
    ws.on("message", function (data) {
        wss.broadcast(data.toString());
    });

    // user connection
    wss.clients.forEach((client) => {
        wss.broadcast(`New User connecting π νμ¬ ${wss.clients.size} λͺ`)
    });

    // user close
    ws.on("close", () => {
        wss.broadcast(`Goodbye user π­ νμ¬ ${wss.clients.size} λͺ`);
    });

    // wss.clients.forEach(function each(client) {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //       client.send(data);
    //     }
    //   })

    // // λ©μΈμ§ μ μ‘
    function sendMessage() {
        const nickname = document.getElementById("nickname").value
        const message = document.getElementById("message").value
        const fullMessage = `${nickname}: ${message}`
    
        ws.send(fullMessage)
        clearMessage()
    }

    ws.onmessage = sendMessage

    // // λ©μΈμ§ μμ 
    function receiveMessage(event) {
        const chat = document.createElement("div")
        const message = document.createTextNode(event.data)
        chat.appendChild(message)

        const chatLog = document.getElementById("chat-log")
        chatLog.appendChild(chat)
    }
    
    ws.onmessage = receiveMessage

    // // input λΉμ°κΈ°
    function clearMessage() {
        document.getElementById("message").value = '';
    }
})