from fastapi import APIRouter, File, UploadFile, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io

router = APIRouter()

# Load the trained AI model
MODEL_PATH = "models/CDM1_updated.h5"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Error loading model: {str(e)}")

def preprocess_image(image: Image.Image):
    """Preprocess image for model input"""
    image = image.convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

@router.post("/api/verify")
async def verify_currency(file: UploadFile = File(...)):
    """Verify if the currency is real or fake"""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        preprocessed_image = preprocess_image(image)

        prediction = model.predict(preprocessed_image)[0][0]
        is_real = bool(prediction >= 0.85)  # 🔥 Explicit conversion to Python bool

        return {
            "isReal": is_real,
            "confidence": float(prediction),  # Ensure float type
            "details": ["Security thread", "Watermark", "Microprinting"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
