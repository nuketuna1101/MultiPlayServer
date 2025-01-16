import { createPingPacket } from '../../utils/notification/game.notification.js';
import { testLog } from '../../utils/testLogger.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    // coordinate
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    // 이전 좌표의 저장
    this.prevX = this.x;
    this.prevY = this.y;

    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    // console.log(`${this.id}: ping`);
    testLog(0, `[Ping] [${this.id}] => ${now}`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    testLog(0, `[Pong] from user ${this.id} at ${now} with latency ${this.latency}ms`);
    // console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const speed = 1; // 속도 고정
    const distance = speed * timeDiff;

    const dirX = this.x !== this.prevX ? Math.sign(this.x - this.prevX) : 0;
    const dirY = this.y !== this.prevY ? Math.sign(this.y - this.prevY) : 0;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + distance * dirX,
      y: this.y + distance * dirY,
    };
  }

  //#region 여러가지 id 관련 getter, setter
  setPlayerId(playerId){
    this.playerId = playerId;
  }

  setDeviceId(deviceId){
    this.deviceId = deviceId;
  }

  setLatency(latency){
    this.latency = latency;
  }

  getPlayerId(){
    return this.playerId;
  }

  getDeviceId(){
    return this.deviceId;
  }

  getLatency(){
    return this.latency;
  }
  //#endregion

}

export default User;
