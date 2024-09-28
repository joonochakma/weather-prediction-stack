"""
Trains to predict temperature using Linear Regression
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
import joblib  

# Function to load training and testing data from CSV files
def load_data(train_filepath, test_filepath):
    train_data = pd.read_csv(train_filepath)  # Load training data
    test_data = pd.read_csv(test_filepath)    # Load testing data
    return train_data, test_data

# Function to preprocess the data by converting date strings and handling missing values
def preprocess_data(df):
    df['Datetime'] = pd.to_datetime(df['Datetime'], utc=True)  # Convert 'Datetime' column to datetime format
    df['Year'] = df['Datetime'].dt.year  # Extract year
    df['Month'] = df['Datetime'].dt.month  # Extract month
    df['Day'] = df['Datetime'].dt.day  # Extract day
    df['Hour'] = df['Datetime'].dt.hour  # Extract hour
    df['Datetime'] = df['Datetime'].dt.tz_localize(None)  # Remove timezone info for simplicity
    df.ffill(inplace=True)  # Forward fill to handle missing values
    return df

# Function to prepare features and target variable for training and testing
def prepare_features(train_data, test_data):
    features = ['TemperatureMax', 'TemperatureMin', 'RainSum', 
                'RelativeHumidityMean', 'RelativeHumidityMax', 
                'RelativeHumidityMin', 'Month', 'Day', 'Hour']
    X_train = train_data[features]  # Select feature columns for training
    y_train = train_data['TemperatureMean']  # Select target variable for training
    X_test = test_data[features]  # Select feature columns for testing
    y_test = test_data['TemperatureMean']  # Select target variable for testing
    
    return X_train, y_train, X_test, y_test

# Function to scale feature data using StandardScaler
def scale_data(X_train, X_test):
    scaler = StandardScaler()  # Create a StandardScaler instance
    X_train_scaled = scaler.fit_transform(X_train)  # Fit and transform training data
    X_test_scaled = scaler.transform(X_test)  # Transform testing data
    joblib.dump(scaler, 'model/temperauture_scaler.joblib')  # Save the scaler model for future use
    return X_train_scaled, X_test_scaled  

# Function to train a linear regression model
def train_model(X_train_scaled, y_train):
    model = LinearRegression()  # Instantiate a Linear Regression model
    model.fit(X_train_scaled, y_train)  # Fit the model to the scaled training data
    return model

# Function to evaluate the trained model on test data
def evaluate_model(model, X_test_scaled, y_test):
    y_pred = model.predict(X_test_scaled)  # Make predictions on the test data
    # Calculate various evaluation metrics
    ev = explained_variance_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Print the evaluation results
    print(f"Explained Variance Score: {ev}")
    print(f"Mean Squared Error (MSE): {mse}")
    print(f"Root Mean Squared Error (RMSE): {rmse}")
    print(f"Mean Absolute Error (MAE): {mae}")
    print(f"R-Squared (R²): {r2}")
    
    return y_pred

# Function to plot actual vs predicted temperature values
def plot_actual_vs_predicted(dates, y_test, y_pred):
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=dates, y=y_test.values, mode='lines+markers', name='Actual TemperatureMean',
        line=dict(color='blue'), marker=dict(symbol='circle')
    ))
    fig.add_trace(go.Scatter(
        x=dates, y=y_pred, mode='lines+markers', name='Predicted TemperatureMean',
        line=dict(color='red'), marker=dict(symbol='x')
    ))
    fig.update_layout(
        title='Actual vs Predicted TemperatureMean Over Time',
        xaxis_title='Datetime',
        yaxis_title='TemperatureMean',
        legend_title='Legend',
        hovermode='x unified',
        template='plotly_dark',
        xaxis=dict(rangeslider=dict(visible=True), type="date")
    )
    fig.show()  # Display the plot

# Function to plot a heatmap of feature correlations
def plot_correlation_heatmap(train_data):
    corr_matrix = train_data.corr()  # Compute the correlation matrix
    plt.figure(figsize=(10, 8))  # Set figure size
    sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", linewidths=0.5)  # Create heatmap
    plt.title("Feature Correlation Heatmap")  # Set title
    plt.show()  # Display the heatmap

# Function to plot histograms of actual vs predicted temperatures
def plot_histogram(y_test, y_pred):
    hist_data = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred})  # Create a DataFrame for histogram
    fig_hist = px.histogram(hist_data, barmode='overlay', 
                             color_discrete_map={'Actual':'blue', 'Predicted':'red'},
                             title="Histogram of Actual vs Predicted TemperatureMean")
    fig_hist.show()  # Display the histogram

# Function to plot residuals of the predictions
def plot_residuals(y_test, y_pred):
    residuals = y_test - y_pred  # Calculate residuals
    fig_resid = px.scatter(x=y_pred, y=residuals, title="Residuals Plot: Predicted vs Residuals",
                           labels={'x': 'Predicted TemperatureMean', 'y': 'Residuals'})
    fig_resid.add_hline(y=0, line_dash="dash", line_color="red")  # Add a horizontal line at y=0
    fig_resid.show()  # Display the residuals plot

# Function to plot a scatter matrix of selected features
def plot_scatter_matrix(train_data):
    scatter_data = train_data[['TemperatureMean', 'TemperatureMax', 'TemperatureMin', 
                                'RainSum', 'RelativeHumidityMean']]  # Select relevant features
    fig_scatter_matrix = px.scatter_matrix(scatter_data, dimensions=scatter_data.columns,
                                           title="Scatter Matrix for Temperature and Related Features")
    fig_scatter_matrix.update_layout(
        dragmode='select',
        width=1000,
        height=1000,
        template='plotly_dark'
    )
    fig_scatter_matrix.show()  # Display the scatter matrix

# Function to save the trained model to disk
def save_model(model, filepath):
    joblib.dump(model, filepath)  # Save the model using joblib

# Main function to orchestrate data loading, processing, model training, and evaluation
def main():
    # Load data
    train_data, test_data = load_data('temperature/train.csv', 'temperature/test.csv')
    # Preprocess data
    train_data = preprocess_data(train_data)
    test_data = preprocess_data(test_data)
    # Prepare features and target variable
    X_train, y_train, X_test, y_test = prepare_features(train_data, test_data)
    # Scale features
    X_train_scaled, X_test_scaled = scale_data(X_train, X_test)
    # Train the model
    model = train_model(X_train_scaled, y_train)
    save_model(model, 'model/temperature_model.joblib')  # Save the trained model
    # Evaluate the model
    y_pred = evaluate_model(model, X_test_scaled, y_test)
    # Plot results
    dates = test_data['Datetime'].values
    plot_actual_vs_predicted(dates, y_test, y_pred)
    plot_correlation_heatmap(train_data)
    plot_histogram(y_test, y_pred)
    plot_residuals(y_test, y_pred)
    plot_scatter_matrix(train_data)

# Run the main function when the script is executed
if __name__ == "__main__":
    main()
