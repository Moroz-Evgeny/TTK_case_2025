from typing import Union
from uuid import UUID

from fastapi import APIRouter, Request, Response, Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from api.schemas import TaskCreate

from api.utils.jwt import _get_current_user_from_access_token
from api.utils.task import _create_new_task

from db.session import get_db
from db.dals import UserDAL
from db.models import PortalRole, User

task_router = APIRouter()

@task_router.post('/', response_model=Union[UUID, None])
async def create_new_task(task: TaskCreate, user: User = Depends(_get_current_user_from_access_token), session: AsyncSession = Depends(get_db)):
  ...
