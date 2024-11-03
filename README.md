# Weather Application

This repository contains a weather application with a Machine Learning backend and a React frontend. Follow these instructions to set up and run the application.

## Prerequisites

- Python 3.x
- Node.js and npm
- Git

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

```bash
# Navigate to Machine Learning directory
cd Machine_Learning/

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Setting up Frontend

First, ensure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

To verify the installation:
```bash
npm --version  # or npm -v
```

Then proceed with frontend setup:
```bash
# Navigate to weather website directory
cd weather_website/

# Install Node dependencies
npm install
```

## Running the Application

1. Start the Backend Server:
```bash
# From the Machine_Learning directory
fastapi dev
```

2. Start the Frontend Server:
```bash
# From the weather_website directory
npm start
```

The website should automatically open in your default browser. If it doesn't, you can access it at `http://localhost:3000`.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are properly installed
2. Check if the required ports (backend and frontend) are not in use
3. Verify Node.js and Python are correctly installed and accessible from command line

## Support

For any additional help or issues, please open an issue in the repository.
