// dbService.js
import * as SQLite from "expo-sqlite";

let dbPromise = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = await SQLite.openDatabaseAsync("producao.db");
  }
  return dbPromise;
}
