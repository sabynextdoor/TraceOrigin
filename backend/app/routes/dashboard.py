from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models import Analysis, User
from ..auth import get_current_active_user
from ..schemas import DashboardStats, DashboardTrend
from datetime import datetime, timedelta
import json

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get comprehensive dashboard statistics"""
    try:
        total = db.query(Analysis).filter(Analysis.user_id == current_user.id).count()
        
        if total == 0:
            return {
                "total": 0,
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0,
                "avg_score": 0,
                "risk_distribution": [],
                "trends": [],
                "common_signals": [],
                "recent": []
            }
        
        critical = db.query(Analysis).filter(
            Analysis.user_id == current_user.id,
            Analysis.risk_level == "CRITICAL"
        ).count()
        
        high = db.query(Analysis).filter(
            Analysis.user_id == current_user.id,
            Analysis.risk_level == "HIGH"
        ).count()
        
        medium = db.query(Analysis).filter(
            Analysis.user_id == current_user.id,
            Analysis.risk_level == "MEDIUM"
        ).count()
        
        low = db.query(Analysis).filter(
            Analysis.user_id == current_user.id,
            Analysis.risk_level == "LOW"
        ).count()
        
        avg_score = db.query(func.avg(Analysis.risk_score)).filter(
            Analysis.user_id == current_user.id
        ).scalar() or 0
        
        risk_distribution = [
            {"name": "Critical", "value": critical, "color": "#ef4444"},
            {"name": "High", "value": high, "color": "#f59e0b"},
            {"name": "Medium", "value": medium, "color": "#fbbf24"},
            {"name": "Low", "value": low, "color": "#10b981"}
        ]
        
        trends = []
        for i in range(6, -1, -1):
            date = datetime.now() - timedelta(days=i)
            start = datetime(date.year, date.month, date.day)
            end = start + timedelta(days=1)
            
            count = db.query(Analysis).filter(
                Analysis.user_id == current_user.id,
                Analysis.created_at >= start,
                Analysis.created_at < end
            ).count()
            
            avg = db.query(func.avg(Analysis.risk_score)).filter(
                Analysis.user_id == current_user.id,
                Analysis.created_at >= start,
                Analysis.created_at < end
            ).scalar() or 0
            
            trends.append({
                "date": date.strftime("%a"),
                "count": count,
                "avg_score": round(avg, 1)
            })
        
        signal_counts = {}
        analyses = db.query(Analysis).filter(
            Analysis.user_id == current_user.id
        ).limit(100).all()
        
        for analysis in analyses:
            if analysis.indicators:
                try:
                    indicators = json.loads(analysis.indicators)
                    for indicator in indicators:
                        title = indicator.get('title', 'Unknown')
                        signal_counts[title] = signal_counts.get(title, 0) + 1
                except Exception:
                    pass
        
        common_signals = sorted(
            [{"name": k, "count": v} for k, v in signal_counts.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:5]
        
        recent = db.query(Analysis).filter(
            Analysis.user_id == current_user.id
        ).order_by(desc(Analysis.created_at)).limit(5).all()
        
        recent_data = [
            {
                "id": a.id,
                "company": a.company or "Unknown",
                "role": a.role or "No role",
                "risk_score": a.risk_score,
                "risk_level": a.risk_level,
                "created_at": a.created_at.isoformat()
            }
            for a in recent
        ]
        
        return {
            "total": total,
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "avg_score": round(avg_score, 1),
            "risk_distribution": risk_distribution,
            "trends": trends,
            "common_signals": common_signals,
            "recent": recent_data,
            "safe_count": low,
            "risk_count": total - low
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load dashboard statistics")

@router.get("/intelligence")
async def get_intelligence_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get scam intelligence data"""
    try:
        total_global = db.query(Analysis).count()
        
        scam_types = {}
        analyses = db.query(Analysis).all()
        for analysis in analyses:
            if analysis.indicators:
                try:
                    indicators = json.loads(analysis.indicators)
                    for indicator in indicators:
                        if indicator.get('severity') in ['CRITICAL', 'HIGH']:
                            title = indicator.get('title', 'Unknown')
                            scam_types[title] = scam_types.get(title, 0) + 1
                except Exception:
                    pass
        
        top_scams = sorted(
            [{"name": k, "count": v} for k, v in scam_types.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:10]
        
        return {
            "total_analyses": total_global,
            "unique_users": db.query(User).filter(User.is_active == True).count(),
            "top_scams": top_scams,
            "detection_rate": round((total_global - db.query(Analysis).filter(Analysis.risk_level == "LOW").count()) / max(total_global, 1) * 100, 1)
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load intelligence data")