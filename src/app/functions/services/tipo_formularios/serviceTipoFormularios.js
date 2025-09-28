import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'
import { tables } from '../db/tables';
import { getDb } from '../db/db';

export default async function servicesTipoFormulario(action, table, method, data, router, sync){
    // const db = await SQLite.openDatabaseAsync('producao.db');
    const db = await getDb();
    const tableDb = tables.tipo_formulario;
    var result = [];
    if(action == 'SELECT'){
            if(table == tableDb){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tableDb+' WHERE tipfor = ?', [data]);
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result);   
                }                
                else if(method == 'ALL'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tableDb);
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
      }

    if(action == 'INSERT'){
        if(table == tableDb){
            try {
                const result = await db.runAsync('INSERT INTO '+tableDb+' (tipfor, nomtip, destip, datger) VALUES (?, ?, ?, ?)', [data.tipfor, data.nomtip, data.destip, data.datger]);
            } catch (error) {
                console.log('erro ao inserir ' +  error);
            }
        }
    }

    if(action == 'UPDATE'){
        if(table == tableDb){
            try {
                if(sync == 1){
                    const result = await db.runAsync('UPDATE '+tableDb+' set sitsin = 2 where tipfor = ?', [data]);
                }
                else {
                    const result = await db.runAsync('UPDATE '+tableDb+' set nomtip = ?, destip = ?, datger = ? where tipfor = ?', [data.nomtip, data.destip, data.datger, data.tipfor]);
                }
                
            } catch (error) {
                console.log('erro ao atualizar ' +  error);
            }
        }
    }

    if(action == 'DELETE'){
        if(table == tableDb){
            try {
                const result = await db.runAsync('DELETE FROM '+tableDb+' where tipfor = ?', [data]);
            } catch (error) {
                console.log('erro ao deletar dado ' +  error);
            }
        }
    }     
    return result;
}