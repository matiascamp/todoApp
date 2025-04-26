import { conn } from "@/libs/mysql"
import { NextResponse } from "next/server"
import { ResultProps } from "@/app/interfaces/interfaces"

export const POST = async (request: Request) => {
    try {
        const { taskName, taskDescription, taskStatus, taskIcon, boardId } = await request.json()

        
        const result:ResultProps = await conn.query('INSERT INTO tasks SET ?', {
            task_name: taskName,
            task_description: taskDescription,
            task_status: taskStatus,
            task_icon: taskIcon,
            board_id: boardId
        })

        const createdTask = {
            task_id: result.insertId,
            task_name: taskName,
            task_description: taskDescription,
            task_status: taskStatus,
            task_icon: taskIcon,
            board_id: boardId
        }

        return NextResponse.json({
            message: "Task created successfully",
            task: createdTask
        })
        
    } catch (e) {
        return NextResponse.json({
            message: `Error to create task: ${e}`,
        })
    }
}