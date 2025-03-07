//====================================================================================================================
//====================================================================================================================
// session/user.session.js
// 사용자 세션의 관리: 사용자 추가, 제거, getter 등
//====================================================================================================================
//====================================================================================================================

import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (id, socket, deviceId, playerId) => {
  const user = new User(id, socket);
  user.setDeviceId(deviceId);
  user.setPlayerId(playerId);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};
