import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, explained_variance_score
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt

# Load the training and testing datasets
train_data = pd.read_csv('data/train.csv')
test_data = pd.read_csv('data/test.csv')

# Preprocessing function to handle datetime and feature extraction
def preprocess_data(df):
    df['Datetime'] = pd.to_datetime(df['Datetime'], utc=True)
    df['Year'] = df['Datetime'].dt.year
    df['Month'] = df['Datetime'].dt.month
    df['Day'] = df['Datetime'].dt.day
    df['Hour'] = df['Datetime'].dt.hour
    df['Datetime'] = df['Datetime'].dt.tz_localize(None)
    df.fillna(method='ffill', inplace=True)
    return df

# Preprocess both training and testing datasets
train_data = preprocess_data(train_data)
test_data = preprocess_data(test_data)

# Select features (X) and target (y) for training and testing data
features = ['TemperatureMax', 'TemperatureMin', 'RainSum', 
            'RelativeHumidityMean', 'RelativeHumidityMax', 
            'RelativeHumidityMin', 'Month', 'Day', 'Hour']
X_train = train_data[features]
y_train = train_data['TemperatureMean']
X_test = test_data[features]
y_test = test_data['TemperatureMean']

# Scale the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize and train the Linear Regression model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test_scaled)

# Evaluate the model
ev = explained_variance_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Explained Varinace Score: {ev}")
print(f"Mean Squared Error (MSE): {mse}")
print(f"Root Mean Squared Error (RMSE): {rmse}")
print(f"Mean Absolute Error (MAE): {mae}")
print(f"R-Squared (R²): {r2}")

# Extract the years and datetime for the x-axis
dates = test_data['Datetime'].values

# Plot 1: Actual vs Predicted TemperatureMean
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
    xaxis=dict(
        rangeslider=dict(visible=True),
        type="date"
    )
)
fig.show()

# Plot 2: Correlation Heatmap (using seaborn)
corr_matrix = train_data[features + ['TemperatureMean']].corr()

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", linewidths=0.5)
plt.title("Feature Correlation Heatmap")
plt.show()

# Plot 3: Histogram of Actual vs Predicted TemperatureMean
hist_data = pd.DataFrame({
    'Actual': y_test,
    'Predicted': y_pred
})
fig_hist = px.histogram(hist_data, barmode='overlay', 
                        color_discrete_map={'Actual':'blue', 'Predicted':'red'},
                        title="Histogram of Actual vs Predicted TemperatureMean")
fig_hist.show()

# Plot 4: Residuals Plot
residuals = y_test - y_pred
fig_resid = px.scatter(x=y_pred, y=residuals, title="Residuals Plot: Predicted vs Residuals",
                       labels={'x': 'Predicted TemperatureMean', 'y': 'Residuals'})
fig_resid.add_hline(y=0, line_dash="dash", line_color="red")
fig_resid.show()

# Plot 5: Scatter Matrix to show relationships between features and target
scatter_data = train_data[['TemperatureMean', 'TemperatureMax', 'TemperatureMin', 'RainSum', 'RelativeHumidityMean']]
fig_scatter_matrix = px.scatter_matrix(scatter_data, dimensions=scatter_data.columns,
                                       title="Scatter Matrix for Temperature and Related Features")
fig_scatter_matrix.update_layout(
    dragmode='select',
    width=1000,
    height=1000,
)
fig_scatter_matrix.show()
