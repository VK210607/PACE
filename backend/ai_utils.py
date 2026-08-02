import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import tables

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

def generate_answer(query:list,results:list,student_details:tables.User) -> str:
    context_list=[]
    for i in results:
        row_data={
            column.name: getattr(i, column.name) for column in i.__table__.columns
        }
        context_list.append(str(row_data))
    context_string="\n---\n".join(context_list)

    prompt = f"""You are a helpful college AI assistant.

    Database Context (Verified College Events):
    {context_string}

    Student Details:
    - Department: {student_details.dept}
    - Year: {student_details.year}

    Strict Instructions:
    1. Assess the student's question based on the conversation history and the student's current department and year and their intent and goal when the student asks for suggestion then give them suggestions such that they can achieve their goal.
    2. IF the question is about college events, schedules, or campus activities, you MUST use ONLY the Database Context to answer and also consider the current date and also the event date details If the context does not contain the answer, explicitly state that you do not have that information. Do not invent details.
    3. IF the question is general knowledge, ignore the Database Context and answer naturally.
    4. IF the student asks for suggestions, provide suggestions based on the Database Context and the student's department and year. If no relevant events are found, explicitly state that you do not have any suggestions at this time.
    """
    gemini_history=[]
    for i in query:
        role="model" if i.role=="assistant" else "user"
        gemini_history.append({"role": role, "parts": [{"text": i.content}]})

    response=client.models.generate_content(
        model="gemini-2.5-flash",
        contents=gemini_history,
        config=types.GenerateContentConfig(
            system_instruction=prompt,
            temperature=0.2,
            max_output_tokens=500
        )
    )
    return response.text