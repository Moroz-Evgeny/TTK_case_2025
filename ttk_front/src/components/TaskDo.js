import React from 'react'
import { useState } from 'react'

export default function TaskDo({ data, closeTaskCreator }) {
	const [article, setArticle] = useState('')
	const [content, setTaskDescribtion] = useState('')
	const [taskData, setTaskData] = useState({})
	const [time, setTime] = useState('')
	const [priority, setPriority] = useState('Средний')
	const [status, setStatus] = useState('Отложенная')

	function handleArticleInput(e) {
		setArticle(e.target.value)
	}

	function handleTaskDescribtionInput(e) {
		setTaskDescribtion(e.target.value)
	}

	function StopCreateTask() {
		setArticle('')
		setTaskDescribtion('')
		closeTaskCreator(false)
	}

	function SaveTask() {
		setTaskData({
			title: article,
			description: content,
			due_date: time,
			priority: priority,
			status: status,
			assignee_login: data.login,
			image: [],
		})
	}
	const handleSubmit = event => {
		event.preventDefault()
		const formData = taskData

		fetch('localhost:8000/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then(response => response.json())
			.then(result => {
				setTaskData({
					title: article,
					description: content,
					due_date: time,
					priority: priority,
					status: status,
					assignee_login: data.login,
					image: [],
					taskid: result,
				})
				console.log(taskData.taskid)
			})
			.catch(error => console.error('Ошибка запроса:', error))
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<button onClick={StopCreateTask}>Закрыть</button>
				<input
					type='text'
					placeholder='Заголовок'
					value={article}
					onChange={handleArticleInput}
				/>
				<textarea
					value={content}
					onChange={handleTaskDescribtionInput}
					placeholder='Описание'
				></textarea>
				<button onClick={SaveTask}>Сохранить задачу</button>
			</form>
		</div>
	)
}
