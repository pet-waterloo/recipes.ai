from rest_framework.views import APIView
from rest_framework.response import Response


# basic ping api endpoint
class PingView(APIView):
    def get(self, request):
        resp = {"message": "pong", "status": 200}
        return Response(resp)

    def post(self, request, *args, **kwargs):
        resp = {"message": "pong", "status": 200}

        print(request.data)
        return Response(resp)
