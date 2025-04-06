import React, { useState } from 'react'
import Task from './Task'

export default function TaskLists() {
	const [openedTaskIds, setOpenedTaskIds] = useState([])

	function handleOpenTask(taskId) {
		// Если задача ещё не открыта — добавляем её
		if (!openedTaskIds.includes(taskId)) {
			setOpenedTaskIds(prev => [...prev, taskId])
		}
	}

	const [inProcess, setInProcess] = useState([
		{
			description:
				'qweqwловппвьпдвтилббиоащаььиьмвшизффьадфтдтидлттдовфыыыыыыыыыытидвошиовшщщыиытщe',
			id_task: 9,
			created_at: '2025-04-05T12:07:35.174115+00:00',
			priority: 'MEDIUM',
			assignee_id: 'string',
			image_names: [],
			title: 'Посадить дерево',
			due_date: '2025-09-20T07:27:21.240752+00:00',
			status: 'qwe',
			is_active: true,
		},
		{
			description: 'qwe',
			id_task: 1,
			created_at: '2025-04-05T12:07:35.174115+00:00',
			priority: 'MEDIUM',
			assignee_id: 'string',
			image_names: [],
			title: 'Собрать урожай',
			due_date: '2025-09-21T07:27:21.240752+00:00',
			status: 'qwe',
		},
		{
			description:
				'qwловппвьпдвтилббиоащаььиьмвшизффьадфтдтидлттдтидвошиовшщщыиытщe',
			id_task: 4,
			created_at: '2025-04-05T12:07:35.174115+00:00',
			priority: 'MEDIUM',
			assignee_id: 'string',
			image_names: [],
			title: 'Полить дерево',
			due_date: '2025-09-22T07:27:21.240752+00:00',
			status: 'qwe',
			is_active: true,
		},
	])

	const [completed, setCompleted] = useState([])
	const [deferred, setDeferred] = useState([])

	return (
		<div className='task_lists1'>
			<div className='taskCreateForm inprocess'>
				<h3>В процессе</h3>
				<div className='tasks_table'>
					{inProcess.map((task, index) => (
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
								<b>Ответсвенный:</b> {task.assignee_id}
							</p>
							<button
								onClick={() => handleOpenTask(task.id_task)}
								className='priorityMainBtn'
								disabled={
									openedTaskIds.length > 0 && !openedTaskIds.includes(task.id_task)
								}
							>
								Открыть
							</button>
							<div>
								{openedTaskIds.includes(task.id_task) && <Task  task={task} />}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='taskCreateForm completed'>
				<h3>Выполнены</h3>
				<div className='tasks_table'>
					{completed.map((task, index) => (
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
								<b>Ответсвенный:</b> {task.assignee_id}
							</p>
							<button className='priorityMainBtn'>Открыть</button>
							<div></div>
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
								<b>Ответсвенный:</b> {task.assignee_id}
							</p>
							<button className='priorityMainBtn'>Открыть</button>
							<div></div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
