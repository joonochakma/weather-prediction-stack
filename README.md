# DCA Weather Website

This repository contains a weather website with a Machine Learning backend and a React frontend. Follow these instructions to set up and run the application.


## Repository Structure

```
├── Machine_Learning/     # Backend ML server
│   ├── requirements.txt  # Python dependencies
│   └── ...
├── weather_website/      # Frontend React application
│   ├── package.json
│   └── ...
└── README.md
```

## Installation Steps

### 1. Setting up Machine Learning Backend


Navigate to Machine Learning directory
```bash
cd .\Machine_Learning\
```
Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Setting up Frontend

First, ensure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

To verify the installation:
```bash
npm --version
```
or
```bash
npm -v
```

Then proceed with frontend setup:

Navigate to weather website directory
```bash
cd .\weather_website\
```

Install Node dependencies
```bash
npm install
```

## Running the Application

1. Start the Backend Server:

From the Machine_Learning directory
```bash
fastapi dev
```

2. Start the Frontend Server:

From the weather_website directory
```bash
npm start
```

The website should automatically open in your default browser. If it doesn't, you can access it at `http://localhost:3000`.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are properly installed
2. Check if the required ports (backend and frontend) are not in use
3. Verify Node.js and Python are correctly installed and accessible from command line

## Acknowledgements
1. Dhruv Patel
2. Joono Chakma
3. NIRACHORN BOONNOUL
