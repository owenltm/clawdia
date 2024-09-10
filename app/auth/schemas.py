from pydantic import BaseModel
from schemas import BaseResponse

class RegisterRequest(BaseModel):
    username: str
    password: str

class RegisterResponse(BaseResponse):
    user: dict

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseResponse):
    user: dict
    access_token: str
