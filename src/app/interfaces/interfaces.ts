export type TaskProps = {
    task_id: number
    task_name: string
    task_description: string
    task_icon: string
    task_status: string
    board_id:number
}

export type BoardItemProps = {
    board_id: number
    board_name: string
    board_description: string
}

export type BoardStateProps = {
    board: BoardItemProps[] | BoardItemProps
    tasks: TaskProps[]
}

export type ExistingTaskProps = {
    taskId: number
    taskName: string
    taskDescription: string
    taskIcon: string
    taskStatus: string
}

export type TaskType = 'inProgress' | 'toDo' | 'dontDo' | 'completed';


export type ResultProps = {
    fieldCount: number
    affectedRows: number
    insertId: number
    info: string
    serverStatus: number
    warningStatus: number
    changedRows: number
}

export type BoardProps = {
    task_id: number
    task_name: string
    task_description: string
    task_status: string
}
