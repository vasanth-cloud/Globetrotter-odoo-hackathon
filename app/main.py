from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, users, trips, cities, activities, itinerary, budget

app = FastAPI(title="GlobeTrotter API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(cities.router, prefix="/api/cities", tags=["Cities"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(itinerary.router, prefix="/api/itinerary", tags=["Itinerary"])
app.include_router(budget.router, prefix="/api/budget", tags=["Budget"])

@app.get("/")
def root():
    return {"message": "GlobeTrotter API is running", "docs": "/docs"}
