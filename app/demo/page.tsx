import React from 'react'
import DemoForm1 from './DemoForm1'
import DemoForm2 from './DemoForm2'

type Props = {}

export default function page({}: Props) {
  return (
    <div>
        Demo Page
        {/* <DemoForm1 /> */}
        <DemoForm2 />
    </div>
  )
}