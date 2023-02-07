//DATABASE_URL = "postgres://dev@localhost:5432/dev"
//const { Client } = require('pg')
//
//import postgres from 'postgres'
import knex from 'knex'


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port: 5432,
    user : 'dev',
    database : 'querybox'
  }
});
//const sql = postgres('postgres://dev@localhost:5432/querybox');

export default db;
