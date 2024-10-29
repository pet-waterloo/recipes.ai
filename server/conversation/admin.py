from django.contrib import admin

from .models import Message, Conversation, User

# Register your models here.
admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(User)
