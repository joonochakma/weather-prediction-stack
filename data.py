import pandas as pd

# Load the two CSV files into DataFrames
file1 = 'file1.csv'  # Replace with your actual file path
file2 = 'file2.csv'  # Replace with your actual file path

# Reading the first file
df1 = pd.read_csv('maxtemp.csv')

# Reading the second file
df2 = pd.read_csv('mintemp.csv')

# Merge the two DataFrames on Year, Month, Day
merged_df = pd.merge(df1, df2, on=['Year', 'Month', 'Day'], how='inner')

# Select and rename the relevant columns
final_df = merged_df[['Year', 'Month', 'Day', 
                       'Maximum temperature (Degree C)', 
                       'Minimum temperature (Degree C)']]

# Save the merged DataFrame to a new CSV file
final_df.to_csv('temperature.csv', index=False)

print("Files merged successfully!")
