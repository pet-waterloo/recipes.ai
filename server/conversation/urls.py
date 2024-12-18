"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

from .views import LoginView, NewUserView, SessionVerifyView
from .views import MessageCreateView


urlpatterns = [
    path("conversation/messages/", MessageCreateView.as_view(), name="message-create"),
    # main routes
    path("user/login/", LoginView.as_view()),
    path("user/register/", NewUserView.as_view()),
    path("user/verify/", SessionVerifyView.as_view()),
]
