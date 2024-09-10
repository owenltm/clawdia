from sqlalchemy.orm import Session

from auth.models import User
from auth.utils import hash_password, verify_password

def save_user(db: Session, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return  user

def validate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()

    return verify_password(password, user.password)

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()