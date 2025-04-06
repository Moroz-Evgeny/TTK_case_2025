from datetime import datetime
from typing import List, Optional, Union
from uuid import UUID
from logging import getLogger

from fastapi import APIRouter, Depends,HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from api.schemas import ArticleCreateHistory, UpdateArticleRequest, ShowArticle

from api.utils.task import _save_task_and_articles_images
from api.utils.jwt import _get_current_user_from_access_token
from api.utils.article import _create_new_article, _create_history_article, _delete_article, _get_all_article, _update_article, _get_all_history_article
from api.utils.user import _get_user_by_login

from db.session import get_db
from db.models import User


article_router = APIRouter()
logger = getLogger(__name__)

@article_router.post('/', response_model=Union[ShowArticle, None])
async def create_new_article(
    title: str = Form(...),
    content: str = Form(...), 
    image: List[UploadFile] = File([]),
    user: User = Depends(_get_current_user_from_access_token),
    session: AsyncSession = Depends(get_db)
) -> Union[None, ShowArticle]:
    try:
      image_names = await _save_task_and_articles_images(image)
      if image_names is None:
          raise HTTPException(status_code=409, detail="Save image error.") 

      new_article = await _create_new_article(
          title=title,
          content=content,
          image_names=image_names,
          author_id=user.id,
          author_login=user.login,
          session=session)
      if new_article is None:
          raise HTTPException(status_code=409, detail="Create article error.")
      article_history = await _create_history_article(
         ArticleCreateHistory(
         article_id=new_article.id_article,
         article_title=new_article.title,
         user_login=user.login,
         change_event=["Create new article."],
         timestamp=new_article.updated_at,
         ),
         session=session,
      )          
      if article_history is None:
          raise HTTPException(status_code=409, detail="Create task history error.")
      return new_article
    except IntegrityError as err:
      logger.error(err)
      raise HTTPException(status_code=503, detail=f"Database error: {err}")

@article_router.delete('/', response_model=Union[UUID, None])
async def delete_article(
    id: UUID,
    user: User = Depends(_get_current_user_from_access_token),
    session: AsyncSession = Depends(get_db)) -> Union[None, UUID]:
   delete_article = await _delete_article(id=id, session=session)
   if delete_article is None:
      raise HTTPException(status_code=404, detail=f"Article with id {id} is not found.")
   article_history = await _create_history_article(
    ArticleCreateHistory(
    article_id=delete_article.id_article,
    article_title=delete_article.title,
    user_login=user.login,
    change_event=["Delete article."],
    timestamp=delete_article.updated_at,
    ),
    session=session,
   )   
   if article_history is None:
      raise HTTPException(status_code=503, detail="Failed to create task history.")
   
   return delete_article.id

@article_router.patch('/', response_model=Union[UUID, None])
async def update_article(
   id: UUID,
   body: UpdateArticleRequest,
   session: AsyncSession = Depends(get_db),
   user: User = Depends(_get_current_user_from_access_token)) -> Union[UUID, None]:
   update_article_params = body.dict(exclude_none=True)
   if update_article_params == {}:
      raise HTTPException(status_code=422, detail="At least one parameter for article update info should be provided")
   update_article = await _update_article(id=id, update_article_params=update_article_params, session=session)
   if update_article is None:
      raise HTTPException(status_code=404, detail=f"Article with id '{id}' is not found")
   events_list = []
   for event in update_article_params:
      events_list.append(f'Update {event}')
   article_history = await _create_history_article(
    ArticleCreateHistory(
    article_id=update_article.id_article,
    article_title=update_article.title,
    user_login=user.login,
    change_event=events_list,
    timestamp=update_article.updated_at,
    ),
    session=session,
   ) 
   if article_history is None:
     raise HTTPException(status_code=503, detail="Failed to create Article history.")
   return update_article.id

@article_router.get('/')
async def get_all_article(user: User = Depends(_get_current_user_from_access_token), session: AsyncSession = Depends(get_db)):
   articles = await _get_all_article(session=session)
   if articles is None:
     raise HTTPException(status_code=404, detail="Articles not found.")
   return {"data": articles}

@article_router.get('/history')
async def get_all_history_article(user: User = Depends(_get_current_user_from_access_token), session: AsyncSession = Depends(get_db)):
   article_history = await _get_all_history_article(session=session)
   if article_history is None:
     raise HTTPException(status_code=404, detail="Articles not found.")
   return {"data": article_history}