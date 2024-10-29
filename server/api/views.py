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
