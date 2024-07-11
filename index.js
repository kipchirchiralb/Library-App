const express= require("express")
const mysql = require("mysql")
const dbconn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "librarydb"
})
const app = express()

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/authors",(req,res)=>{
    dbconn.query("SELECT * FROM authors", (err,authors)=>{
        if(err){
            res.status(500).send("Error Occured!!")
        }else{
            res.render("authors.ejs", {authors})
        }
    })
})

console.log("albert");

app.post("/newauthor",(req,res)=>{
    console.log(req.body); // {id: "dsjdhsjdhsjhdjs", name: "jhfsjf", nationality: "jhfjs", bio: }
    let insertStatement = `INSERT INTO authors (Fullname,Nationality,YOB, Biography,AuthorID) VALUES ("${req.body.name}","${req.body.nationality}",${req.body.YOB},"${req.body.bio}","${req.body.id}")`
    console.log(insertStatement);
    // input validation
    dbconn.query(insertStatement, (err,authors)=>{
        if(err){
            res.status(500).send("Error Occured!!")
        }else{
            res.redirect("/authors")
        }
    })
})
app.get("/books",(req,res)=>{
    res.render("books.ejs")
})
app.get("/profile",(req,res)=>{
    res.render("profile.ejs")
})

app.listen(8000, ()=>console.log("app listening on port 8000"))

