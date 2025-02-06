import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'

export default async function servicesForms(action, table, method, data, router, sync){

    const db = await SQLite.openDatabaseAsync('producao');

    var result;

    if(action == 'SELECT'){
            if(table == 'forms_producao_nsync'){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM forms_producao_nsync WHERE codfor = ?', [data]);
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
                            FROM forms_producao_nsync');
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
            if(table == 'forms_producao_sync'){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM forms_producao_sync WHERE codfor = ?', [data]);
                        
                        // if(result.length == 0) result = null;
                    } catch (error) {
                        console.log(error)
                    }
                }                
                else if(method === 'ALL'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM forms_producao_sync');

                        console.log(result)
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
      }


      if(action == 'INSERT'){
            if(table == 'forms_producao_nsync'){
                try {
                    const result = await db.runAsync('INSERT INTO forms_producao_nsync (codfor, codage, codcli, ns_codcli, descri, remrec, codsit, usuger) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [data.codfor, data.codage, data.codcli, data.ns_codcli, data.descri, data.remrec, data.codsit, data.usuger]);
                    console.log(result.lastInsertRowId, result.changes);
                    router.push('/forms/read/nsync');
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
            if(table == 'forms_producao_sync'){
                try {
                    // await db.execAsync('CREATE TABLE IF NOT EXISTS forms_producao_sync (codfor INTEGER PRIMARY KEY AUTOINCREMENT, nomcli TEXT, emacli TEXT, cpfcli TEXT, datnas TEXT, telcli TEXT, sitsin TEXT)');
                    // Vai deletar ta tabela de pendentes para sincronização
                    const resultDel = await db.runAsync('DELETE FROM forms_producao_nsync WHERE codfor = ?', [data.codfor]);
                    const result = await db.runAsync('INSERT INTO forms_producao_nsync (codfor, codage, codcli, ns_codcli, descri, remrec, codsit, usuger) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [data.codfor, data.codage, data.codcli, data.ns_codcli, data.descri, data.remrec, data.codsit, data.usuger]);
                    router.push('/forms/read/sync');
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == 'forms_producao_nsync'){
                try {
                    const result = await db.runAsync('UPDATE forms_producao_nsync set codage = ?, codcli = ?, ns_codcli = ?, descri = ?, remrec = ?, codsit ? where codfor = ?', [data.codage, data.codcli, data.ns_codcli, data.descri, data.remrec, data.codsit, data.codfor]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
            else if(table == 'forms_producao_sync'){
                try {
                    //Se foi chamada atraves da sincronização
                    if(sync == 1){
                        const result = await db.runAsync('UPDATE forms_producao_sync set sitsin = 2 where codfor = ?', [data]);
                    }
                    else {
                        const result = await db.runAsync('UPDATE forms_producao_sync set codage = ?, codcli = ?, ns_codcli = ?, descri = ?, remrec = ?, codsit ?, sitsin = 1 where codfor = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codfor]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == 'forms_producao_nsync'){
                try {
                    const result = await db.runAsync('DELETE FROM forms_producao_nsync where codfor = ?', [data]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
            else if(table == 'forms_producao_sync'){
                try {
                    console.log(data)
                    const result = await db.runAsync('DELETE FROM forms_producao_sync where codfor = ?', [data]);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        }     
    return result;
}