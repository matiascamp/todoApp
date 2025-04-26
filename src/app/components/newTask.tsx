'use client'
import { todoStore } from "@/store/store"
import Image from "next/image"

const NewTask = () => {
    const { board, createTask } = todoStore()

    const handleClick = () => {
        if (board && Array.isArray(board.board)) {
            const { board_id } = board.board[0]
            createTask(board_id)
        }
    }

    return (
        <>
            <button className="bg-transparent cursor-pointer w-full" onClick={handleClick}>
                <div className="bg-[#FBE8CF] rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-400 p-2 rounded-lg">
                            <Image src="/Add_round_duotone.svg" alt="icon custom completed" width={25} height={25} />
                        </div>
                        <span className="font-bold text-md text-gray-600">Add new task</span>
                    </div>
                </div>
            </button>
        </>
    )
}

export default NewTask