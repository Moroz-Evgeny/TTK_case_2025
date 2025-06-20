from datetime import datetime
import os, settings
import shutil
import uuid
from typing import Optional, Union
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from api.schemas import TaskCreateHistory, UpdateTaskRequest

from db.dals import TaskDAL, UserDAL
from db.models import PortalRole, User, Task


async def _save_task_and_articles_images(images: UploadFile) -> Union[None, str]:
    image_names = []
    
    if images[0].filename == '':
        return image_names
    
    upload_dir = settings.UPLOAD_DIR
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)  

    for image in images:

        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = os.path.normpath(os.path.join(upload_dir, filename))
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        image_names.append(filename) 
    
    return image_names

async def _create_new_task(
    title: str,
    description: str,
    due_date: Optional[datetime],
    created_at: Optional[datetime],
    priority: str,
    status: str,
    assignee_id: UUID,
    assignee_login: str,
    image_names: list,
    session) -> Union[None, Task]:
  async with session.begin():
    task_dal = TaskDAL(session)
    task = await task_dal.create_new_task(
      title=title,
      description=description,
      due_date=due_date,
      created_at=created_at,
      priority=priority,
      status=status,
      assignee_id=assignee_id,
      assignee_login=assignee_login,
      image_names=image_names,
    )
    if task is not None:
      return task


async def _create_history_task(
    body: TaskCreateHistory,
    session,
) -> Union[None, UUID]:
  async with session.begin():
    task_dal = TaskDAL(session)
    history = await task_dal.create_history_task(body=body)
    if history is not None:
      return history

async def _delete_task(
    id: UUID,
    session,
) -> Union[None, Task]:
  async with session.begin():
    task_dal = TaskDAL(session)
    task = await task_dal.delete_task(id=id)
    if task is not None:
      return task

async def _update_task(
    id: UUID,
    update_task_params: UpdateTaskRequest,
    session,
) -> Union[None, Task]:
  async with session.begin():
    task_dal = TaskDAL(session)
    task = await task_dal.update_task(id=id, update_task_params=update_task_params)
    if task is not None:
      return task
    
async def _get_all_task(session):
  async with session.begin():
    task_dal = TaskDAL(session)
    all_task = await task_dal.get_all_task()
    if all_task is not None:
      return all_task

async def _get_all_history_task(session):
  async with session.begin():
    task_dal = TaskDAL(session)
    all_task = await task_dal.get_all_history_task()
    if all_task is not None:
      return all_task

async def _get_task_by_id(id: UUID, session) -> Union[Task, None]:
    async with session.begin():
        task_dal = TaskDAL(session)
        task = await task_dal.get_task_by_id(id=id)
        if task is not None:
            return task