import uuid

from fastapi.testclient import TestClient

from app.core.security import get_password_hash, verify_password
from app.main import app

client = TestClient(app)


def _unique_email() -> str:
    return f"user-{uuid.uuid4().hex[:12]}@example.com"


def test_password_hash_round_trip():
    hashed = get_password_hash("correct horse battery")
    assert hashed != "correct horse battery"
    assert verify_password("correct horse battery", hashed)
    assert not verify_password("wrong password", hashed)


def test_verify_password_rejects_malformed_hash():
    assert not verify_password("anything", "not-a-bcrypt-hash")


def test_password_longer_than_bcrypt_limit_is_accepted():
    # bcrypt only consumes the first 72 bytes; hashing must not raise.
    hashed = get_password_hash("a" * 72)
    assert verify_password("a" * 72, hashed)


def test_register_then_login_returns_token():
    email = _unique_email()
    payload = {"name": "Test User", "email": email, "password": "pass12345"}

    register = client.post("/auth/register", json=payload)
    assert register.status_code == 200, register.text

    login = client.post("/auth/login", json={"email": email, "password": "pass12345"})
    assert login.status_code == 200, login.text
    body = login.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"


def test_login_with_wrong_password_is_rejected():
    email = _unique_email()
    client.post("/auth/register", json={"name": "Test", "email": email, "password": "pass12345"})

    login = client.post("/auth/login", json={"email": email, "password": "wrong-password"})
    assert login.status_code == 401


def test_duplicate_email_is_rejected():
    email = _unique_email()
    payload = {"name": "Test", "email": email, "password": "pass12345"}

    assert client.post("/auth/register", json=payload).status_code == 200
    assert client.post("/auth/register", json=payload).status_code == 400


def test_short_password_is_rejected():
    response = client.post(
        "/auth/register",
        json={"name": "Test", "email": _unique_email(), "password": "short"},
    )
    assert response.status_code == 422


def test_self_registration_cannot_claim_elevated_role():
    email = _unique_email()
    client.post(
        "/auth/register",
        json={"name": "Evil", "email": email, "password": "pass12345", "role": "admin"},
    )

    login = client.post("/auth/login", json={"email": email, "password": "pass12345"})
    assert login.json()["role"] == "student"


def test_protected_route_requires_authentication():
    assert client.post("/courses", json={"title": "X", "description": "y"}).status_code == 401


def test_student_cannot_create_course():
    email = _unique_email()
    client.post("/auth/register", json={"name": "Student", "email": email, "password": "pass12345"})
    token = client.post(
        "/auth/login", json={"email": email, "password": "pass12345"}
    ).json()["access_token"]

    response = client.post(
        "/courses",
        json={"title": "X", "description": "y"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
