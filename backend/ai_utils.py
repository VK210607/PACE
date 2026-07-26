import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client=genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_vector(event_text: str) -> list[float]:
    response=client.models.embed_content(
        model="gemini-embedding-2",
        contents=event_text,
        config=types.EmbedContentConfig(
            output_dimensionality=768
        )
    )
    vector=response.embeddings[0].values
    return vector