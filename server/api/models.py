from django.db import models


# Create your models here.

class User(models.Model):
    """
    User Model

    This will be used to store user information
    - name
    - email
    - password
    - created date
    """

    name = models.TextField() # encrypted
    email = models.EmailField() # encrypted
    password = models.TextField() # encrypted
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Text(models.Model):
    """
    A simple chat object

    This will be used to store chat information for a single text

    - text
    - files
    - created time
    - user
    - chat id

    """

    text: models.TextField()
    files: models.FileField(upload_to='uploads/', null=True, blank=True)
    created_at: models.DateTimeField(auto_now_add=True)
    user: models.ForeignKey(User, on_delete=models.CASCADE)
    chat_id: models.TextField()

    def __str__(self):
        return self.text


class ChatSequence(models.Model):
    """
    AI Chat Sequence

    This will be used to store chat information
    - name
    - created time
    - chat id

    and other misc. metadata.
    """

    name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    chat_id = models.TextField()

    def __str__(self):
        return self.name


