from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import analyze, history, health, auth, dashboard, intelligence, alerts
from .database import engine, Base


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI app
app = FastAPI(
    title="ScamCheck API",
    description="Student opportunity verification platform"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://scam-check-alpha.vercel.app",
        "https://scamcheck-2-xqh3.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(intelligence.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "ScamCheck API",
        "version": "1.0.0"
    }