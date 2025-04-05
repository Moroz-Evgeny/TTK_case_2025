from datetime import datetime
import os, settings
import shutil
import uuid
from typing import Optional, Union
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from api.schemas import TaskCreate

from db.dals import TaskDAL, UserDAL
from db.models import PortalRole, User, Task


async def _save_task_and_articles_images(images: UploadFile) -> Union[None, str]:
  image_names = []
  for image in images:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.normpath(os.path.join(settings.UPLOAD_DIR, filename))
    with open(file_path, "wb") as buffer:
      shutil.copyfileobj(image.file, buffer)
    image_names.append(filename)  # Или относительный путь, если нужно

  return image_names

async def _create_new_task(
    title: str,
    description: str,
    due_date: Optional[datetime],
    priority: str,
    status: str,
    assignee_id: UUID,
    image_names: list,
    session) -> Union[None, UUID]:
  async with session.begin():
    task_dal = TaskDAL(session)
    task_id = await task_dal.create_new_task(
      title=title,
      description=description,
      due_date=due_date,
      priority=priority,
      status=status,
      assignee_id=assignee_id,
      image_names=image_names,
    )
    return task_id