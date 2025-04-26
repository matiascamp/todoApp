import mysql from 'serverless-mysql'

export const conn = mysql({
  config: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),
    ssl: {
      rejectUnauthorized: true
    }
  }
})