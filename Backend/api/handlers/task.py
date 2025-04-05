from datetime import datetime
from typing import List, Optional, Union
from uuid import UUID
from logging import getLogger

from fastapi import APIRouter, Request, Response, Depends,HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from api.schemas import TaskCreate

from api.utils.jwt import _get_current_user_from_access_token
from api.utils.task import _create_new_task, _save_task_and_articles_images
from api.utils.user import _get_user_by_login

from db.session import get_db
from db.dals import UserDAL
from db.models import PortalRole, User


task_router = APIRouter()
logger = getLogger(__name__)

@task_router.post('/', response_model=Union[UUID, None])
async def create_new_task(
    title: str = Form(...),
    description: str = Form(...), 
    due_date: Optional[datetime] = Form(None),
    priority: str = Form("MEDIUM"),
    status: str = Form(...),
    assignee_login: str = Form(...),
    image: List[UploadFile] = File(...),
    user: User = Depends(_get_current_user_from_access_token),
    session: AsyncSession = Depends(get_db)
) -> Union[None, UUID]:
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
          priority=priority,
          status=status,
          assignee_id=assignee.id,
          image_names=image_names,
          session=session)
      if new_task is None:
          raise HTTPException(status_code=409, detail="Create task error.")

      return new_task
    except IntegrityError as err:
      logger.error(err)
      raise HTTPException(status_code=503, detail=f"Database error: {err}")
