"use client"
import { revalidatePath } from 'next/cache';
import React, { useRef, useState } from 'react'

type Props = {}

export default function DemoForm1({}: Props) {
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // revalidatePath("http://localhost:3000/demo")
      ref.current?.reset();
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className='flex flex-auto border-1'>
        <form 
          ref={ref}
          onSubmit={onSubmit}
          className='flex flex-col w-[300px] my-16 bg-white-300 w-[300px]'
        >
            <input 
              className='p-2 my-2 rounded border-1 border-gray-200'
                type='text'
                name='name'
                // defaultValue={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isLoading}
            />
            <button type='submit' className='text-white font-semibold bg-blue-800 p-2 rounded'>
                {isLoading ? "Loading..." : "Submit"}
            </button>
        </form>
    </div>
  )
}