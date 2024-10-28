import json
import cohere
from channels.generic.websocket import AsyncWebsocketConsumer


class CohereConsumer(AsyncWebsocketConsumer):
    CLIENT_KEY = json.load(open("../.secrets"))["COHERE_API_SECRET"]
    COHERE_API = cohere.AsyncClientV2(CLIENT_KEY)

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):

        print("Received message: ", text_data)

        return

        async def fetch_cohere_streaming_request():
            response = COHERE_API.chat_stream(
                model="command-r",
                messages=[
                    {
                        "role": "user",
                        "content": "How to make a pizza?",
                    }
                ],
            )

            async for chunk in response:
                if chunk:
                    await self.send(text_data=json.dumps({"message": chunk}))

        await fetch_cohere_streaming_request()
