"""
Splits the Data
"""

import pandas as pd
def split_data(train_file : str, output_train_file : str, output_test_file : str):
    """
    Processes traffic data from main training file and splits it into new train and 
    test CSV files with the following steps:
    1. Converts 'Datetime' to datetime format
    2. Splits the data into train and test with specfic datetime('2022-01-01')
    3. Saved the processed data into new train and test CSV files

    Parameters:
    - train_file (str) : Path to main training file
    - output_train_file (str) : Path to save processed train.csv
    - output_test_file (str) : Path to save processed test.csv
    """
    # Load the CSV file into a DataFrame, replacing missing values with 0
    df = pd.read_csv(train_file, encoding='utf-8').fillna(0)

    # Convert 'Combined DateTime' to datetime format
    df['Datetime'] = pd.to_datetime(df['Datetime']).dt.date

    # Define the split date for training and testing datasets
    split_date = pd.to_datetime('2022-01-01').date()

    # Split the DataFrame into training and testing sets based on the split date
    train_df = df[df['Datetime'] < split_date]
    test_df = df[df['Datetime'] >= split_date]

    # Save the sorted training and testing sets to CSV files
    train_df.to_csv(output_train_file, index=False)
    test_df.to_csv(output_test_file, index=False)

# Call the function to split data into training and testing sets
# split_data('Weather Data.csv', 'data/train.csv', 'data/test.csv')
