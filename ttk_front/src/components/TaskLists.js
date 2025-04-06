import React, { useEffect, useState } from 'react'
import Task from './Task'
export default function TaskLists({tasks}) {
	const [openedTaskIds, setOpenedTaskIds] = useState([])
  
	function handleOpenTask(taskId) {
		// Если задача ещё не открыта — добавляем её
		if (!openedTaskIds.includes(taskId)) {
			setOpenedTaskIds(prev => [...prev, taskId])
		}
	}

  const [inProcess, setInProcess] = useState([])
	const [completed, setCompleted] = useState([])
	const [deferred, setDeferred] = useState([])
useEffect(() => {
	const inProcessTasks = tasks.filter(task => task.status === 'В процессе')
	const completedTasks = tasks.filter(task => task.status === 'Завершена')
	const deferredTasks = tasks.filter(task => task.status === 'Отложенная')

	setInProcess(inProcessTasks)
	setCompleted(completedTasks)
	setDeferred(deferredTasks)
}, [tasks])

	return (
		<div className='task_lists1'>
			<div className='taskCreateForm inprocess'>
				<h3>В процессе</h3>
				<div className='tasks_table'>
					{inProcess.map(task => (
						<div className='task_card' key={task.id_task}>
							<h4>
								<b>Задача:</b> {task.title}
							</h4>
							<p>
								<b>Приоритет:</b> {task.priority}
							</p>
							<p>
								<b>Дата создания:</b> {task.created_at.slice(0, 10)}
							</p>
							<p>
								<b>Дедлайн:</b> {task.due_date.slice(0, 10)}
							</p>
							<p>
								<b>Ответсвенный:</b> {task.assignee_login}
							</p>
							<button
								onClick={() => handleOpenTask(task.id_task)}
								className='priorityMainBtn'
								disabled={
									openedTaskIds.length > 0 &&
									!openedTaskIds.includes(task.id_task)
								}
							>
								Открыть
							</button>
							<div>
								{openedTaskIds.includes(task.id_task) && (
									<Task
										taskIDs={openedTaskIds}
										openedTaskIds={setOpenedTaskIds}
										task={task}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='taskCreateForm completed'>
				<h3>Выполнены</h3>
				<div className='tasks_table'>
					{completed.map(task => (
						<div className='task_card' key={task.id_task}>
							<h4>
								<b>Задача:</b> {task.title}
							</h4>
							<p>
								<b>Приоритет:</b> {task.priority}
							</p>
							<p>
								<b>Дата создания:</b> {task.created_at.slice(0, 10)}
							</p>
							<p>
								<b>Дедлайн:</b> {task.due_date.slice(0, 10)}
							</p>
							<p>
								<b>Ответсвенный:</b> {task.assignee_login}
							</p>
							<button
								onClick={() => handleOpenTask(task.id_task)}
								className='priorityMainBtn'
								disabled={
									openedTaskIds.length > 0 &&
									!openedTaskIds.includes(task.id_task)
								}
							>
								Открыть
							</button>
							<div>
								{openedTaskIds.includes(task.id_task) && (
									<Task
										taskIDs={openedTaskIds}
										openedTaskIds={setOpenedTaskIds}
										task={task}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='taskCreateForm deferred'>
				<h3>Отложены</h3>
				<div className='tasks_table'>
					{deferred.map((task, index) => (
						<div className='task_card' key={index}>
							<h4>
								<b>Задача:</b> {task.title}
							</h4>
							<p>
								<b>Приоритет:</b> {task.priority}
							</p>
							<p>
								<b>Дата создания:</b> {task.created_at.slice(0, 10)}
							</p>
							<p>
								<b>Дедлайн:</b> {task.due_date.slice(0, 10)}
							</p>
							<p>
								<b>Ответсвенный:</b> {task.assignee_login}
							</p>
							<button
								onClick={() => handleOpenTask(task.id_task)}
								className='priorityMainBtn'
								disabled={
									openedTaskIds.length > 0 &&
									!openedTaskIds.includes(task.id_task)
								}
							>
								Открыть
							</button>
							<div>
								{openedTaskIds.includes(task.id_task) && (
									<Task
										taskIDs={openedTaskIds}
										openedTaskIds={setOpenedTaskIds}
										task={task}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
