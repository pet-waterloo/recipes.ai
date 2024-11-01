from django.shortcuts import render

from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone
from django.contrib.auth.hashers import check_password

from .serializers import MessageSerializer, UserSerializer
from .models import User

import uuid
import json


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


class LoginView(APIView):

    def post(self, request):
        rdata = request.data
        print(rdata)

        # check if a user with the given email + password exists
        email = rdata["email"]
        user = User.objects.filter(email=email)
        if not user.exists():
            resp = {"accepted": False, "reason": "User with email does not exist"}
            return Response(resp)

        user = user.first()
        if check_password(rdata["password"], user.password):
            resp = {
                "accepted": True,
                "user_hash": user.user_id,
                "reason": "User with email exists and password is correct",
            }
            return Response(resp)

        return Response(
            {
                "accepted": False,
                "reason": "User with email eixsts but password is incorrect",
            }
        )


class NewUserView(APIView):

    def post(self, request):
        rdata = request.data

        # check if a user exists with the email already
        email = rdata["email"]
        if User.objects.filter(email=email).exists():
            resp = {"accepted": False, "reason": "User with email already exists"}
            print("duplicate email")
            return Response(resp)
        print("no duplicate email")

        # create new user
        rdata["user_id"] = uuid.uuid4()
        rdata["created_at"] = timezone.now()
        serializer = UserSerializer(data=rdata)

        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            resp = {"accepted": True, "userdata": rdata}
            return Response(resp)

        # could not save the data
        resp = {"accepted": False, "reason": "Invalid Input Data", "data": rdata}
        return Response(resp)
