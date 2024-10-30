from rest_framework import serializers
from .models import Message, Conversation, User, UserData


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
