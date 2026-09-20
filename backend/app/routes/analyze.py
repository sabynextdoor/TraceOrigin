from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..schemas import AnalyzeRequest, AnalyzeResponse
from ..database import get_db
from ..models import Analysis, User
from ..analyzer import RuleBasedAnalyzer
from ..extractor import InfoExtractor
from ..auth import get_current_active_user
import json

router = APIRouter()
analyzer = RuleBasedAnalyzer()
extractor = InfoExtractor()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_opportunity(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        # Validate input
        if not request.text or len(request.text.strip()) < 5:
            raise HTTPException(status_code=400, detail="Please provide sufficient text for analysis")
        
        text = request.text.strip()
        
        # Extract information
        extracted = extractor.extract(text)
        
        # Run analysis
        risk_score, indicators, verification = analyzer.analyze(text)
        risk_level = analyzer.get_risk_level(risk_score)
        recommendation = analyzer.get_recommendation(risk_score, risk_level)
        

        # Save to database with user_id
        analysis = Analysis(
            user_id=current_user.id,  # This should not be None
            input_text=text,
            company=extracted.get('company'),
            role=extracted.get('role'),
            location=extracted.get('location'),
            salary=extracted.get('salary'),
            source=extracted.get('source'),
            contact=extracted.get('contact'),
            website=extracted.get('website'),
            risk_score=risk_score,
            risk_level=risk_level,
            indicators=json.dumps(indicators),
            verification_data=json.dumps(verification),
            recommendation=recommendation
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return AnalyzeResponse(
            id=analysis.id,
            risk_score=risk_score,
            risk_level=risk_level,
            company=analysis.company,
            role=analysis.role,
            location=analysis.location,
            salary=analysis.salary,
            source=analysis.source,
            contact=analysis.contact,
            website=analysis.website,
            indicators=indicators,
            verification=verification,
            recommendation=recommendation,
            created_at=analysis.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")