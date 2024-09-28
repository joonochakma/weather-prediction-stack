"""
Classifies with it rain or not
"""
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

def load_data(filepath):
    """
    Load the dataset from a CSV file.

    Args:
    - filepath (str): Path to the CSV file containing the data.

    Returns:
    - df (DataFrame): Loaded DataFrame containing the rainfall data.
    """
    data = pd.read_csv(filepath)
    return pd.DataFrame(data)

def clean_data(df):
    """
    Clean the dataset by filling missing values and creating a binary target variable.

    Args:
    - df (DataFrame): DataFrame containing the rainfall data.

    Returns:
    - df (DataFrame): Cleaned DataFrame with filled missing values and binary target variable.
    """
    # Fill missing rainfall amounts with 0 and create a binary column indicating rain.
    df['Rainfall amount (millimetres)'] = df['Rainfall amount (millimetres)'].fillna(0)
    df['Rainy'] = (df['Rainfall amount (millimetres)'] > 0).astype(int)  # 1 for rain, 0 for no rain
    return df

def feature_engineering(df):
    """
    Perform feature engineering by creating new features based on existing data.

    Args:
    - df (DataFrame): DataFrame containing the rainfall data.

    Returns:
    - df (DataFrame): DataFrame with new features added.
    """
    # Create a new feature for the previous day's rainfall.
    df['Previous_Rainfall'] = df['Rainfall amount (millimetres)'].shift(1)  # Shift for previous day's rainfall
    
    # Drop rows with NaN values created by shifting (first row).
    df.dropna(inplace=True)
    return df

def prepare_data(df):
    """
    Prepare the feature and target variables for model training.

    Args:
    - df (DataFrame): DataFrame containing the cleaned and engineered data.

    Returns:
    - X (DataFrame): Feature variables.
    - y (Series): Target variable.
    """
    # Select features and target variable
    X = df[['Maximum temperature (Degree C)', 'Minimum temperature (Degree C)', 'Previous_Rainfall']]
    y = df['Rainy']
    return X, y

def train_model(X_train, y_train, model_filepath='rainfall/decision_tree_model.joblib'):
    """
    Train a Decision Tree Classifier on the training data and save the model.

    Args:
    - X_train (DataFrame): Feature variables for training.
    - y_train (Series): Target variable for training.
    - model_filepath (str): File path to save the trained model.

    Returns:
    - model (DecisionTreeClassifier): Trained decision tree model.
    """
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)  # Fit the model on the training data.
    
    # Save the trained model 
    joblib.dump(model, model_filepath)
    print(f"Model saved to {model_filepath}")
    
    return model

def load_model(model_filepath='rainfall/decision_tree_model.joblib'):
    """
    Load a saved decision tree model from a file.

    Args:
    - model_filepath (str): File path to the saved model.

    Returns:
    - model (DecisionTreeClassifier): Loaded decision tree model.
    """
    model = joblib.load(model_filepath)
    print(f"Model loaded from {model_filepath}")
    return model

def make_predictions(model, X_test):
    """
    Make predictions using the trained model.

    Args:
    - model (DecisionTreeClassifier): Trained decision tree model.
    - X_test (DataFrame): Feature variables for testing.

    Returns:
    - predictions (ndarray): Predicted class labels.
    - probabilities (ndarray): Predicted probabilities for both classes.
    """
    probabilities = model.predict_proba(X_test)  # Get probabilities for both classes
    predictions = [1 if prob[1] > 0.5 else 0 for prob in probabilities]  # Threshold of 50% for rain prediction
    return predictions, probabilities

def save_predictions(df, predictions, probabilities, df_test_indices):
    """
    Save the predictions and probabilities into the original DataFrame.

    Args:
    - df (DataFrame): Original DataFrame containing the rainfall data.
    - predictions (list): List of predicted labels.
    - probabilities (ndarray): Predicted probabilities for both classes.
    - df_test_indices (Index): Indices of the test data in the original DataFrame.
    
    Returns:
    - df (DataFrame): DataFrame with predictions and probabilities added.
    """
    df.loc[df_test_indices, 'Predicted_Rainy'] = ['Y' if pred == 1 else 'N' for pred in predictions]
    df['Predicted_Rainy'] = df['Predicted_Rainy'].fillna('N')  # Fill missing predictions with 'N'
    df.loc[df_test_indices, 'Probability_of_Rain'] = [prob[1] for prob in probabilities]
    return df

def calculate_metrics(y_test, predictions):
    """
    Calculate accuracy and generate a classification report.

    Args:
    - y_test (Series): Actual target variable for testing.
    - predictions (list): Predicted class labels.

    Returns:
    - accuracy (float): Accuracy score of the predictions.
    - report (str): Classification report as a string.
    """
    accuracy = accuracy_score(y_test, predictions)
    report = classification_report(y_test, predictions)
    return accuracy, report

def visualize_results(df):
    """
    Visualize the predictions and their distribution.

    Args:
    - df (DataFrame): DataFrame containing the actual and predicted labels.
    """
    # Count plot for actual vs predicted
    plt.figure(figsize=(10, 4))
    sns.countplot(data=df, x='Predicted_Rainy', order=['Y', 'N'])
    plt.title('Predicted Rainy Days vs Non-Rainy Days')
    plt.xlabel('Prediction (Y = Rainy, N = Not Rainy)')
    plt.ylabel('Count')
    plt.grid(axis='y')

    # Show probability distributions for actual rainy days
    plt.figure(figsize=(10, 4))
    sns.histplot(df[df['Rainy'] == 1]['Probability_of_Rain'], bins=10, kde=True, color='blue', label='Actual Rainy Days', stat='density')
    sns.histplot(df[df['Rainy'] == 0]['Probability_of_Rain'], bins=10, kde=True, color='red', label='Actual Non-Rainy Days', stat='density')
    plt.title('Distribution of Predicted Probabilities for Rainfall')
    plt.xlabel('Probability of Rain')
    plt.ylabel('Density')
    plt.legend()
    plt.grid()
    plt.show()

def main():
    # Load the dataset
    df = load_data('rainfall/temperature_rainfall.csv')
    
    # Clean and prepare the data
    df = clean_data(df)
    df = feature_engineering(df)
    
    # Prepare feature and target variables
    X, y = prepare_data(df)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train or load the model
    model_filepath = 'model/rainfall_model.joblib'
    
    # Train the model
    model = train_model(X_train, y_train, model_filepath)
    
    # Make predictions
    predictions, probabilities = make_predictions(model, X_test)
    
    # Align predictions with the original DataFrame
    df_test_indices = X_test.index
    df = save_predictions(df, predictions, probabilities, df_test_indices)
    
    # Calculate metrics
    accuracy, report = calculate_metrics(y_test, predictions)
    
    # Save predictions to a new CSV file
    df.to_csv('rainfall/rainfall_predictions.csv', index=False)
    
    # Display metrics
    print(f'\nAccuracy: {accuracy:.2f}')
    print('\nClassification Report:')
    print(report)
    
    # Visualize results
    visualize_results(df)

if __name__ == "__main__":
    main()  # Run the main function to execute the script.
