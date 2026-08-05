from .pydantic_models.task_router_models import TaskRouterResponse
from .TaskRouter import TaskRouter
import json

# from fastapi import FastAPI
# app = FastAPI()

data = {
  "response": "Summarizing the uploaded PDF.",
  "tasks": [
    {
      "id": 1,
      "module": "browser",
      "action": "summarize_website",
      "parameters": {
        "url": "https://wikipedia.org"
      } 
    }
  ]
}
data = json.dumps(data)
try:
  response = TaskRouterResponse.model_validate_json(data)
  ai = TaskRouter()
  ai.execute(response.tasks)

except Exception as err:
  print(err)