//====================================================================================================================
//====================================================================================================================
// onConnection.js
// 서버 연결
//====================================================================================================================
//====================================================================================================================
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

export const onConnection = (socket) => {
    console.log('Client on Connected : ', socket.remoteAddress, socket.remotePort);

    // 각 client가 buffer 고유하게 유지하도록 할당
    socket.buffer = Buffer.alloc(0);

    socket.on('data', onData(socket));
    socket.on('end', onEnd(socket));
    socket.on('error', onError(socket));
}