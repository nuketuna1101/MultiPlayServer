//====================================================================================================================
//====================================================================================================================
// server.js
// 서버의 메인 진입점
//====================================================================================================================
//====================================================================================================================import net from 'net';
import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

const server = net.createServer(onConnection);

initServer()
    .then(() => {
        server.listen(config.server.port, config.server.host, () => {
            console.log(`Server is running on ${config.server.host}:${config.server.port}`);
            console.log(server.address());
        });
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });