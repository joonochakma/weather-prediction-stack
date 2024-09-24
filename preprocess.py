import pandas as pd
import os

# Path to the folder containing the CSV files
folder_path = 'original'

# List all CSV files in the folder
file_paths = [os.path.join(folder_path, file) for file in os.listdir(folder_path) if file.endswith('.csv')]

# Read all CSV files into pandas dataframes
df_list = [pd.read_csv(file, encoding='ISO-8859-1') for file in file_paths]

# Merge all dataframes vertically (concatenating rows)
merged_df = pd.concat(df_list, ignore_index=True)

# Save the merged dataframe to a new CSV file
output_path = os.path.join('merged_data.csv')
merged_df.to_csv(output_path, index=False)

print(f"Merged file saved to: {output_path}")
