"""
Predicts whether it will rain tomorrow (Yes/No) using a Decision Tree Classifier
based on temperature and rainfall data from historical data.
"""

import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib

def load_data(filepath):
    """
    Load historical weather data from a CSV file.

    Args:
    - filepath (str): Path to the CSV file containing the data.

    Returns:
    - df (DataFrame): Loaded DataFrame containing the rainfall data.
    """
    data = pd.read_csv(filepath)
    return pd.DataFrame(data)

def clean_data(df):
    """
    Clean the dataset by filling missing values and creating a binary target variable.

    Args:
    - df (DataFrame): DataFrame containing the rainfall data.

    Returns:
    - df (DataFrame): Cleaned DataFrame with filled missing values and binary target variable.
    """
    # Fill missing rainfall amounts with 0 and create a binary column indicating rain.
    df['Rainfall amount (millimetres)'] = df['Rainfall amount (millimetres)'].fillna(0)
    df['Rainy'] = (df['Rainfall amount (millimetres)'] > 0).astype(int)  # 1 for rain, 0 for no rain
    return df

def feature_engineering(df):
    """
    Perform feature engineering by creating new features based on existing data.

    Args:
    - df (DataFrame): DataFrame containing the rainfall data.

    Returns:
    - df (DataFrame): DataFrame with new features added.
    """
    # Create a new feature for the previous day's rainfall.
    df['Previous_Rainfall'] = df['Rainfall amount (millimetres)'].shift(1)  # Shift for previous day's rainfall
    
    # Drop rows with NaN values created by shifting (first row).
    df.dropna(inplace=True)
    return df

def prepare_features_for_prediction(df):
    """
    Prepare the feature variables for model prediction.

    Args:
    - df (DataFrame): DataFrame containing the cleaned and engineered data.

    Returns:
    - X (DataFrame): Feature variables for tomorrow's prediction.
    """
    # Create a DataFrame for tomorrow's features using today's data
    last_row = df.iloc[-1]
    tomorrow_features = {
        'Maximum temperature (Degree C)': last_row['Maximum temperature (Degree C)'],
        'Minimum temperature (Degree C)': last_row['Minimum temperature (Degree C)'],
        'Previous_Rainfall': last_row['Rainfall amount (millimetres)']
    }
    return pd.DataFrame([tomorrow_features])

def predict_rain_tomorrow(model, X_tomorrow):
    """
    Predict whether it will rain tomorrow based on the feature data.

    Args:
    - model (DecisionTreeClassifier): Trained decision tree model.
    - X_tomorrow (DataFrame): Feature variables for tomorrow.

    Returns:
    - str: 'Y' if it will rain, 'N' if it won't.
    """
    probability = model.predict_proba(X_tomorrow)[0][1]  # Get probability of rain
    return 'Y' if probability > 0.5 else 'N'

def main():
    # Load the pre-trained decision tree model
    model = joblib.load('model/rainfall_model.joblib')

    # Load historical weather data
    historical_data_filepath = 'rainfall/temperature_rainfall.csv'  # Update this path as needed
    df = load_data(historical_data_filepath)
    
    # Clean and engineer features
    df = clean_data(df)
    df = feature_engineering(df)
    
    # Prepare features for tomorrow's prediction
    X_tomorrow = prepare_features_for_prediction(df)

    # Predict if it will rain tomorrow
    prediction = predict_rain_tomorrow(model, X_tomorrow)
    
    # Output the prediction
    print(f"Will it rain tomorrow? {'Yes' if prediction == 'Y' else 'No'}")

if __name__ == "__main__":
    main()
