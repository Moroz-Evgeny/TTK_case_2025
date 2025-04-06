import React, { useState } from 'react'

export default function TaskDo({ tasks, setTasks, createTask, createAt }) {
	const [article, setArticle] = useState('')
	const [content, setTaskDescribtion] = useState('')
	const [priority, setPriority] = useState('Средний')
	const [status, setStatus] = useState('Отложенная')
	const [token] = useState(localStorage.getItem('token'))
	const [login, setLogin] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [files, setFiles] = useState([])

	const [priorityDropdownVisible, setPriorityDropdownVisible] = useState(false)
	const [statusDropdownVisible, setStatusDropdownVisible] = useState(false)

	const handleStatusClick = () =>
		setStatusDropdownVisible(!statusDropdownVisible)
	const handleStatusSelect = selectedStatus => {
		setStatus(selectedStatus)
		setStatusDropdownVisible(false)
	}

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

	const handleSubmit = async e => {
		e.preventDefault()
		createTask()

		const formData = new FormData()
		formData.append('title', article)
		formData.append('description', content)
		formData.append('due_date', getFormattedDateTime())
		formData.append('priority', priority)
		formData.append('status', status)
		formData.append('assignee_login', login)
		formData.append('create_at', createAt)
		files.forEach(file => formData.append('image', file))

		try {
			const response = await fetch('http://31.41.155.241:8000/task', {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: 'include',
			})

			if (!response.ok) {
				const errorData = await response.json()
				console.error('Ошибка при создании задачи:', errorData)
			} else {
				const data = await response.json()
				setTasks([...tasks , data])
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
					<button
						className='priorityMainBtn'
						type='button'
						onClick={handlePriorityClick}
					>
						Приоритет: {priority}
					</button>
					{priorityDropdownVisible && (
						<ul className='priority-dropdown'>
							{['Высокий', 'Средний', 'Низкий'].map(p => (
								<li key={p}>
									<button
										className='priorityBtn'
										type='button'
										onClick={() => handlePrioritySelect(p)}
									>
										{p}
									</button>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className='priority_nav'>
					<button
						className='priorityMainBtn'
						type='button'
						onClick={handleStatusClick}
					>
						Статус: {status}
					</button>
					{statusDropdownVisible && (
						<ul className='priority-dropdown'>
							{['В процессе', 'Отложенная', 'Завершена'].map(s => (
								<li key={s}>
									<button
										className='priorityBtn'
										type='button'
										onClick={() => handleStatusSelect(s)}
									>
										{s}
									</button>
								</li>
							))}
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
