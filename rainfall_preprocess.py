"""
Merges maxtemperature.csv,mintemperature.csv and rainfall.csv into one csv file.
"""

import pandas as pd

# Read the maximum temperature data from CSV file
df1 = pd.read_csv('rainfall/maxtemperature.csv')

# Read the minimum temperature data from CSV file
df2 = pd.read_csv('rainfall/mintemperature.csv')

# Read the rainfall amount data from CSV file
df3 = pd.read_csv('rainfall/rainfall.csv')

# Merge the maximum and minimum temperature DataFrames
# This combines df1 and df2 on the common columns 'Year', 'Month', and 'Day'
merged_df = pd.merge(df1, df2, on=['Year', 'Month', 'Day'], how='inner')

# Merge the result with the rainfall DataFrame
# This adds rainfall data to the merged temperature DataFrame based on the same date columns
merged_df = pd.merge(merged_df, df3, on=['Year', 'Month', 'Day'], how='inner')

# Select only the relevant columns for the final DataFrame
# We're interested in Year, Month, Day, Maximum temperature, Minimum temperature, and Rainfall amount
final_df = merged_df[['Year', 'Month', 'Day', 
                      'Maximum temperature (Degree C)', 
                      'Minimum temperature (Degree C)', 
                      'Rainfall amount (millimetres)']]

# Save the merged DataFrame to a new CSV file
# This will create 'temperature_rainfall.csv' in the 'rainfall' directory
final_df.to_csv('rainfall/temperature_rainfall.csv', index=False)
