import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";

export default async function servicesUsers(
  action,
  table,
  method,
  data,
  router,
  sync
) {
  const db = await SQLite.openDatabaseAsync("producao");
  var result;

  if (action == "SELECT") {
    if (table == "clientes_producao_nsync") {
      if (method == "ID") {
        console.log(db);
        try {
          result = await db.getAllAsync(
            "SELECT *   \
                            FROM clientes_producao_nsync WHERE codusu = ?",
            [data]
          );
        } catch (error) {
          console.log(error);
        }
        console.log(result);
      } else if (method == "ALL") {
        console.log("auqiqi");
        console.log(db);
        try {
          result = await db.getAllAsync(
            "SELECT *   \
                            FROM clientes_producao_nsync"
          );
        } catch (error) {
          console.log(error);
        }
        console.log(result);
      }
    }
    if (table == "users") {
      if (method == "ID") {
        console.log(db);
        try {
          result = await db.getAllAsync(
            "SELECT *   \
                            FROM users WHERE codusu = ?",
            [data]
          );

          // if(result.length == 0) result = null;
        } catch (error) {
          console.log(error);
        }
        console.log(result);
        console.log("proximo obj");
      } else if (method === "ALL") {
        console.log("auqiqi");
        console.log(db);
        try {
          result = await db.getAllAsync(
            "SELECT *   \
                            FROM users"
          );

          console.log(result);
        } catch (error) {
          console.log(error);
        }
        console.log(result);
      }
    }
  }

  if (action == "INSERT") {
    if (table == "clientes_producao_nsync") {
      try {
        // await db.execAsync('CREATE TABLE IF NOT EXISTS clientes_producao_nsync (codusu INTEGER PRIMARY KEY AUTOINCREMENT, nomcli TEXT, emacli TEXT, cpfcli TEXT, datnas TEXT, telcli TEXT, sitsin TEXT)');
        const result = await db.runAsync(
          "INSERT INTO clientes_producao_nsync (nomcli, emacli, cpfcli, datnas, telcli) VALUES (?, ?, ?, ?, ?)",
          [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli]
        );
        console.log(result.lastInsertRowId, result.changes);
        router.push("/clients/read/not_sync");
      } catch (error) {
        console.log("erro ao inserir " + error);
      }
      console.log(result);
    }
    if (table == "users") {
      try {
        // Vai deletar ta tabela de pendentes para sincronização
        // const resultDel = await db.runAsync('DELETE FROM clientes_producao_nsync WHERE cpfcli = ?', [data.cpfcli]);
        const result = await db.runAsync(
          "INSERT INTO users (codusu, nomusu, emausu, logusu, password, situsu) VALUES (?, ?, ?, ?, ?, ?)",
          [
            data.codusu,
            data.nomusu,
            data.emausu,
            data.logusu,
            data.password,
            data.situsu,
          ]
        );
        // router.push('/clients/read/sync');
        console.log(result.lastInsertRowId, result.changes);
      } catch (error) {
        console.log("erro ao inserir " + error);
      }
      console.log(result);
    }
  }

  if (action == "UPDATE") {
    if (table == "clientes_producao_nsync") {
      try {
        const result = await db.runAsync(
          "UPDATE clientes_producao_nsync set nomcli = ?, emacli = ?, cpfcli = ?, datnas = ?, telcli = ? where codusu = ?",
          [
            data.nomcli,
            data.emacli,
            data.cpfcli,
            data.datnas,
            data.telcli,
            data.codusu,
          ]
        );
        console.log(result.changes);
      } catch (error) {
        console.log("erro ao atualizar " + error);
      }
      console.log(result);
    } else if (table == "users") {
      try {
        //Se foi chamada atraves da sincronização
        console.log("passwi" + sync);
        if (sync == 1) {
          console.log("chamei");
          console.log(data);
          const result = await db.runAsync(
            "UPDATE users set sitsin = 2 where codusu = ?",
            [data]
          );
        } else {
          console.log("aqui atualiar");
          const result = await db.runAsync(
            "UPDATE users set nomusu = ?, emausu = ?, logusu = ?, password = ?, situsu = ?  where codusu = ?",
            [
              data.nomusu,
              data.emausu,
              data.logusu,
              data.password,
              data.situsu,
              data.codusu,
            ]
          );
        }
      } catch (error) {
        console.log("erro ao atualizar " + error);
      }
      console.log(result);
    }
  }

  if (action == "DELETE") {
    if (table == "clientes_producao_nsync") {
      try {
        const result = await db.runAsync(
          "DELETE FROM clientes_producao_nsync where codusu = ?",
          [data]
        );
        console.log(result.changes);
      } catch (error) {
        console.log("erro ao deletar dado " + error);
      }
      console.log(result);
    } else if (table == "users") {
      try {
        console.log("chamei");
        console.log(data);
        const result = await db.runAsync("DELETE FROM users where codusu = ?", [
          data,
        ]);
      } catch (error) {
        console.log("erro ao deletar dado " + error);
      }
      console.log(result);
    }
  }
  return result;
}
