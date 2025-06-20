from typing import List, Optional, Union

from fastapi import APIRouter, Depends,HTTPException, UploadFile, File, Form

from api.utils.jwt import _get_current_user_from_access_token
from api.utils.ai import _text_generation

from api.schemas import GenerateArticle

from db.models import User


ai_router = APIRouter()

@ai_router.post('/article', response_model=Union[str, None])
def take_text_for_the_article(body: GenerateArticle, 
# user: User = Depends(_get_current_user_from_access_token)
) -> Union[str, None]:
    response = _text_generation(title=body.title, content=body.content)
    if response is not None:
        return response.content