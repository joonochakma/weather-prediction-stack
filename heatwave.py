import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from scipy import stats
from sklearn.metrics import silhouette_score

data = pd.read_csv('temperature.csv', encoding='utf-8')

#data preprocessing
#convert temperature columns to numeric
data['Minimum temperature (Degree C)'] = pd.to_numeric(data['Minimum temperature (Degree C)'], errors='coerce')
data['Maximum temperature (Degree C)'] = pd.to_numeric(data['Maximum temperature (Degree C)'], errors='coerce')

#drop rows with missing values
data.dropna(inplace=True)

#select features
features = data[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]

print(features.head())

#scale the features
scaler = StandardScaler()
data_scaled = scaler.fit_transform(features)

#outlier detection
z_scores = np.abs(stats.zscore(data_scaled))
threshold = 3
outliers = np.where(z_scores > threshold)
print('Outliers:', outliers)

data_no_outliers = data[(z_scores < threshold).all(axis=1)]

features = [
    'Minimum temperature (Degree C)',
    'Maximum temperature (Degree C)',
]

print("Cleaned Features list:", features)
print("Cleaned column names:", data_no_outliers.columns.tolist())

# Ensure all columns in 'features' are numeric
for feature in features:
    data_no_outliers.loc[:, feature] = pd.to_numeric(data_no_outliers[feature], errors='coerce')

# Check for any NaN values in the features and drop them
data_no_outliers = data_no_outliers.dropna(subset=features)

print("Data shape after dropping NaN values:", data_no_outliers.shape)

# Now calculate the correlation matrix
corr = data_no_outliers[features].corr()

#data visualization
plt.figure(figsize=(10, 6))
plt.title('Temperature Distribution')
sns.histplot(data_no_outliers['Maximum temperature (Degree C)'], kde=True, bins=30)
plt.xlabel('Maximum Temperature (Degree C)')
plt.ylabel('Frequency')
plt.show()

# Correlation heatmap
plt.figure(figsize=(12, 8))
corr = data_no_outliers[features].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Heatmap')
plt.show()

#define heatwave conditions
# heatwave is defined as three or more consecutive days where maximum and minimum temperatures are unusually high.
threshold_min = data_no_outliers['Minimum temperature (Degree C)'].quantile(0.90)
threshold_max = data_no_outliers['Maximum temperature (Degree C)'].quantile(0.90)

# Identify heatwave conditions for consecutive 3-day periods
data_no_outliers['Heatwave'] = (
    (data_no_outliers['Minimum temperature (Degree C)'].rolling(window=3).mean() > threshold_min) &
    (data_no_outliers['Maximum temperature (Degree C)'].rolling(window=3).mean() > threshold_max)
).astype(int)

#select features
X = data_no_outliers[['Minimum temperature (Degree C)', 'Maximum temperature (Degree C)']]

#Apply KMeans clustering
kmeans = KMeans(n_clusters=2, random_state=42)
labels = kmeans.fit_predict(X)

#add cluster labels to the data
data_no_outliers['Cluster'] = labels

#PCA for visualization
pca = PCA(n_components=2)
data_pca = pca.fit_transform(X)
data_no_outliers['PCA1'] = data_pca[:, 0]
data_no_outliers['PCA2'] = data_pca[:, 1]

#plot the clusters
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data_no_outliers, x='PCA1', y='PCA2', hue='Cluster', palette='coolwarm', s=100)
plt.title('Clusters of Temperature Data')
plt.show()

#Model evaluation
sil_score = silhouette_score(X, labels)
print(f'Silhouette Score for KMeans Clustering: {sil_score:.2f}')

# Check how well the clusters align with heatwave days
plt.figure(figsize=(10, 6))
sns.countplot(x='Cluster', hue='Heatwave', data=data_no_outliers, palette='coolwarm')
plt.title('Cluster Distribution of Heatwave Days')
plt.show()