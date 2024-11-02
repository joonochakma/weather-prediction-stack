import pandas as pd

# Load your training data
training_data = pd.read_csv("Machine_learning/weather/merged_weather_data.csv")

# Define the columns you want to calculate the mean for
columns_to_calculate_mean = [
    "9am Temperature (°C)",
    "3pm Temperature (°C)",
    "9am relative humidity (%)",
    "3pm relative humidity (%)",
    "9am cloud amount (oktas)",
    "3pm cloud amount (oktas)",
    "9am wind speed (km/h)",
    "3pm wind speed (km/h)"
]

# Initialize an empty dictionary to store the mean values
mean_values = {}

# Calculate the mean for each column, handling non-numeric values
for column in columns_to_calculate_mean:
    # Convert column to numeric, setting errors='coerce' to turn non-numeric values into NaN
    training_data[column] = pd.to_numeric(training_data[column], errors='coerce')
    
    # Calculate the mean, skipping NaN values
    mean_values[column] = training_data[column].mean(skipna=True)

# Print or save the mean values to use as defaults for missing values
print(mean_values)
