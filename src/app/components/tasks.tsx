import { todoStore } from "@/store/store";
import Image from "next/image"
import { Dispatch, SetStateAction } from "react";
import { TaskType } from "../interfaces/interfaces";

interface TaskListProps {
    type: TaskType;
    title?: string;
    description?: string;
    icon: string
    setShowSidebar: Dispatch<SetStateAction<boolean>>
}

interface RightIconConfig {
    bgColor: string;
    icon: string;
}

interface TaskConfig {
    bgColor: string;
    icon: string;
    defaultTitle: string;
    rightIcon?: RightIconConfig;
}

const Tasks = ({ type, title, description, icon, setShowSidebar }: TaskListProps) => {
    const { settaskState } = todoStore()

    const taskConfig: Record<TaskType, TaskConfig> = {
        inProgress: {
            bgColor: 'bg-[#F5D565]',
            icon: '/Time_atack_duotone.svg',
            defaultTitle: 'Task in Progress',
            rightIcon: {
                bgColor: 'bg-[#E9A23B]',
                icon: '/Time_atack_duotone.svg'
            }
        },
        toDo: {
            bgColor: 'bg-[#E9EDF1]',
            icon: '/Done_round.svg',
            defaultTitle: 'Task To Do'
        },
        dontDo: {
            bgColor: 'bg-[#F8C4C4]',
            icon: '/Done_round.svg',
            defaultTitle: 'Task Wont Do',
            rightIcon: {
                bgColor: 'bg-red-500',
                icon: '/close_ring_duotone.svg'
            }
        },
        completed: {
            bgColor: 'bg-[#A8E4B1]',
            icon: '/Done_round.svg',
            defaultTitle: 'Task Completed',
            rightIcon: {
                bgColor: 'bg-green-500',
                icon: '/Done_round.svg'
            }
        }
    };

    const config = taskConfig[type];

    if (!config) {
        console.error(`Invalid task type: ${type}`);
        return null;
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        settaskState(e.currentTarget.value)
        setShowSidebar(true)
    }

    return (
        <button className="cursor-pointer w-full" onClick={handleClick} value={type}>
            <div className={`${config.bgColor} rounded-2xl p-4 ${config.rightIcon ? 'flex items-center justify-between' : ''}`}>
                <div className="flex items-center gap-4 ">
                    <div className="bg-white p-2 rounded-lg">
                        <Image src={icon} alt={`${type} icon`} width={25} height={25} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-xl">{title || config.defaultTitle}</span>
                        {description && (
                            <p className="text-gray-700 max-w-[325px] text-start">{description}</p>
                        )}
                    </div>
                </div>
                {config.rightIcon && (
                    <div className={`${config.rightIcon.bgColor} p-2 rounded-lg`}>
                        <Image src={config.rightIcon.icon} alt="status icon" width={25} height={25} />
                    </div>
                )}
            </div>
        </button>
    );
}

export default Tasks