const express= require("express")
const bcrypt = require('bcrypt');
const session = require("express-session")
const mysql = require("mysql")
const dbconn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "librarydb"
})
// creating app
const app = express()

// app middlewares
// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourencryptionkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use((req,res,next)=>{
   if(req.session && req.session.user){
    res.locals.user = req.session.user
   }
    next()
})

// app routes
app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/signup", (req,res)=>{
    res.render("signup.ejs")
})
app.get("/signin", (req,res)=>{
    res.render("signin.ejs")
})

app.post("/signup", (req,res)=>{
    // get data sent from html form - through req.body -- 
    // //check if email provided is in the database(already used/registered)
    // hash password
    //store data/register new user   then redirect them to login/signin
    dbconn.query(`SELECT Email FROM members WHERE Email = "${req.body.email}" `, (err, result)=>{
        if(err){
            res.status(500).send("Server Error")
        }else{
            console.log( "Result from DB checking email:  ", result);
            if(result.length>0){
                // email found
                res.render("signup.ejs", {errorMessage: "Email Already in Use. Signup"})
            }else{
                // email not found --- then has password using bcrypt(node module)
                const hashedPassword = bcrypt.hashSync(req.body.password, 5);
                // now store the data -- remember hashed password and default club 99-ordinary
                dbconn.query(`INSERT INTO members(FullName,Address,Phone,Email,Password,Club)VALUES("${req.body.fullname}","${req.body.address}","${req.body.phone}","${req.body.email}","${hashedPassword}",99 )`, (error)=>{
                    if(error) {
                        res.status(500).send("Server Error")
                    }else{
                        res.redirect("/signin")
                    }
                })
            }
        }
    })
 })

 app.post("/signin", (req,res)=>{
    // recieve emai and pasword -- req.body
    // check if email is registered
    // compare passwords (from req.body and from database-- -bcrypt.compaaresync)
    // if correct-- login/ create a session for them ------- What are sessions(Why is http stateless), what are cookies in web
    console.log(req.body);
    dbconn.query(`SELECT * FROM members WHERE Email = "${req.body.email}"`, (error, member)=>{
        if(error){
            console.log(error);
            res.status(500).send("Server Error")
        }else{
            console.log(member);
            if(member.length==0){
                res.render("signin.ejs", {errorMessage: "Email not Registered"})
            }else{
                //compare
                let passwordMatch = bcrypt.compareSync(req.body.password, member[0].password)
                if(passwordMatch){
                    // initiate a session
                    req.session.user = member // update headers with a session id cookie
                    res.redirect("/")
                }else{
                    res.render("signin.ejs", {errorMessage: "Incorrect Password!"})
                }
            }            
        }
    })
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
app.get("/authors/:author",(req,res)=>{
    console.log(req.params.author);
    
    res.send("hi there!!")
})
app.get("/books/:isbn",(req,res)=>{
    console.log(req.params.author);
    res.send("hi there!!")
})


app.post("/newauthor",(req,res)=>{
    console.log("posting author");
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
    console.log("getting books");
    res.render("books.ejs")
})
app.get("/profile",(req,res)=>{
    console.log("getting profile");
    res.render("profile.ejs")
})

// last route - 404 page
app.get("*", (req,res)=>{
    res.render("404.ejs")
})

app.listen(8000, ()=>console.log("app listening on port 8000"))

