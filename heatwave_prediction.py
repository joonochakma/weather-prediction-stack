"""
Predicts Heatwave for tomorrow
"""

import pandas as pd 
import joblib   
from sklearn.preprocessing import StandardScaler  
from datetime import datetime, timedelta 

# Function to load the pre-trained model from a specified path
def load_model(model_path):
    return joblib.load(model_path)  # Returns the loaded model

# Function to load data from a CSV file
def load_data(file_path):
    return pd.read_csv(file_path, encoding='utf-8')  # Loads data and returns it as a DataFrame

# Function to preprocess the data
def preprocess_data(data):
    # Convert temperature columns to numeric, coerce errors to NaN
    data['Minimum temperature (Degree C)'] = pd.to_numeric(data['Minimum temperature (Degree C)'], errors='coerce')
    data['Maximum temperature (Degree C)'] = pd.to_numeric(data['Maximum temperature (Degree C)'], errors='coerce')
    
    # Drop any rows with missing values
    data.dropna(inplace=True)
    
    # Select features for prediction
    features = data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]
    
    # Scale the features using StandardScaler for better model performance
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(features)  # Fit and transform the features
    return data_scaled  # Return the scaled features

# Function to predict heatwave conditions using the trained model
def predict_heatwave_conditions(model, data_scaled):
    return model.predict(data_scaled)  # Returns the predictions based on scaled data

# Main function that orchestrates the workflow
def main():
    # Load the heatwave prediction model
    model = load_model('model/heatwave_model.joblib')
    
    # Load the temperature and rainfall data
    data = load_data('rainfall/temperature_rainfall.csv')
    
    # Extract the most recent data entry
    today_data = data.iloc[-1:]  # Get the last row of data
    
    # Preprocess the data for prediction
    data_scaled = preprocess_data(today_data)
    
    # Predict heatwave conditions
    predictions = predict_heatwave_conditions(model, data_scaled)
    
    # Calculate tomorrow's date
    tomorrow_date = (datetime.now() + timedelta(days=1)).date()
    
    # Add predictions and date to today's data
    today_data.loc[:, 'Predicted Cluster'] = predictions
    today_data.loc[:, 'Date'] = tomorrow_date
    
    # Print the predictions in a readable format
    print("Predicted heatwave conditions for tomorrow:")
    print(today_data[['Date', 'Minimum temperature (Degree C)', 'Maximum temperature (Degree C)', 'Predicted Cluster']].to_string(index=False))

# Entry point of the script
if __name__ == "__main__":
    main()  # Run the main function
