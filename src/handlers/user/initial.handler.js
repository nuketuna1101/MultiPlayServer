//====================================================================================================================
// handlers/user/initial.handler.js.
// 유저 초기화 핸들러 이벤트
//====================================================================================================================
//====================================================================================================================

import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';
import { testLog } from '../../utils/testLogger.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;
    testLog(0, `[initialHandler] deviceId: ${deviceId} / playerId: ${playerId} / latency: ${latency} `);
    // device Id로 유저 찾기
    let user = await findUserByDeviceID(deviceId);
    // deviceId 기준으로, 찾은 유저로 로그인하거나, 최초 접속 시 유저 생성
    if (!user) {
      user = await createUser(deviceId);
    } else {
      testLog(0, `[initialHandler] user.id: ${user.id}`);
      await updateUserLogin(user.id);
    }

    // 세션에 유저 추가
    addUser(user.id, socket);

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
