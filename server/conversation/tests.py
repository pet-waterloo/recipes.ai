import pytest
import uuid

from django.utils import timezone
from django.conf import settings

from rest_framework.test import APIClient

from .models import Conversation, Message, User

from urllib.parse import urlencode


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def create_user():
    # check if user exists
    EMAIL = "test@gmail.com"
    PASSWORD = "password"

    if User.objects.filter(email=EMAIL).exists():
        return User.objects.get(email=EMAIL)

    # create a new user
    user = User.objects.create(
        user_id=uuid.uuid4(),
        created_at=timezone.now(),
        email=EMAIL,
        password=PASSWORD,
        social_login=False,
    )

    return user


@pytest.fixture
def create_messages():
    # create a few messages
    return [
        Message.objects.create(content=f"Message {i}", ai=False) for i in range(0, 12)
    ]


@pytest.mark.django_db
def test_get_messages(client, create_user, create_messages):
    # TODO - api key generation
    # TODO - session id generation for non-real users
    print(client)

    # create a few messages
    messages = create_messages

    # simply check if we can grab messages from api
    query_params = {"message_ids": " ".join([str(message.id) for message in messages])}
    url = f"/conversation/messages/?{urlencode(query_params)}"
    print(url)
    response = client.get(url)
    print(response)

    assert response.status_code == 200

    # check if data is correct
    data = response.data["messages"]
    for i in range(len(messages)):
        print(data[i + 1])
        assert data[i + 1]["content"] == f"Message {i}"
        assert data[i + 1]["ai"] == False
        assert data[i + 1]["created_at"] == messages[i].created_at
