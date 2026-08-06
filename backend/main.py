from .pydantic_models.task_router_models import TaskRouterResponse
from .pocket_ai_modules.text_to_speech_module.Piper_TTS import tts
from .TaskRouter import TaskRouter
import json

# from fastapi import FastAPI
# app = FastAPI()

data = {
    "response": "Opening Github and searching for Smit-10",
    "tasks": [
        {
            "id": 1,
            "module": "browser",
            "action": "search",
            "parameters": {"website_name": "github",
                           "query": "Smit-10"},
        }
    ],
}
data = json.dumps(data)
try:
    response = TaskRouterResponse.model_validate_json(data)
    tts = tts.TextToSpeechModule()
    tts.tts(response.response)
    ai = TaskRouter()
    ai.execute(response.tasks)

except Exception as err:
    print(err)
