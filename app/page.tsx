import { revalidatePath } from 'next/cache';
import React from 'react'
import TodoForm from './_components/TodoForm';

type Props = {}

export default async function Index({}: Props) {

  const result = await fetch("http://localhost:3000/api/todo");
  const todoList: { id: string, message: string}[] = await result.json();


  return (
      <div>
        <h1 className='text-2xl font-bold'>Todos (NextJS14 Server Action)</h1>
        <TodoForm />

        <ul>
          {todoList.map((todo) => (
            <li key={todo.id}>
              Job {todo.id}: {todo.message}
            </li>
          ))}
        </ul>
      </div>
  );
}