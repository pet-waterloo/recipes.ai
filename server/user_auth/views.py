from django.shortcuts import render

# import api_view
from rest_framework.decorators import api_view
from rest_framework.response import Response

# import redirect
from django.shortcuts import redirect
from django.http import JsonResponse

# import settings
from django.conf import settings
from django.utils import timezone


# finding user information
from conversation.models import User
from conversation.views import SessionManager
from conversation.serializers import UserSerializer

import requests
import uuid

# -------------------------------- #


@api_view(["GET"])
def get_google_callback(request):
    """Google OAuth2 callback endpoint"""

    # state = to identify valid requests (no hacking)
    # code = more secure OAuth2 flow
    code = request.GET.get("code")
    state = request.GET.get("state")

    if not code:
        # redirect back to login screen if failed
        return redirect(
            settings.FRONTEND_BASE_URL + "/login",
            status=302,
            reason="Failed to get code",
        )

    # Exchange the code for tokens
    token_url = settings.GOOGLE_TOKEN_URI
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": f"{settings.BACKEND_BASE_URL}/auth/google-callback/",
        "grant_type": "authorization_code",
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(token_url, data=token_data, headers=headers)

    if response.status_code == 200:
        tokens = response.json()
        # Save tokens securely (e.g., in the database or session)
        request.session["access_token"] = tokens["access_token"]

        # retrive user information
        user_info_url = settings.GOOGLE_USERINFO_API
        headers = {
            "Authorization": f"Bearer {tokens['access_token']}",
        }

        response = requests.get(user_info_url, headers=headers)

        # failed to request user information
        if response.status_code != 200:
            return redirect(
                settings.FRONTEND_BASE_URL + "/login",
                status=302,
                reason="Failed to get user information",
            )

        # retrieved user information
        data = response.json()
        email = data["email"]

        # find user in db
        resp = {}
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)

            # generate a new session id
            session_id = SessionManager.check_or_generate(user)

            # save session id in the session

            resp = {
                "accepted": True,
                "session_id": session_id.session_id,
                "user_hash": user.user_id,
                "reason": "User found in database",
            }

        else:
            # create a new user
            rdata = {
                "user_id": uuid.uuid4(),
                "created_at": timezone.now(),
                "email": email,
                "password": "some rnadom ass password that won't be used!",
                "social_login": True,
            }

            serializer = UserSerializer(data=rdata)

            if not serializer.is_valid():
                # send a response back saying it failed
                return redirect(
                    settings.FRONTEND_BASE_URL + "/login", status=302, reason="Error"
                )

            serializer.save()
            print(serializer.data)

            # create new user session information + log it
            user = User.objects.get(user_id=rdata["user_id"])
            ssid = SessionManager.check_or_generate(user)

            # return response with session_id, user_id, and expire date
            resp = {
                "accepted": True,
                "session_id": str(ssid.session_id),
                "user_hash": user.user_id,
                "reason": "User created successfully",
            }

            # return the right data - with the query string
        # ================================= #

        print(resp)
        resp["session_id"]
        query = "&".join([f"{key}={str(val)}" for key, val in resp.items()])
        print(query)
        url = f"{settings.FRONTEND_BASE_URL}/login?{query}"
        url = url.replace(" ", "%20")
        print(url)
        return redirect(url, status=302)

    else:
        print("Failed to get tokens")
        # return to login screen with error message?
        return redirect(
            settings.FRONTEND_BASE_URL + "/login",
            status=302,
            reason="Failed to get tokens",
        )

    return redirect(settings.FRONTEND_BASE_URL + "/login", status=302, reason="Error")
