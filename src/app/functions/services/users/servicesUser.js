import * as SQLite from "expo-sqlite";

export default async function servicesUsers(action, table, method, data) {
  const db = await SQLite.openDatabaseAsync("producao");
  let result;

  // Defina o tempo de expiração da sessão em horas, se necessário
  const expiracaoHoras = 24;

  try {
    if (action === "SELECT") {
      try {
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
          // Limpar sessões expiradas
          try {
            const agora = new Date();
            const limite = new Date(agora.getTime() - expiracaoHoras * 60 * 60 * 1000);
            await db.runAsync(
              "DELETE FROM users_session WHERE last_login < ?",
              [limite.toISOString()]
            );
            console.log(`Sessões expiradas deletadas até ${limite.toISOString()}`);
          } catch (err) {
            console.log("Erro ao limpar sessões expiradas:", err);
          }

          if (method === "ID") {
            result = await db.getAllAsync(
              "SELECT * FROM users_session WHERE logusu = ? AND password = ?",
              [data.logusu, data.password]
            );
          } else if (method === "ALL") {
            result = await db.getAllAsync("SELECT * FROM users_session");
          }
        }
      } catch (err) {
        console.log("Erro SELECT:", err);
      }
    }

    if (action === "INSERT") {
      try {
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
      } catch (err) {
        console.log("Erro INSERT:", err);
      }
    }

    if (action === "UPDATE") {
      try {
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
      } catch (err) {
        console.log("Erro UPDATE:", err);
      }
    }

    if (action === "DELETE") {
      try {
        if (table === "users") {
          await db.runAsync("DELETE FROM users WHERE codusu = ?", [data.codusu]);
        } else if (table === "users_session") {
          await db.runAsync("DELETE FROM users_session WHERE codusu = ?", [data.codusu]);
        }
      } catch (err) {
        console.log("Erro DELETE:", err);
      }
    }
  } catch (error) {
    console.log("Erro geral serviceUsers:", error);
  }

  return result;
}
