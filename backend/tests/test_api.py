import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200

def test_calculator():
    payload = {
        "price": 1000,
        "cost": 500,
        "vat_rate": 0.07,
        "marketplace_commission": 0.1,
        "logistics_cost": 50,
        "storage_cost": 10,
        "marketing_cost": 100
    }
    response = client.post("/tools/calculator", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "profit" in data
    # 1000 - 500(cost) - 70(vat 7%) - 100(comm 10%) - 50(log) - 10(storage) - 100(market) - 15(acq 1.5%) = 155.
    assert data["profit"] == 155.0

def test_seo_check():
    response = client.post("/tools/seo-check", json={"text": "Обучение менеджеров маркетплейсов"})
    assert response.status_code == 200
    assert "score" in response.json()
