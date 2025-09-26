import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_snippets():
    response = client.get("/api/snippets")
    assert response.status_code == 200
    assert "snippets" in response.json()
    assert len(response.json()["snippets"]) > 0

def test_practices():
    response = client.get("/api/practices")
    assert response.status_code == 200
    assert "practices" in response.json()