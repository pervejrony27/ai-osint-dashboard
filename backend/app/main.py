from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers.scan import router as scan_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered OSINT Intelligence Dashboard",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
origins = settings.BACKEND_CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scan_router)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
        "api_keys_configured": {
            "shodan": bool(settings.SHODAN_API_KEY),
            "hibp": bool(settings.HIBP_API_KEY),
            "securitytrails": bool(settings.SECURITYTRAILS_API_KEY),
            "hunter": bool(settings.HUNTER_API_KEY),
            "openai": bool(settings.OPENAI_API_KEY),
        }
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}