from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime


class DashboardStats(BaseModel):
    total: int
    critical: int
    high: int
    medium: int
    low: int
    avg_score: float
    risk_distribution: List[Dict[str, Any]]
    trends: List[Dict[str, Any]]
    common_signals: List[Dict[str, Any]]
    recent: List[Dict[str, Any]]
    safe_count: int
    risk_count: int


class DashboardTrend(BaseModel):
    date: str
    count: int
    avg_score: float

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    
    @validator('username')
    def validate_username(cls, v):
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Analysis Schemas
class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)

class AnalyzeResponse(BaseModel):
    id: int
    risk_score: int
    risk_level: str
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    source: Optional[str] = None
    contact: Optional[str] = None
    website: Optional[str] = None
    indicators: List[Dict[str, Any]]
    verification: List[Dict[str, Any]]
    recommendation: str
    created_at: datetime

class HistoryItem(BaseModel):
    id: int
    company: Optional[str]
    role: Optional[str]
    risk_score: int
    risk_level: str
    created_at: datetime

class HistoryResponse(BaseModel):
    items: List[HistoryItem]
    total: int