from fastapi import FastAPI
from tasks.router import router as taskRouter
from auth.router import router as authRouter

from database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(authRouter)
app.include_router(taskRouter)