import { useRouter } from 'expo-router';
import 'react-native-get-random-values'
import * as SQLite from  'expo-sqlite'
import { tables } from '../db/tables';
import {v4 as uuidv4} from "uuid";

export default async function servicesForms(action, table, method, data, router, sync, dataDel){

    const db = await SQLite.openDatabaseAsync('producao');

    var result;

    // if(action == 'SELECT'){
    //         if(table == tables.formularios){
    //             if(method == 'ID'){
    //                 console.log(db)
    //                 try {
    //                     result = await db.getAllAsync(`SELECT *   \
    //                         FROM ${tables.formularios} WHERE codfor = ?`, [data]);
    //                 } catch (error) {
    //                     console.log(error)
    //                 }
    //             }                
    //             else if(method === 'ALL'){
    //                 try {
    //                     result = await db.getAllAsync(`SELECT *   \
    //                         FROM ${tables.formularios}`);
    //                     console.log(result)
    //                 } catch (error) {
    //                     console.log(error)
    //                 }
    //                 console.log(result); 
    //             }
    //         }
    //   }
        if (action === 'SELECT') {
            if (table === tables.formularios) {

                if (method === 'ID') {
                    try {
                        // Se seu expo-sqlite tiver getFirstAsync, use-o. Caso não, use getAllAsync e pegue [0].
                        const form =
                        (await db.getFirstAsync(`SELECT * FROM ${tables.formularios} WHERE codfor = ?`, [data])) ||
                        null;

                        if (!form) {
                        result = null; // não achou
                        } else {
                        const respostas = await db.getAllAsync(
                            `SELECT * FROM ${tables.respostas_formularios} WHERE codfor = ?`,
                            [data]
                        );
                        result = { ...form, resfor: respostas };
                        }
                        console.log('esse é o form')
                        console.log(result)
                    } catch (error) {
                        console.log(error);
                    }
                }

                else if (method === 'ALL') {
                    try {
                        var query = `SELECT * FROM ${tables.formularios}`; 
                        var query2 = `SELECT * FROM ${tables.respostas_formularios}`
                        if(dataDel == 1){ //signfica que quer deletar
                            query = query + ' WHERE SITSIN NOT IN (1)';
                            query2 = query2 + ` ,${tables.formularios} WHERE ${tables.formularios}.codfor = ${tables.respostas_formularios}.codfor
                                                AND ${tables.formularios}.sitsin NOT IN (1)`;
                            console.log('query 1: ' + query);
                            console.log('query 1: ' + query2);
                        }
                        const forms = await db.getAllAsync(query);
                        if (!forms || forms.length === 0) {
                        result = [];
                        } else {
                        const respostas = await db.getAllAsync(query2);

                        // JS puro: agrupa respostas por codfor
                        const respostasMap = {};
                        for (const r of respostas) {
                            if (!respostasMap[r.codfor]) respostasMap[r.codfor] = [];
                            respostasMap[r.codfor].push(r);
                        }

                        result = forms.map(f => ({
                            ...f,
                            resfor: respostasMap[f.codfor] || []
                        }));
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

            }
        }

      if(action == 'INSERT'){
            var idForm;
            if(!data.codfor){
                idForm = uuidv4();
            }
            else {
                idForm = data.codfor;
            }
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
                    result = idForm;
                    console.log(idForm + "esse é o di")
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == tables.formularios){
                try {
                    // Se foi chamada através da sincronização
                    if(sync == 1){
                        const result = await db.runAsync(
                            `UPDATE ${tables.formularios} 
                            SET sitsin = 2 
                            WHERE codfor = ?`, 
                            [data]
                        );
                    } else {
                        await db.withTransactionAsync(async () => {
                            // Atualiza o formulário
                            console.log('atualiza mesmo')
                            console.log(data)
                            await db.runAsync(
                                `UPDATE ${tables.formularios} 
                                SET tipfor = ?, codage = ?, codcli = ?, descri = ?, remrec = ?, codsit = ?, sitsin = 1 
                                WHERE codfor = ?`,
                                [data.tipfor, data.codage, data.codcli, data.descri, data.remrec, data.codsit, data.codfor]
                            );

                            // Remove todas as respostas anteriores do formulário
                            await db.runAsync(
                                `DELETE FROM ${tables.respostas_formularios} 
                                WHERE codfor = ?`,
                                [data.codfor]
                            );

                            // Reinsere todas as respostas atualizadas
                            for (const resposta of data.resfor) {
                                await db.runAsync(
                                    `INSERT INTO ${tables.respostas_formularios} (codfor, idperg, valres) 
                                    VALUES (?, ?, ?)`,
                                    [data.codfor, resposta.idperg, resposta.valres]
                                );
                            }
                        });
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
                    await db.withTransactionAsync(async () => {
                            // Remove todas as respostas anteriores do formulário
                            await db.runAsync(
                                `DELETE FROM ${tables.respostas_formularios} 
                                WHERE codfor = ?`,
                                [data]
                            );

                            await db.runAsync(`DELETE FROM ${tables.formularios} where codfor = ?`, [data]);
                    });
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        } 
    console.log('id aqui' + result)   
    return result;
}