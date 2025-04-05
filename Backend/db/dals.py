from datetime import datetime
from typing import Optional, Union
from uuid import UUID
from sqlalchemy import select, update, and_
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import PortalRole, User, Task, TaskHistory
from api.schemas import TaskCreateHistory

import uuid

class UserDAL:
  def __init__(self, db_session: AsyncSession):
    self.db_session = db_session
  
  async def create_user(
      self,
      login: str,
      first_name: str,
      middle_name: str,
      last_name: str,
      hashed_password: str
      ) -> User:
    new_user = User(
      login=login,
      first_name=first_name,
      middle_name=middle_name,
      last_name=last_name,
      hashed_password=hashed_password,
    )

    self.db_session.add(new_user)
    await self.db_session.flush()
    return new_user
  
  async def delete_user(self, id: UUID) -> Union[UUID, None]:
    query = update(User).where(and_(User.id == id, User.is_active == True)).values(is_active = False).returning(User.id)
    result = await self.db_session.execute(query)
    remote_user_id = result.fetchone()
    if remote_user_id is not None:
      return remote_user_id[0]
  
  async def update_user(self, id: UUID, update_user_params: dict) -> Union[UUID, None]:
    query = update(User).where(and_(User.id == id, User.is_active == True)).values(update_user_params).returning(User.id)
    result = await self.db_session.execute(query)
    update_user_id = result.fetchone()
    if update_user_id is not None:
      return update_user_id[0]

  async def get_user_by_id(self, id: UUID) -> Union[User, None]:
    query = select(User).where(User.id == id)
    result = await self.db_session.execute(query)
    user_row = result.fetchone()
    if user_row is not None:
      return user_row[0]
  
  async def get_user_by_login(self, login: str) -> Union[None, User]:
    query = select(User).where(User.login == login)
    result = await self.db_session.execute(query)
    user_row = result.fetchone()
    if user_row is not None:
      return user_row[0]


class TaskDAL:
  def __init__(self, db_session: AsyncSession):
    self.db_session = db_session

  async def create_new_task(
      self,
      title: str,
      description: str,
      due_date: Optional[datetime],
      created_at: Optional[datetime],
      priority: str,
      status: str,
      assignee_id: UUID,
      image_names: list,) -> Union[None, Task]:
    new_task = Task(
      title=title,
      description=description,
      image_names=image_names,
      due_date=due_date,
      created_at=created_at,
      priority=priority,
      status=status,
      assignee_id=assignee_id,
    )
    self.db_session.add(new_task)
    await self.db_session.flush()
    return new_task
  
  async def delete_task(self, id: UUID) -> Union[None, Task]:
    query = update(Task).where(and_(Task.id == id, Task.is_active == True)).values(is_active = False).returning(Task)
    result = await self.db_session.execute(query)
    task = result.fetchone()
    if task is not None:
      return task[0]
  
  async def update_task(self, id: UUID, update_task_params: dict) -> Union[Task, None]:
    query = update(Task).where(and_(Task.id == id, Task.is_active == True)).values(update_task_params).returning(Task)
    result = await self.db_session.execute(query)
    update_user_id = result.fetchone()
    if update_user_id is not None:
      return update_user_id[0]
  
  async def create_history_task(self, body: TaskCreateHistory) -> Union[None, TaskHistory]:
    new_history = TaskHistory(
      id_task=body.id_task,
      task_title=body.task_title,
      user_login=body.user_login,
      change_event=body.change_event,
      timestamp=body.timestamp,
    )
    self.db_session.add(new_history)
    await self.db_session.flush()
    return new_history
  
  