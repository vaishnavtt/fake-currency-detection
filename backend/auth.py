from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/api/auth/login")
async def login(request: LoginRequest):
    logging.debug(f"Received login request: {request.username}, {request.password}")

    if request.username == "admin" and request.password == "admin123":
        logging.debug("Admin login successful")
        return {
            "user": {"username": "admin", "isAdmin": True},
            "token": "fake-jwt-token"
        }
    elif request.username == "user" and request.password == "user123":
        logging.debug("User login successful")
        return {
            "user": {"username": "user", "isAdmin": False},
            "token": "fake-jwt-token"
        }
    else:
        logging.debug("Login failed: Invalid credentials")
        raise HTTPException(status_code=401, detail="Invalid credentials")
