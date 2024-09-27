import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

# Step 1: Prepare the dataset from the provided data
data = pd.read_csv('rainfall/temperature_rainfall.csv')
df = pd.DataFrame(data)

# Step 2: Data cleaning
df['Rainfall amount (millimetres)'] = df['Rainfall amount (millimetres)'].fillna(0)
df['Rainy'] = (df['Rainfall amount (millimetres)'] > 0).astype(int)  # 1 for rain, 0 for no rain

# Step 3: Feature engineering
df['Previous_Rainfall'] = df['Rainfall amount (millimetres)'].shift(1)  # Shift for previous day's rainfall

# Drop rows with NaN values created by shifting (first row)
df.dropna(inplace=True)

# Step 4: Select features and target
X = df[['Maximum temperature (Degree C)', 'Minimum temperature (Degree C)', 'Previous_Rainfall']]
y = df['Rainy']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Model selection and training
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Step 6: Get predicted probabilities
y_prob = model.predict_proba(X_test)  # Get probabilities for both classes

# Step 7: Determine predictions based on threshold and fill missing values
predictions_binary = [1 if prob[1] > 0.5 else 0 for prob in y_prob]  # Threshold of 50% for rain prediction
predictions_label = ['Y' if pred == 1 else 'N' for pred in predictions_binary]  # Map to 'Y'/'N'

# Step 8: Align predictions with the correct test indices and fill missing values
df_test_indices = X_test.index

# Ensure all labels are either 'Y' or 'N' and handle misalignments
df.loc[df_test_indices, 'Predicted_Rainy'] = predictions_label

# Fill any missing predictions with 'N' (no rain)
df['Predicted_Rainy'] = df['Predicted_Rainy'].fillna('N')

# Step 9: Add predicted probabilities to the DataFrame
df.loc[df_test_indices, 'Probability_of_Rain'] = [prob[1] for prob in y_prob]

# Step 10: Calculate metrics
accuracy = accuracy_score(y_test, predictions_binary)
report = classification_report(y_test, predictions_binary)

# Step 11: Save to a new CSV file
df.to_csv('rainfall/rainfall_predictions.csv', index=False)

# Step 12: Display metrics
print(f'\nAccuracy: {accuracy:.2f}')
print('\nClassification Report:')
print(report)

# Step 13: Visualization
# Plotting the actual vs predicted rainfall
plt.figure(figsize=(10, 4))

# Count plot for actual vs predicted
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
