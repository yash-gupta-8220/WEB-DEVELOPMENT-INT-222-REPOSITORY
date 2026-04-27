Overview
A web-based application where users can submit, view, and explore research or startup ideas. It promotes collaboration and innovation.
🚀 Features
Submit ideas (Title, Domain, Description)
View all ideas
Categorize ideas
API-based dynamic data handling
Backend Architecture
The backend follows a simple REST API structure:
Handles client requests from frontend
Processes and validates data
Sends appropriate responses
Manages idea storage (temporary or database-based)
📡 API Endpoints
1. ➕ Add Idea
Route: POST /add
Purpose: To submit a new idea
Request Body:
JSON
{
  "title": "Idea Title",
  "domain": "Web / AI / Startup",
  "description": "Idea description here"
}
Response:
200 OK → Idea added successfully
2. 📥 Get All Ideas
Route: GET /ideas
Purpose: Fetch all submitted ideas
Response:
JSON
[
  {
    "title": "Sample Idea",
    "domain": "AI",
    "description": "Example description"
  }
]
🔄 Data Flow
User fills the form on frontend
JavaScript sends a POST request to /add
Backend receives and stores the data
Frontend sends GET request to /ideas
Backend returns all stored ideas
