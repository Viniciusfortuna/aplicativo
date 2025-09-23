import * as SQLite from 'expo-sqlite'
export default async function migrations(){
    const db = await SQLite.openDatabaseAsync('producao');

    try {
      const createMigrations = await db.execAsync(`
     -- DROP TABLE IF EXISTS respostas_formularios;
     -- DROP TABLE IF EXISTS formularios;
     -- DROP TABLE IF EXISTS perguntas_tipo_formulario;
     -- DROP TABLE IF EXISTS tipo_formulario;
     -- DROP TABLE IF EXISTS agentes_saude;
     -- DROP TABLE IF EXISTS clientes;
     -- DROP TABLE IF EXISTS situacao;
     -- DROP TABLE IF EXISTS users;
     -- DROP TABLE IF EXISTS users_sessions;

      CREATE TABLE IF NOT EXISTS users_session (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codusu TEXT NOT NULL,
          logusu TEXT NOT NULL,
          token TEXT,                -- opcional, para login online
          password TEXT,             -- criptografada ou hash
          last_login DATETIME,       -- quando fez login
          is_offline INTEGER DEFAULT 0,  -- 1 = offline, 0 = online
          expires_at DATETIME        -- opcional, para expiração
      );

      CREATE TABLE IF NOT EXISTS clientes (
        codcli INTEGER PRIMARY KEY AUTOINCREMENT,
        nomcli TEXT NOT NULL,
        emacli TEXT NOT NULL,
        cpfcli TEXT NOT NULL UNIQUE,
        telcli TEXT,
        datnas DATETIME NOT NULL,
        datger DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS agentes_saude (
        codage INTEGER PRIMARY KEY AUTOINCREMENT,
        nomage TEXT NOT NULL,
        emaage TEXT NOT NULL,
        cpfage TEXT NOT NULL UNIQUE,
        telage TEXT,
        funage TEXT NOT NULL,
        datnas DATETIME NOT NULL,
        datger DATETIME
      );

      CREATE TABLE IF NOT EXISTS tipo_formulario (
        tipfor INTEGER PRIMARY KEY AUTOINCREMENT,
        nomtip TEXT NOT NULL,
        destip TEXT,
        datger DATETIME
      );

      CREATE TABLE IF NOT EXISTS perguntas_tipo_formulario (
        idperg INTEGER PRIMARY KEY AUTOINCREMENT,
        desprg TEXT NOT NULL,
        tipper TEXT NOT NULL,
        tipfor INTEGER NOT NULL,
        FOREIGN KEY (tipfor) REFERENCES tipo_formulario (tipfor)
      );

      CREATE TABLE IF NOT EXISTS situacao (
        codsit INTEGER PRIMARY KEY AUTOINCREMENT,
        dessit TEXT NOT NULL,
        datger DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        codusu INTEGER PRIMARY KEY AUTOINCREMENT,
        nomusu TEXT NOT NULL,
        emausu TEXT NOT NULL UNIQUE,
        logusu TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        situsu TEXT DEFAULT 'A'
      );

      CREATE TABLE IF NOT EXISTS formularios (
        codfor TEXT PRIMARY KEY, -- uuid
        tipfor INTEGER NOT NULL,
        codage INTEGER NOT NULL,
        codcli INTEGER NOT NULL,
        descri TEXT NOT NULL,
        remrec TEXT,
        codsit INTEGER NOT NULL,
        usuger INTEGER NOT NULL,
        sitsin INTEGER,
        datger DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tipfor) REFERENCES tipo_formulario (tipfor),
        FOREIGN KEY (codage) REFERENCES agentes_saude (codage),
        FOREIGN KEY (codcli) REFERENCES clientes (codcli),
        FOREIGN KEY (codsit) REFERENCES situacao (codsit),
        FOREIGN KEY (usuger) REFERENCES users (codusu)
      );

      CREATE TABLE IF NOT EXISTS respostas_formularios (
        codres INTEGER PRIMARY KEY AUTOINCREMENT,
        codfor TEXT NOT NULL,
        idperg INTEGER NOT NULL,
        valres TEXT NOT NULL,
        datger DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (codfor) REFERENCES formularios (codfor),
        FOREIGN KEY (idperg) REFERENCES perguntas_tipo_formulario (idperg)
      );
     
        `);
        return createMigrations;
    } catch (error) {
        return error;
    }
}