
import { create } from "zustand";
import { BoardStateProps, ExistingTaskProps, BoardItemProps, TaskProps } from "@/app/interfaces/interfaces";

type TodoState = {
    taskName: string
    taskDescription: string
    status: "inProgress" | "completed" | "dontDo" | null
    loading: boolean
    board: BoardStateProps
    iconSrc: string
    taskState: string
}

type TodoActions = {
    setFormData: (field: keyof Omit<TodoState, 'setFormData' | 'board' | 'loading' | 'iconSrc' | 'taskState'>, value: string | null) => void
    fetchBoard: (id: string) => Promise<void>
    setIcons: (value: string) => void
    settaskState: (value: string) => void
    createBoard: () => Promise<{ id: number }>
    createTask: (boardId: number) => Promise<void>
    deleteTask: (taskId: number) => Promise<void>
    updateTask: (data: ExistingTaskProps) => Promise<void>
    updateBoard: (name: string, description: string, boardId: number) => Promise<void>
}

export const todoStore = create<TodoState & TodoActions>((set) => ({

    taskName: '',
    taskDescription: '',
    status: null,
    board: {
        board: {
            board_id: 0,
            board_name: "",
            board_description: ""
        },
        tasks: []
    },
    loading: false,
    iconSrc: '',
    taskState: '',


    fetchBoard: async (id: string) => {
        set({ loading: true })
        try {

            const response = await fetch(`/api/board/${id}`)

            if (!response.ok) {
                throw new Error('Error to fech board')
            }
            const data = await response.json()

            set({
                board: {
                    board: data.board,
                    tasks: data.tasks
                },
                loading: false
            })

        } catch (error) {
            console.error("error", error);
            set({ loading: false });
        }
    },

    setFormData: (field, value) => {
        set((state) => {
            return { ...state, [field]: value }
        })
    },

    setIcons: (value: string) => {
        set({ iconSrc: value })
    },

    settaskState: (value: string) => {
        set({ taskState: value })
    },

    createBoard: async () => {
        set({ loading: true })
        try {
            const res = await fetch('api/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    boardName: 'My Task Board',
                    boardDescription: 'Tasks to keep organised'
                })
            })
            const { id }: { id: number } = await res.json()
            set({ loading: false })
            return { id }

        } catch (error) {
            set({ loading: false })
            throw error
        }
    },

    updateBoard: async (name: string, description: string, boardId: number) => {
        set({ loading: true })
        try {

            const res = await fetch(`/api/board/${boardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ board_name: name, board_description: description })
            })

            if (!res.ok) throw new Error('Failed to update board')

            set(state => {
                if (Array.isArray(state.board.board)) {
                    const updatedBoards = state.board.board.map((board: BoardItemProps) =>
                        board.board_id === boardId
                            ? { ...board, board_name: name, board_description: description }
                            : board
                    );

                    return {
                        loading: false,
                        board: {
                            ...state.board,
                            board: updatedBoards
                        }
                    };
                } else {
                    return {
                        loading: false,
                        board: {
                            ...state.board,
                            board: {
                                ...state.board.board,
                                board_name: name,
                                board_description: description
                            }
                        }
                    };
                }
            });
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },

    createTask: async (boardId: number) => {
        set({ loading: true })
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskName: 'Task To Do',
                    taskDescription: '',
                    taskStatus: 'toDo',
                    taskIcon: '/books.svg',
                    boardId
                })
            });

            if (!response.ok) {
                throw new Error('Error creating task');
            }

            const newTask = await response.json();
            set(state => {

                const currentTasks = state.board?.tasks || [];

                return {
                    loading: false,
                    board: {
                        ...state.board,
                        tasks: [...currentTasks, newTask.task]
                    }
                };
            });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    deleteTask: async (taskId: number) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error deleting task');
            }

            set(state => {
                const updatedTasks = state.board?.tasks.filter((task: TaskProps) =>
                    Number(task.task_id) !== taskId
                )

                return {
                    loading: false,
                    board: {
                        ...state.board,
                        tasks: updatedTasks
                    }
                };
            });

        } catch (error) {
            console.error("Error trying to delete task", error);
        }
    },

    updateTask: async (existingData: ExistingTaskProps) => {
        try {

            const { taskName, taskDescription, taskStatus, taskIcon } = existingData
            const response = await fetch(`/api/tasks/${existingData.taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_name: taskName,
                    task_description: taskDescription,
                    task_status: taskStatus,
                    task_icon: taskIcon
                })
            })

            if (!response.ok) {
                throw new Error('Error updating task');
            }

            const updatedTask = await response.json();

            set(state => {
                const currentTasks = state.board?.tasks || [];
                const updatedTasks = currentTasks.map((task: TaskProps) =>
                    task.task_id === existingData.taskId ? updatedTask[0] : task
                );

                return {
                    loading: false,
                    board: {
                        ...state.board,
                        tasks: updatedTasks
                    }
                };
            });
        } catch (error) {
            console.error("Error trying to update task", error);
        }
    }
})) 