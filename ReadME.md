# College AI Assistant (RAG Architecture)

## Architecture Overview
This repository contains the functional MVP of a Retrieval-Augmented Generation (RAG) system designed to close the information gap for college students. It provides strictly verified data regarding campus events, schedules, and workshops. 

The architecture is built to eliminate general LLM hallucinations by isolating the generative model's context strictly to localized, vectorized database records.

## Core Tech Stack
*   **Frontend:** React (TypeScript), Tailwind CSS
*   **Backend:** FastAPI (Python), SQLAlchemy
*   **Database:** Supabase (PostgreSQL) with `pgvector` extension
*   **Generative AI:** Gemini API (Google GenAI SDK)
*   **Authentication:** Supabase Auth (JWT)

## System Mechanics
### 1. Vector Semantic Search
User queries are converted into 768-dimensional mathematical arrays via an embedding model. The backend queries the Supabase database using cosine distance (`<=>`) to retrieve the most contextually relevant event rows.

### 2. Stateless Conversational Memory
The application supports multi-turn dialogue without maintaining persistent backend sessions. The frontend maps and transmits the entire conversation history array in standard JSON format on every request, allowing the stateless Gemini model to interpret follow-up context dynamically.

### 3. JWT Security & Access Control
API endpoints are locked behind a dependency injection layer. The FastAPI backend intercepts incoming `Authorization` headers and mathematically verifies the Supabase JWT signatures against the server's environment secret, neutralizing unauthorized API consumption.

### 4. Dynamic Prompt Injection (Personalization)
Student metadata (e.g., department, year of study) is fetched upon token validation and injected directly into the LLM's `system_instruction`. This enforces strict role-based data filtering (e.g., hiding 4th-year events from 3rd-year students) without polluting the conversational history.

### 5. Event Ingestion Pipeline
Admin-secured POST routes allow for the ingestion of new college events. The backend automatically generates vector embeddings for incoming raw text and commits the new records to the pgvector database.

## Local Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   Active Supabase Project
*   Gemini API Key

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pyjwt sqlalchemy psycopg2-binary google-genai
   ```
3. Configure the `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
   SUPABASE_JWT_SECRET="your-jwt-secret"
   GEMINI_API_KEY="your-gemini-key"
   ```
4. Initialize the server:
   ```bash
   uvicorn fastapiserver:app --reload
   ```

### Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the development server:
   ```bash
   npm run dev
