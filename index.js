const express= require("express")
const bcrypt = require('bcrypt');
const session = require("express-session")
const mysql = require("mysql")
const path = require("path")
const dbconn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "librarydb"
})
// creating app
const app = express()
console.log(__dirname);
// app middlewares
// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: 'yourencryptionkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  // authorization middleware
app.use((req,res,next)=>{
    const privateRoutes = ["/profile", "/borrow"] 
    const adminRoutes = [ "/newauthor", "/aproveuser", "/completeorder" ]
   if(req.session && req.session.user){
    res.locals.user = req.session.user
    if(req.session.user.Email !== "john@gmail.com" && adminRoutes.includes(req.path)){
        res.status(401).send("Unauthorized Access. Only admins allowed.")
    }else{
        next()
    }
   }else if(privateRoutes.includes(req.path) || adminRoutes.includes(req.path)){
    res.status(401).send("Unauthorized Access. Login First")
   }else{
    next()
   }
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
                    req.session.user = member[0] // update headers with a session id cookie
                    res.redirect("/")
                }else{
                    res.render("signin.ejs", {errorMessage: "Incorrect Password!"})
                }
            }            
        }
    })
 })

app.get("/logout", (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            res.status(500).send("Server Error")
        }else{
            res.redirect("/")
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
app.get("/book/:isbn",(req,res)=>{
    console.log(req.params.isbn); // query parameters
    dbconn.query(`SELECT * FROM books WHERE isbn = ${req.params.isbn}`, (error, book)=>{
        if(error){
            console.log(error);
            res.status(500).send("Server Error")
        }else{
            res.render("book.ejs", {book})
        }
    })
})

app.get("/borrow", (req,res)=>{
    // check availability
    // if available, create a new record
    
    res.send("Pick book at front desk")
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
// joins and types of joins in sql with examples
app.get("/books",(req,res)=>{
    dbconn.query("SELECT * FROM books JOIN authors ON books.author = authors.AuthorID", (err,books)=>{
        if(err){
            res.status(500).send("Server Error")
        }else{
            res.render("books.ejs", {books})
        }
    })
})
app.get("/profile",(req,res)=>{
    dbconn.query(`SELECT * FROM members WHERE MemberID = ${req.session.user.MemberID}`, (error , member)=>{
        if(error){
            res.status(500).send("Server Error")
        }else{
            res.render("profile.ejs", {member: member[0]})
        }
    })
})

// last route - 404 page
app.get("*", (req,res)=>{
    res.render("404.ejs")
})

app.listen(8000, ()=>console.log("app listening on port 8000"))

