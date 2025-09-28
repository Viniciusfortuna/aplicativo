import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'
import { getDb } from '../db/db';

export default async function servicesSituation(action, table, method, data, router, sync){

    // const db = await SQLite.openDatabaseAsync('producao.db');
    const db = await getDb();
    var result = [];

    if(action == 'SELECT'){
            if(table == 'situacao'){
                if(method == 'ID'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM situacao WHERE codsit = ?', [data]);
                        
                    } catch (error) {
                        console.log(error)
                    }  
                }                
                else if(method === 'ALL'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM situacao');

                        console.log(result)
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
      }


      if(action == 'INSERT'){
            if(table == 'situacao'){
                try {
                    // Vai deletar ta tabela de pendentes para sincronização
                    // const resultDel = await db.runAsync('DELETE FROM clientes_producao_nsync WHERE cpfcli = ?', [data.cpfcli]);
                    const result = await db.runAsync('INSERT INTO situacao (codsit, dessit, datger) VALUES (?, ?, ?)', [data.codsit, data.dessit, data.datger]);
                    // router.push('/clients/read/sync');
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir (ServiceSituacao) ' +  error);
                }
            }
        }

        if(action == 'UPDATE'){
            if(table == 'situacao'){
                try {
                    if(sync == 1){
                        const result = await db.runAsync('UPDATE situacao set sitsin = 2 where codsit = ?', [data]);
                    }
                    else {
                        const result = await db.runAsync('UPDATE situacao set dessit = ?  where codsit = ?', [data.dessit, data.codsit]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar (ServiceSituacao) ' +  error);
                }
            }
        }

        if(action == 'DELETE'){
            if(table == 'situacao'){
                try {
                    console.log('chamei')
                    console.log(data)
                    const result = await db.runAsync('DELETE FROM situacao where codsit = ?', [data]);
                } catch (error) {
                    console.log('erro ao deletar (ServiceSituacao) ' +  error);
                }
            }
        }     
    return result;
}