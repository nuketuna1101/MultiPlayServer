//====================================================================================================================
//====================================================================================================================
// utils/parser/packetParser.js
// 설정값 및 환경변수
//====================================================================================================================
//====================================================================================================================


import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { testLog } from '../testLogger.js';

export const packetParser = (data) => {
    // 공통 패킷 구조로 protobuf 메시지 가져오기
    const protoMessages = getProtoMessages();
    const Packet = protoMessages.common.Packet;
    let packet;

    try {
        // 패킷 디코딩
        testLog(0, `[packetParser] raw data (hex): ${data.toString('hex')}`, false);
        packet = Packet.decode(data);
    } catch (error) {
        throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
    }

    // 디코디된 패킷에서 각 속성 할당
    const handlerId = packet.handlerId;
    const userId = packet.userId;
    const clientVersion = packet.version;
    // const payload = packet.payload;
    // const sequence = packet.sequence;

    // validation: clientVersion 검증
    if (clientVersion !== config.client.version) {
        throw new CustomError(
            ErrorCodes.CLIENT_VERSION_MISMATCH,
            'Client Version mismatched.',
        );
    }

    // handlerId에 따라 payload 디코딩
    const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
    if (!protoTypeName) 
        throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `Unknown handler ID: ${handlerId}`);

    // 
    const [namespace, typeName] = protoTypeName.split('.');
    const PayloadType = protoMessages[namespace][typeName];
    let payload;

    try {
        payload = PayloadType.decode(packet.payload);
    } catch (error) {
        throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
    }

    // 필드 검증 추가

    // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
    const expectedFields = Object.keys(PayloadType.fields);
    const actualFields = Object.keys(payload);
    const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
    if (missingFields.length > 0) {
        throw new CustomError(
            ErrorCodes.MISSING_FIELDS,
            `missing fields: ${missingFields.join(', ')}`,
        );
    }

    return { handlerId, userId, payload }; //sequence };
};
