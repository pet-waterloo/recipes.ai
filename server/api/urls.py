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
from django.urls import path

from .views import PingView
from .consumers import CohereConsumer

urlpatterns = [
    # api
    # path("ai/", RecipeListCreateView.as_view(), name="ai-prompt"),
    # pinging
    path("ping/", PingView.as_view(), name="ping"),
    # include the websocket url
    path("ws/ai/", CohereConsumer.as_asgi()),
]


# https://docs.djangoproject.com/en/5.1/topics/auth/default/#:~:text=If%20you%20have%20an%20authenticated,with%20a%20login()%20function.&text=To%20log%20a%20user%20in,session%2C%20using%20Django's%20session%20framework.
# login
