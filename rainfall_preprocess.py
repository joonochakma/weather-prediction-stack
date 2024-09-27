import pandas as pd

# Reading the first file (Maximum temperature)
df1 = pd.read_csv('rainfall/maxtemperature.csv')

# Reading the second file (Minimum temperature)
df2 = pd.read_csv('rainfall/mintemperature.csv')

# Reading the third file (Rainfall amount)
df3 = pd.read_csv('rainfall/rainfall.csv')

# Merge the first two DataFrames on Year, Month, Day
merged_df = pd.merge(df1, df2, on=['Year', 'Month', 'Day'], how='inner')

# Merge the result with the rainfall DataFrame
merged_df = pd.merge(merged_df, df3, on=['Year', 'Month', 'Day'], how='inner')

# Select and rename the relevant columns
final_df = merged_df[['Year', 'Month', 'Day', 
                      'Maximum temperature (Degree C)', 
                      'Minimum temperature (Degree C)', 
                      'Rainfall amount (millimetres)']]

# Save the merged DataFrame to a new CSV file
final_df.to_csv('rainfall/temperature_rainfall.csv', index=False)


