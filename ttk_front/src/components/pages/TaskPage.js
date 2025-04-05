
import { useState } from 'react'
import React from 'react'

import TaskDo from '../TaskDo'
import Header from '../Header'

export default function TaskPage() {
  

  const [time, setTime] = useState('')

  function SaveChanges() {
    var now = new Date()

    setTime(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`)
  }

  return (
    <div>
      <Header/>
      <div>
        <div><TaskDo /></div>
      </div>
      
    </div>
  )
}
