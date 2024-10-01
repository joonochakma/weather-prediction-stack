"""
Combines all files in weather/weather_files to a single file.
"""

import pandas as pd
import os

# Define the path to the folder containing the weather data CSV files
folder_path = 'weather/weather_files'

# Create a list of file paths for all CSV files in the folder
file_paths = [os.path.join(folder_path, file) for file in os.listdir(folder_path) if file.endswith('.csv')]

# Read each CSV file into a pandas DataFrame and store them in a list
df_list = [pd.read_csv(file, encoding='ISO-8859-1') for file in file_paths]

# Combine all the DataFrames into a single one by stacking the rows together
merged_df = pd.concat(df_list, ignore_index=True)

# Fill in any missing values with 0
merged_df = merged_df.fillna(0)

# Save the final merged DataFrame to a new CSV file
output_path = os.path.join('weather/merged_weather_data.csv')
merged_df.to_csv(output_path, index=False)

print(f"Merged file saved to: {output_path}")
