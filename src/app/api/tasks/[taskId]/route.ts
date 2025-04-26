import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { ResultProps } from "@/app/interfaces/interfaces";

interface RestProps  {
    params: {
        taskId: number
    }
}

export const PUT = async (request: Request, { params }: RestProps) => {
    try {
        const { taskId } = await params
        const data = await request.json()

        const result: ResultProps = await conn.query('UPDATE tasks SET ? WHERE task_id = ?', [data, taskId])

        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message: "task not found"
                },
                {
                    status: 404
                }
            )
        }

        const updatedProduct = await conn.query('SELECT * FROM tasks WHERE task_id = ?',[taskId])
        
        return NextResponse.json(updatedProduct)

    } catch (error) {
        return NextResponse.json({
            message: `${error}`
        })
    }
}

export const DELETE = async (__: Request, { params }: RestProps) => {
    try {
        const { taskId } = await params
        const result: ResultProps = await conn.query('DELETE FROM tasks WHERE task_id = ?', [taskId])

        if (result.affectedRows === 0) {
            return NextResponse.json({
                message: "task id doesnt exist"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "delete succefull"
        })

    } catch (error) {
        return NextResponse.json({
            message: `error deleting task: ${error}`
        })
    }

}