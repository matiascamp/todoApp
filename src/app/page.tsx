/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { todoStore } from "@/store/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const InitialLoad = () => {
    const router = useRouter()
    const { createBoard } = todoStore()

    useEffect(() => {
        (async () => {
            const { id } = await createBoard()
            router.push(`/board/${id}`)
        })()
    }, [])

    return <div>Creating board...</div>

}

export default InitialLoad