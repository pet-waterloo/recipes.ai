from django.db import models
from datetime import datetime
import uuid


# Create your models here.
class Message(models.Model):
    content = models.CharField(max_length=2000)
    ai = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI: {self.ai} Created: {self.created_at} Content: {self.content}"


class Conversation(models.Model):
    message_ids = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    owner = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return f"Created By : {self.owner} Created At: {self.created_at} # of Messages: {len(self.message_ids)}"


# ---


class User(models.Model):
    user_id = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # make sure to link email eventually

    def __str__(self):
        return f"User ID: {self.user_id} Created: {self.created_at}"
