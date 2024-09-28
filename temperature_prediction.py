"""
This script loads, preprocesses, trains a linear regression model on temperature data, 
evaluates the model, and visualizes the results.
"""

import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, explained_variance_score
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt


def load_data(train_filepath, test_filepath):
    """
    Load training and testing datasets from CSV files.

    Args:
    - train_filepath (str): Path to the training data CSV file.
    - test_filepath (str): Path to the testing data CSV file.

    Returns:
    - train_data (DataFrame): Loaded training data.
    - test_data (DataFrame): Loaded testing data.
    """
    train_data = pd.read_csv(train_filepath)
    test_data = pd.read_csv(test_filepath)
    return train_data, test_data

def preprocess_data(df):
    """
    Preprocess the dataset by extracting datetime features and filling missing values.

    Args:
    - df (DataFrame): DataFrame containing the dataset to preprocess.

    Returns:
    - df (DataFrame): Preprocessed DataFrame with new features and filled missing values.
    """
    # Convert 'Datetime' to a proper datetime object, making sure it's in UTC.
    df['Datetime'] = pd.to_datetime(df['Datetime'], utc=True)
    
    # Extract useful features like Year, Month, Day, and Hour from the datetime.
    df['Year'] = df['Datetime'].dt.year
    df['Month'] = df['Datetime'].dt.month
    df['Day'] = df['Datetime'].dt.day
    df['Hour'] = df['Datetime'].dt.hour
    
    # Remove timezone info for simplicity.
    df['Datetime'] = df['Datetime'].dt.tz_localize(None)
    
    # Forward fill missing values to maintain continuity in the dataset.
    df.fillna(method='ffill', inplace=True)
    return df

def prepare_features(train_data, test_data):
    """
    Prepare feature and target variables for training and testing data.

    Args:
    - train_data (DataFrame): DataFrame containing the training data.
    - test_data (DataFrame): DataFrame containing the testing data.

    Returns:
    - X_train (DataFrame): Feature variables for training.
    - y_train (Series): Target variable for training.
    - X_test (DataFrame): Feature variables for testing.
    - y_test (Series): Target variable for testing.
    """
    features = ['TemperatureMax', 'TemperatureMin', 'RainSum', 
                'RelativeHumidityMean', 'RelativeHumidityMax', 
                'RelativeHumidityMin', 'Month', 'Day', 'Hour']
    
    # Extract features and target variable for training and testing sets.
    X_train = train_data[features]
    y_train = train_data['TemperatureMean']
    X_test = test_data[features]
    y_test = test_data['TemperatureMean']
    
    return X_train, y_train, X_test, y_test

def scale_data(X_train, X_test):
    """
    Scale the feature data using StandardScaler.

    Args:
    - X_train (DataFrame): Feature variables for training.
    - X_test (DataFrame): Feature variables for testing.

    Returns:
    - X_train_scaled (ndarray): Scaled feature variables for training.
    - X_test_scaled (ndarray): Scaled feature variables for testing.
    """
    # Initialize the StandardScaler to standardize the features.
    scaler = StandardScaler()
    
    # Fit the scaler to the training data and transform both training and testing data.
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled

def train_model(X_train_scaled, y_train):
    """
    Train a Linear Regression model.

    Args:
    - X_train_scaled (ndarray): Scaled feature variables for training.
    - y_train (Series): Target variable for training.

    Returns:
    - model (LinearRegression): Trained linear regression model.
    """
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)  # Fit the model to the scaled training data.
    return model

def evaluate_model(model, X_test_scaled, y_test):
    """
    Evaluate the model using various metrics and return predictions.

    Args:
    - model (LinearRegression): Trained linear regression model.
    - X_test_scaled (ndarray): Scaled feature variables for testing.
    - y_test (Series): Target variable for testing.

    Returns:
    - y_pred (ndarray): Predicted values for the target variable.
    """
    # Make predictions on the scaled testing data.
    y_pred = model.predict(X_test_scaled)
    
    # Calculate evaluation metrics to assess model performance.
    ev = explained_variance_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Print the evaluation metrics for user reference.
    print(f"Explained Variance Score: {ev}")
    print(f"Mean Squared Error (MSE): {mse}")
    print(f"Root Mean Squared Error (RMSE): {rmse}")
    print(f"Mean Absolute Error (MAE): {mae}")
    print(f"R-Squared (R²): {r2}")
    
    return y_pred

