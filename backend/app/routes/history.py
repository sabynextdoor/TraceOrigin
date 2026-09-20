from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from ..database import get_db
from ..models import Analysis
from ..schemas import HistoryResponse, HistoryItem
from ..auth import get_current_active_user
from ..models import User
import json

router = APIRouter()

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    risk_filter: str = Query(None),
    search: str = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(Analysis).filter(Analysis.user_id == current_user.id)
    
    if risk_filter:
        query = query.filter(Analysis.risk_level == risk_filter.upper())
    
    if search:
        query = query.filter(
            (Analysis.company.ilike(f"%{search}%")) |
            (Analysis.role.ilike(f"%{search}%")) |
            (Analysis.input_text.ilike(f"%{search}%"))
        )
    
    total = query.count()
    items = query.order_by(desc(Analysis.created_at)).offset(skip).limit(limit).all()
    
    history_items = [
        HistoryItem(
            id=item.id,
            company=item.company,
            role=item.role,
            risk_score=item.risk_score,
            risk_level=item.risk_level,
            created_at=item.created_at
        )
        for item in items
    ]
    
    return HistoryResponse(items=history_items, total=total)

@router.get("/history/{analysis_id}")
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    try:
        return {
            "id": analysis.id,
            "risk_score": analysis.risk_score,
            "risk_level": analysis.risk_level,
            "company": analysis.company,
            "role": analysis.role,
            "location": analysis.location,
            "salary": analysis.salary,
            "source": analysis.source,
            "contact": analysis.contact,
            "website": analysis.website,
            "indicators": json.loads(analysis.indicators) if analysis.indicators else [],
            "verification": json.loads(analysis.verification_data) if analysis.verification_data else [],
            "recommendation": analysis.recommendation,
            "created_at": analysis.created_at,
            "input_text": analysis.input_text
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve analysis")

@router.delete("/history/{analysis_id}")
async def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    try:
        db.delete(analysis)
        db.commit()
        return {"message": "Analysis deleted successfully"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete analysis")