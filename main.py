import httpx
import json


# ping the server and handle outputting of text

URL = "http://localhost:8000/api/ai/"


async def ping_server():
    async with httpx.AsyncClient() as client:
        response = await client.get(URL)
        print(response.text)

    async for chunk in response.aiter_text():
        print(chunk)


if __name__ == "__main__":
    import asyncio

    asyncio.run(ping_server())
