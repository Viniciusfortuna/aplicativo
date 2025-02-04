import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'

export default async function services(action, table, method, data, router, sync){

    const db = await SQLite.openDatabaseAsync('producao');
    var result;
    // const router = useRouter()

    console.log(action)
    console.log('id aqui' + data.codcli)
    if(action == 'SELECT'){
            if(table == 'clientes_producao_nsync'){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM clientes_producao_nsync WHERE CODCLI = ?', [data]);
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result);   
                    
                }                
                else if(method == 'ALL'){
                    console.log('auqiqi')
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM clientes_producao_nsync');
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
            if(table == 'clientes_producao_sync'){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM clientes_producao_sync WHERE CODCLI = ?', [data]);
                        
                        // if(result.length == 0) result = null;
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result);  
                    console.log("proximo obj");    
                }                
                else if(method === 'ALL'){
                    console.log('auqiqi')
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM clientes_producao_sync');

                        console.log(result)
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
      }


      if(action == 'INSERT'){
            if(table == 'clientes_producao_nsync'){
                try {
                    await db.execAsync('CREATE TABLE IF NOT EXISTS clientes_producao_nsync (codcli INTEGER PRIMARY KEY AUTOINCREMENT, nomcli TEXT, emacli TEXT, cpfcli TEXT, datnas TEXT, telcli TEXT, sitsin TEXT)');
                    const result = await db.runAsync('INSERT INTO clientes_producao_nsync (nomcli, emacli, cpfcli, datnas, telcli) VALUES (?, ?, ?, ?, ?)', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli]);
                    console.log(result.lastInsertRowId, result.changes);
                    router.push('/clients/read/not_sync');
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
            if(table == 'clientes_producao_sync'){
                try {
                    await db.execAsync('CREATE TABLE IF NOT EXISTS clientes_producao_sync (codcli INTEGER PRIMARY KEY AUTOINCREMENT, nomcli TEXT, emacli TEXT, cpfcli TEXT, datnas TEXT, telcli TEXT, sitsin TEXT)');
                    // Vai deletar ta tabela de pendentes para sincronização
                    const resultDel = await db.runAsync('DELETE FROM clientes_producao_nsync WHERE cpfcli = ?', [data.cpfcli]);
                    const result = await db.runAsync('INSERT INTO clientes_producao_sync (codcli, nomcli, emacli, cpfcli, datnas, telcli) VALUES (?, ?, ?, ?, ?, ?)', [data.codcli, data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli]);
                    router.push('/clients/read/sync');
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == 'clientes_producao_nsync'){
                try {
                    const result = await db.runAsync('UPDATE clientes_producao_nsync set nomcli = ?, emacli = ?, cpfcli = ?, datnas = ?, telcli = ? where codcli = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
            else if(table == 'clientes_producao_sync'){
                try {
                    //Se foi chamada atraves da sincronização
                    console.log('passwi' + sync)
                    if(sync == 1){
                        console.log('chamei')
                        console.log(data)
                        const result = await db.runAsync('UPDATE clientes_producao_sync set sitsin = 2 where codcli = ?', [data]);
                    }
                    else {
                        console.log('aqui atualiar')
                        const result = await db.runAsync('UPDATE clientes_producao_sync set nomcli = ?, emacli = ?, cpfcli = ?, datnas = ?, telcli = ?, sitsin = 1 where codcli = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == 'clientes_producao_nsync'){
                try {
                    const result = await db.runAsync('DELETE FROM clientes_producao_nsync where codcli = ?', [data]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
            else if(table == 'clientes_producao_sync'){
                try {
                    console.log('chamei')
                    console.log(data)
                    const result = await db.runAsync('DELETE FROM clientes_producao_sync where codcli = ?', [data]);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        }     
    return result;
}