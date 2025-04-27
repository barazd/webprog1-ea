const SSEServer = require('sse-fake-server');

SSEServer(client => {
    setInterval(() => {
        client.send('A pontos idő: ' + Date.now().toPrecisionString())
    }, Math.random() * (5000 - 500) + 500);
});