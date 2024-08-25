from fastapi import APIRouter

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

@router.get("/")
async def read_tasks():
    return "read_tasks"