def plot_actual_vs_predicted(dates, y_test, y_pred):
    """
    Plot actual vs predicted TemperatureMean over time.

    Args:
    - dates (array): Array of datetime values for the test set.
    - y_test (Series): Actual TemperatureMean values from the test set.
    - y_pred (ndarray): Predicted TemperatureMean values.
    """
    fig = go.Figure()
    # Add actual temperature data to the plot.
    fig.add_trace(go.Scatter(
        x=dates, y=y_test.values, mode='lines+markers', name='Actual TemperatureMean',
        line=dict(color='blue'), marker=dict(symbol='circle')
    ))
    # Add predicted temperature data to the plot.
    fig.add_trace(go.Scatter(
        x=dates, y=y_pred, mode='lines+markers', name='Predicted TemperatureMean',
        line=dict(color='red'), marker=dict(symbol='x')
    ))
    # Update layout for better readability and aesthetics.
    fig.update_layout(
        title='Actual vs Predicted TemperatureMean Over Time',
        xaxis_title='Datetime',
        yaxis_title='TemperatureMean',
        legend_title='Legend',
        hovermode='x unified',
        template='plotly_dark',
        xaxis=dict(rangeslider=dict(visible=True), type="date")
    )
    fig.show()  # Display the plot.

def plot_correlation_heatmap(train_data):
    """
    Plot a correlation heatmap for the features.

    Args:
    - train_data (DataFrame): DataFrame containing the training data.
    """
    # Calculate the correlation matrix for the features.
    corr_matrix = train_data.corr()
    plt.figure(figsize=(10, 8))
    
    # Create a heatmap to visualize the correlation between features.
    sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", linewidths=0.5)
    plt.title("Feature Correlation Heatmap")
    plt.show()  # Display the heatmap.

def plot_histogram(y_test, y_pred):
    """
    Plot histogram of actual vs predicted TemperatureMean.

    Args:
    - y_test (Series): Actual TemperatureMean values from the test set.
    - y_pred (ndarray): Predicted TemperatureMean values.
    """
    hist_data = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred})
    fig_hist = px.histogram(hist_data, barmode='overlay', 
                             color_discrete_map={'Actual':'blue', 'Predicted':'red'},
                             title="Histogram of Actual vs Predicted TemperatureMean")
    fig_hist.show()  # Display the histogram.

def plot_residuals(y_test, y_pred):
    """
    Plot residuals of predictions.

    Args:
    - y_test (Series): Actual TemperatureMean values from the test set.
    - y_pred (ndarray): Predicted TemperatureMean values.
    """
    residuals = y_test - y_pred
    fig_resid = px.scatter(x=y_pred, y=residuals, title="Residuals Plot: Predicted vs Residuals",
                           labels={'x': 'Predicted TemperatureMean', 'y': 'Residuals'})
    fig_resid.add_hline(y=0, line_dash="dash", line_color="red")  # Add a horizontal line at y=0.
    fig_resid.show()  # Display the residuals plot.

def plot_scatter_matrix(train_data):
    """
    Plot a scatter matrix to show relationships between features and target.

    Args:
    - train_data (DataFrame): DataFrame containing the training data.
    """
    scatter_data = train_data[['TemperatureMean', 'TemperatureMax', 'TemperatureMin', 
                                'RainSum', 'RelativeHumidityMean']]
    fig_scatter_matrix = px.scatter_matrix(scatter_data, dimensions=scatter_data.columns,
                                           title="Scatter Matrix for Temperature and Related Features")
    fig_scatter_matrix.update_layout(
        dragmode='select',
        width=1000,
        height=1000,
    )
    fig_scatter_matrix.show()  # Display the scatter matrix.

def main():
    # Load the training and testing data.
    train_data, test_data = load_data('temperature/train.csv', 'temperature/test.csv')
    
    # Preprocess the data to extract features and fill missing values.
    train_data = preprocess_data(train_data)
    test_data = preprocess_data(test_data)
    
    # Prepare feature and target variables for training and testing.
    X_train, y_train, X_test, y_test = prepare_features(train_data, test_data)
    
    # Scale the features to standardize them.
    X_train_scaled, X_test_scaled = scale_data(X_train, X_test)
    
    # Train the linear regression model on the scaled training data.
    model = train_model(X_train_scaled, y_train)
    
    # Evaluate the model's performance on the scaled testing data.
    y_pred = evaluate_model(model, X_test_scaled, y_test)
    
    # Extract dates from the test data for plotting.
    dates = test_data['Datetime'].values
    
    # Create various visualizations to analyze model performance and data relationships.
    plot_actual_vs_predicted(dates, y_test, y_pred)
    plot_correlation_heatmap(train_data)
    plot_histogram(y_test, y_pred)
    plot_residuals(y_test, y_pred)
    plot_scatter_matrix(train_data)

if __name__ == "__main__":
    main()  # Run the main function to execute the script.
