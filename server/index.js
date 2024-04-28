require('dotenv').config();

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const { Pool } = require('pg')

// Connect to databas
// Not using .env file because hosting online
const db = new Pool({
  connectionLimit: 100,
  host: 'comcv9gl6cac73d5f350-a.oregon-postgres.render.com',
  user: 'universitycoursehelperrenderdatabase_user',
  password: 's8tMXDHZjkDtkxaBaDpoETzqhwkAwtzx',
  database: 'universitycoursehelperrenderdatabase',
  port: '5432',
  ssl: {
      rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Moderator Account ----------------------------------------------
// -------------------------------------------------------------------------------------------------------------------


// Setting up for bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 1.1 Create account
// Allow users to create a account
app.post("/api/user", (req, res) => {
    encryptCreate(req, res)
});

// Creating seperate function to use await for bycrypt
async function encryptCreate(req, res){
    const username = req.body.username
    const password = req.body.password

    const encryptedPassword = await bcrypt.hash(password, saltRounds)

    const sqlInsert = "INSERT INTO MODERATOR_ACCOUNT (username, password) VALUES ($1,$2)"
    db.query(sqlInsert, [username, encryptedPassword], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error creating Account"
            });
        } else res.send(result)
    });
}

// 1.2 Edit Account 
// User has the ability to edit/update account information.
app.put("/api/user/:username", (req, res) => {
    encryptEdit(req, res)
});

// Creating seperate function to use await for bycrypt
async function encryptEdit(req, res){
    const currentUsername = req.params.username
    const newUsername = req.body.newUsername
    const newPassword = req.body.newPassword

    const encryptedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Deal with case of user entering same username they already had
    if(newUsername != currentUsername){
        const sqlInsert = "UPDATE MODERATOR_ACCOUNT AS a SET a.password=$1, a.username=$2 WHERE a.username=$3"
        db.query(sqlInsert, [encryptedNewPassword, newUsername, currentUsername], (err, result) => {
            if (err) {
                res.status(500).send({
                    message: "Error when updating Account"
                });
            } else res.send(result)
        })
    }
    //deal with case of user entering new username
    else{
        const sqlInsert = "UPDATE MODERATOR_ACCOUNT AS a SET a.password=$1 WHERE a.username=$2"
        db.query(sqlInsert, [encryptedNewPassword, currentUsername], (err, result) => {
            if (err) {
                res.status(500).send({
                    message: "Error when updating Account with Username " + currentUsername
                });
            } else res.send(result)
        })
    }
}

// 1.3 Verify Account
// Find whether the password entered is correct for the corresponding username
app.get("/api/user/:username/:password", (req, res) => {
    const username = req.params.username
    const password = req.params.password
    const sqlSelect = "SELECT a.password FROM MODERATOR_ACCOUNT AS a WHERE a.username = $1"
    db.query(sqlSelect, [username], async function (err, result) { //creating seperate function to use await for bycrypt
        if (err) {
            res.status(500).send({
                message: "Error when verifying Account"
            });
            return;
        }

        // Username is not in database, resulting in no password being retrived so check is false
        let hasPassword = true
        try{
            result.rows[0].password == null
        }
        catch{
            hasPassword = false
            res.send(false)
        }

        // If username was in database check if corresponding password matches
        if(hasPassword == true){
            const Check = await bcrypt.compare(password, result.rows[0].password)
            res.send(Check)
        }
    });
})

// 1.4 Check for existing username
// Check if a username is already in the database
app.get("/api/user/:username", (req, res) => {
    const username = req.params.username
    const sqlSelect = "SELECT username FROM MODERATOR_ACCOUNT WHERE username=$1"

    db.query(sqlSelect, [username], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when checking Username"
            });
            return
        } 
        // Return true if a result is found
        if (result.rows.length > 0) {
            res.send(true)
            return
        } else {
            res.send(false)
            return
        }
    })
})

// ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Course --------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

// 2.1 List Courses
// View a list of all courses
app.get("/api/courseList", (req, res) => {
    const sqlSelect = "SELECT course_name FROM COURSE"
    db.query(sqlSelect, (err, result) => {
        if (err) {
          res.status(500).send({
            message: "Error when fetching semester information"
          });
        } else {
          res.send(result)
        }
    });
})

// 2.2 View Course Info
// View information for a specific course
app.get("/api/courseInfo/:course_name", (req, res) => {
    const course_name = req.params.course_name
    const sqlSelect = "SELECT * FROM COURSE as c WHERE c.course_name = $1"
    db.query(sqlSelect, [course_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching course information"
            });
        } else res.send(result)
    });
})

