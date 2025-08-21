import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'
import { tables } from '../db/tables';

export default async function servicesAgents(action, table, method, data, router, sync){

    const db = await SQLite.openDatabaseAsync('producao');

    var result;
    if(action == 'SELECT'){
            if(table == tables.agentes){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tables.agentes+' WHERE codage = ?', [data]);
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result);   
                }                
                else if(method == 'ALL'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tables.agentes);
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
      }

      if(action == 'INSERT'){
            if(table == tables.agentes){
                try {
                    const result = await db.runAsync('INSERT INTO '+tables.agentes+' (codage, nomage, emaage, cpfage, telage, funage, datnas) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.codage, data.nomage, data.emaage, data.cpfage, data.telage, data.funage, data.datnas]);
                    router.push('/agents/read/sync');
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == tables.agentes){
                try {
                    if(sync == 1){
                        const result = await db.runAsync('UPDATE '+tables.agentes+' set sitsin = 2 where codage = ?', [data]);
                    }
                    else {
                        const result = await db.runAsync('UPDATE '+tables.agentes+' set nomage = ?, emaage = ?, cpfage = ?, telage = ?, funage = ?, datnas = ?, sitsin = 1 where codage = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == tables.agentes){
                try {
                    const result = await db.runAsync('DELETE FROM '+tables.agentes+' where codage = ?', [data]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        }     
    return result;
}