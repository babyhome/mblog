"use client"
import React, { useTransition } from 'react'
import { resetTodo } from '../_actions/todo-action';

type Props = {}

export default function ResetButton({}: Props) {
  const [_, startTransition] = useTransition();

  return (
    <div>
        <button type='button' className='text-black py-2 mt-3 font-semibold border border-gray-300 rounded'
            onClick={() => {
              startTransition(() => resetTodo());
            }}
        >
            Reset
        </button>
    </div>
  )
}