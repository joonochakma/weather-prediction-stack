"""
Splits the Data
"""

import pandas as pd

def split_data(train_file: str, output_train_file: str, output_test_file: str):
    """
    This function processes traffic data from the main training file and splits it into new train and test CSV files. 
    Here's what it does:
    1. Converts the 'Datetime' column into a proper datetime format.
    2. Uses a specific date ('2023-01-01') to divide the data into training and testing sets.
    3. Saves the processed data into two separate CSV files for training and testing.

    Parameters:
    - train_file (str) : Path to the main training file containing the weather data.
    - output_train_file (str) : Path where the processed training data will be saved as 'train.csv'.
    - output_test_file (str) : Path where the processed testing data will be saved as 'test.csv'.
    """
    
    # Load the CSV file into a DataFrame. If there are any missing values, we'll replace them with 0.
    df = pd.read_csv(train_file, encoding='utf-8').fillna(0)

    # Convert the 'Datetime' column to just the date part.
    df['Datetime'] = pd.to_datetime(df['Datetime']).dt.date

    # We'll use this date to split our data into training and testing sets.
    split_date = pd.to_datetime('2023-01-01').date()

    # Now, let's create the training DataFrame with data before the split date.
    train_df = df[df['Datetime'] < split_date]
    
    # And for the testing DataFrame, we'll take the data from the split date onwards.
    test_df = df[df['Datetime'] >= split_date]

    # Finally, we save both the training and testing sets into separate CSV files.
    train_df.to_csv(output_train_file, index=False)
    test_df.to_csv(output_test_file, index=False)

# Call the function to split the data into training and testing sets.
split_data('temperature/Weather Data.csv', 'temperature/train.csv', 'temperature/test.csv')
