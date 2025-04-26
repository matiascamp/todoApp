'use client'

import Board from "@/app/components/board";
import { todoStore } from "@/store/store";
import { useEffect } from "react";
import { useParams } from 'next/navigation';

export default function BoardPage() {

  const params = useParams();

  const id = params?.id as string;

  const { fetchBoard } = todoStore()

  useEffect(() => {

      fetchBoard(id)
      
  }, [id, fetchBoard])

  return <Board />
}
  