import os
from google import generativeai as genai

client=genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.generate_text(
    model="gemini-2.5-flash",
    content="Return ONLY a valid JSON array of objects with keys: title, date, description. Do not use markdown blocks like ```json.```"
)