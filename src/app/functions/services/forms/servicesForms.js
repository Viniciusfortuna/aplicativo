import { useRouter } from 'expo-router';
import * as SQLite from  'expo-sqlite'

export default async function services(action, table, method, data, router, sync){

    const db = await SQLite.openDatabaseAsync('producao');
    await db.execAsync(`
        PRAGMA foreign_keys = ON;
        
        CREATE TABLE IF NOT EXISTS forms_producao_sync (
          codfor TEXT PRIMARY KEY,  
          codage INTEGER,
          codage INTEGER,
          codcli INTEGER,
          ns_codcli INTEGER,
          descri TEXT,
          remrec TEXT,
          codsit INTEGER,
          usuger INTEGER,
          datger TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (codage) REFERENCES agentes_saude (codage),
          FOREIGN KEY (codcli) REFERENCES clientes_producao_sync (codcli),
          FOREIGN KEY (ns_codcli) REFERENCES clientes_producao_nsync (codcli),
          FOREIGN KEY (codsit) REFERENCES situacao (codsit),
          FOREIGN KEY (usuger) REFERENCES users (codusu)
        );
      `);
  

    
    
    var result;
    // const router = useRouter()

    console.log(action)
    console.log('id aqui' + data.codfor)
    if(action == 'SELECT'){
            if(table == 'forms_producao_sync'){
                if(method == 'ID'){
                    console.log(db)
                    try {
                        result = await db.getAllAsync('SELECT *   \
                            FROM forms_producao_sync WHERE codfor = ?', [data]);
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
                            FROM forms_producao_sync');
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
                            FROM clientes_producao_sync WHERE codfor = ?', [data]);
                        
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
            if(table == 'forms_producao_sync'){
                try {
                    const result = await db.runAsync('INSERT INTO forms_producao_sync (nomcli, emacli, cpfcli, datnas, telcli) VALUES (?, ?, ?, ?, ?)', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli]);
                    console.log(result.lastInsertRowId, result.changes);
                    router.push('/forms/read');
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
            if(table == 'clientes_producao_sync'){
                try {
                    await db.execAsync('CREATE TABLE IF NOT EXISTS clientes_producao_sync (codfor INTEGER PRIMARY KEY AUTOINCREMENT, nomcli TEXT, emacli TEXT, cpfcli TEXT, datnas TEXT, telcli TEXT, sitsin TEXT)');
                    // Vai deletar ta tabela de pendentes para sincronização
                    const resultDel = await db.runAsync('DELETE FROM forms_producao_sync WHERE cpfcli = ?', [data.cpfcli]);
                    const result = await db.runAsync('INSERT INTO clientes_producao_sync (codfor, nomcli, emacli, cpfcli, datnas, telcli) VALUES (?, ?, ?, ?, ?, ?)', [data.codfor, data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli]);
                    router.push('/clients/read/sync');
                    console.log(result.lastInsertRowId, result.changes);
                } catch (error) {
                    console.log('erro ao inserir ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'UPDATE'){
            if(table == 'forms_producao_sync'){
                try {
                    const result = await db.runAsync('UPDATE forms_producao_sync set nomcli = ?, emacli = ?, cpfcli = ?, datnas = ?, telcli = ? where codfor = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codfor]);
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
                        const result = await db.runAsync('UPDATE clientes_producao_sync set sitsin = 2 where codfor = ?', [data]);
                    }
                    else {
                        console.log('aqui atualiar')
                        const result = await db.runAsync('UPDATE clientes_producao_sync set nomcli = ?, emacli = ?, cpfcli = ?, datnas = ?, telcli = ?, sitsin = 1 where codfor = ?', [data.nomcli, data.emacli, data.cpfcli, data.datnas, data.telcli, data.codfor]);
                    }
                    
                } catch (error) {
                    console.log('erro ao atualizar ' +  error);
                }
                console.log(result); 
            }
        }

        if(action == 'DELETE'){
            if(table == 'forms_producao_sync'){
                try {
                    const result = await db.runAsync('DELETE FROM forms_producao_sync where codfor = ?', [data]);
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
                    const result = await db.runAsync('DELETE FROM clientes_producao_sync where codfor = ?', [data]);
                } catch (error) {
                    console.log('erro ao deletar dado ' +  error);
                }
                console.log(result); 
            }
        }     
    return result;
}