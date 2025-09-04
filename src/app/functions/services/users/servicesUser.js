import * as SQLite from "expo-sqlite";

export default async function servicesUsers(action, table, method, data) {
  const db = await SQLite.openDatabaseAsync("producao");
  let result;
  
  try {
    if (action === "SELECT") {
      if (table === "users") {
        if (method === "ID") {
          result = await db.getAllAsync(
            "SELECT * FROM users WHERE codusu = ?",
            [data.codusu]
          );
        } else if (method === "ALL") {
          result = await db.getAllAsync("SELECT * FROM users");
        }
      } else if (table === "users_session") {

        // =====================
        // Função para limpar sessões expiradas
        // =====================
        const agora = new Date();
        const limite = new Date(agora.getTime() - expiracaoHoras * 60 * 60 * 1000);
        await db.runAsync(
            "DELETE FROM users_session WHERE last_login < ?",
            [limite.toISOString()]
        );
        console.log(`Sessões expiradas deletadas até ${limite.toISOString()}`);

        if (method === "ID") {
          result = await db.getAllAsync(
            "SELECT * FROM users_session WHERE logusu = ? AND password = ?",
            [data.logusu, data.password]
          );
        } else if (method === "ALL") {
          result = await db.getAllAsync("SELECT * FROM users_session");
        }
      }
    }

    if (action === "INSERT") {
      if (table === "users") {
        await db.runAsync(
          "INSERT INTO users (codusu, nomusu, emausu, logusu, password, situsu) VALUES (?, ?, ?, ?, ?, ?)",
          [data.codusu, data.nomusu, data.emausu, data.logusu, data.password, data.situsu]
        );
      } else if (table === "users_session") {
        await db.runAsync(
          "INSERT OR REPLACE INTO users_session (codusu, logusu, password, token, last_login, is_offline) VALUES (?, ?, ?, ?, ?, ?)",
          [data.codusu, data.logusu, data.password, data.token || "", new Date().toISOString(), data.is_offline || 0]
        );
      }
    }

    if (action === "UPDATE") {
      if (table === "users") {
        await db.runAsync(
          "UPDATE users SET nomusu = ?, emausu = ?, logusu = ?, password = ?, situsu = ? WHERE codusu = ?",
          [data.nomusu, data.emausu, data.logusu, data.password, data.situsu, data.codusu]
        );
      } else if (table === "users_session") {
        await db.runAsync(
          "UPDATE users_session SET logusu = ?, password = ?, token = ?, last_login = ?, is_offline = ? WHERE codusu = ?",
          [data.logusu, data.password, data.token || "", new Date().toISOString(), data.is_offline || 0, data.codusu]
        );
      }
    }

    if (action === "DELETE") {
      if (table === "users") {
        await db.runAsync("DELETE FROM users WHERE codusu = ?", [data.codusu]);
      } else if (table === "users_session") {
        await db.runAsync("DELETE FROM users_session WHERE codusu = ?", [data.codusu]);
      }
    }
  } catch (error) {
    console.log("Erro serviceUsers:", error);
  }

  return result;
}
