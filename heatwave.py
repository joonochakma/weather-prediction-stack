import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.ensemble import IsolationForest

# Load the data
data = pd.read_csv('rainfall/temperature_rainfall.csv', encoding='utf-8')

# Data preprocessing: Convert temperature columns to numeric
data['Minimum temperature (Degree C)'] = pd.to_numeric(data['Minimum temperature (Degree C)'], errors='coerce')
data['Maximum temperature (Degree C)'] = pd.to_numeric(data['Maximum temperature (Degree C)'], errors='coerce')

# Drop rows with missing values
data.dropna(inplace=True)

# Select features for clustering
features = data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]

# Scale the features using StandardScaler
scaler = StandardScaler()
data_scaled = scaler.fit_transform(features)

# Outlier detection using Isolation Forest
isolation_forest = IsolationForest(contamination=0.05, random_state=42)
outliers = isolation_forest.fit_predict(data_scaled)
print(f'Number of outliers detected: {np.sum(outliers == -1)}')

# Calculate the correlation matrix
corr = features.corr()

#data visualization
plt.figure(figsize=(10, 6))
plt.title('Temperature Distribution')
sns.histplot(data['Maximum temperature (Degree C)'], kde=True, bins=30)
plt.xlabel('Maximum Temperature (Degree C)')
plt.ylabel('Frequency')
plt.show()

# Plot the correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Heatmap')
plt.show()

# Define heatwave conditions (extreme temperatures over 3 consecutive days)
threshold_min = data['Minimum temperature (Degree C)'].quantile(0.90)
threshold_max = data['Maximum temperature (Degree C)'].quantile(0.90)

data['Heatwave'] = (
    (data['Minimum temperature (Degree C)'].rolling(window=3).mean() > threshold_min) &
    (data['Maximum temperature (Degree C)'].rolling(window=3).mean() > threshold_max)
).astype(int)

# Apply DBSCAN clustering
dbscan = DBSCAN(eps=0.5, min_samples=10)  
labels = dbscan.fit_predict(data_scaled)

# Add cluster labels to the data
data['Cluster'] = labels

# PCA for visualization
pca = PCA(n_components=2)
data_pca = pca.fit_transform(data_scaled)
data['PCA1'] = data_pca[:, 0]
data['PCA2'] = data_pca[:, 1]

# Plot the clusters
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data, x='PCA1', y='PCA2', hue='Cluster', palette='coolwarm', s=100)
plt.title('Clusters of Temperature Data with DBSCAN')
plt.show()

# Model evaluation: silhouette score 
silhouette_avg = silhouette_score(data_scaled, labels)
print(f'Silhouette Score: {silhouette_avg:.2f}')

# Check how well the clusters align with heatwave days
plt.figure(figsize=(10, 6))
sns.countplot(x='Cluster', hue='Heatwave', data=data, palette='coolwarm')
plt.title('Cluster Distribution of Heatwave Days')
plt.show()