// 2.3 View Course -> Semester Info
// View information about the semester where the given course was offered
app.get("/api/courseInfo/:course_name/semester", (req, res) => {
    const course_name = req.params.Course_name
    const sqlSelect = (
        "SELECT s.sem_start_year, s.sem_start_term, s.duration " + 
        "FROM SEMESTER AS s " +
        "WHERE s.course_name = $1 " +
        "ORDER BY s.sem_start_year DESC, s.ordering DESC")
    db.query(sqlSelect, [course_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching semester information"
            });
        } else res.send(result)
    });
})

// 2.4 View Course -> Semester -> Prof Info
// View information about the professors that taught the given course in the given semester
app.get("/api/courseInfo/:course_name/:sem_start_year/:sem_start_term/professor", (req, res) => {
    const course_name = req.params.Course_name
    const sem_start_year = req.params.Sem_start_year
    const sem_start_term = req.params.Sem_start_term
    const sqlSelect = (
        "SELECT o.mode_of_delivery, o.syllabus_link, p.prof_name, p.prof_rating, p.rate_my_professor_link " + 
        "FROM OFFERED_IN as o NATURAL JOIN PROFESSOR as p " + 
        "WHERE o.course_name = $1 and o.sem_start_year = $2 and o.sem_start_term = $3 and " +
        "o.prof_name = p.prof_name ")
    db.query(sqlSelect, [course_name, sem_start_year, sem_start_term], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching professor information"
            });
        } else res.send(result)
    });
})

// 2.5 View Course -> Required For
// View which degrees the given course is required for
app.get("/api/courseInfo/:course_name/degreeRequired", (req, res) => {
    const course_name = req.params.Course_name
    const sqlSelect = (
        "SELECT r.degree_name " + 
        "FROM REQUIRED_FOR AS r " + 
        "WHERE r.course_name = $1" )
    db.query(sqlSelect, [course_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching required degree information"
            });
        } else res.send(result)
    });
})

// 2.6 View Course -> Optional For
// View which degrees the given course is optional for
app.get("/api/courseInfo/:course_name/degreeOptional", (req, res) => {
    const course_name = req.params.Course_name
    const sqlSelect = (
        "SELECT o.degree_name " + 
        "FROM OPTIONAL_FOR as o " + 
        "WHERE o.course_name = $1" )
    db.query(sqlSelect, [course_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching optional degree information"
            });
        } else res.send(result)
    });
})

// ---------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Professor --------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

// 3.1 List of Professors
// View a list of all professors
app.get("/api/profList", (req, res) => {
    const sqlSelect = "SELECT prof_name FROM PROFESSOR"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching professors"
            });
        } else res.send(result)
    });
})

// 3.2 View specific professor information
// View information for a specific professor
app.get("/api/profInfo/:prof_name", (req, res) => {
    const prof_name = req.params.prof_name
    const sqlSelect = "SELECT * FROM PROFESSOR AS p WHERE p.prof_name = $1" 
    db.query(sqlSelect, [prof_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching professor information"
            });
        } else res.send(result)
    });
})

// 3.3 View Professor -> Courses
// View which courses were taught by a specific professor
app.get("/api/profInfo/:prof_name/courses", (req, res) => {
    const prof_name = req.params.prof_name
    const sqlSelect = (
        "SELECT DISTINCT o.course_name " + 
        "FROM OFFERED_IN AS o NATURAL JOIN PROFESSOR AS p " + 
        "WHERE p.prof_name = $1")
    db.query(sqlSelect, [prof_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching course information"
            });
        } else res.send(result)
    });
})

// ---------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Degrees --------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

// 4.1 List Degrees Major
// View a list of all major degrees
app.get("/api/degreeList/major", (req, res) => {
    const sqlSelect = "SELECT d.degree_name FROM DEGREE as d WHERE d.flag = 1"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching major degrees"
            });
        } else res.send(result)
    });
})

// 4.2 List Degrees Minor
// View a list of all minor degrees
app.get("/api/degreeList/minor", (req, res) => {
    const sqlSelect = "SELECT d.degree_name FROM DEGREE as d WHERE d.flag = 2"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching minor degrees"
            });
        } else res.send(result)
    });
})

// 4.3 List Degrees Other
// View a list of all other degrees
app.get("/api/degreeList/other", (req, res) => {
    const sqlSelect = "SELECT d.degree_name FROM DEGREE as d WHERE d.flag = 3"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching other degrees"
            });
        } else res.send(result)
    });
})

// 4.4 View Specific Degree Information
// View information for a specific degree
app.get("/api/degreeInfo/:degree_name", (req, res) => {
    const degree_name = req.params.degree_name
    const sqlSelect = "SELECT * FROM DEGREE AS d WHERE d.degree_name = $1" 
    db.query(sqlSelect, [degree_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching degree information"
            });
        } else res.send(result)
    });
})

// 4.5 View Degree -> Required Courses
// View required courses for a specific degree
app.get("/api/degreeInfo/:degree_name/coursesRequired", (req, res) => {
    const degree_name = req.params.degree_name
    const sqlSelect = (
        "SELECT r.course_name " +
        "FROM REQUIRED_FOR AS r NATURAL JOIN DEGREE as d " +
        "WHERE d.degree_name = $1" )
    db.query(sqlSelect, [degree_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching course information"
            });
        } else res.send(result)
    });
})

