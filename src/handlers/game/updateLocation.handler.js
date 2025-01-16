import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { testLog } from '../../utils/testLogger.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    testLog(0, `[updateLocationHandler] called`);
    const { gameId, x, y } = payload;
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '[Error] cannot find session.');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '[Error] cannot find user.');
    }
    // 유저 위치 업데이트
    user.updatePosition(x, y);
    const packet = gameSession.getAllLocation();
    // testLog(0, `[updateLocationHandler] packet: ${JSON.stringify(packet, null, 2)}`);

    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};

export default updateLocationHandler;
