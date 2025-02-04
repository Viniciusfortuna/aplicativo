import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'

export default async function servicesAgents(action, table, method, data, router, sync){

    const db = await SQLite.openDatabaseAsync('producao');
    const create = await db.execAsync('CREATE TABLE IF NOT EXISTS agentes_saude (codage INTEGER PRIMARY KEY AUTOINCREMENT, nomage TEXT, emaage TEXT, cpfage TEXT, telage TEXT, funage TEXT, datnas TEXT, datger TEXT, sitsin TEXT)');

    var result;
    // const router = useRouter()
    if(action == 'SELECT'){
            if(table == 'agentes_saude'){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM agentes_saude WHERE codage = ?', [data]);
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
                            FROM agentes_saude');
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(result); 
                }
            }
            // if(table == 'clientes_producao_sync'){
            //     if(method == 'ID'){
            //         console.log(db)
            //         try {
            //             result = await db.getAllAsync('SELECT *   \
            //                 FROM clientes_producao_sync WHERE CODCLI = ?', [data]);
                        
            //             // if(result.length == 0) result = null;
            //         } catch (error) {
            //             console.log(error)
            //         }
            //         console.log(result);  
            //         console.log("proximo obj");    
            //     }                
            //     else if(method === 'ALL'){
            //         console.log('auqiqi')
            //         console.log(db)
            //         try {
            //             result = await db.getAllAsync('SELECT *   \
            //                 FROM clientes_producao_sync');

            //             console.log(result)
            //         } catch (error) {
            //             console.log(error)
            //         }
            //         console.log(result); 
            //     }
            // }
      }


      if(action == 'INSERT'){
            if(table == 'agentes_saudefdf'){
                try {
                    await db.execAsync('CREATE TABLE IF NOT EXISTS agentes_saude (codage INTEGER PRIMARY KEY AUTOINCREMENT, nomage TEXT, emaage TEXT, cpfage TEXT, telage TEXT, funage TEXT, datnas TEXT, datger TEXT, sitsin TEXT)');
                    const result = await db.runAsync('INSERT INTO agentes_saude (nomage, emaage, cpfage, telage, funage, datnas) VALUES (?, ?, ?, ?, ?,?)', [data.nomage, data.emaage, data.cpfage, data.telage, data.funage, data.datnas]);
                    console.log(result.lastInsertRowId, result.changes);
                    router.push('/agents/read/sync');
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
            else if(table == 'agentes_saude'){
                try {
                    await db.execAsync('CREATE TABLE IF NOT EXISTS agentes_saude (codage INTEGER PRIMARY KEY AUTOINCREMENT, nomage TEXT, emaage TEXT, cpfage TEXT, telage TEXT, funage TEXT, datnas TEXT, datger TEXT, sitsin TEXT)');
                    const result = await db.runAsync('INSERT INTO agentes_saude (codage, nomage, emaage, cpfage, telage, funage, datnas) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.codage, data.nomage, data.emaage, data.cpfage, data.telage, data.funage, data.datnas]);
                    router.push('/agents/read/sync');
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            // if(table == 'agentes_saude'){
            //     try {
            //         const result = await db.runAsync('UPDATE agentes_saude set nomage = ?, emaage = ?, cpfage = ?, telage = ?, funage = ?, datnas = ?, sitsin = 1 where codage = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
            //         console.log(result.changes);
            //     } catch (error) {
            //         console.log('erro ao atualizar ' +  error);
            //     }
            //     console.log(result); 
            // }
            if(table == 'agentes_saude'){
                try {
                    //Se foi chamada atraves da sincronização
                    // console.log('passwi' + sync)
                    if(sync == 1){
                        console.log('chamei')
                        console.log(data)
                        const result = await db.runAsync('UPDATE agentes_saude set sitsin = 2 where codage = ?', [data]);
                    }
                    else {
                        const result = await db.runAsync('UPDATE agentes_saude set nomage = ?, emaage = ?, cpfage = ?, telage = ?, funage = ?, datnas = ?, sitsin = 1 where codage = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codcli]);
                        console.log(result.changes);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == 'agentes_saude'){
                try {
                    const result = await db.runAsync('DELETE FROM agentes_saude where codage = ?', [data]);
                    console.log(result.changes);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
            // else if(table == 'clientes_producao_sync'){
            //     try {
            //         console.log('chamei')
            //         console.log(data)
            //         const result = await db.runAsync('DELETE FROM clientes_producao_sync where codcli = ?', [data]);
            //     } catch (error) {
            //         console.log('erro ao deletar dado ' +  error);
            //     }
            //     console.log(result); 
            // }
        }     
    return result;
}