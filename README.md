# Application for self-monitoring

## Description
This is a web application where users can keep track on their daily behavior. Users can add reports twice a day and both reports contain a bit different metrics.


## Creating databases
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE TABLE reports (
id INTEGER,
date DATE DEFAULT CURRENT_DATE,
sleepDuration REAL,
sleepQuality INTEGER,
mood INTEGER,
sportsTime REAL,
studyTime REAL,
eating INTEGER
);


## Running application
Application can be run locally in Linux with the command `deno run --allow-net --allow-env --allow-read --unstable app.js` and the database variables must be given in the config.js. After that the application is available at http://localhost:7777


## How to use
Root path `/` shows user a landing page which shortly describes the application. There are also links to all the other pages of the application and a overview of users' general mood for today and yesterday. If there are not any reports the mood is shown as 0. Non registered users can only access the landing page, API endpoints and login and registration forms.

Registration form is accessible under the path `/auth/register` where the form asks for email and password. After registration users can log in under the path `/auth/login`. If a logged in user fills the login form succesfully they will be logged in with the new account.

Logged in users can also add new reports for themselves under the path `/behavior/reporting`. When adding new reports users can choose whether they want to add a morning or evening report. Only one morning and one evening report can be added each day and if a new one is added, the old one will be replaced.

Under the path `/behavior/summary` authenticated users can see a overview of their reports. The page shows averages for sleep duration, time spent on sports and exercise, time spent on studying, quality of sleep and generic mood for the past 7 and 30 days. The averages are shown only if at least one morning one one evening report during the period exist. The times cannot be changed.

Each page has a link back to the landing page and a log out button.


## API endpoints
The application provides two endpoints. Endpoint `/api/summary` provides a JSON document with all users' average sleep duration, time spent on sports and exercise, time spent studying, sleep quality, and generic mood averaged over the last 7 days. Endpoint `/api/summary/:year/:month/:day` provides a JSON document with all users' average sleep duration, time spent on sports and exercise, time spent studying, sleep quality, and generic mood for the given day.
