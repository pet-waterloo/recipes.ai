from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework import status

from django.http import JsonResponse, HttpResponse, StreamingHttpResponse

import json
import time


class PingView(APIView):

    def get(self, request):
        print(request)

        resp = {"message": "pong", "status": status.HTTP_200_OK}
        return Response(resp)


class CountdownTimerView(View):

    async def generate_stream(self):
        print("starting")
        # first response is a "timer start"
        yield "data: " + json.dumps({"state": "timer-start"})
        # do the countdown
        for i in range(10, 0, -1):
            yield "data: " + json.dumps({"state": "timer-count", "count": i})
            print("send a data blob")
            time.sleep(1)
        # timer finished
        yield "data: " + json.dumps({"state": "timer-end"})

    def get(self, request, *args, **kwargs):
        response = StreamingHttpResponse(
            self.generate_stream(), content_type="text/event-stream"
        )
        response["Cache-Control"] = "no-cache"
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Methods"] = "GET"
        return response
