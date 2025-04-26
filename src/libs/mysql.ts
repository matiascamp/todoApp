import mysql from 'serverless-mysql'

export const conn = mysql({
    config:{
        host:'localhost',
        user:'root',
        password:'Cel15513521.',
        port: 3306,
        database:'todoList'
    }
})