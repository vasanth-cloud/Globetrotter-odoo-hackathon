from app.db.base import Base
from app.db.database import engine

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✓ All tables created successfully!")
print("\nTables created:")
print("- users")
print("- trips")
print("- cities")
print("- activities")
print("- itinerary_stops")
print("- itinerary_activities")
print("- budgets")
