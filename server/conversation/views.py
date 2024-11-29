from django.shortcuts import render

from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password

from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings


from .serializers import (
    MessageSerializer,
    UserSerializer,
    SessionSerializer,
)
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
        session = Session.objects.get(session_id=session_id)
        if session.expire_date < timezone.now():
            session.delete()
            return None
        return session


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


class SessionVerifyView(APIView):
    """/user/verify/"""

    def get(self, request):
        """Create new session id"""
        pass

    def post(self, request):
        """Verify if a session id is valid"""
        rdata = request.data
        session_id = rdata["session_id"]

        # check if session_id is still valid
        if SessionManager.verify(session_id):
            return Response({"accepted": True, "reason": "Session is valid"})
        return Response({"accepted": False, "reason": "Session is invalid"})


class LoginView(APIView):
    """user/login/"""

    def post(self, request):
        rdata = request.data

        # check if a user with the given email + password exists
        email = rdata["email"]
        user = User.objects.filter(email=email)
        if not user.exists():
            resp = {"accepted": False, "reason": "User with email does not exist"}
            return Response(resp)

        user = user.first()

        # check if is user google oauth login!
        if user.social_login:
            # TODO - find a way to create a notification system with react!
            # that soudns pretty simple right?
            # also this code base is pretty messy ngl
            #           but first project vibes hit really hard
            return Response(
                {
                    "accepted": False,
                    "reason": "User with email is a google oauth user",
                }
            )

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
        rdata["social_login"] = False
        serializer = UserSerializer(data=rdata)

        if serializer.is_valid():
            serializer.save()
            print("DATA: ", serializer.data)

            # create user session info (log them in)
            user = User.objects.get(user_id=rdata["user_id"])
            ssid = SessionManager.check_or_generate(user)

            # return response with session_id, user_id, and expire date
            resp = {
                "accepted": True,
                "session_id": str(ssid.session_id),
                "user_hash": user.user_id,
                "expire_date": ssid.expire_date,
                "reason": "User created successfully",
            }
            print(resp)
            return Response(resp)

        # could not save the data
        resp = {"accepted": False, "reason": "Invalid Input Data", "data": rdata}
        return Response(resp)
