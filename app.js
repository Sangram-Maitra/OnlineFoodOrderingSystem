const express = require("express");
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const mysql = require("mysql");

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "userdetails",
});

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect
db.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("My Sql connected");
  }
});

//create Table
app.get("/createtable", function (req, res) {
  let sql =
    "CREATE TABLE users(id int AUTO_INCREMENT, FName VARCHAR(255), LName VARCHAR(255),PhoneNumber Int(12),Address VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send("Post Table Created...");
  });
});

//initating signup and signin page
app.get("/", function (req, res) {
  res.render("signup", { title: "signup" });
});

app.get("/home", function (req, res) {
  res.render("home", { title: "Home Page" });
});

app.get("/signingIn", function (req, res) {
  res.render("signin", { title: "Sign In" });
});

app.get("/signIn", function (req, res) {
  res.render("signin", { title: "Sign In" });
});

app.get("/error",function(req,res){
  res.render("error",{ title: "Error" });
  res.redirect("/");
})

//post Requests
app.post("/signingUp",function(req,res){
    // var flag=0;
    var Fname = req.body.First_Name;
    var Lname = req.body.Last_Name;
    var PhoneNumber = req.body.Phone;
    var Address = req.body.add;
    // if(Fname.length!=null)
    // {
    //     if(Lname.length!=null)
    //     {
    //         var isNum = /^[0-9]+$/.test(PhoneNumber);
    //         if(isNum)
    //         {
    //             if(Address.length!=null)
    //             {
    //                 console.log("here")
    //                 flag=1
    //             }   
    //         }   
    //     }  
    // }
    // if(flag==0)
    // {
    //     console.log("Not Enough Parameter");
    //     res.redirect("/");
    // }

  let data = {
    FNAME: Fname,
    LNAME: Lname,
    PHONENUMBER: PhoneNumber,
    ADDRESS: Address,
  };
  let sql = "Insert into users set ?";
  let query = db.query(sql, data, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("data inserted");
      res.redirect("/home");
    }
  });
})

app.post("/home", function (req, res) {
    res.redirect("/home");
});

app.post("/signIn",function(req,res){
    res.redirect("/signIn");
})

app.post("/signingIn", function (req, res) {
  var phnumber = req.body.Phone;
  let sql = `select * from users where PHONENUMBER = '${phnumber}'`;
  let query = db.query(sql,function(err,result,fields){
      //as the result is taking array as name
      console.log(result[0]);
      if(result[0]==undefined) 
      {
        console.log("User not present");
        res.redirect("/error");
      }
      else{
          console.log("Post Fetched");
          res.redirect("/home");
      }
  });
});

app.post("/", function (req, res) {
  res.redirect("/");
});

app.listen("3000", function () {
  console.log("Server started at 3000 port...");
});
