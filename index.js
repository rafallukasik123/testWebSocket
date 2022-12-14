const path = require('path'); //dostęp do ścieżki aplikacji
const fs = require('fs');
const fsExtra = require('fs-extra');

const WebSocket = require('ws');



const bodyParser = require('body-parser');
const express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const ws = new WebSocket.Server({
    server
});

var webSockets = {};


app.get('*', async function (req, res, next) {
    return next();
});

ws.on('connection', function (ws, req) {
    console.info(req.url);
    var type = req.url.substr(1, 3);
    webSockets[type] = ws;
    console.info("Connected: " + type);

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
                console.info(parsedMessage);
            webSockets['dev'].send(JSON.stringify(parsedMessage));
                break;
            case "fromDevice":
                console.info(parsedMessage);
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
server.listen(port, () => {
  console.info(`Server running on port: ${port}`);
} )