from fastapi import FastAPI
from tasks.router import router as taskRouter

app = FastAPI()

app.include_router(taskRouter)