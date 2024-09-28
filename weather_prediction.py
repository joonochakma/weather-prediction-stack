"""
This script allows users to input weather conditions and predict the weather category 
using a pre-trained Random Forest model.
"""

import pandas as pd
import joblib

def get_user_input():
    """
    Get user input for weather conditions.

    Returns:
        dict: A dictionary containing user-provided weather conditions.
    """
    print("Enter the weather conditions:")
    minimum_temp = float(input("Minimum Temperature (°C): "))
    maximum_temp = float(input("Maximum Temperature (°C): "))
    rainfall = float(input("Rainfall (mm): "))
    nine_am_temp = float(input("9 AM Temperature (°C): "))
    nine_am_humidity = float(input("9 AM Relative Humidity (%): "))
    nine_am_cloud = float(input("9 AM Cloud Amount (oktas): "))
    nine_am_wind_speed = float(input("9 AM Wind Speed (km/h): "))
    three_pm_temp = float(input("3 PM Temperature (°C): "))
    three_pm_humidity = float(input("3 PM Relative Humidity (%): "))
    three_pm_cloud = float(input("3 PM Cloud Amount (oktas): "))
    three_pm_wind_speed = float(input("3 PM Wind Speed (km/h): "))

    # Return as a dictionary
    return {
        'Minimum temperature (°C)': minimum_temp,
        'Maximum temperature (°C)': maximum_temp,
        'Rainfall (mm)': rainfall,
        '9am Temperature (°C)': nine_am_temp,
        '9am relative humidity (%)': nine_am_humidity,
        '9am cloud amount (oktas)': nine_am_cloud,
        '9am wind speed (km/h)': nine_am_wind_speed,
        '3pm Temperature (°C)': three_pm_temp,
        '3pm relative humidity (%)': three_pm_humidity,
        '3pm cloud amount (oktas)': three_pm_cloud,
        '3pm wind speed (km/h)': three_pm_wind_speed
    }

def predict_weather(user_input, model):
    """
    Predict the weather condition based on user input.

    Args:
        user_input (dict): User-provided weather conditions.
        model (RandomForestClassifier): Trained Random Forest model.

    Returns:
        str: Predicted weather condition.
    """
    input_df = pd.DataFrame([user_input])
    prediction = model.predict(input_df)
    return prediction[0]

def main():
    """
    Main function to load the model and get predictions based on user input.
    """
    # Load the pre-trained model
    model = joblib.load('model/weather_classifier_model.joblib')

    # Get user input for weather conditions
    user_input = get_user_input()

    # Predict the weather condition
    predicted_condition = predict_weather(user_input, model)
    
    # Output the prediction
    print(f"The predicted weather condition is: {predicted_condition}")

if __name__ == "__main__":
    main()
