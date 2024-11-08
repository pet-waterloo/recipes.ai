from django.shortcuts import render

from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password

from .serializers import MessageSerializer, UserSerializer, SessionSerializer
from .models import User, Session

import uuid
import json


# -------------------------------- #
class SessionManager:

    @classmethod
    def check_or_generate(cls, user):

        # check if session already linked to a user
        user_id = user.user_id
        if Session.objects.filter(user_id=user_id).exists():
            # delete the session first
            session = Session.objects.get(user_id=user_id)
            session.delete()
        # create a new session + save it
        session = Session()
        session.user_id = user.user_id
        session.session_id = uuid.uuid4()
        session.expire_date = timezone.now() + timezone.timedelta(weeks=2)
        session.save()

        return session

    @classmethod
    def verify(cls, session_id):
        if not Session.objects.filter(session_id=session_id).exists():
            return None
        return Session.objects.get(session_id=session_id)


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

        # check if a user with the given email + password exists
        email = rdata["email"]
        user = User.objects.filter(email=email)
        if not user.exists():
            resp = {"accepted": False, "reason": "User with email does not exist"}
            return Response(resp)

        user = user.first()

        # check if the password is correct
        if check_password(rdata["password"], user.password):
            # create session info
            # cannot use "login" because we aren't using
            # built in django user object

            # since the user logged in validly, check_or_gen
            ssid = SessionManager.check_or_generate(user)

            # return response with session_id, user_id, and expire date
            # TODO - consider encrypting
            resp = {
                "accepted": True,
                "session_id": ssid.session_id,
                "user_hash": user.user_id,
                "expire_date": ssid.expire_date,
                "reason": "Successfully logged in",
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

            # create user session info (log them in)
            user = User.objects.get(user_id=rdata["user_id"])
            ssid = SessionManager.check_or_generate(user)

            # return response with session_id, user_id, and expire date
            resp = {
                "accepted": True,
                "session_id": ssid.session_id,
                "user_hash": user.user_id,
                "expire_date": ssid.expire_date,
                "reason": "User created successfully",
            }
            return Response(resp)

        # could not save the data
        resp = {"accepted": False, "reason": "Invalid Input Data", "data": rdata}
        return Response(resp)
