# What2Study

What2Study is a collaborative web application designed to help users create and share study materials. The platform enables users to work together to build comprehensive reviewers and educational resources. Additionally, users can join or create study groups, fostering a collaborative learning environment where they can share insights, discuss topics, and support each other in their learning journey.

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

