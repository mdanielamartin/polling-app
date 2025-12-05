# POLLING APP

The project presents the following features:

- User authentication (JWT tokens)
- Poll creation and voting system
- CRUD operations (Create, Read, Update, and Delete)
- Database management
- Data validation and feedback
- Email notifications & password reset via MailJet

It is a full-stack polling web application where users can create a password-protected account, create polls, share them via email, and allow others to vote. The app also includes secure password reset functionality using MailJet for email delivery.

The frontend is built with Next.js and TypeScript. State management is handled using Zustand, forms and data validation are managed with Yup and React Hook Form, and styling/dark mode is implemented with TailwindCSS and Flowbite React. The backend is built with Flask and PostgreSQL, using JWT-based authentication and MailJet for transactional emails.

## CHECK IT OUT

The app is currently live [HERE](https://polling-app-1yvh.onrender.com)

Notes:
It uses Render's free tier service; therefore, it may be necessary to wait for the app to wake up. Make sure your browser allows third-party cookies.

## DEVELOPMENT

Clone the repo
```
git clone https://github.com/mdanielamartin/polling-app.git
```
Navigate to the frontend directory
`cd frontend`

Install dependencies
`npm install`

Start development server
`npm run dev`

This is a Next.js project bootstrapped with create-next-app.
Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

Learn More

To learn more about Next.js, take a look at the following resources:

- Next.js Documentation
- Learn Next.js
- Next.js GitHub Repository

## BACKEND SETUP

Navigate to the backend directory
`cd backend`

(Optional) Create a virtual environment
```
conda create -n name python=3.11
conda activate name
or
python -m venv venv
or
source venv/bin/activate  (On Windows: venv\Scripts\activate)
```

Install dependencies
`pip install -r requirements.txt`

## DATABASE

Make sure PostgreSQL is installed and running.

ENVIRONMENT VARIABLES

Set environment variables for dev mode:
`cp .env.example .env`

Then update your .env file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/polling_app_db
MAIL_KEY=your_mailjet_api_key
MAIL_SECRET=your_mailjet_secret_key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## RUN THE SERVER
```
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```



