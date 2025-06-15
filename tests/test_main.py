from fastapi.testclient import TestClient
from main import app
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app


client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200

def test_get_users():
    response = client.get("/users")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_create_user():
    response = client.post(
        "/users",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "full_name": "Test User",
            "password": "password123"
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "user_id" in data
    assert data["message"] == "User created successfully"

def test_get_user_by_id():
    # Сначала создаём пользователя
    response = client.post(
        "/users",
        json={
            "username": "getuser",
            "email": "getuser@example.com",
            "full_name": "Get User",
            "password": "password123"
        },
    )
    assert response.status_code == 201
    user_id = response.json()["user_id"]

    # Теперь получаем его по ID
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "getuser"

def test_update_user():
    # Создаём пользователя
    response = client.post(
        "/users",
        json={
            "username": "updateuser",
            "email": "updateuser@example.com",
            "full_name": "Update User",
            "password": "password123"
        },
    )
    assert response.status_code == 201
    user_id = response.json()["user_id"]

    # Обновляем его
    response = client.put(
        f"/users/{user_id}",
        json={"full_name": "Updated Name"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "User updated successfully"


def test_delete_user():
    # Создаём пользователя
    response = client.post(
        "/users",
        json={
            "username": "deleteuser",
            "email": "deleteuser@example.com",
            "full_name": "Delete User",
            "password": "password123"
        },
    )
    assert response.status_code == 201
    user_id = response.json()["user_id"]

    # Удаляем его
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "User deleted successfully"
