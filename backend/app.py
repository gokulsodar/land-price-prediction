from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import joblib
import numpy as np

app = FastAPI()


from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="../frontend/public"), name="static")

# Serve index.html at root
@app.get("/")
async def read_root():
    return FileResponse('../frontend/public/index.html')

# Your existing code stays the same...

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load scalers and model
bed_scaler = joblib.load(r'model/bed_scaler.pkl')
bath_scaler = joblib.load(r'model/bath_scaler.pkl')
acre_lot_scaler = joblib.load(r'model/acre_lot_scaler.pkl')
house_size_scaler = joblib.load(r'model/house_size_scaler.pkl')
model = joblib.load(r'model/model.pkl')


# Define the list of states
states = ['alaska', 'arizona', 'arkansas', 'california', 'colorado',
          'connecticut', 'delaware', 'district of columbia', 'florida',
          'georgia', 'guam', 'hawaii', 'idaho', 'illinois', 'indiana',
          'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland',
          'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri',
          'montana', 'nebraska', 'nevada', 'new brunswick', 'new hampshire',
          'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota',
          'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'puerto rico', 'rhode island',
          'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont',
          'virgin islands', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming']

class LandPriceInput(BaseModel):
    land_area: float
    beds: int
    bath: int
    house_size: int
    street: int
    state: str
    days_since_sale: int
    status: str

@app.post("/predict")
async def predict_land_price(input_data: LandPriceInput):
    # Scale the numerical input data
    bed_scaled = bed_scaler.transform([[input_data.beds]])
    bath_scaled = bath_scaler.transform([[input_data.bath]])
    acre_lot_scaled = acre_lot_scaler.transform([[input_data.land_area]])
    house_size_scaled = house_size_scaler.transform([[input_data.house_size]])

    # Handle status column
    ready_to_build = 1 if input_data.status.lower() == 'ready_to_build' else 0
    sold = 1 if input_data.status.lower() == 'sold' else 0

    # Create one-hot encoding for state
    state_vector = [0] * len(states)
    if input_data.state.lower() in states:
        state_index = states.index(input_data.state.lower())
        state_vector[state_index] = 1

    # Combine all features
    feature_vector = np.hstack((bed_scaled, bath_scaled, acre_lot_scaled, house_size_scaled,[[input_data.days_since_sale]], [[input_data.street]],
                                [[ready_to_build, sold]], [state_vector]))
    # Make prediction
    scaled_prediction = model.predict(feature_vector)
    price_scaler = joblib.load(r'model\price_scaler.pkl')
    prediction = price_scaler.inverse_transform(scaled_prediction.reshape(-1, 1))

    # Print received values and prediction in the terminal
    print("\n--- Received Data ---")
    print(prediction)
    for field, value in input_data.dict().items():
        print(f"{field}: {value}")
    print(f"\n--- Prediction ---")
    print(f"Predicted Price: ${prediction[0][0]:,.2f}")
    print("--------------------\n")

    # Return the received data and prediction as a response
    return {
        "predicted_price": float(prediction[0][0])
    }

@app.get("/")
async def root():
    return {"message": "Welcome to the USA Land Prices Predictor API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
