# User_API

## Setup
- Do an npm i to install the dpendencies
- Also, in the mongoose.connect('local database link') in app.js file, replace the given databse link with your own local database link

## Description

- The swagger documentation could be found at http://localhost:8000/api-docs/
- The API consist of 4 endpoints
  * /users - for showing all the users present in the database
  * /users/newUser - to create a new User
  * /users/transfer - to transfer requested amount from one user to other user
  * /users/{userId} - to view balance and details about specified user
