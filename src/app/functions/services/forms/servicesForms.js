import { useRouter } from 'expo-router';
import 'react-native-get-random-values'
import * as SQLite from  'expo-sqlite'
import { tables } from '../db/tables';
import {v4 as uuidv4} from "uuid";

export default async function servicesForms(action, table, method, data, router, sync, dataDel){

    const db = await SQLite.openDatabaseAsync('producao');

    var result;
    console.log(data)

    if(action == 'SELECT'){
            if(table == tables.formularios){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync(`SELECT *   \
                            FROM ${tables.formularios} WHERE codfor = ?`, [data]);
                    } catch (error) {
                        console.log(error)
                    }
                }                
                else if(method === 'ALL'){
                    try {
                        result = await db.getAllAsync(`SELECT *   \
                            FROM ${tables.formularios}`);
                        console.log(result)
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
      }


      if(action == 'INSERT'){
            const idForm = uuidv4(); 
            if(table == tables.formularios){
                try { 
                    /*insere respostas*/
                    db.withTransactionAsync(async () => {
                        const result = await db.runAsync(`INSERT INTO ${tables.formularios} (codfor, tipfor, codage, codcli, descri, remrec, codsit, usuger, sitsin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`, 
                                                        [idForm, data.tipfor, data.codage, data.codcli, data.descri, data.remrec, data.codsit, data.usuger]);
                    // percorre todas as respostas e insere
                        for (const resposta of data.resfor) {
                            console.log("a resposta")
                            console.log(resposta)
                            await db.runAsync(
                            `INSERT INTO ${tables.respostas_formularios} (codfor, idperg, valres) VALUES (?, ?, ?)`,
                            [idForm, resposta.idperg, resposta.valres]
                            );
                        }
                    });
                    router.push('/forms/read/sync');
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == tables.formularios){
                try {
                    //Se foi chamada atraves da sincronização
                    if(sync == 1){
                        const result = await db.runAsync(`UPDATE ${tables.formularios} set sitsin = 2 where codfor = ?`, [data]);
                    }
                    else {
                        const result = await db.runAsync(`UPDATE ${tables.formularios} set tipfor = ?, codage = ?, codcli = ?, descri = ?, remrec = ?, codsit = ?, sitsin = 1 where codfor = ?`,
                                                         [data.tipfor, data.codage, data.codcli, data.descri, data.remrec, data.codsit, data.codfor]);

                        await db.runAsync(`UPDATE ${tables.respostas_formularios} set codfor = ?, idperg = ?, valres = ? where codfor = ?`,
                                                         [data.codfor, data.resfor.idperg, data.resfor.valres, data.codfor]);
                    }          
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == tables.formularios){
                try {
                    const result = await db.runAsync(`DELETE FROM ${tables.formularios} where codfor = ?`, [data]);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        }     
    return result;
}