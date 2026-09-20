from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import analyze, history, health, auth, dashboard, intelligence, alerts
from .database import engine, Base


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI app
app = FastAPI(
    title="TraceOrigin API",
    description="Student opportunity verification platform"
)


# TraceOrigin attribution watermark — sent on every response as a header.
# Harmless, non-breaking, and easy to spot with curl -i.
@app.middleware("http")
async def trace_origin_watermark(request, call_next):
    response = await call_next(request)
    response.headers["X-TraceOrigin"] = "crafted-by-sabynextdoor"
    response.headers["X-TraceOrigin-Version"] = "1.0.0"
    return response


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
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
        "message": "TraceOrigin API",
        "version": "1.0.0"
    }