/* eslint-disable react-hooks/exhaustive-deps */
import { todoStore } from "@/store/store"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TaskProps } from "../interfaces/interfaces"

interface SideBarProps {
    showSidebar: boolean
    setShowSidebar: Dispatch<SetStateAction<boolean>>
}

const SideBar = ({ showSidebar, setShowSidebar }: SideBarProps) => {
    const { setFormData, status, setIcons, board, taskState, deleteTask, updateTask } = todoStore()
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
    const [existingData, setExistingData] = useState({
        taskId: 0,
        taskName: "",
        taskDescription: "",
        taskIcon: "",
        taskStatus: "",
        boardId: 0
    })


    useEffect(() => {
        if (!taskState || !board) return;

        const task = board.tasks.find((e: TaskProps) => e.task_status === taskState);
        if (task) {
            setExistingData({
                taskId: task.task_id,
                taskName: task.task_name,
                taskDescription: task.task_description,
                taskIcon: task.task_icon,
                taskStatus: task.task_status,
                boardId: task.board_id
            });
        }
    }, [board, taskState]);

    useEffect(() => {
        if (existingData.taskIcon) {
            setSelectedIcon(existingData.taskIcon)
            setIcons(existingData.taskIcon)
        }
        if (existingData.taskStatus) {
            setFormData("status", existingData.taskStatus as "inProgress" | "completed" | "dontDo")
        }
    }, [existingData])

    const onClose = () => {
        setShowSidebar(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        if (name === 'status') {
            setExistingData((prevData) => ({
                ...prevData,
                taskStatus: value
            }));
        } else {
            setExistingData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }

        if (type === 'radio') {
            setFormData(name as "taskName" | "taskDescription" | "status", value as "inProgress" | "completed" | "dontDo" | null)
        } else {
            setFormData(name as "taskName" | "taskDescription" | "status", value)
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const iconPath = e.currentTarget.getAttribute('data-icon')

        if (iconPath) {
            setSelectedIcon(iconPath)

            setIcons(iconPath)

            setExistingData(prevData => ({
                ...prevData,
                taskIcon: iconPath
            }))
        }
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        deleteTask(existingData.taskId)
        setShowSidebar(false)

    }

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        updateTask(existingData)
        setShowSidebar(false)
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out ${showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />
            <aside className={`fixed top-0 right-0 h-screen w-[630px] p-3 bg-transparent transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <nav className="h-full flex flex-col bg-white rounded-lg">
                    <form action="submit" onSubmit={(e) => e.preventDefault()} className="h-full">
                        <div className="h-full w-full p-5 flex flex-col justify-start items-center relative">
                            <div className="flex justify-between w-full mb-4">
                                <h4 className="text-xl font-semibold">Task details</h4>
                                <button className="rounded-lg border border-gray-300 cursor-pointer p-2" onClick={onClose}>
                                    <Image src="/close_ring_duotone-1.svg" alt="close nav" width={20} height={20} />
                                </button>
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label className="text-sm text-gray-400" htmlFor="taskname">Task name</label>
                                <input
                                    id="taskname"
                                    name="taskName"
                                    type="text"
                                    placeholder="Task name"
                                    className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-2  focus:outline-blue-500 focus:border-none"
                                    onChange={handleChange}
                                    value={existingData ? existingData.taskName : ""}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col w-full gap-1 mb-3">
                                <label className="text-sm text-gray-400" htmlFor="taskDescription">Description</label>
                                <textarea
                                    name="taskDescription"
                                    placeholder="Enter a short description"
                                    className="border border-gray-300 rounded-md h-40 w-full p-2 text-start align-top text-gray-500"
                                    maxLength={400}
                                    onChange={handleChange}
                                    value={existingData ? existingData.taskDescription : ""}
                                />
                            </div>
                            <div className="w-full my-3">
                                <p className="mb-2 text-sm text-gray-400">Icon</p>
                                <div className="flex w-full gap-3">
                                    <div className={`${selectedIcon === '/worker.svg' || existingData.taskIcon === '/worker.svg' ? 'bg-yellow-200' : 'bg-gray-200'} p-2 rounded-lg flex items-center`}>
                                        <button
                                            className="cursor-pointer"
                                            onClick={handleClick}
                                            data-icon="/worker.svg">
                                            <Image src="/worker.svg" alt="clock" width={30} height={30} />
                                        </button>
                                    </div>
                                    <div className={`${selectedIcon === '/dialogue.svg' || existingData.taskIcon === '/dialogue.svg' ? 'bg-yellow-200' : 'bg-gray-200'} p-2 rounded-lg flex items-center`}>
                                        <button
                                            className="cursor-pointer"
                                            onClick={handleClick}
                                            data-icon="/dialogue.svg">
                                            <Image src="/dialogue.svg" alt="clock" width={25} height={25} />
                                        </button>
                                    </div>
                                    <div className={`${selectedIcon === '/cofee.svg' || existingData.taskIcon === '/cofee.svg' ? 'bg-yellow-200' : 'bg-gray-200'} p-2 rounded-lg flex items-center`}>
                                        <button
                                            className="cursor-pointer"
                                            onClick={handleClick}
                                            data-icon="/cofee.svg">
                                            <Image src="/cofee.svg" alt="clock" width={25} height={25} />
                                        </button>
                                    </div>
                                    <div className={`${selectedIcon === '/gym.svg' || existingData.taskIcon === '/gym.svg' ? 'bg-yellow-200' : 'bg-gray-200'} p-2 rounded-lg flex items-center`}>
                                        <button
                                            className="cursor-pointer"
                                            onClick={handleClick}
                                            data-icon="/gym.svg">
                                            <Image src="/gym.svg" alt="clock" width={25} height={25} />
                                        </button>
                                    </div>
                                    <div className={`${selectedIcon === '/books.svg' || existingData.taskIcon === '/books.svg' ? 'bg-yellow-200' : 'bg-gray-200'} p-2 rounded-lg flex items-center`}>
                                        <button
                                            className="cursor-pointer"
                                            onClick={handleClick}
                                            data-icon="/books.svg">
                                            <Image src="/books.svg" alt="clock" width={25} height={25} />
                                        </button>
                                    </div>
                                    <div className={`${selectedIcon === '/clock.svg' || existingData.taskIcon === '/clock.svg' ? 'bg-yellow-200' : 'bg-gray-200'} p-2 rounded-lg flex items-center`}>
                                        <button
                                            className="cursor-pointer"
                                            onClick={handleClick}
                                            data-icon="/clock.svg">
                                            <Image src="/clock.svg" alt="clock" width={25} height={25} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col mb-3">
                                <p className="mb-2 text-sm text-gray-400">Status</p>
                                <div className="flex flex-wrap gap-3">
                                    <label className={`w-[260px]  cursor-pointer flex rounded-xl p-[2px]  border border-gray-300  items-center gap-2 relative cursor-pointer transition-colors duration-300 ${status === 'inProgress' || existingData.taskStatus === 'inProgress' ? 'border-[#3662E3] ring-2 ring-[#3662E3]' : ''}`}>
                                        <div className="bg-amber-400/80 p-2 rounded-xl">
                                            <Image src="/Time_atack_duotone.svg" alt="icon wait" width={25} height={25} />
                                        </div>
                                        <input
                                            id="status-wait"
                                            name="status"
                                            type="radio"
                                            value="inProgress"
                                            checked={status === 'inProgress' || existingData.taskStatus === 'inProgress'}
                                            onChange={handleChange}
                                            className="radio-input absolute top-4 right-5"
                                        />
                                        <label htmlFor="status-wait" className="radio-label cursor-pointer">In Progress</label>
                                    </label>

                                    <label className={`w-[260px] flex rounded-xl p-[2px]  border border-gray-300  items-center gap-2 relative cursor-pointer transition-colors duration-300 ${status === 'completed' || existingData.taskStatus === 'completed' ? 'border-[#3662E3] ring-2 ring-[#3662E3]' : ''}`}>
                                        <div className="bg-green-400/80 p-2 rounded-xl">
                                            <Image src="/Done_round_duotone.svg" alt="icon done" width={25} height={25} />
                                        </div>
                                        <input
                                            id="status-done"
                                            name="status"
                                            type="radio"
                                            value="completed"
                                            checked={status === 'completed' || existingData.taskStatus === 'completed'}
                                            onChange={handleChange}
                                            className="radio-input absolute top-4 right-5"
                                        />
                                        <label htmlFor="status-done" className="radio-label cursor-pointer ">
                                            Completed
                                        </label>
                                    </label>

                                    <label className={`w-[260px]  cursor-pointer flex rounded-xl p-[2px]  border border-gray-300 items-center gap-2 relative cursor-pointer transition-colors duration-300 ${status === 'dontDo' || existingData.taskStatus === 'dontDo' ? 'border-[#3662E3] ring-2 ring-[#3662E3]' : ''}`}>
                                        <div className="bg-red-500 p-2 rounded-xl">
                                            <Image src="/close_ring_duotone-1.svg" alt="icon done" width={25} height={25} />
                                        </div>
                                        <input
                                            id="status-dont"
                                            name="status"
                                            type="radio"
                                            value="dontDo"
                                            checked={status === 'dontDo' || existingData.taskStatus === 'dontDo'}
                                            onChange={handleChange}
                                            className=" radio-input absolute top-5 right-5"
                                        />
                                        <label htmlFor="status-dont" className="radio-label cursor-pointer">Won&apos;t do</label>
                                    </label>
                                </div>
                            </div>
                            <footer className="w-full flex justify-end gap-5 text-white absolute bottom-5 right-5">
                                <button className="flex items-center gap-3 py-1 px-5 bg-[#3662E3] border-none rounded-2xl not-disabled:cursor-pointer disabled:bg-gray-300 cursor-default" onClick={handleDelete} disabled={status === null}>
                                    Delete
                                        <Image src="/Trash.svg" alt="Trash Icon" width={15} height={15}   />
                                </button>
                                <button className="flex items-center gap-3 py-1 px-5 bg-[#3662E3] border-none rounded-2xl cursor-pointer" onClick={handleUpdate} >
                                    Save
                                    <Image src="/Done_round.svg" alt="Trash Icon" width={15} height={15}  className="pt-1"/>

                                </button>
                            </footer>
                        </div>
                    </form>
                </nav>
            </aside>
        </>
    )
}

export default SideBar