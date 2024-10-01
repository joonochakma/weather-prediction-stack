"""
Predict temperature for the next day
"""
import pandas as pd
import joblib
import numpy as np

def load_model_and_scaler(model_path, scaler_path):
    # Load the pre-trained machine learning model and the scaler from specified paths
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler

def preprocess_new_data(df):
    # Convert the 'Datetime' column to datetime format with UTC timezone
    df['Datetime'] = pd.to_datetime(df['Datetime'], utc=True)
    
    # Extract year, month, day, and hour from the 'Datetime' column
    df['Year'] = df['Datetime'].dt.year
    df['Month'] = df['Datetime'].dt.month
    df['Day'] = df['Datetime'].dt.day
    df['Hour'] = df['Datetime'].dt.hour
    
    # Remove timezone information for further processing
    df['Datetime'] = df['Datetime'].dt.tz_localize(None)
    
    # Forward fill missing values in the DataFrame
    df.ffill(inplace=True)
    return df

def prepare_features_for_prediction(df):
    # Define the features that will be used for prediction
    features = ['TemperatureMax', 'TemperatureMin', 'RainSum', 
                'RelativeHumidityMean', 'RelativeHumidityMax', 
                'RelativeHumidityMin', 'Month', 'Day', 'Hour']
    
    # Create a new DataFrame containing only the selected features
    X = df[features]
    return X

def predict_temperature_for_next_day(new_data_filepath):
    # Load the trained model and scaler
    model, scaler = load_model_and_scaler('model/temperature_model.joblib', 'model/temperauture_scaler.joblib')
    
    # Read the new data from the specified CSV file
    new_data = pd.read_csv(new_data_filepath)
    
    # Preprocess the new data to prepare it for prediction
    new_data = preprocess_new_data(new_data)
    
    # Create a DataFrame for the next day's date
    next_day = new_data['Datetime'].max() + pd.Timedelta(days=1)
    next_day_df = pd.DataFrame({
        'Datetime': [next_day],
        'TemperatureMax': [new_data['TemperatureMax'].mean()],  
        'TemperatureMin': [new_data['TemperatureMin'].mean()],
        'RainSum': [new_data['RainSum'].mean()],
        'RelativeHumidityMean': [new_data['RelativeHumidityMean'].mean()],
        'RelativeHumidityMax': [new_data['RelativeHumidityMax'].mean()],
        'RelativeHumidityMin': [new_data['RelativeHumidityMin'].mean()],
    })

    # Preprocess the next day's DataFrame
    next_day_df = preprocess_new_data(next_day_df)
    
    # Prepare the features for the model
    X_next_day = prepare_features_for_prediction(next_day_df)
    
    # Scale the features using the loaded scaler
    X_next_day_scaled = scaler.transform(X_next_day)
    
    # Make predictions using the trained model
    predictions = model.predict(X_next_day_scaled)
    
    # Add the predictions to the next day's DataFrame
    next_day_df['PredictedTemperatureMean'] = predictions
    
    # Print the predicted temperature for the next day
    print(f"Predicted temperature for {next_day}: {predictions[0]}°C")
    
    # Save the predictions to a new CSV file
    next_day_df.to_csv('temperature/predicted_temperatures_next_day.csv', index=False)

if __name__ == "__main__":
    new_data_filepath = 'temperature/test.csv' 
    predict_temperature_for_next_day(new_data_filepath)
