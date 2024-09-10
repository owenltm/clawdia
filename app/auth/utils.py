from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password hashing and verification
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def generate_token(data: dict = {}):
    data.update({
        "exp": datetime.now() + timedelta(minutes=30)
    })

    token_str = jwt.encode(data, "secret")
    return token_str

def decode_token(token: str):
    return jwt.decode(token)