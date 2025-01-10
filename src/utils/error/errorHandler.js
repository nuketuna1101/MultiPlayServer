//====================================================================================================================
//====================================================================================================================
// utils/error/errorHandler.js
// 에러 처리 핸들러
//====================================================================================================================
//====================================================================================================================

import { createResponse } from '../response/createResponse.js';
import { testLog } from '../testLogger.js';

export const handleError = (socket, error) => {
  let responseCode;
  let message;

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`[Error] code: ${error.code}, msg: ${error.message}`);
  } else {
    responseCode = 10000; // 일반 에러 코드
    message = error.message;
    console.error(`[Error] Normal 10000: ${error.message}`);
  }
  // 에러 응답 생성
  testLog(0, `[handleError] error response 생성`)
  const errorResponse = createResponse(-1, responseCode, { message }, null);
  socket.write(errorResponse);
};
