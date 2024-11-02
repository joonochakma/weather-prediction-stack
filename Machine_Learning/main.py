from datetime import datetime, timedelta
from fastapi import FastAPI, Query, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel, Field, model_validator
import pandas as pd
import joblib
from typing import Dict, Any
from temperature import get_temperature  # Ensure get_temperature returns only train_data
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import numpy as np

app = FastAPI()

# CORS middleware for handling requests from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------- Rainfall modelintegration ----------------
# Load the pre-trained rainfall prediction model
model = joblib.load('model/rainfall_model.joblib')
heatwave_model = joblib.load('model/heatwave_model.joblib')
scaler = StandardScaler()

# Define a Pydantic model for the prediction request
class RainPredictionRequest(BaseModel):
    max_temp: float
    min_temp: float
    rainfall: float

class HeatwavePredictionRequest(BaseModel):
    min_temp: float
    max_temp: float

def prepare_rain_features(max_temp: float, min_temp: float, rainfall: float) -> pd.DataFrame:
    """Prepare feature data for rain prediction."""
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

def load_data(file_path: str) -> pd.DataFrame:
    """Load data from a CSV file."""
    return pd.read_csv(file_path)

def preprocess_data(data: pd.DataFrame) -> pd.DataFrame:
    """Preprocess data by removing outliers or scaling as necessary."""
    return data 

def apply_kmeans_clustering(data: pd.DataFrame, n_clusters: int = 2) -> pd.DataFrame:
    """Apply KMeans clustering to the data."""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    data['Cluster'] = kmeans.fit_predict(data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']])
    return data

@app.get("/testdata")
def read_root(response: Response) -> Dict[str, Any]:
    """Retrieve training data for the temperature prediction model."""
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
    """Predict the probability of rain based on temperature and rainfall."""
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

# --------------- Temperature model integration ----------------
# Load the temperature prediction model and scaler
try:
    model = joblib.load('model/temperature_model.joblib')
    scaler = joblib.load('model/temperauture_scaler.joblib')
    print("Model and scaler loaded successfully")
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    raise HTTPException(status_code=500, detail="Error loading model or scaler")

# Define a Pydantic model for the prediction request
class TemperaturePredictionRequest(BaseModel):
    # Define input fields with validation
    temperature_max: float = Field(..., gt=-50, lt=60, description="Max temperature between -50 and 60°C")
    temperature_min: float = Field(..., gt=-50, lt=60, description="Min temperature between -50 and 60°C")
    rain_sum: float = Field(..., ge=0, description="Rain sum should be positive")
    relative_humidity_mean: float = Field(..., ge=0, le=100, description="Humidity between 0 and 100%")
    relative_humidity_max: float = Field(..., ge=0, le=100, description="Humidity between 0 and 100%")
    relative_humidity_min: float = Field(..., ge=0, le=100, description="Humidity between 0 and 100%")

    # Cross-field validation to ensure min/max relationships
    @model_validator(mode="after")
    def check_min_max_relationships(cls, values):
        temp_min = values.temperature_min
        temp_max = values.temperature_max
        hum_min = values.relative_humidity_min
        hum_max = values.relative_humidity_max
        
        if temp_min > temp_max:
            raise ValueError("Minimum temperature must be less than or equal to maximum temperature")
        if hum_min > hum_max:
            raise ValueError("Minimum humidity must be less than or equal to maximum humidity")
        
        return values

# Define a route for the temperature prediction endpoint
@app.post("/temperature_prediction")
async def create_temperature_prediction(request: TemperaturePredictionRequest):
    """Predict the average temperature for tomorrow."""
    try:
        # Determine the date for tomorrow
        today = datetime.now()
        tomorrow = today + timedelta(days=1)

        # Prepare the feature vector
        features = np.array([[request.temperature_max, 
                              request.temperature_min, 
                              request.rain_sum,
                              request.relative_humidity_mean, 
                              request.relative_humidity_max,
                              request.relative_humidity_min, 
                              tomorrow.month,
                              tomorrow.day,
                              0 # Hour is set to 0 as placeholder for "Hour" for a daily average prediction
                              ]])
        
        # Scale the features
        try:   
            scaler = StandardScaler()
            features_scaled = scaler.fit_transform(features)
        except Exception as e:
            print(f"Scaler error: {e}")
            raise HTTPException(status_code=500, detail="Error scaling input data")
        
        # Predict the temperature
        try:
            prediction = model.predict(features_scaled)
        except Exception as e:
            print(f"Prediction error: {e}")
            raise HTTPException(status_code=500, detail="Error making prediction")
        
        # Round the prediction to the nearest integer
        rounded_prediction = round(prediction[0])
        
        return {"predicted_temperature": rounded_prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------- Weather condition model integration ----------------


# --------------- Heatwave model integration ----------------
# Load the heatwave prediction model
heatwave_model = joblib.load('model/heatwave_model.joblib')
scaler = StandardScaler()

# Define a Pydantic model for the prediction request
class HeatwavePredictionRequest(BaseModel):
    min_temp: float
    max_temp: float

# Define a route for the heatwave prediction endpoint
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
            date = datetime.now().strftime("%Y-%m-%d")
        
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

@app.get("/clusters_visualization")
def visualize_clusters_endpoint() -> Dict[str, Any]:
    """Visualize clusters using PCA and KMeans clustering."""
    try:
        print("Loading data...")
        data = load_data('rainfall/temperature_rainfall.csv')

        print("Checking for NaN values...")
        print(data.isnull().sum())  # Print NaN counts for each column

        # Handle NaN values
        if data.isnull().values.any():
            # Option 1: Drop rows with any NaN values
            data = data.dropna()  # Drop rows with NaN values
            
            # Option 2: Alternatively, you could fill NaN values with the mean or median
            # data.fillna(data.mean(), inplace=True)  # Replace NaN with column mean

        # Check if the data has the required columns
        required_columns = {'Minimum temperature (Degree C)', 'Maximum temperature (Degree C)'}
        if not required_columns.issubset(data.columns):
            raise HTTPException(status_code=500, detail="Required columns are missing in the data.")

        print("Applying KMeans clustering...")
        data_no_outliers = apply_kmeans_clustering(data)

        print("Performing PCA...")
        pca = PCA(n_components=2)
        data_pca = pca.fit_transform(data_no_outliers[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']])
        
        # Add PCA components to the DataFrame for visualization
        data_no_outliers['PCA1'] = data_pca[:, 0]
        data_no_outliers['PCA2'] = data_pca[:, 1]

        print("Preparing cluster data for response...")
        cluster_data = {
            "x": data_no_outliers['PCA1'].tolist(),
            "y": data_no_outliers['PCA2'].tolist(),
            "cluster": data_no_outliers['Cluster'].tolist(),
        }

        return cluster_data

    except Exception as e:
        print(f"Error in visualize_clusters_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))