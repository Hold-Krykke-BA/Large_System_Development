# Large System Development - Exam Project

## Contributors
- _[Rúni Vedel Niclasen - cph-rn118](https://github.com/Runi-VN)_
- _[Camilla Jenny Valerius Staunstrup - cph-cs340](https://github.com/Castau)_  

**[Assignment Description and Requirements](https://github.com/Hold-Krykke-BA/Large_System_Development/blob/main/assignment2.pdf)**

## Diagrams
### Sequence Diagram
![image](https://github.com/Hold-Krykke-BA/Large_System_Development/blob/main/Diagrams/Sequence.PNG)

### NoSQL Documents
![image](https://github.com/Hold-Krykke-BA/Large_System_Development/blob/main/Diagrams/NoSQLducuments.PNG)


### System Overview
![image](https://github.com/Hold-Krykke-BA/Large_System_Development/blob/main/Diagrams/SystemOverview.PNG)

## Setup
Environment variables are required for this setup.  
If you are to run this project, you need to create a `.env` file in `Backend` and include the appropriate environment variables.  
If the file is already there in your copy of the project, just continue.  

1. `cd Backend`
2. `npm i`

The app entrypoint is in `app.ts`

## Running

1. `nodemon`
2. Access application endpoints through a program like Postman (_**the frontend is not finished or in a runnable state**_)

### Example application flow
The databases have had some base data added.

**Provided JSON login - teacher:**
```json
{
    "userID": "aoc@cphbusiness.dk",
    "password": "secret"
}
```

**Provided JSON login - student:**
```json
{
    "userID": "cs340@cphbusiness.dk",
    "password": "secret"
}
```

1. Login with your user of choice by sending a POST request to `localhost:3000/login`
2. Copy the token you receive as a response and create a new request to your endpoint of choice.
3. As an example, get all users by making a GET request to `localhost:3000/rolecall/users/all` with the header `Authorization: Bearer <Token>`.

Some routes are protected more than others, such as some being limited to teachers only.


### Endpoints

**All endpoints point to `localhost:3000`**

| URL     | METHOD | FORMAT               | PURPOSE     | LIMITS |
|---------|--------|----------------------|-------------|--------|
| /login/ | POST   | { userID, password } | Log in      |        |
| /       | GET    |                      | Hello World |        |

#### Attendance Check Routes
These routes are for the Attendance Check service - it serves CRUD operations for an Attendance Check.

| URL                              | METHOD | FORMAT                                | PURPOSE                                                                           | LIMITS                   |
|----------------------------------|--------|---------------------------------------|-----------------------------------------------------------------------------------|--------------------------|
| /rolecall/attendance/add         | POST   | { attendanceCheck, seconds, teacher } | Add a new attendanceCheck. Include teacher who created the check and its duration | isLoggedIn  isTeacher    |
| /rolecall/attendance/all         | GET    |                                       | Get all attendanceChecks                                                          | isLoggedIn  isTeacher    |
| /rolecall/attendance/{code}      | GET    | pathParam: attendanceCheckCode        | Get attendanceCheck by its code                                                   | isLoggedIn BelongsToUser |
| /rolecall/attendance/remove/{id} | DELETE | pathParam: id                         | Delete attendanceCheck by its ID                                                  | isLoggedIn  isTeacher    |
| /rolecall/attendance/addstudent  | PUT    | { studentID, code }                   | Add student to attendanceCheck by studentID and attendanceCheckCode               | isLoggedIn checkIP   |

#### Course Routes
These routes are for the Course service - it serves CRUD operations for a Course

| URL                              | METHOD | FORMAT              | PURPOSE                                                             | LIMITS                   |
|----------------------------------|--------|---------------------|---------------------------------------------------------------------|--------------------------|
| /rolecall/courses/add            | POST   | { Course }          | Add a new Course.                                                   | isLoggedIn  isTeacher    |
| /rolecall/courses/all            | GET    |                     | Get all Courses                                                     | isLoggedIn  isTeacher    |
| /rolecall/courses/{id}           | GET    | pathParam: courseID | Get Course by its ID                                                | isLoggedIn BelongsToUser |
| /rolecall/courses/remove/{id}    | DELETE | pathParam: courseID | Delete Course by its ID                                             | isLoggedIn  isTeacher    |

#### User Routes
These routes are for the User service - it serves CRUD operations for a User.

| URL                             | METHOD | FORMAT              | PURPOSE                                                             | LIMITS                   |
|---------------------------------|--------|---------------------|---------------------------------------------------------------------|--------------------------|
| /rolecall/users/add             | POST   | { User }            | Add a new User.                                                     | isLoggedIn  isTeacher    |
| /rolecall/users/all             | GET    |                     | Get all Users                                                       | isLoggedIn  isTeacher    |
| /rolecall/users/{id}            | GET    | pathParam: userID   | Get User by its ID                                                  | isLoggedIn BelongsToUser |
| /rolecall/users/remove/{id}     | DELETE | pathParam: userID   | Delete User by its ID                                               | isLoggedIn  isTeacher    |

#### Whitelist Routes
These routes are for the whitelist service - it serves CRUD operations for the Whitelist.

| URL                               | METHOD | FORMAT        | PURPOSE                  | LIMITS                       |
|-----------------------------------|--------|---------------|--------------------------|------------------------------|
| /rolecall/whitelist/              | GET    |               | Get whitelist            | isLoggedIn isTeacher checkIP |
| /rolecall/whitelist/addip         | PUT    | { ip }        | Add IP to the whitelist  | isLoggedIn  isTeacher        |
| /rolecall/whitelist/removeip/{ip} | DELETE | pathParam: IP | Delete IP from whitelist | isLoggedIn  isTeacher        |