// 4.6 View Degree -> Optional Courses
// View optional courses for a specific degree
app.get("/api/degreeInfo/:degree_name/coursesOptional", (req, res) => {
    const degree_name = req.params.degree_name
    const sqlSelect = (
        "SELECT o.course_name " +
        "FROM OPTIONAL_FOR AS o NATURAL JOIN DEGREE as d " +
        "WHERE d.degree_name = $1" )
    db.query(sqlSelect, [degree_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching optional courses"
            });
        } else res.send(result)
    });
})

// ---------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Rating -----------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

// 5.1 View Course -> Ratings
// View a list of ratings for a specific course
app.get("/api/rating/:course_name", (req, res) => {
    const course_name = req.params.course_name
    const sqlSelect = (
        "SELECT r.rating_id, r.comment, r.score, r.rating_date, r.username " +
        "FROM RATING as r " +
        "WHERE r.course_name = $1" )
    db.query(sqlSelect, [course_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching ratings"
            });
        } else res.send(result)
    });
})

// 5.2 Create Rating 
// Create a rating
app.post("/api/rating/:course_name", (req, res) => {
    const comment = req.body.comment
    const score = req.body.score
    const rating_date = req.body.rating_date
    const username = req.body.username
    const course_name = req.params.course_name

    const sqlInsert = "INSERT INTO RATING (comment, score, rating_date, username, course_name) VALUES ($1,$2,$3,$4,$5)"
    db.query(sqlInsert, [comment, score, rating_date, username, course_name], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when creating rating"
            });
        } else res.send(result)
    });
});

// 5.3 Edit Rating
// Edit/modify a accounts own ratings
app.put("/api/rating/:rating_id", (req, res) => {
    const rating_id = req.params.rating_id
    const username = req.body.username
    const comment = req.body.comment
    const score = req.body.score
    const rating_date = req.body.rating_date

    const sqlInsert = 
        ("UPDATE RATING AS r " + 
        "SET r.comment=$1, r.score=$2, r.rating_date=$3 " + 
        "WHERE r.rating_id=$4 AND r.username=$5")

    db.query(sqlInsert, [comment, score, rating_date, rating_id, username], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when updating rating"
            });
        } else res.send(result)
    });
});


// 5.4 Delete Rating
// Delete a rating 
app.delete("/api/rating/:rating_id", (req, res) => {
    const rating_id = req.params.rating_id
    const sqlDelete = "DELETE FROM RATING WHERE rating_id = $1"
    db.query(sqlDelete, [rating_id], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when deleting rating"
            });
        } else res.send(result)
    });
})

// ---------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Report -----------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

// 6.1 List Reports
// View a list of all reports
app.get("/api/reportList", (req, res) => {
    const sqlSelect = "SELECT report_id, report_date FROM REPORT"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching reports"
            });
        } else res.send(result)
    });
})

// 6.2 View Specific Report
// View information about a specific report
app.get("/api/reportInfo/:report_id", (req, res) => {
    const report_id = req.params.report_id
    const sqlSelect = "SELECT * FROM REPORT WHERE report_id=$1"
    db.query(sqlSelect, [report_id], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching report information"
            });
        } else res.send(result)
    });
})

// 6.3 View Report -> Rating
// View information for the specific rating the report pertains to
app.get("/api/reportInfo/:report_id/rating", (req, res) => {
    const report_id = req.params.report_id
    const sqlSelect = "SELECT rt.rating_id, rt.comment, rt.score, rt.rating_date, rt.username, rt.course_name " + 
        "FROM REPORT AS rp NATURAL JOIN RATING AS rt " + 
        "WHERE rp.report_id=$1"
    db.query(sqlSelect, [report_id], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when fetching rating information"
            });
        } else res.send(result)
    });
})

// 6.4 Create Report
// Create a report for inappropriate comments
app.post("/api/reportInfo", (req, res) => {
    const reason = req.body.reason
    const report_date = req.body.report_date
    const rating_id = req.body.rating_id
    
    const sqlInsert = "INSERT INTO REPORT (reason, report_date, rating_id) VALUES ($1,$2,$3)"
    db.query(sqlInsert, [reason, report_date, rating_id], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when creating report"
            });
        } else res.send(result)
    });
});

// 6.5 Delete report
// Delete a report
app.delete("/api/reportInfo/:report_id", (req, res) => {
    const report_id = req.params.report_id
    const sqlDelete = "DELETE FROM REPORT WHERE report_id = $1"
    db.query(sqlDelete, [report_id], (err, result) => {
        if (err) {
            res.status(500).send({
                message: "Error when deleting report"
            });
        } else res.send(result)
    });
})
