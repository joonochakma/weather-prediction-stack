"""
This code implements a weather classification model using a Random Forest classifier based on various meteorological features.
"""


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split, learning_curve
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib  

def load_data(filepath):
    """
    Load the dataset from a CSV file.

    Args:
        filepath (str): The file path to the CSV file.
    
    Returns:
        DataFrame: A pandas DataFrame containing the loaded data.
    """
    data = pd.read_csv(filepath)
    return pd.DataFrame(data)

def preprocess_data(df):
    """
    Preprocess the dataset by handling missing values and modifying specific columns.

    Args:
        df (DataFrame): The pandas DataFrame containing the raw weather data.
    
    Returns:
        DataFrame: The preprocessed DataFrame with cleaned data.
    """
    # Replace 'Calm' with 1 in wind speed columns
    df['9am wind speed (km/h)'] = df['9am wind speed (km/h)'].replace('Calm', 1)
    df['3pm wind speed (km/h)'] = df['3pm wind speed (km/h)'].replace('Calm', 1)

    # Fill missing values with zero
    df.fillna(0, inplace=True)
    return df

def categorize_weather(row):
    """
    Categorize weather based on various conditions (Rainy, Stormy, Cloudy, Hot, Sunny).

    Args:
        row (Series): A row of the DataFrame representing a single weather observation.
    
    Returns:
        str: A string representing the categorized weather condition.
    """
    if row['Rainfall (mm)'] > 0:
        return 'Rainy'
    elif (row['9am cloud amount (oktas)'] > 5 and row['Speed of maximum wind gust (km/h)'] > 40) or \
         (row['3pm cloud amount (oktas)'] > 5 and row['Speed of maximum wind gust (km/h)'] > 40):
        return 'Stormy'
    elif (row['9am cloud amount (oktas)'] > 5) or (row['3pm cloud amount (oktas)'] > 5):
        return 'Cloudy'
    elif row['9am Temperature (°C)'] > 25 or row['3pm Temperature (°C)'] > 25:
        return 'Hot'
    else:
        return 'Sunny'

def add_weather_condition_column(df):
    """
    Add a new column to the DataFrame for weather conditions based on existing features.

    Args:
        df (DataFrame): The pandas DataFrame containing weather data.
    
    Returns:
        DataFrame: The DataFrame with a new column 'WeatherCondition'.
    """
    df['WeatherCondition'] = df.apply(categorize_weather, axis=1)
    return df

def split_data(df):
    """
    Split the data into features (X) and target (y).

    Args:
        df (DataFrame): The pandas DataFrame with preprocessed data.
    
    Returns:
        X (DataFrame): The feature matrix.
        y (Series): The target variable ('WeatherCondition').
    """
    X = df[['Minimum temperature (°C)', 'Maximum temperature (°C)', 
             'Rainfall (mm)', '9am Temperature (°C)', '9am relative humidity (%)', 
             '9am cloud amount (oktas)', '9am wind speed (km/h)', 
             '3pm Temperature (°C)', '3pm relative humidity (%)', 
             '3pm cloud amount (oktas)', '3pm wind speed (km/h)']]
    y = df['WeatherCondition']
    return X, y

def train_model(X, y):
    """
    Train a Random Forest Classifier and perform cross-validation.

    Args:
        X (DataFrame): The feature matrix.
        y (Series): The target variable representing weather conditions.
    
    Returns:
        clf (RandomForestClassifier): The trained classifier.
    """
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Stratified K-Folds cross-validator for balanced splits
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    # Perform cross-validation and print scores
    cv_scores = cross_val_score(clf, X, y, cv=skf, scoring='accuracy')
    print("Cross-Validation Scores:", cv_scores)
    print("Mean Cross-Validation Accuracy:", cv_scores.mean())
    
    # Fit the model to the entire dataset
    clf.fit(X, y)
    
    # Save the model to a file
    joblib.dump(clf, 'model/weather_classifier_model.joblib')
     
    return clf

def evaluate_model(clf, X, y):
    """
    Evaluate the trained model on the test set.

    Args:
        clf (RandomForestClassifier): The trained classifier.
        X (DataFrame): The feature matrix.
        y (Series): The target variable representing weather conditions.
    
    Returns:
        y_test (Series): True labels for the test set.
        y_test_pred (Series): Predicted labels for the test set.
    """
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Predict on the test set
    y_test_pred = clf.predict(X_test)
    
    # Evaluate test accuracy and print classification report
    print("Test Accuracy:", accuracy_score(y_test, y_test_pred))
    print("Classification Test Report:")
    print(classification_report(y_test, y_test_pred))

    # Calculate training accuracy
    train_accuracy = clf.score(X_train, y_train)
    print("Training Accuracy:", train_accuracy)

    return y_test, y_test_pred

def plot_confusion_matrix(y_test, y_test_pred, clf):
    """
    Plot the confusion matrix for model predictions.

    Args:
        y_test (Series): True labels for the test set.
        y_test_pred (Series): Predicted labels for the test set.
        clf (RandomForestClassifier): The trained classifier.
    """
    conf_matrix_test = confusion_matrix(y_test, y_test_pred)
    
    # Plot confusion matrix using a heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(conf_matrix_test, annot=True, fmt='d', cmap='Blues', xticklabels=clf.classes_, yticklabels=clf.classes_)
    plt.title('Confusion Matrix - Test Set')
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.show()

def plot_feature_importance(clf, feature_names):
    """
    Plot the feature importance for the Random Forest model.

    Args:
        clf (RandomForestClassifier): The trained classifier.
        feature_names (list): List of feature names.
    """
    importances = clf.feature_importances_
    
    # Create a DataFrame to store features and their importance scores
    feature_importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)

    # Plot feature importance using a bar chart
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Importance', y='Feature', data=feature_importance_df)
    plt.title('Feature Importance in Weather Condition Prediction')
    plt.show()

def plot_learning_curve(clf, X, y):
    """
    Plot the learning curve for the model to analyze bias and variance.

    Args:
        clf (RandomForestClassifier): The trained classifier.
        X (DataFrame): The feature matrix.
        y (Series): The target variable representing weather conditions.
    """
    # Compute learning curve data
    train_sizes, train_scores, test_scores = learning_curve(clf, X, y, cv=5, n_jobs=-1, train_sizes=np.linspace(0.1, 1.0, 10))
    
    # Calculate mean scores for training and validation sets
    train_scores_mean = train_scores.mean(axis=1)
    test_scores_mean = test_scores.mean(axis=1)

    # Plot the learning curve
    plt.figure(figsize=(10, 6))
    plt.plot(train_sizes, train_scores_mean, label='Training Score', color='blue')
    plt.plot(train_sizes, test_scores_mean, label='Cross-Validation Score', color='green')
    plt.title('Learning Curve')
    plt.xlabel('Training Size')
    plt.ylabel('Score')
    plt.legend(loc='best')
    plt.grid()
    plt.show()

def main():
    """
    Main function to load data, preprocess it, train the model, and evaluate its performance.
    """
    # Load and preprocess the dataset
    df = load_data('weather/merged_weather_data.csv')
    df = preprocess_data(df)
    df = add_weather_condition_column(df)

    # Split the data into features and target
    X, y = split_data(df)

    # Train the Random Forest model
    clf = train_model(X, y)

    # Evaluate the model and plot results
    y_test, y_test_pred = evaluate_model(clf, X, y)
    plot_confusion_matrix(y_test, y_test_pred, clf)
    plot_feature_importance(clf, X.columns)
    plot_learning_curve(clf, X, y)

if __name__ == "__main__":
    main()
