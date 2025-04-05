import React from 'react'
import { useState } from 'react'

export default function TaskDo() {
	const [article, setArticle] = useState('')
	const [content, setTaskDescribtion] = useState('')
	const [taskData, setTaskData] = useState({})
	const [time, setTime] = useState('')
	const [priority, setPriority] = useState('Средний')
	const [status, setStatus] = useState('Отложенная')
	const [token, setToken] = useState(localStorage.getItem('token'))
	const [login, setLogin] = useState('')

	const [files, setFiles] = useState([])

	function handleArticleInput(e) {
		setArticle(e.target.value)
	}

	function handleLoginInput(e) {
		setLogin(e.target.value)
	}

	const handleFileInput = e => {
		const selectedFiles = Array.from(e.target.files)
		console.log('Выбраны файлы:', selectedFiles)
		setFiles(selectedFiles)
	}

	function handleTaskDescribtionInput(e) {
		setTaskDescribtion(e.target.value)
	}

	function StopCreateTask() {
		setArticle('')
		setTaskDescribtion('')
	}

	function SaveTask() {
		setTaskData({
			title: article,
			description: content,
			due_date: time,
			priority: priority,
			status: status,
			assignee_login: login,
			image: files,
		})
	}
	const handleSubmit = async e => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('title', article)
		formData.append('description', content)
		formData.append('due_date', '2025-04-10T15:00:00')
		formData.append('priority', priority)
		formData.append('status', status)
		formData.append('assignee_login', login)

		files.forEach((file, index) => {
			formData.append('image[]', file)
		})
		try {
			const response = await fetch('http://31.41.155.241:8000/task', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			})

			if (!response.ok) {
				const error = await response.json()
			} else {
				const data = await response.json()
				console.log('Задача успешно создана. ID:', data)
			}
		} catch (err) {
			console.error('Ошибка сети:', err)
		}
	}

	return (
		<div className='taskPage'>
			<form className='taskCreateForm' onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Заголовок'
					value={article}
					onChange={handleArticleInput}
				/>

				<textarea className='describtion'
					value={content}
					onChange={handleTaskDescribtionInput}
					placeholder='Описание'
				></textarea>
				<input
					placeholder='Ответсвенное лицо'
					type='text'
					value={login}
					onChange={handleLoginInput}
				/>
				<input type='file' multiple onChange={handleFileInput} />
				<button type='submit'>Сохранить задачу</button>
			</form>
		</div>
	)
}
