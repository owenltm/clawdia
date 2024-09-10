from sqlalchemy import Column, Integer, String
from database import Base

# Simple in-memory user storage for demonstration purposes
fake_users_db = {}

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
        }
    
    def token_dict(self):
        return {
            "sub": self.username
        }