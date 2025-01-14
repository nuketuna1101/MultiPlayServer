//====================================================================================================================
//====================================================================================================================
// interval.manager.js
// 인터벌 매니저: 
//====================================================================================================================
//====================================================================================================================


import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  // 인터벌 등록
  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map());
    }
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  //
  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game');
  }

  // 
  addUpdatePosition(playerId, callback, interval) {
    this.addPlayer(playerId, callback, interval, 'updatePosition');
  }

  // 인터벌 삭제
  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(playerId);
    }
  }

  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
