import { useState } from "react";
import Image from "next/image";

interface BoardHeaderProps {
    boardName: string
    boardDescription: string
    boardId?: number
    onUpdate?: (id: number, name: string, description: string) => Promise<void>
}

const BoardHeader = ({ boardName, boardDescription, boardId,onUpdate }: BoardHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(boardName)
    const [description, setDescription] = useState(boardDescription)

    const handleSave = async () => {
        try {
            if (boardId && onUpdate) {
                await onUpdate(boardId, name, description);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating board", error);
        }
    }

    const handleCancel = () => {
        setName(boardName)
        setDescription(boardDescription)
        setIsEditing(false)
    }
    

    return (
        <div className="board-header flex  gap-1 my-6">
            <div className="flex flex-col items-start gap-2">
                <div className="flex flex-row gap-2">

                    {!boardName || !name ? <></> : <Image src="/Logo.svg" alt="Task Board Logo" width={32} height={32} />}
                    {isEditing ? (
                        <input type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-4xl font-semibold border-b focus:outline-none max-w-[300px]"
                            autoFocus
                        />
                    ) : (
                        <h1 className="text-4xl font-semibold">{name}</h1>
                    )}
                    {
                       boardName && !isEditing && (
                            <button onClick={() => setIsEditing(true)}
                                className="edit-button ml-2 cursor-pointer"
                            >
                                <Image src="/edit.svg" alt="Edit" width={16} height={16} />
                            </button>
                        )
                    }
                </div>
                {
                    isEditing ? (
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="text-md ml-10 text-gray-600 border-b focus:outline-none" />
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold cursor-pointer"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 font-semibold cursor-pointer"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                    ) : (
                        <p className="text-md text-gray-600 font-semibold ml-10">{description}</p>
                    )
                }
            </div>
        </div>
    )
}

export default BoardHeader