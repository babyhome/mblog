"use client"
import React, { useRef, useState, useTransition } from "react";

type Props = {};

export default function DemoForm2({}: Props) {
  const [name, setName] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      startTransition(async() => {
        // Your Api call or server action here, simulating a server request below
        await new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
          console.log("Test log 1");
          ref.current?.reset();
        });
      });
      console.log("Test log 2");
    } catch (error: any) {
      // Error here
    }
  }

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
                disabled={isPending}
            />
            <button type='submit' className='text-white font-semibold bg-blue-800 p-2 rounded'>
                {isPending ? "Loading..." : "Submit"}
            </button>
        </form>
    </div>
  )
}