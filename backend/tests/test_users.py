import uuid

from fastapi.testclient import TestClient

from app.core.database import SessionLocal
from app.core.security import create_access_token, get_password_hash
from app.main import app
from app.models.entities import User

client = TestClient(app)


def _unique_email() -> str:
    return f"user-{uuid.uuid4().hex[:12]}@example.com"


def _make_user(role: str = "student") -> tuple[int, str]:
    """Create a user straight in the database and mint its token.

    Going through /auth/register and /auth/login would trip the rate limiter
    (10 and 5 per minute), and those routes are already covered by test_auth.
    """
    db = SessionLocal()
    try:
        user = User(
            name="Test",
            email=_unique_email(),
            password_hash=get_password_hash("pass12345"),
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user.id, create_access_token(subject=str(user.id))
    finally:
        db.close()


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_users_me_returns_the_caller():
    user_id, token = _make_user()

    response = client.get("/users/me", headers=_auth(token))

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["id"] == user_id
    assert body["role"] == "student"


def test_listing_users_requires_authentication():
    assert client.get("/users").status_code == 401


def test_student_cannot_list_users():
    _, token = _make_user()

    assert client.get("/users", headers=_auth(token)).status_code == 403


def test_teacher_cannot_list_users():
    _, token = _make_user(role="teacher")

    assert client.get("/users", headers=_auth(token)).status_code == 403


def test_admin_lists_users():
    admin_id, token = _make_user(role="admin")

    response = client.get("/users", headers=_auth(token))

    assert response.status_code == 200, response.text
    assert admin_id in [user["id"] for user in response.json()]


def test_admin_changes_another_users_role():
    _, admin_token = _make_user(role="admin")
    student_id, student_token = _make_user()

    response = client.patch(
        f"/users/{student_id}/role",
        json={"role": "teacher"},
        headers=_auth(admin_token),
    )

    assert response.status_code == 200, response.text
    assert response.json()["role"] == "teacher"
    # The promotion is real: the user may now create modules.
    assert client.get("/users/me", headers=_auth(student_token)).json()["role"] == "teacher"


def test_student_cannot_promote_anyone():
    _, token = _make_user()
    victim_id, _victim_token = _make_user()

    response = client.patch(
        f"/users/{victim_id}/role", json={"role": "admin"}, headers=_auth(token)
    )

    assert response.status_code == 403


def test_admin_cannot_change_own_role():
    admin_id, token = _make_user(role="admin")

    response = client.patch(
        f"/users/{admin_id}/role", json={"role": "student"}, headers=_auth(token)
    )

    assert response.status_code == 400
    assert client.get("/users/me", headers=_auth(token)).json()["role"] == "admin"


def test_role_change_on_unknown_user_is_404():
    _, token = _make_user(role="admin")

    response = client.patch(
        "/users/999999/role", json={"role": "teacher"}, headers=_auth(token)
    )

    assert response.status_code == 404


def test_unknown_role_is_rejected():
    _, admin_token = _make_user(role="admin")
    victim_id, _ = _make_user()

    response = client.patch(
        f"/users/{victim_id}/role", json={"role": "superuser"}, headers=_auth(admin_token)
    )

    assert response.status_code == 422
