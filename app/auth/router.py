from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from sqlalchemy.orm import Session
import jwt
from datetime import datetime, timedelta
from typing import Annotated

from database import engine, get_db

from auth.schemas import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from auth.utils import hash_password, verify_password, generate_token, decode_token
from auth.models import User
from auth.repositories import save_user, validate_user, get_user_by_username

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

@router.post("/register")
async def register(user: RegisterRequest, db: Session = Depends(get_db)):
    new_user = User(username=user.username, password=hash_password(user.password))

    registered_user = save_user(db=db, user=new_user)

    return RegisterResponse(
        status=200,
        message="new user created successfully",
        user=registered_user.to_dict()
    )

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    authenticated_user = get_user_by_username(db=db, username=request.username)

    if not authenticated_user or not verify_password(request.password, authenticated_user.password):
        raise HTTPException(status_code=400, detail="Incorrect username / password")
    
    token_str = generate_token(authenticated_user.token_dict())

    return LoginResponse(
        status=200,
        message="Logged in successfully",
        user=authenticated_user.to_dict(),
        access_token=token_str
    )

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = decode_token(token=token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.get("/profile")
async def get_user_profile(current_user: Annotated[User, Depends(get_current_user)]):
    return {"user": current_user}

@router.post("/token")
async def token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = get_user_by_username(db=db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username / password")
    
    token_str = generate_token(user.token_dict())

    return {"access_token": token_str, "token_type": "bearer"}