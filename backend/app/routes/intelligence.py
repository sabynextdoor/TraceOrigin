from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Analysis
from ..auth import get_current_active_user
from ..models import User
import json
from collections import Counter

router = APIRouter(prefix="/intelligence", tags=["intelligence"])

@router.get("/scam-patterns")
async def get_scam_patterns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Analyze global scam patterns"""
    try:
        analyses = db.query(Analysis).all()
        
        patterns = {
            "payment": 0,
            "urgency": 0,
            "personal_email": 0,
            "whatsapp": 0,
            "no_interview": 0,
            "fake_selection": 0,
            "suspicious_url": 0
        }
        
        for analysis in analyses:
            if analysis.indicators:
                try:
                    indicators = json.loads(analysis.indicators)
                    for indicator in indicators:
                        title = indicator.get('title', '')
                        if 'Payment' in title:
                            patterns['payment'] += 1
                        elif 'Urgency' in title:
                            patterns['urgency'] += 1
                        elif 'Personal Email' in title:
                            patterns['personal_email'] += 1
                        elif 'WhatsApp' in title or 'Telegram' in title:
                            patterns['whatsapp'] += 1
                        elif 'No Interview' in title:
                            patterns['no_interview'] += 1
                        elif 'Fake Selection' in title or 'Guaranteed' in title:
                            patterns['fake_selection'] += 1
                        elif 'Suspicious URL' in title:
                            patterns['suspicious_url'] += 1
                except Exception:
                    pass
        
        return {
            "patterns": patterns,
            "total_analyses": len(analyses),
            "most_common": max(patterns, key=patterns.get) if patterns else "None",
            "trend": "increasing" if patterns.get('payment', 0) > 10 else "stable"
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to analyze scam patterns")

@router.get("/company-risk")
async def get_company_risk(
    company: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get risk analysis for a specific company"""
    try:
        analyses = db.query(Analysis).filter(
            Analysis.company.ilike(f"%{company}%")
        ).all()
        
        if not analyses:
            return {"company": company, "risk_score": 0, "analyses": 0, "status": "unknown"}
        
        avg_score = sum(a.risk_score for a in analyses) / len(analyses)
        risk_levels = {}
        for a in analyses:
            risk_levels[a.risk_level] = risk_levels.get(a.risk_level, 0) + 1
        
        return {
            "company": company,
            "analyses": len(analyses),
            "avg_risk_score": round(avg_score, 1),
            "risk_distribution": risk_levels,
            "status": "high_risk" if avg_score > 60 else "medium_risk" if avg_score > 30 else "low_risk"
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to analyze company risk")