from rest_framework import serializers
from .models import Message, Conversation


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "content", "ai", "created_at"]
