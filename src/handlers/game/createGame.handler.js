import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { testLog } from '../../utils/testLogger.js';

const createGameHandler = ({ socket, userId, payload }) => {
  try {
    testLog(0, `[createGameHandler] called`);

    // 현재 로그에 userId 를 출력하면 deviceId가 나오는 현상
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);
    testLog(0, `[createGameHandler] userId : ${userId} / gameId : ${gameId}`);

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '[Error] cannot find user.');
    }
    gameSession.addUser(user);

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다.' },
      userId,
    );

    socket.write(createGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default createGameHandler;
