from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.middleware.cors import CORSMiddleware

from api.handlers.user import user_router
from api.handlers.login import login_router 
from api.handlers.task import task_router
from api.handlers.static import static_router
from api.handlers.article import article_router

import uvicorn

app = FastAPI(title='TTK_case')

main_api_router = APIRouter()

main_api_router.include_router(user_router, prefix="/user", tags=['user'])
main_api_router.include_router(login_router, prefix="/login", tags=['login'])
main_api_router.include_router(task_router, prefix="/task", tags=['task'])
main_api_router.include_router(static_router, prefix="/static", tags=["static"])
main_api_router.include_router(article_router, prefix="/article", tags=['article'])

app.include_router(main_api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://0.0.0.0:3000", "http://45.94.123.62:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

if __name__ == "__main__":
  uvicorn.run("main:app", host="localhost", port=8000, reload=True, access_log=True)