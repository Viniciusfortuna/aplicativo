import * as SQLite from 'expo-sqlite'
export default async function migrations(){
    const db = await SQLite.openDatabaseAsync('producao');
    const createMigrations = await db.execAsync(`
        CREATE TABLE IF NOT EXISTS agentes_saude 
        (codage INTEGER PRIMARY KEY AUTOINCREMENT, 
        nomage TEXT, 
        emaage TEXT, 
        cpfage TEXT, 
        telage TEXT, 
        funage TEXT, 
        datnas TEXT, 
        datger TEXT, 
        sitsin TEXT);   
                
        CREATE TABLE IF NOT EXISTS clientes_producao_nsync 
        (codcli INTEGER PRIMARY KEY AUTOINCREMENT, 
        nomcli TEXT, 
        emacli TEXT, 
        cpfcli TEXT, 
        datnas TEXT, 
        telcli TEXT, 
        sitsin TEXT); 
                                            
        CREATE TABLE IF NOT EXISTS clientes_producao_sync 
        (codcli INTEGER PRIMARY KEY AUTOINCREMENT, 
        nomcli TEXT, 
        emacli TEXT, 
        cpfcli TEXT, 
        datnas TEXT, 
        telcli TEXT, 
        sitsin TEXT); 

        CREATE TABLE IF NOT EXISTS situacao 
        (codsit INTEGER PRIMARY KEY AUTOINCREMENT, 
        dessit TEXT, 
        datger TEXT); 

        CREATE TABLE IF NOT EXISTS users 
        (codusu INTEGER PRIMARY KEY AUTOINCREMENT, 
        nomusu TEXT, 
        emausu TEXT UNIQUE,
        logusu TEXT UNIQUE,
        password TEXT,
        situsu TEXT DEFAULT 'A'); 

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

}