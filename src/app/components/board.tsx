import { useState } from "react"
import NewTask from "./newTask"
import SideBar from "./sideBar"
import Tasks from "./tasks"
import { TaskProps } from "../interfaces/interfaces"
import { todoStore } from "@/store/store"
import BoardHeader from "./boardHeader"
import { TaskType } from "../interfaces/interfaces"
import Loading from "./loading"


const Board = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const { loading, board, updateBoard } = todoStore()

    if (loading) return <Loading/>;

    if (!board) return <div>No hay datos del tablero disponibles</div>;

    const tasks = Array.isArray(board.tasks) ? board.tasks :
        (board.tasks ? [board.tasks] : []);

    const boardInfo = board.board || board;


    const handleUpdate = async (id: number, name: string, description: string) => {
        try {
            await updateBoard(name, description, id);
        } catch (error) {
            console.error("Error actualizando el tablero:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <main className="max-w-[600px] mx-auto px-4 sm:px-6">

                {Array.isArray(boardInfo) && boardInfo[0] ? (
                    <BoardHeader
                        boardName={boardInfo[0].board_name}
                        boardDescription={boardInfo[0].board_description}
                        boardId={boardInfo[0].board_id}
                        onUpdate={handleUpdate}
                    />
                ) : boardInfo && 'board_name' in boardInfo ? (
                    <BoardHeader
                        boardName={boardInfo.board_name}
                        boardDescription={boardInfo.board_description}
                        boardId={boardInfo.board_id}
                        onUpdate={handleUpdate}
                    />
                ) : null}

                <div className="space-y-4">
                    {tasks.length > 0 ? (
                        tasks.map((task: TaskProps) => (
                            <Tasks
                                key={task.task_id}
                                type={task.task_status as TaskType}
                                title={task.task_name}
                                description={task.task_description}
                                icon={task.task_icon}
                                setShowSidebar={setShowSidebar}
                            />
                        ))
                    ) : (
                        <div>No hay tareas disponibles</div>
                    )}
                    <NewTask />
                </div>
            </main>
            <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        </div>
    );
}

export default Board