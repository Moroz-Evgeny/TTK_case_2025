from datetime import datetime
import os, settings
import shutil
import uuid
from typing import Optional, Union
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from api.schemas import UpdateArticleRequest, ArticleCreateHistory, UpdateArticleRequest

from db.dals import TaskDAL, UserDAL, ArticleDAL
from db.models import Article, PortalRole, User, Task


async def _create_new_article(
    title: str,
    content: str,
    image_names: list,
    author_id: UUID,
    author_login: str,
    session) -> Union[None, UUID]:
  async with session.begin():
    article_dal = ArticleDAL(session)
    article = await article_dal.create_new_article(
      title=title,
      content=content,
      image_names=image_names,
      author_id=author_id,
      author_login=author_login,
    )
    if article is not None:
      return article


async def _create_history_article(
    body: ArticleCreateHistory,
    session,
) -> Union[None, UUID]:
  async with session.begin():
    article_dal = ArticleDAL(session)
    history = await article_dal.create_history_article(body=body)
    if history is not None:
      return history

async def _delete_article(
    id: UUID,
    session,
) -> Union[None, Article]:
  async with session.begin():
    article_dal = ArticleDAL(session)
    article = await article_dal.delete_article(id=id)
    if article is not None:
      return article

async def _update_article(
    id: UUID,
    update_article_params: UpdateArticleRequest,
    session,
) -> Union[None, Article]:
  async with session.begin():
    article_dal = ArticleDAL(session)
    article = await article_dal.update_article(id=id, update_article_params=update_article_params)
    if article is not None:
      return article
    
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