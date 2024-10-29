from django.shortcuts import render


from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status


from .serializers import MessageSerializer


# Create your views here.
class MessageCreateView(APIView):
    def post(self, request):
        serializer = MessageSerializer(data=request.data)

        print(request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # could not save the data
        return Response(status=status.HTTP_400_BAD_REQUEST)
