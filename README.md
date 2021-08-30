# Snack Overflow

Snack Overflow is a website for foodies to ask food related questions and get answers/advice from strangers. Snack Overflow can be accessed at: https://snack-overflow-aa.herokuapp.com/

## Run Development App
* You can read more about the project using the wiki located at: https://github.com/boromeot/snack-overflow/wiki
* To start a development environment:
    1. Clone the repository at: https://github.com/boromeot/snack-overflow.git
    2. Run the command "npm install" from the project root folder in your terminal to install dependencies
    3. Run the command "npm start" from the project root folder to launch the server
    4. Navigate to http://localhost:8080

## Technologies Used
* Javascript
* HTML/CSS
* Node.js
* Express
* Postgres
* Sequelize
* Pug
* Heroku
* Git

##  Features
* Users
    * Users are able to create an account, login/logout, and perform different CRUD functionality in regards to their snack posts.
* Questions/Answers
    * Authenticated users are able to ask a question about a snack. 
    * Users can also answer someone's question.
    * Users can delete or edit their question after it has been posted.
* Comments
    * Users are able to leave comments on questions or answers. This function is for discussion without directly answering a question. 
* Upvotes/Downvotes
    * Authenticated users are able to upvote or downvote other users' questions. Votes are shown on all questions
* Functioning Search
    * Users are able to type into the search bar and relevant posts for that topic appear.
* Security
    * Bcrypt hashing was implemented for proper password security
    * Csurf middelware protection was implemented to prevent Cross-Site Request Forgeries.

## Database Schema

![](https://github.com/boromeot/snack-overflow/blob/main/public/snackoverflow_dbschema.png)

## Team Members
* [Steven Barnett](https://github.com/StevenBarnett1)
* [Kekoa Boromeo](https://github.com/boromeot)
* [Vazha Chiaberashvili](https://github.com/Vazhac) 
* [Andres Echeverri](https://github.com/a-echeverri)
