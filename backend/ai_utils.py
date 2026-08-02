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

def generate_answer(query:str,results:list) -> str:
    context_list=[]
    for i in results:
        row_data={
            column.name: getattr(i, column.name) for column in i.__table__.columns
        }
        context_list.append(str(row_data))
    context_string="\n---\n".join(context_list)
    prompt = f"""You are a precise college assistant. Answer the student's question using ONLY the provided event context. If the answer is not in the context, explicitly state that you do not have that information. Do not invent details.

    Event Context:
    {context_string}

    Student Question: {query}"""
    response=client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            max_output_tokens=500
        )
    )
    return response.text