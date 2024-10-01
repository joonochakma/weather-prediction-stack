"""
Heatwave clustering
"""
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from scipy import stats
from sklearn.metrics import silhouette_score
import joblib


def load_data(file_path):
    """
    Load the temperature and rainfall data from a CSV file.
    
    Args:
        file_path (str): Path to the CSV file.
    
    Returns:
        pd.DataFrame: Loaded data as a DataFrame.
    """
    return pd.read_csv(file_path, encoding='utf-8')


def preprocess_data(data):
    """
    Preprocess the data by converting temperature columns to numeric,
    removing outliers, and dropping missing values.
    
    Args:
        data (pd.DataFrame): Raw data.
    
    Returns:
        pd.DataFrame: Cleaned data with outliers removed.
    """
    # Convert temperature columns to numeric values, coercing errors to NaN
    data['Minimum temperature (Degree C)'] = pd.to_numeric(data['Minimum temperature (Degree C)'], errors='coerce')
    data['Maximum temperature (Degree C)'] = pd.to_numeric(data['Maximum temperature (Degree C)'], errors='coerce')
    
    # Drop rows that contain any missing values to clean the dataset
    data.dropna(inplace=True)

    # Select the features of interest: minimum and maximum temperatures
    features = data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]
    
    # Scale the features to standardize the data for clustering
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(features)

    # Outlier detection using Z-scores
    z_scores = np.abs(stats.zscore(data_scaled))
    threshold = 3

    # Remove outliers from the dataset
    data_no_outliers = data[(z_scores < threshold).all(axis=1)]

    # Ensure all columns in the selected features are numeric
    for feature in features.columns:
        data_no_outliers.loc[:, feature] = pd.to_numeric(data_no_outliers[feature], errors='coerce')

    # Drop any rows that still contain NaN values in the selected features
    return data_no_outliers.dropna(subset=features.columns)


def visualize_distribution(data):
    """
    Visualize the distribution of maximum temperatures.
    
    Args:
        data (pd.DataFrame): Cleaned data with outliers removed.
    """
    plt.figure(figsize=(10, 6))
    plt.title('Temperature Distribution')
    sns.histplot(data['Maximum temperature (Degree C)'], kde=True, bins=30)
    plt.xlabel('Maximum Temperature (Degree C)')
    plt.ylabel('Frequency')
    plt.show()

def plot_correlation_heatmap(features):
    """
    Plot the correlation heatmap.

    Args:
        features (pd.DataFrame): DataFrame containing temperature features.
    """
    corr = features.corr()
    plt.figure(figsize=(12, 8))
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Heatmap')
    plt.show()


def define_heatwave_conditions(data):
    """
    Define heatwave conditions based on temperature thresholds.
    
    Args:
        data (pd.DataFrame): Cleaned data with outliers removed.
    
    Returns:
        pd.DataFrame: Data with heatwave conditions marked.
    """
    threshold_min = data['Minimum temperature (Degree C)'].quantile(0.90)  # 90th percentile for min temperature
    threshold_max = data['Maximum temperature (Degree C)'].quantile(0.90)  # 90th percentile for max temperature

    # Identify heatwave conditions for consecutive 3-day periods
    data['Heatwave'] = (
        (data['Minimum temperature (Degree C)'].rolling(window=3).mean() > threshold_min) &
        (data['Maximum temperature (Degree C)'].rolling(window=3).mean() > threshold_max)
    ).astype(int)  # Mark as 1 for heatwave conditions, otherwise 0
    
    return data


def apply_kmeans_clustering(data):
    """
    Apply KMeans clustering to the temperature data.
    
    Args:
        data (pd.DataFrame): Data with temperature features.
    
    Returns:
        pd.DataFrame: Data with cluster labels added.
    """
    X = data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]
    
    # Apply KMeans clustering to the selected features
    kmeans = KMeans(n_clusters=2, random_state=42)  # Using 2 clusters for simplicity
    labels = kmeans.fit_predict(X)  # Fit the model and predict cluster labels

    # Add the cluster labels to the DataFrame for further analysis
    data['Cluster'] = labels

    # Save the KMeans model to a file
    joblib.dump(kmeans, 'model/heatwave_model.joblib')  
    
    return data


def visualize_clusters(data):
    """
    Visualize the clusters in PCA-reduced feature space.
    
    Args:
        data (pd.DataFrame): Data with PCA components and cluster labels.
    """
    # Perform PCA for dimensionality reduction
    pca = PCA(n_components=2)
    data_pca = pca.fit_transform(data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']])
    
    # Add PCA components to the DataFrame for visualization
    data['PCA1'] = data_pca[:, 0]
    data['PCA2'] = data_pca[:, 1]

    # Plot the clusters in the PCA-reduced feature space
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=data, x='PCA1', y='PCA2', hue='Cluster', palette='coolwarm', s=100)
    plt.title('Clusters of Temperature Data')
    plt.show()


def evaluate_clustering(data):
    """
    Evaluate the clustering performance using silhouette score.
    
    Args:
        data (pd.DataFrame): Data with cluster labels.
    
    Returns:
        float: Silhouette score for the clustering.
    """
    X = data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]
    labels = data['Cluster']
    sil_score = silhouette_score(X, labels)
    
    print(f'Silhouette Score for KMeans Clustering: {sil_score:.2f}')  # Print the silhouette score
    return sil_score


def visualize_heatwave_distribution(data):
    """
    Visualize the distribution of heatwave days across different clusters.
    
    Args:
        data (pd.DataFrame): Data with heatwave conditions and cluster labels.
    """
    plt.figure(figsize=(10, 6))
    sns.countplot(x='Cluster', hue='Heatwave', data=data, palette='coolwarm')
    plt.title('Cluster Distribution of Heatwave Days')
    plt.show()


def main():
    """
    Main function to execute the data processing and analysis workflow.
    """
    # Load data
    data = load_data('rainfall/temperature_rainfall.csv')
    
    # Preprocess data
    data_no_outliers = preprocess_data(data)
    
    # Visualize data distribution
    visualize_distribution(data_no_outliers)
    # Plot the correlation heatmap
    plot_correlation_heatmap(data_no_outliers)
    
    # Define heatwave conditions
    data_no_outliers = define_heatwave_conditions(data_no_outliers)
    
    # Apply KMeans clustering
    data_no_outliers = apply_kmeans_clustering(data_no_outliers)
    
    # Visualize clusters
    visualize_clusters(data_no_outliers)
    
    # Evaluate clustering
    evaluate_clustering(data_no_outliers)
    
    # Visualize heatwave distribution
    visualize_heatwave_distribution(data_no_outliers)


if __name__ == "__main__":
    main()
