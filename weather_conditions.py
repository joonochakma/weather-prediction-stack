# Import necessary libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split, learning_curve
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def load_data(filepath):
    """Load the dataset from a CSV file."""
    data = pd.read_csv(filepath)
    return pd.DataFrame(data)

def preprocess_data(df):
    """Preprocess the dataset."""
    # Replace 'Calm' with 1 in the wind speed columns
    df['9am wind speed (km/h)'] = df['9am wind speed (km/h)'].replace('Calm', 1)
    df['3pm wind speed (km/h)'] = df['3pm wind speed (km/h)'].replace('Calm', 1)

    # Fill missing values with zero
    df.fillna(0, inplace=True)
    return df

def categorize_weather(row):
    """Categorize weather based on specific criteria."""
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
    """Add a new column for weather conditions."""
    df['WeatherCondition'] = df.apply(categorize_weather, axis=1)
    return df

def split_data(df):
    """Split the data into features and target."""
    X = df[['Minimum temperature (°C)', 'Maximum temperature (°C)', 
             'Rainfall (mm)', '9am Temperature (°C)', '9am relative humidity (%)', 
             '9am cloud amount (oktas)', '9am wind speed (km/h)', 
             '3pm Temperature (°C)', '3pm relative humidity (%)', 
             '3pm cloud amount (oktas)', '3pm wind speed (km/h)']]
    y = df['WeatherCondition']
    return X, y

def train_model(X, y):
    """Train a Random Forest Classifier."""
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    # Cross-validation
    cv_scores = cross_val_score(clf, X, y, cv=skf, scoring='accuracy')
    print("Cross-Validation Scores:", cv_scores)
    print("Mean Cross-Validation Accuracy:", cv_scores.mean())
    
    # Fit the model
    clf.fit(X, y)
    return clf

def evaluate_model(clf, X, y):
    """Evaluate the model's performance."""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Test set evaluation
    y_test_pred = clf.predict(X_test)
    print("Test Accuracy:", accuracy_score(y_test, y_test_pred))
    
    # Classification report
    print("Classification Test Report:")
    print(classification_report(y_test, y_test_pred))

    # Training accuracy
    train_accuracy = clf.score(X_train, y_train)
    print("Training Accuracy:", train_accuracy)

    return y_test, y_test_pred

def plot_confusion_matrix(y_test, y_test_pred, clf):
    """Plot the confusion matrix."""
    conf_matrix_test = confusion_matrix(y_test, y_test_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(conf_matrix_test, annot=True, fmt='d', cmap='Blues', xticklabels=clf.classes_, yticklabels=clf.classes_)
    plt.title('Confusion Matrix - Test Set')
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.show()

def plot_feature_importance(clf, feature_names):
    """Plot the feature importance."""
    importances = clf.feature_importances_
    feature_importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)

    plt.figure(figsize=(10, 6))
    sns.barplot(x='Importance', y='Feature', data=feature_importance_df)
    plt.title('Feature Importance in Weather Condition Prediction')
    plt.show()

def plot_learning_curve(clf, X, y):
    """Plot the learning curve."""
    train_sizes, train_scores, test_scores = learning_curve(clf, X, y, cv=5, n_jobs=-1,
                                                             train_sizes=np.linspace(0.1, 1.0, 10))
    train_scores_mean = train_scores.mean(axis=1)
    test_scores_mean = test_scores.mean(axis=1)

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
    # Load and preprocess data
    df = load_data('merged_data.csv')
    df = preprocess_data(df)
    df = add_weather_condition_column(df)

    # Split data
    X, y = split_data(df)

    # Train the model
    clf = train_model(X, y)

    # Evaluate the model
    y_test, y_test_pred = evaluate_model(clf, X, y)

    # Visualizations
    plot_confusion_matrix(y_test, y_test_pred, clf)
    plot_feature_importance(clf, X.columns)
    plot_learning_curve(clf, X, y)

if __name__ == "__main__":
    main()
