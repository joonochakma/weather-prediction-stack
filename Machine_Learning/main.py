from datetime import datetime
from fastapi import FastAPI, Query, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel
import pandas as pd
import joblib
from typing import Dict, Any
from temperature import get_temperature  # Ensure get_temperature returns only train_data
from sklearn.preprocessing import StandardScaler

app = FastAPI()

# CORS middleware for handling requests from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------- Rainfall prediction integration ----------------
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

@app.post("/rain_prediction")
async def create_rain_prediction(request: RainPredictionRequest) -> Dict[str, Any]:
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

# --------------- Temperature prediction integration ----------------
temperature_model = joblib.load('model/temperature_model.joblib')
scaler = joblib.load('model/temperature_scaler.joblib')

class TemperaturePredictionRequest(BaseModel):
    temperature_max: float
    temperature_min: float
    rain_sum: float
    relative_humidity_mean: float
    relative_humidity_max: float
    relative_humidity_min: float
    month: int
    day: int
    hour: int


@app.post("/temperature_prediction")
async def create_temperature_prediction(request: TemperaturePredictionRequest):
    try:
        # Prepare the feature vector
        features = np.array([[request.temperature_max, request.temperature_min, request.rain_sum,
                              request.relative_humidity_mean, request.relative_humidity_max,
                              request.relative_humidity_min, request.month, request.day, request.hour]])
        
        # Scale the features
        features_scaled = scaler.transform(features)
        
        # Predict the temperature
        prediction = model.predict(features_scaled)
        return {"predicted_temperature": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------- Weather condition prediction integration ----------------


# --------------- Heatwave prediction integration ----------------
# Load the heatwave prediction model
heatwave_model = joblib.load('model/heatwave_model.joblib')
scaler = StandardScaler()

class HeatwavePredictionRequest(BaseModel):
    min_temp: float
    max_temp: float

@app.post("/heatwave_prediction")
async def create_heatwave_prediction(request: HeatwavePredictionRequest, date: str = Query(None)) -> Dict[str, Any]:
    """Predict heatwave conditions based on temperature inputs."""
    try:
        # Prepare features for heatwave prediction
        features = pd.DataFrame([{
            'Minimum temperature (Degree C)': request.min_temp,
            'Maximum temperature (Degree C)': request.max_temp
        }])
        
        # Scale the features using the StandardScaler
        features_scaled = scaler.fit_transform(features)
        
        # Predict heatwave conditions
        prediction = heatwave_model.predict(features_scaled)

        # Determine cluster (assuming this is the predicted cluster)
        cluster = int(prediction[0])  # Get the cluster from the prediction

        # If no date is provided, use today's date
        if date is None:
            date = datetime.now().strftime("%Y-%M-%D")
        
        # Return the prediction result including the cluster
        return {
            "date": date,
            "minimum_temperature": request.min_temp,
            "maximum_temperature": request.max_temp,
            "cluster": cluster,  # Include the predicted cluster
            "heatwave": cluster == 1  # Cluster 1 indicates a heatwave
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))