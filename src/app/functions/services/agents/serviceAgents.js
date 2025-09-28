import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'
import { tables } from '../db/tables';
import { getDb } from '../db/db';

export default async function servicesAgents(action, table, method, data, router, sync){

    // const db = await SQLite.openDatabaseAsync('producao.db');
    const db = await getDb();
    

    var result = [];
    if(action == 'SELECT'){
            if(table == tables.agentes){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tables.agentes+' WHERE codage = ?', [data]);
                    } catch (error) {
                        console.log('erro ao selecionar (serviceAgents - ID):' +  error);
                    }
                }                
                else if(method == 'ALL'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tables.agentes);
                    } catch (error) {
                        console.log('erro ao selecionar (serviceAgents - ALL):' +  error);
                    }
                }
            }
      }

      if(action == 'INSERT'){
            if(table == tables.agentes){
                try {
                    const result = await db.runAsync('INSERT INTO '+tables.agentes+' (codage, nomage, emaage, cpfage, telage, funage, datnas) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.codage, data.nomage, data.emaage, data.cpfage, data.telage, data.funage, data.datnas]);
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir (serviceAgents): ' +  error);
                }
            }
        }

        if(action == 'UPDATE'){
            if(table == tables.agentes){
                try {
                    if(sync == 1){
                        const result = await db.runAsync('UPDATE '+tables.agentes+' set nomage = ?, emaage = ?, cpfage = ?, telage = ?, funage = ?, datnas = ? where codage = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                    }
                    else {
                        const result = await db.runAsync('UPDATE '+tables.agentes+' set nomage = ?, emaage = ?, cpfage = ?, telage = ?, funage = ?, datnas = ? where codage = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar (serviceAgents): ' +  error);
                }
            }
        }

        if(action == 'DELETE'){
            if(table == tables.agentes){
                try {
                    const result = await db.runAsync('DELETE FROM '+tables.agentes+' where codage = ?', [data]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao deletar dado (serviceAgents) :' +  error);
                } 
            }
        }     
    return result;
}