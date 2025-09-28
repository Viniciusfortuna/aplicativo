import * as SQLite from 'expo-sqlite';
import { tables } from '../db/tables'; 
import { getDb } from '../db/db';

export default async function servicesPerguntasTipoFormulario(action, table, method, data, router, sync) {
  // const db = await SQLite.openDatabaseAsync('producao.db');
  const db = await getDb();
  const tableDb = tables.perguntas_tipo_formulario;
  let result = [];

  if (action === 'SELECT') {
    if (table === tableDb) {
      if (method === 'ID') {
        try {
          result = await db.getAllAsync(
            `SELECT * FROM ${tableDb} WHERE idperg = ?`, 
            [data]
          );
        } catch (error) {
          console.log('Erro no SELECT por ID:', error);
        }
      }
      else if (method === 'ID_TIPFOR') {
        try {
          result = await db.getAllAsync(`SELECT * FROM ${tableDb} where tipfor = ?`, [data]);
        } catch (error) {
          console.log('Erro no SELECT ID_FORM:', error);
        }
      }
      else if (method === 'ALL') {
        try {
          result = await db.getAllAsync(`SELECT * FROM ${tableDb}`);
        } catch (error) {
          console.log('Erro no SELECT ALL:', error);
        }
      }
      console.log(result);
    }
  }

  if (action === 'INSERT') {
    if (table === tableDb) {
      try {
        // idperg é autoincrement, não precisa inserir
        result = await db.runAsync(
          `INSERT INTO ${tableDb} (idperg, desprg, tipper, tipfor) VALUES (?,?, ?, ?)`,
          [data.idperg, data.desprg, data.tipper, data.tipfor]
        );
      } catch (error) {
        console.log('Erro ao inserir:', error);
      }
      console.log(result);
    }
  }

  if (action === 'UPDATE') {
    if (table === tableDb) {
      try {
        if (sync === 1) {
          // Aqui não sei exatamente o que você quer fazer quando sync === 1, mas vou colocar um exemplo:
          // Talvez atualizar um campo de sincronização, se existir
          // Como não há campo de sync na tabela, vou pular essa parte
          console.log('Sync update não implementado para essa tabela.');
        } else {
          // Atualizar os campos: desprg, tipper, tipfor (tipfor pode ser alterado?)
          result = await db.runAsync(
            `UPDATE ${tableDb} SET desprg = ?, tipper = ?, tipfor = ? WHERE idperg = ?`,
            [data.desprg, data.tipper, data.tipfor, data.idperg]
          );
        }
      } catch (error) {
        console.log('Erro ao atualizar:', error);
      }
      console.log(result);
    }
  }

  if (action === 'DELETE') {
    if (table === tableDb) {
      try {
        result = await db.runAsync(
          `DELETE FROM ${tableDb} WHERE idperg = ?`,
          [data]
        );
      } catch (error) {
        console.log('Erro ao deletar:', error);
      }
      console.log(result);
    }
  }

  return result;
}
