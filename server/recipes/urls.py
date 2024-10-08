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

from .views import RecipeListCreateView, RecipeDetailView

urlpatterns = [
    # api
    path("recipes/", RecipeListCreateView.as_view(), name="recipe-list"),
    path("recipes/<int:pk>/", RecipeDetailView.as_view(), name="recipe-detail"),
    # dashboard views
    # path("dashboard/", Dashboard.as_view(), name="recipe-dashboard"),
]


# https://docs.djangoproject.com/en/5.1/topics/auth/default/#:~:text=If%20you%20have%20an%20authenticated,with%20a%20login()%20function.&text=To%20log%20a%20user%20in,session%2C%20using%20Django's%20session%20framework.
# login
