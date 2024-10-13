from django.shortcuts import render

from rest_framework.decorators import APIView, api_view
from rest_framework.response import Response


import cohere
from cohere import CohereAI


# basic ping api endpoint
class PingView(APIView):
    def get(self, request):
        resp = {
            'message': 'pong',
            'status': 200
        }
        return Response(resp)

    def post(self, request, *args, **kwargs):
        resp = {
            'message': 'pong',
            'status': 200
        }

        print(request.data)
        return Response(resp)

class CohereAPI(APIView):

    # create instance of cohere AI


    def get(self, request, *args, **kwargs):
        pass

    def post(self, request):
        resp = {
            'message': 'pong',
            'status': 200
        }
        return Response(resp)


