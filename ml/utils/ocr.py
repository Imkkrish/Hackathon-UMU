"""
OCR utilities for extracting text from images
"""
import os
import io
from typing import Tuple
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract

# Configure Tesseract path for different OS
if os.name == "nt":  # Windows
    tesseract_path = os.getenv("TESSERACT_PATH", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
elif os.name == "posix":  # Linux/Mac
    # Tesseract should be in PATH or at common locations
    common_paths = [
        "/usr/bin/tesseract",
        "/usr/local/bin/tesseract",
        "/opt/homebrew/bin/tesseract"
    ]
    for path in common_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break


def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Preprocess image for better OCR results
    
    Args:
        image: PIL Image object
        
    Returns:
        Preprocessed PIL Image
    """
    # Convert to grayscale
    image = image.convert('L')
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)
    
    # Increase sharpness
    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(1.5)
    
    # Apply slight blur to reduce noise
    image = image.filter(ImageFilter.MedianFilter(size=3))
    
    # Resize if too small (OCR works better on larger images)
    width, height = image.size
    if width < 1000 or height < 1000:
        scale_factor = max(1000 / width, 1000 / height)
        new_size = (int(width * scale_factor), int(height * scale_factor))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
    
    return image


def extract_text_from_image(image_bytes: bytes) -> Tuple[str, float]:
    """
    Extract text from image using OCR
    
    Args:
        image_bytes: Image file bytes
        
    Returns:
        Tuple of (extracted_text, confidence_score)
    """
    try:
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Perform OCR with detailed output
        ocr_data = pytesseract.image_to_data(
            processed_image,
            lang='eng',
            output_type=pytesseract.Output.DICT
        )
        
        # Extract text and calculate confidence
        text_parts = []
        confidences = []
        
        for i, conf in enumerate(ocr_data['conf']):
            if int(conf) > 0:  # Valid confidence
                text = ocr_data['text'][i].strip()
                if text:
                    text_parts.append(text)
                    confidences.append(int(conf))
        
        # Combine text
        extracted_text = ' '.join(text_parts)
        
        # Calculate average confidence
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        normalized_confidence = avg_confidence / 100.0  # Convert to 0-1 scale
        
        return extracted_text, normalized_confidence
    
    except Exception as e:
        print(f"OCR extraction error: {e}")
        # Fallback to simple OCR
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image, lang='eng')
            return text.strip(), 0.5  # Default confidence
        except Exception as fallback_error:
            print(f"Fallback OCR also failed: {fallback_error}")
            raise Exception(f"OCR failed: {str(e)}")


def extract_text_simple(image_bytes: bytes) -> str:
    """
    Simple text extraction without preprocessing
    
    Args:
        image_bytes: Image file bytes
        
    Returns:
        Extracted text string
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image, lang='eng')
        return text.strip()
    except Exception as e:
        raise Exception(f"Simple OCR failed: {str(e)}")


def is_tesseract_available() -> bool:
    """
    Check if Tesseract OCR is available
    
    Returns:
        True if Tesseract is available, False otherwise
    """
    try:
        pytesseract.get_tesseract_version()
        return True
    except:
        return False
