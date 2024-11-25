"use client"
import React, { useActionState, useRef } from 'react'
import { submitTodo } from '../_actions/todo-action'
import SubmitButton from './SubmitButton';
import ResetButton from './ResetButton';

type Props = {}

export default function TodoForm({}: Props) {
    const ref = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(submitTodo, { error: null});

    return (
        <form 
            ref={ref}
            action={async (formData: FormData) => {
                ref.current?.reset();
                formAction(formData)
            }}
            className='flex flex-col w-[300px] my-16 bg-white-300'
        >
          <input 
            type='text'
            name='message'
            className='px-4 py-2 mb-3'
            placeholder='write your job..'
          />

          {state.error && (
            <span className='text-red-500'>!Must be greater than 5 chars.</span>
          )}
          <SubmitButton />
          <ResetButton />
        </form>
    )
}