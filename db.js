//DATABASE_URL = "postgres://dev@localhost:5432/dev"
//const { Client } = require('pg')
import pg from 'pg';

var db = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'dev',
    database: 'querybox'
});

db.connect();

export default db;
