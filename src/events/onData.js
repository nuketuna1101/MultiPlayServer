//====================================================================================================================
//====================================================================================================================
// events/onData.js.
//====================================================================================================================
//====================================================================================================================

import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import { handleError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { testLog } from '../utils/testLogger.js';

export const onData = (socket) => async (data) => {
    //
    testLog(0, `[onData] received data`);
    // testLog(`[onData] socket: ${socket} , data: ${data}`);

    // 버퍼에 새로 수신 데이터 추가
    socket.buffer = Buffer.concat([socket.buffer, data]);

    // 패킷 총 길이
    const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

    // 전체 헤더 있을 경우 패킷 처리
    while (socket.buffer.length >= totalHeaderLength) {
        // 1. 패킷 길이 정보 수신 (4바이트)
        const length = socket.buffer.readUInt32BE(0);
        // 2. 패킷 타입 정보 수신 (1바이트)
        const packetType = socket.buffer.readUInt8(config.packet.totalLength);
        // 3. 패킷 전체 길이 확인 후 데이터 수신
        if (socket.buffer.length >= length) {
            // 패킷 데이터를 자르고 버퍼에서 제거
            const packet = socket.buffer.slice(totalHeaderLength, length);
            socket.buffer = socket.buffer.slice(length);

            try {
                switch (packetType) {
                    case PACKET_TYPE.PING:
                        {
                            const protoMessages = getProtoMessages();
                            const Ping = protoMessages.common.Ping;
                            const pingMessage = Ping.decode(packet);
                            const user = getUserBySocket(socket);
                            if (!user) {
                                throw new CustomError(ErrorCodes.USER_NOT_FOUND, '[Error] cannot find user.');
                            }
                            user.handlePong(pingMessage);
                        }
                        break;
                    // 패킷타입 노말에 대해
                    case PACKET_TYPE.NORMAL:
                        testLog(0, `[onData] packetType: NORMAL`);
                        // 패킷 파싱
                        // const { handlerId, sequence, payload, userId } = packetParser(packet);
                        const { handlerId, userId, payload } = packetParser(packet);
                        testLog(0, `[onData] handlerId: ${handlerId}`);

                        const user = getUserById(userId);
                        // 유저가 접속해 있는 상황에서 시퀀스 검증
                        // if (user && user.sequence !== sequence) {
                        //     throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
                        // }
                        const handler = getHandlerById(handlerId);
                        await handler({
                            socket,
                            userId,
                            payload,
                        });
                }
            } catch (error) {
                handleError(socket, error);
            }
        } else {
            // 아직 전체 패킷이 도착하지 않음
            break;
        }
    }
};
