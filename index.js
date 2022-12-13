const path = require('path'); //dostęp do ścieżki aplikacji
const fs = require('fs');
const fsExtra = require('fs-extra');

const WebSocketServer = require('ws');



const bodyParser = require('body-parser');
const express = require('express'),
app = express()

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })

var webSockets = {};


app.get('*', async function (req, res, next) {
    return next();
});

wss.on('connection', function (ws, req) {
    console.log(req.url);
    var type = req.url.substr(1, 3);
    webSockets[type] = ws;
    console.log("Connected: " + type);

    ws.on('message', function (message) {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) {
            parsedMessage = message;
        }
        console.log(parsedMessage);

        switch (parsedMessage.type) {
            case "toService":
                console.log(parsedMessage);
            webSockets['dev'].send(JSON.stringify(parsedMessage));
                break;
            case "fromDevice":
                console.log(parsedMessage);
                webSockets['loc'].send(JSON.stringify(parsedMessage));
                    break;
            default:
                break;
        }

        /*if (type == 'src' && webSockets['des']) {
            webSockets['des'].send(JSON.stringify({
                callbackId: parsedMessage.callbackId,
                response: parsedMessage.response,
                errorStatus: parsedMessage.errorStatus
            }));
        } else if (type == 'des' && webSockets['src']) {
            webSockets['src'].send(JSON.stringify(parsedMessage));
        }*/
        return false;
    })

    ws.on('close', function (ev) {})
    return false;
})