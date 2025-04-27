const SSEServer = require('sse-fake-server');

SSEServer(client => {
    console.log('A szerverhez csatlakozott valaki');
    setInterval(() => {
        const msg = 'A pontos idő: ' + new Date().toISOString();
        //console.log(msg);
        client.send(msg);
    }, Math.random() * (10000 - 3000) + 3000);
});