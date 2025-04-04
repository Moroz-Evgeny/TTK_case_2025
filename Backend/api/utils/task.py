from typing import Union
from uuid import UUID

from fastapi import HTTPException, status
from api.schemas import TaskCreate

from db.dals import TaskDAL
from db.models import PortalRole, User, Task


async def _create_new_task(task: TaskCreate, team_id: UUID, session) -> Union[None, UUID]:
  async with session.begin():
    task_dal = TaskDAL(session)
    task_id = await task_dal.create_new_task(
      team_id=team_id,
      title=task.title,
      description=task.description,
      status=task.status,
      responsible=task.responsible,
    )
    if task_id is not None:
      return task_id