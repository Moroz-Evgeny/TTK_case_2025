import React, { useState } from 'react'

export default function TaskDo() {
	const [article, setArticle] = useState('')
	const [content, setTaskDescribtion] = useState('')
	const [priority, setPriority] = useState('Средний')
	const [status] = useState('Отложенная')
	const [token, setToken] = useState(localStorage.getItem('token'))
	const [login, setLogin] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [files, setFiles] = useState([])

	const [priorityDropdownVisible, setPriorityDropdownVisible] = useState(false)

	const handleArticleInput = e => setArticle(e.target.value)
	const handleLoginInput = e => setLogin(e.target.value)
	const handleTaskDescribtionInput = e => setTaskDescribtion(e.target.value)
	const handleFileInput = e => setFiles(Array.from(e.target.files))
	const handlePriorityClick = () =>
		setPriorityDropdownVisible(!priorityDropdownVisible)
	const handlePrioritySelect = selectedPriority => {
		setPriority(selectedPriority)
		setPriorityDropdownVisible(false)
	}

	const getFormattedDateTime = () => {
		if (!dueDate) return ''
		return new Date(dueDate).toISOString()
	}

	// Обновление access токена, refresh берётся из куки
	const refreshToken = async () => {
		try {
			const response = await fetch('http://31.41.155.241:8000/login/refresh', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // 🔥 отправит куку
			})

			if (!response.ok) throw new Error('Failed to refresh token')

			const data = await response.json()
			localStorage.setItem('token', data.access_token)
			setToken(data.access_token)
			return data.access_token
		} catch (error) {
			console.error('Ошибка обновления токена:', error)
			return null
		}
	}

	const fetchWithAuth = async (url, options = {}) => {
		let currentToken = token

		const makeRequest = async () => {
			const headers = {
				...(options.headers || {}),
				Authorization: `Bearer ${currentToken}`,
			}

			const response = await fetch(url, {
				...options,
				headers,
				credentials: 'include', // 🔥 нужно всегда
			})

			if (response.status === 401) {
				const newToken = await refreshToken()
				if (!newToken) throw new Error('Требуется повторная авторизация')

				const retryHeaders = {
					...headers,
					Authorization: `Bearer ${newToken}`,
				}

				return await fetch(url, {
					...options,
					headers: retryHeaders,
					credentials: 'include',
				})
			}

			return response
		}

		return makeRequest()
	}

	const handleSubmit = async e => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('title', article)
		formData.append('description', content)
		formData.append('due_date', getFormattedDateTime())
		formData.append('priority', priority)
		formData.append('status', status)
		formData.append('assignee_login', login)
		files.forEach(file => formData.append('image', file))

		try {
			const response = await fetchWithAuth('http://31.41.155.241:8000/task', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				const errorData = await response.json()
				console.error('Ошибка при создании задачи:', errorData)
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
			<form
				className='taskCreateForm'
				onSubmit={handleSubmit}
				encType='multipart/form-data'
			>
				<input
					type='text'
					placeholder='Заголовок'
					value={article}
					onChange={handleArticleInput}
				/>
				<textarea
					className='describtion'
					value={content}
					onChange={handleTaskDescribtionInput}
					placeholder='Описание'
				></textarea>
				<input
					type='text'
					placeholder='Ответственное лицо'
					value={login}
					onChange={handleLoginInput}
				/>
				<input
					type='datetime-local'
					value={dueDate}
					onChange={e => setDueDate(e.target.value)}
				/>

				<div className='priority_nav'>
					<button type='button' onClick={handlePriorityClick}>
						Приоритет: {priority}
					</button>
					{priorityDropdownVisible && (
						<ul className='priority-dropdown'>
							<li>
								<button
									type='button'
									onClick={() => handlePrioritySelect('Высокий')}
								>
									Высокий
								</button>
							</li>
							<li>
								<button
									type='button'
									onClick={() => handlePrioritySelect('Средний')}
								>
									Средний
								</button>
							</li>
							<li>
								<button
									type='button'
									onClick={() => handlePrioritySelect('Низкий')}
								>
									Низкий
								</button>
							</li>
						</ul>
					)}
				</div>

				<div className='upload'>
					<label htmlFor='fileUpload' className='upload-btn'>
						Загрузить файлы: {files.length}
					</label>
					<input
						id='fileUpload'
						name='file'
						type='file'
						className='input-file'
						multiple
						onChange={handleFileInput}
					/>
				</div>

				<button className='input-bnt' type='submit'>
					Сохранить задачу
				</button>
			</form>
		</div>
	)
}
