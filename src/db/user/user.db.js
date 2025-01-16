import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import { testLog } from '../../utils/testLogger.js';

// 유저 device ID 검색
export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

// 유저 생성
export const createUser = async (deviceId) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  return { id, deviceId };
};

// 유저 로그인 업데이트
export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

// 게임 종료 후 db 업데이트
export const updateAfterEnd = async (user) => {
  testLog(0, "[updateAfterEnd] called");

  if (!user)
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '[Error] cannot find user');

  const endTime = new Date(user.startTime).toISOString().slice(0, 19).replace('T', ' ');
  await pools.USER_DB.query(SQL_QUERIES.GAME_END, [
    id,
    user.id,
    endTime,
    user.x,
    user.y,
  ]);

}