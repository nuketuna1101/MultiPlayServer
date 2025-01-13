//====================================================================================================================
//====================================================================================================================
// utils/db/testConnection.js
// db 테스팅
//====================================================================================================================
//====================================================================================================================

// db
const testDbConnection = async (pool, dbName) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log(`[DB connect] ${dbName} test result:`, rows[0].solution);
  } catch (error) {
    console.error(`[DB connect] ${dbName} Error on test query:`, error);
  }
};

export const testAllConnections = async (pools) => {
  await testDbConnection(pools.GAME_DB, 'GAME_DB');
  await testDbConnection(pools.USER_DB, 'USER_DB');
};
