from .pydantic_models.task_router_models import TaskRouterResponse
from .pydantic_models.llm_models.llm_models import LLMRequestModel
from .pocket_ai_modules.text_to_speech_module.Piper_TTS import tts
from .core.TaskRouter import TaskRouter
import json
from fastapi import FastAPI
from .core.llm import route_task

# data = {
#     "response": "Email is being generated, pls dont press any key sir",
#     "tasks": [
#         {
#             "id": 1,
#             "module": "desktop",
#             "action": "set_brightness",
#             "parameters": {"level": "10"},
#         }
#     ],
# }

app = FastAPI()


# Endpoint to generate the response from llm after receiving the prompt
# Run Qwen:=> .\backend\core\llama_cpp\llama-server.exe -m ".\backend\core\model\qwen2.5-1.5b-instruct-q4_k_m.gguf" -c 4096
@app.post('/prompt')
def generate_response(request: LLMRequestModel):
    error = ''
    count = 2

    while count > 0:
        try:
            data = route_task(request.prompt)
            data_json = json.dumps(data)

            data_json = TaskRouterResponse.model_validate_json(data_json)
            print(data_json)

            speaker = tts.TextToSpeechModule()
            speaker.tts(data_json.response)

            ai = TaskRouter()
            ai.execute(data_json.tasks)

            error = ''
            break
        except Exception as err:
            error += str(err)
            count -= 1
            if count == 0:
                speaker = tts.TextToSpeechModule()
                speaker.tts('Sorry I cannot help with that')
