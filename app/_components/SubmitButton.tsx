import React from 'react'
import { useFormStatus } from 'react-dom'

type Props = {}

export default function SubmitButton({}: Props) {
  const { pending } = useFormStatus();

  return (
    <button className='bg-blue-500 rounded px-4 py-2 text-white font-semibold'>
        {pending ? "Submitting...": "Submit"}
    </button>
  )
}