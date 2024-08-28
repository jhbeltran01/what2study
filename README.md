# Django + React + Tailwind CSS Setup

This repository provides a basic setup for a Django backend with a React frontend styled using Tailwind CSS. This setup is ideal for building modern web applications where Django handles the backend and API, and React manages the frontend UI.

## Prerequisites

Make sure you have the following installed:

- **Python 3.x**
- **Node.js** (with npm)
- **pip** (Python package installer)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Set Up Django Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Set Up React Frontend with Tailwind CSS
```bash
cd ../frontend  # Adjust if your React app is in a different directory
npm install
npm run start
# open new terminal tab
npm run tailwind

