import * as SQLite from 'expo-sqlite';

export const getDbConnection = async () => {
  return await SQLite.openDatabaseAsync('viacep_crud.db');
};

export const initializeDatabase = async () => {
  try {
    const db = await getDbConnection();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        cep TEXT NOT NULL,
        street TEXT,
        neighborhood TEXT,
        city TEXT,
        state TEXT
      );
    `);
    console.log("Database initialized!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
