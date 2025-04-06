
import { useEffect, useState } from 'react'
import React from 'react'

import TaskDo from '../TaskDo'
import TaskLists from '../TaskLists'
import Header from '../Header'

export default function TaskPage() {
  
  const [tasks, setTasks] = useState([])

  function decodeJWT(token) {
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		return JSON.parse(atob(base64))
	}


  const [time, setTime] = useState('')

    function createTask () {
      var now = new Date()

			setTime(now.toISOString())
    }
    
	const handleSubmit = async () => {
		// event.preventDefault()

		const token = localStorage.getItem('token')
		const data = decodeJWT(token)

		fetch(`http://31.41.155.241:8000/task`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(result => {
				console.log('Результат от сервера:', result)
				console.log('result.data:', result.data)
				setTasks(result.data)
			})
			.catch(error => console.error('Ошибка запроса:', error))
	}

	useEffect(() => {
		handleSubmit()
	}, [])

  return (
		<div className='task_page'>
			<div className='container'>
				<Header />
				<div className='task_rows'>
					<TaskDo
						tasks={tasks}
						setTasks={setTasks}
						createTask={createTask}
						createAt={time}
					/>
					<TaskLists tasks={tasks} />
				</div>
			</div>
		</div>
	)
}
