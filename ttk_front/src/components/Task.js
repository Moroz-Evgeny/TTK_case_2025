import React from 'react'

export default function Task({task}) {
  return (
		<div>
			<div className='read_task'>
				<h4>
					<b>Задача:</b> {task.title}
				</h4>
				<div className='task_desc'>
					<b>Описание: </b>
					<p>{task.description}</p>
				</div>
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
        <button>Закрыть</button>
			</div>
			<div className='back_task'></div>
		</div>
	)
}
