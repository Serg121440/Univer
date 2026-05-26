def calculate_unit_economics(
    price: float,
    cost: float,
    vat_rate: float,
    marketplace_commission: float,
    logistics_cost: float,
    storage_cost: float,
    marketing_cost: float,
    acquiring_rate: float = 0.015
):
    """
    Calculates Unit Economics for 2026 standards.
    Includes VAT (5% or 7%), acquiring, and marketplace specific costs.
    """
    vat_amount = price * vat_rate
    acquiring_cost = price * acquiring_rate
    commission_amount = price * marketplace_commission

    total_costs = cost + vat_amount + commission_amount + logistics_cost + storage_cost + marketing_cost + acquiring_cost
    profit = price - total_costs
    roi = (profit / cost) * 100 if cost > 0 else 0
    margin = (profit / price) * 100 if price > 0 else 0

    return {
        "price": price,
        "profit": round(profit, 2),
        "roi": round(roi, 2),
        "margin": round(margin, 2),
        "vat_amount": round(vat_amount, 2),
        "commission_amount": round(commission_amount, 2),
        "acquiring_cost": round(acquiring_cost, 2),
        "total_costs": round(total_costs, 2)
    }
