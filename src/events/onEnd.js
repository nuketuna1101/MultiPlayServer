//====================================================================================================================
//====================================================================================================================
// events/onEnd.js.
//====================================================================================================================
//====================================================================================================================

import { updateAfterEnd } from "../db/user/user.db.js";
import { getGameSession } from "../session/game.session.js";
import { removeUser } from "../session/user.session.js";

export const onEnd = (socket) => async () => {
    console.log("[Event] onEnd: client connection ended.");
    // 유저를 세션에서 삭제
    const user = removeUser(socket);
    // db 업데이트
    await updateAfterEnd(user);
    // 세션 삭제
    getGameSession(user.gameId).removeUser(user.id);
}