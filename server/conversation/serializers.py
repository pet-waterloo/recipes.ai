from rest_framework import serializers
from .models import Message, Conversation, User, UserData, Session


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "content", "ai", "created_at"]


class UserSerializer(serializers.ModelSerializer):

    user_id = serializers.UUIDField(format="hex", required=True)
    created_at = serializers.DateTimeField(required=True)

    class Meta:
        model = User
        fields = ["id", "user_id", "created_at", "email", "password"]


class SessionSerializer(serializers.ModelSerializer):

    session_id = serializers.UUIDField(format="hex", required=True)
    user_id = serializers.UUIDField(format="hex", required=True)
    expire_date = serializers.DateTimeField(required=True)

    class Meta:
        model = Session
        fields = ["id", "session_id", "user_id", "expire_date"]
