
import { useState } from 'react'
import React from 'react'

import TaskDo from '../TaskDo'
import TaskLists from '../TaskLists'
import Header from '../Header'

export default function TaskPage() {
  

  const [time, setTime] = useState('')

    function createTask () {
      var now = new Date()

			setTime(now.toISOString())
    }
    
  

  return (
    <div>
      <Header/>
      <div className='task_rows'>
        <TaskDo createTask={createTask} createAt={time}/>
        <TaskLists/>
      </div>
      
    </div>
  )
}
