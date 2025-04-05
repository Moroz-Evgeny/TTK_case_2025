
import { useState } from 'react'
import React from 'react'

import TaskDo from '../TaskDo'

export default function TaskPage({data}) {

  const [taskCreator, setTaskCreator] = useState(false)
  const taskList = [{title: "Отсосать",
        description: "Грубо",
        due_date: "2025.05.05 5:24:21.000",
        stat : 'inprogress',
        assignee_login: 'petuh',
        image: []}]

  const [time, setTime] = useState('')

  function OpenTaskCreator() {
    setTaskCreator(true)
  }

  function SaveChanges() {
    var now = new Date()

    setTime(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`)
  }

  return (
    <div>
      <div>
        <button onClick={OpenTaskCreator}>Создать задачу</button>
        <div>{taskCreator ? <TaskDo data={data} closeTaskCreator={setTaskCreator}/> : ''}</div>
      </div>
      <div className='task_now'>
        <div className='task'>
          {taskList.map((task, index) => (
            <div>
              <div key={index}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>{task.due_date}</p>
                <p>{task.assignee_login}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
