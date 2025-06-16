from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List
import shutil
import os

router = APIRouter()
UPLOAD_DIR = "dataset/"  # Ensure this folder exists in `backend/`

@router.post("/api/dataset/upload")
async def upload_dataset(files: List[UploadFile] = File(...)):
    uploaded_files = []
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        for file in files:
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            uploaded_files.append(file.filename)

        return {"message": "Dataset uploaded successfully", "uploadedFiles": len(uploaded_files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
