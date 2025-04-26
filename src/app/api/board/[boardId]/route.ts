import { conn } from '@/libs/mysql';
import { NextResponse } from "next/server"
import { BoardProps,ResultProps } from '@/app/interfaces/interfaces';



export const GET = async (__: Request, { params }:{params:Promise<{boardId:string}>}) => {
    try {
        const { boardId } = await params

        const selectedBoard = await conn.query('SELECT * FROM board WHERE board_id = ?', [boardId]) as BoardProps[]
        
        if (selectedBoard.length) {
            const tasksFromSelectedBoard = await conn.query('SELECT task_id,task_name,task_description,task_status,task_icon,board_id FROM tasks WHERE board_id = ?', [boardId])

            return NextResponse.json({
                board: selectedBoard,
                tasks: tasksFromSelectedBoard
            })
        }

        else {
            return NextResponse.json({
                message: "Board id doesnt exist",
            }, { status: 404 })
        }

    } catch (error) {
        return NextResponse.json({
            message: `error to get board: ${error}`
        }, { status: 500 })
    }
}

export const PUT = async (request: Request, { params }:{params:Promise<{boardId:string}>}) => {
    try {
        const data = await request.json()

        const {boardId} = await params
        
        const result:ResultProps = await conn.query('UPDATE board SET ? WHERE board_id = ?',[data,boardId])
        
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
        
        const updateBoard = await conn.query('SELECT * FROM board WHERE board_id = ?',[boardId])
        
        return NextResponse.json(updateBoard)

    } catch (error) {
        return NextResponse.json({
            message: `error updating board, ${error}`
        })
    }
}

export const DELETE = async (__: Request, { params }:{params:Promise<{boardId:string}>}) => {
    try {
        const { boardId } = await params
        const result: ResultProps = await conn.query('DELETE FROM board WHERE board_id = ?', [boardId])

        if (result.affectedRows === 0) {
            return NextResponse.json({
                message: "board id doesnt exist"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "delete succefull"
        })

    } catch (error) {
        return NextResponse.json({
            message: `error deleting board: ${error}`
        })
    }

}