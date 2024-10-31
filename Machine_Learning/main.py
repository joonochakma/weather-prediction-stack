from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from typing import Dict, Any
from temperature import get_temperature  # Ensure get_temperature returns only train_data

app = FastAPI()

# CORS middleware for handling requests from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained rainfall prediction model
model = joblib.load('model/rainfall_model.joblib')

# Define a Pydantic model for the prediction request
class RainPredictionRequest(BaseModel):
    max_temp: float
    min_temp: float
    rainfall: float

def prepare_rain_features(max_temp: float, min_temp: float, rainfall: float) -> pd.DataFrame:
    """
    Prepare feature data for rain prediction.
    Args:
        max_temp (float): Maximum temperature for the day.
        min_temp (float): Minimum temperature for the day.
        rainfall (float): Previous day's rainfall.
    Returns:
        pd.DataFrame: DataFrame with the prepared features.
    """
    # Create a DataFrame with the required features
    features = pd.DataFrame([{
        'Maximum temperature (Degree C)': max_temp,
        'Minimum temperature (Degree C)': min_temp,
        'Previous_Rainfall': rainfall
    }])
    return features

def prepare_features(train_data: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Prepare features and target variable for training."""
    features = ['TemperatureMax', 'TemperatureMin', 'RainSum', 
                'RelativeHumidityMean', 'RelativeHumidityMax', 
                'RelativeHumidityMin', 'Month', 'Day', 'Hour']
    
    # Extract the feature columns and target column
    X_train = train_data[features]  
    y_train = train_data['TemperatureMean']  
    
    return X_train, y_train

@app.get("/testdata")
def read_root(response: Response) -> Dict[str, Any]:
    # Retrieve train data dynamically from the source
    train_data, y_pred, dates, y_test, y_train = get_temperature()
    
    # Ensure data is available before processing
    if train_data.empty:
        response.status_code = 404
        return {"error": "Data not available"}
    
    # Prepare features for training
    X_train, y_train = prepare_features(train_data)
    
    # Convert DataFrames to lists for JSON response
    return {
        "X_train": X_train.to_dict(orient='records'),  # Convert to list of records
        "y_train": y_train.tolist(),  # Convert Series to list
        "y_pred": y_pred.tolist()  # Convert Series to list
    }

@app.post("/predict_rain")
async def predict_rain(request: RainPredictionRequest) -> Dict[str, Any]:
    # Prepare features for prediction
    features = prepare_rain_features(request.max_temp, request.min_temp, request.rainfall)

    # Predict probability of rain (Yes/No)
    try:
        probability = model.predict_proba(features)[0][1]  # Probability of rain (1)
        result = "Yes" if probability > 0.4 else "No"  # Adjusted threshold to 0.4 for sensitivity
        
        # Return probability as score
        return {
            "will_rain": result,
            "score": probability  # Return the raw probability score directly
        }
    except AttributeError:
        # If the model doesn't support predict_proba
        prediction = model.predict(features)
        probability = "N/A"
        result = "Yes" if prediction[0] == 1 else "No"

        # Handle non-probabilistic case
        return {
            "will_rain": result,
            "score": probability  # This will be 'N/A' if no score is available
        }