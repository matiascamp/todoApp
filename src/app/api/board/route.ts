import { conn } from "@/libs/mysql"
import { NextResponse } from "next/server"

interface QueryResult {
    insertId: number
}

export const POST = async (request: Request) => {
    try {
        const { boardName, boardDescription } = await request.json()
        
        const boardResult = await conn.query('INSERT INTO board SET ?', {
            board_name: boardName,
            board_description: boardDescription
        }) as QueryResult
        
        const boardId = boardResult.insertId
        
        const defaultTasks = [
            {
                task_name: "Task in Progress",
                task_description: "",
                task_status: "inProgress",
                task_icon: "/clock.svg",
                board_id: boardId
            },
            {
                task_name: "Task Completed",
                task_description: "",
                task_status: "completed",
                task_icon: "/worker.svg",
                board_id: boardId
            },
            {
                task_name: "Task Wont't Do",
                task_description: "",
                task_status: "dontDo",
                task_icon: "/cofee.svg", 
                board_id: boardId
            },
            {
                task_name: "Task To Do",
                task_description: "Work on a Challange on devChallenge.io,learn TypeScript",
                task_status: "toDo",
                task_icon: "/books.svg",
                board_id: boardId
            }
        ]
        
        for (const task of defaultTasks) {
            await conn.query('INSERT INTO tasks SET ?', task)
        }
       
        return NextResponse.json({
            id: boardId
        })
    }
    catch(e){
        return NextResponse.json({
            message: `Error creating board in database: ${e}`,
        }, { status: 500 })
    }
}