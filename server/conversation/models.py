from django.db import models
from datetime import datetime

from django.contrib.auth.hashers import make_password

import uuid

# -------------------------------- #


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


# -------------------------------- #


class User(models.Model):
    user_id = models.CharField(max_length=64, unique=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=False)
    email = models.EmailField(max_length=64, unique=True, blank=False)
    password = models.CharField(max_length=88, blank=False)

    def save(self, *args, **kwargs):
        if not self.pk or "password" in self.get_dirty_fields():
            self.password = make_password(self.password)
            print(self.password)
        super().save(*args, **kwargs)

    # make sure to link email eventually

    def __str__(self):
        return f"User ID: {self.user_id} Created: {self.created_at}"


class UserData(models.Model):
    user_id = models.CharField(max_length=64, unique=True)

    conversations = models.JSONField(default=list)
    stats = models.JSONField(default=dict)

    def __str__(self):
        return f"User ID: {self.user_id} Conversations: {len(self.conversations)} Stats: {self.stats}"
