import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'
import { tables } from '../db/tables';

export default async function services(action, table, method, data, router, sync){

    const db = await SQLite.openDatabaseAsync('producao');
    var result;
    if(action == 'SELECT'){
            if(table == tables.clientes){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tables.clientes+' WHERE CODCLI = ?', [data]);
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result);  
                }                
                else if(method === 'ALL'){
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM '+tables.clientes);
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
      }


      if(action == 'INSERT'){
            if(table == tables.clientes){
                try {
                    const result = await db.runAsync('INSERT INTO '+tables.clientes+' (codcli, nomcli, emacli, cpfcli, datnas, telcli) VALUES (?, ?, ?, ?, ?, ?)', [data.codcli, data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli]);         
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == tables.clientes){
                try {
                    //Se foi chamada atraves da sincronização
                    if(sync == 1){
                        const result = await db.runAsync('UPDATE '+tables.clientes+' set sitsin = 2 where codcli = ?', [data]);
                    }
                    else {
                        const result = await db.runAsync('UPDATE '+tables.clientes+' set nomcli = ?, emacli = ?, cpfcli = ?, datnas = ?, telcli = ?, sitsin = 1 where codcli = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == tables.clientes){
                try {
                    const result = await db.runAsync('DELETE FROM '+tables.clientes+' where codcli = ?', [data]);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        }     
    return result;
}