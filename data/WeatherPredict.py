import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import plotly.graph_objects as go

# Load the training and testing datasets
train_data = pd.read_csv('data/train.csv')
test_data = pd.read_csv('data/test.csv')

# Preprocessing function to handle datetime and feature extraction
def preprocess_data(df):
    # Convert Datetime to pandas datetime format with timezone handling
    df['Datetime'] = pd.to_datetime(df['Datetime'], utc=True)
    
    # Extract features from Datetime
    df['Year'] = df['Datetime'].dt.year
    df['Month'] = df['Datetime'].dt.month
    df['Day'] = df['Datetime'].dt.day
    df['Hour'] = df['Datetime'].dt.hour
    
    # Remove timezone information (optional)
    df['Datetime'] = df['Datetime'].dt.tz_localize(None)
    
    # Fill missing values (forward fill in this example)
    df.fillna(method='ffill', inplace=True)
    
    return df

# Preprocess both training and testing datasets
train_data = preprocess_data(train_data)
test_data = preprocess_data(test_data)

# Select features (X) and target (y) for training data
X_train = train_data[['TemperatureMax', 'TemperatureMin', 'RainSum', 
                      'RelativeHumidityMean', 'RelativeHumidityMax', 
                      'RelativeHumidityMin', 'Month', 'Day', 'Hour']]
y_train = train_data['TemperatureMean']

# Select features (X) and target (y) for testing data
X_test = test_data[['TemperatureMax', 'TemperatureMin', 'RainSum', 
                    'RelativeHumidityMean', 'RelativeHumidityMax', 
                    'RelativeHumidityMin', 'Month', 'Day', 'Hour']]
y_test = test_data['TemperatureMean']

# Initialize and fit the scaler on the training data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize and train the Linear Regression model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test_scaled)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error (MSE): {mse}")
print(f"Root Mean Squared Error (RMSE): {rmse}")
print(f"Mean Absolute Error (MAE): {mae}")
print(f"R-Squared (R²): {r2}")

# Extract the years and datetime for the x-axis
dates = test_data['Datetime'].values

# Create an interactive Plotly figure
fig = go.Figure()

# Add actual temperature trace
fig.add_trace(go.Scatter(
    x=dates, y=y_test.values, mode='lines+markers', name='Actual TemperatureMean',
    line=dict(color='blue'), marker=dict(symbol='circle')
))

# Add predicted temperature trace
fig.add_trace(go.Scatter(
    x=dates, y=y_pred, mode='lines+markers', name='Predicted TemperatureMean',
    line=dict(color='red'), marker=dict(symbol='x')
))

# Customize layout
fig.update_layout(
    title='Actual vs Predicted TemperatureMean Over Time',
    xaxis_title='Datetime',
    yaxis_title='TemperatureMean',
    legend_title='Legend',
    hovermode='x unified',
    template='plotly_dark'
)

# Enable interactive zooming, panning, and range slider
fig.update_layout(
    xaxis=dict(
        rangeslider=dict(visible=True),
        type="date"
    )
)

# Show the figure
fig.show()
