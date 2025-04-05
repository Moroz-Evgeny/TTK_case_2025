from datetime import datetime
from enum import Enum
from sqlalchemy import Boolean, Integer
from sqlalchemy import Column
from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY, TIMESTAMP
from sqlalchemy.orm import declarative_base

import uuid

Base = declarative_base()


class TaskPriority(str, Enum):
   LOW = "Низкий"
   MEDIUM = "Средний"
   HIGH = "Высокий"

class TaskStatus(str, Enum):
   CURRENT = "Текущая"
   POSTPONED = "Отложенная"
   COMPLETED = "Выполненная"


class PortalRole(str, Enum):
    ROLE_PORTAL_USER = "ROLE_PORTAL_USER"
    ROLE_PORTAL_ADMIN = "ROLE_PORTAL_ADMIN"


class User(Base):
   __tablename__ = "users"
   
   id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
   login = Column(String, unique=True, nullable=False)
   first_name = Column(String, nullable=False)
   middle_name = Column(String, nullable=False)
   last_name = Column(String, nullable=False)
   hashed_password = Column(String, nullable=False)
   role = Column(String, default=PortalRole.ROLE_PORTAL_USER)
   is_active = Column(Boolean, default=True)


class Article(Base):
   __tablename__ = "articles"
   
   id_article = Column(Integer, primary_key=True, autoincrement=True, unique=True)  
   id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
   title = Column(String, nullable=False)
   content = Column(Text, nullable=False)
   image_url = Column(String, nullable=True)
   updated_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow(), onupdate=datetime.utcnow())
   author_id = Column(UUID(as_uuid=True), nullable=False)
   

class ArticleHistory(Base):
   __tablename__ = "article_history"
   
   id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
   article_id = Column(Integer, nullable=False)
   article_title = Column(String, nullable=False)
   user_login = Column(String, nullable=False)
   change_event = Column(String, nullable=False)
   timestamp = Column(TIMESTAMP(timezone=True), default=datetime.utcnow())
   

class Task(Base):
   __tablename__ = "tasks"

   id_task = Column(Integer, primary_key=True, autoincrement=True, unique=True)  
   id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
   title = Column(String, nullable=False)
   description = Column(Text, nullable=False)
   image_names = Column(ARRAY(String), nullable=True)
   created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow())
   due_date = Column(TIMESTAMP(timezone=True), nullable=True)
   priority = Column(String, default=TaskPriority.MEDIUM)
   status = Column(String, default=TaskStatus.CURRENT)
   assignee_id = Column(UUID(as_uuid=True), nullable=False)
   is_active = Column(Boolean, default=True)

class TaskHistory(Base):
   __tablename__ = "task_history"
   
   id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
   id_task = Column(Integer, nullable=False)
   task_title = Column(String, nullable=False)
   user_login = Column(String, nullable=False)
   change_event = Column(ARRAY(String), nullable=False)
   timestamp = Column(TIMESTAMP(timezone=True), default=datetime.utcnow())




    