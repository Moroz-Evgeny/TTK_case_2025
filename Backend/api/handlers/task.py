from datetime import datetime
from typing import List, Optional, Union
from uuid import UUID
from logging import getLogger

from fastapi import APIRouter, Request, Response, Depends,HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from api.schemas import TaskCreateHistory, UpdateTaskRequest, ShowTask

from api.utils.jwt import _get_current_user_from_access_token
from api.utils.task import _create_new_task, _save_task_and_articles_images, _create_history_task, _delete_task, _update_task, _get_all_task, _get_all_history_task
from api.utils.user import _get_user_by_login

from db.session import get_db
from db.dals import UserDAL
from db.models import PortalRole, User


task_router = APIRouter()
logger = getLogger(__name__)

@task_router.post('/', response_model=ShowTask)
async def create_new_task(
    title: str = Form(...),
    description: str = Form(...), 
    due_date: Optional[datetime] = Form(None),
    created_at: Optional[datetime] = Form(None),
    priority: str = Form("MEDIUM"),
    status: str = Form(...),
    assignee_login: str = Form(...),
    image: List[UploadFile] = File([]),
    user: User = Depends(_get_current_user_from_access_token),
    session: AsyncSession = Depends(get_db)
) -> Union[None, ShowTask]:
    try:
      image_names = await _save_task_and_articles_images(image)
      if image_names is None:
          raise HTTPException(status_code=409, detail="Save image error.")
      assignee = await _get_user_by_login(login=assignee_login, session=session)
      if assignee is None:
        raise HTTPException(status_code=404, detail=f"User with login '{assignee_login}' is not found")  

      new_task = await _create_new_task(
          title=title,
          description=description,
          due_date=due_date,
          created_at=created_at,
          priority=priority,
          status=status,
          assignee_id=assignee.id,
          assignee_login=assignee.login,
          image_names=image_names,
          session=session)
      if new_task is None:
          raise HTTPException(status_code=409, detail="Create task error.")
      task_history = await _create_history_task(
         TaskCreateHistory(
         id_task=new_task.id_task,
         task_title=new_task.title,
         user_login=user.login,
         change_event=["Create new task."],
         timestamp=new_task.created_at,
         ),
         session=session,
      )          
      if task_history is None:
          raise HTTPException(status_code=409, detail="Create task history error.")
      return new_task
    except IntegrityError as err:
      logger.error(err)
      raise HTTPException(status_code=503, detail=f"Database error: {err}")

@task_router.delete('/', response_model=Union[UUID, None])
async def delete_task(
    id: UUID,
    user: User = Depends(_get_current_user_from_access_token),
    session: AsyncSession = Depends(get_db)) -> Union[None, UUID]:
   delete_task = await _delete_task(id=id, session=session)
   if delete_task is None:
      raise HTTPException(status_code=404, detail=f"Task with id {id} is not found.")
   task_history = await _create_history_task(
      TaskCreateHistory(
      id_task=delete_task.id_task,
      task_title=delete_task.title,
      user_login=user.login,
      change_event=["Delete task."],
      timestamp=delete_task.created_at,
      ),
      session=session,
   )
   if task_history is None:
      raise HTTPException(status_code=503, detail="Failed to create task history.")
   
   return delete_task.id

@task_router.patch('/', response_model=Union[UUID, None])
async def update_task(
   id: UUID,
   body: UpdateTaskRequest,
   session: AsyncSession = Depends(get_db),
   user: User = Depends(_get_current_user_from_access_token)) -> Union[UUID, None]:
   update_task_params = body.dict(exclude_none=True)
   if update_task_params == {}:
      raise HTTPException(status_code=422, detail="At least one parameter for task update info should be provided")
   update_task = await _update_task(id=id, update_task_params=update_task_params, session=session)
   if update_task is None:
      raise HTTPException(status_code=404, detail=f"Task with id '{id}' is not found")
   events_list = []
   for event in update_task_params:
      events_list.append(f'Update {event}')
   task_history = await _create_history_task(
      TaskCreateHistory(
      id_task=update_task.id_task,
      task_title=update_task.title,
      user_login=user.login,
      change_event=events_list,
      timestamp=update_task.created_at,
      ),
      session=session,
   )   
   if task_history is None:
     raise HTTPException(status_code=503, detail="Failed to create task history.")
   return update_task.id

@task_router.get('/')
async def get_all_task(user: User = Depends(_get_current_user_from_access_token), session: AsyncSession = Depends(get_db)):
   tasks = await _get_all_task(session=session)
   if tasks is None:
     raise HTTPException(status_code=404, detail="Tasks not found.")
   return {"data": tasks}

@task_router.get('/history')
async def get_all_history_task(user: User = Depends(_get_current_user_from_access_token), session: AsyncSession = Depends(get_db)):
   task_history = await _get_all_history_task(session=session)
   if task_history is None:
     raise HTTPException(status_code=404, detail="Tasks not found.")
   return {"data": task_history}