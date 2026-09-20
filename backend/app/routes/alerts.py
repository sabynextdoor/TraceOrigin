from fastapi import APIRouter, HTTPException
from ..scam_alerts import ScamAlertSystem

router = APIRouter(tags=["alerts"])
alert_system = ScamAlertSystem()

@router.get("/alerts")
async def get_alerts(limit: int = 10):
    try:
        return alert_system.get_alerts(limit)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve alerts")

@router.get("/alerts/search/{query}")
async def search_alerts(query: str):
    try:
        return alert_system.search_alerts(query)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to search alerts")