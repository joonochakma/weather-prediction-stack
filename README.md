AI-based Weather Analysis Machine Learning Project
Description
The aim of this Weather Analysis Machine Learning project is to understand and analyze weather patterns, including temperature variations, various weather types, rain probability, and heatwave detection. Accurate weather forecasts are crucial for decision-making across numerous sectors, such as agriculture, disaster preparedness, and event planning.

Objectives
Investigate Weather Datasets: Analyze historical weather data to uncover patterns and trends.
Predict Temperature Changes: Develop models to forecast future temperature fluctuations.
Assess Rain Likelihood: Create algorithms to estimate the probability of rainfall.
Classify Weather Conditions: Use machine learning techniques to categorize different weather types.
Identify Temperature Extremes: Detect and analyze heatwaves and other temperature anomalies.
Table of Contents
Installation
Data Preprocessing
Training and Visualization
Prediction
Acknowledgments
Installation
Use Conda for environment setup.

To create an environment:
bash
Copy code
conda create --name <my-env>
Replace <my-env> with the name of your environment. When conda asks you to proceed, type y:

bash
Copy code
proceed ([y]/n)?
This creates the <my-env> environment in /envs/. No packages will be installed in this environment.

To create an environment with a specific version of Python:
bash
Copy code
conda create -n myenv python=3.12.4
After creating the environment, install all required libraries:
bash
Copy code
pip install keras==3.5.0
pip install matplotlib==3.9.2
pip install numpy==1.26.4
pip install pandas==2.2.2
pip install plotly==5.24.1
pip install pydot==3.0.1
pip install scikit-learn==1.5.1
pip install scipy==1.14.1
pip install seaborn==0.13.2
pip install tensorflow==2.17.0
pip install h5py==3.11.0
Data Preprocessing
Scripts for preprocessing data:

rainfall_preprocess.py

bash
Copy code
python rainfall_preprocess.py
temperature_train_test.py

bash
Copy code
python temperature_train_test.py
weather_preprocess.py

bash
Copy code
python weather_preprocess.py
Training and Visualization
Scripts for training models and visualizing results:

temperature.py

bash
Copy code
python temperature.py
weather_conditions.py

bash
Copy code
python weather_conditions.py
rainfall_yes_no.py

bash
Copy code
python rainfall_yes_no.py
heatwave.py

bash
Copy code
python heatwave.py
Prediction
Scripts for making predictions:

temperature_prediction.py

bash
Copy code
python temperature_prediction.py
heatwave_prediction.py

bash
Copy code
python heatwave_prediction.py
rainfall_yes_no_prediction.py

bash
Copy code
python rainfall_yes_no_prediction.py
weather_prediction.py

bash
Copy code
python weather_prediction.py
Acknowledgments
Dhruv Patel
Joono Chakma
NIRACHORN BOONNOUL
