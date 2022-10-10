const express = require("express");
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const mysql = require("mysql");
// const foodList = [];
var UserFirstName="";
var UserLastName="";
var TotalCost = 0;
var number = 0;
var UserAddress = "";


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
    res.send("Users Table Created...");
  });
});

//checking table exist or not
app.get("/checkTable",function(req,res){
  // let sql= `SELECT count(*) FROM userdetails.TABLES WHERE TABLE_NAME = users`
  let sql = `SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'userdetails') AND (TABLE_NAME = 'delhi_fooddb')`
  let query = db.query(sql,function(err,result){
    if(err) throw err;

    console.log(result);
    res.send("Post Fetched");
});
})


//initating signup and signin page
app.get("/", function (req, res) {
  res.render("signup", { title: "signup" });
});

app.get("/home", function (req, res) {
  db.query("SELECT * FROM delhi_fooddb", function (err, result, fields) 
    {
      if (err) throw err;
      var test = result;
      var length = Object.keys(result).length;
      // console.log(length);
      // for (var i = 0; i < length; i++) 
      // {
      //   console.log(result[i].Name);
      // };
      
      res.render("home", { title: "Home Page",foodDetails: result, size: length, Name:UserFirstName });
      // res.render("home", { title: "Home Page"});
    });
});

app.get("/signingIn", function (req, res) {
  res.render("signin", { title: "Sign In" });
});

app.get("/signIn", function (req, res) {
  res.render("signin", { title: "Sign In" });
});

app.get("/cart",function(req,res){
  db.query("SELECT * FROM cart", function (err, result, fields) 
    {
      if (err) throw err;
      var test = result;
      var length = Object.keys(result).length;
      // console.log(length);
      // for (var i = 0; i < length; i++) 
      // {
      //   console.log(result[i].Name);
      // };
      var data = JSON.parse(JSON.stringify(result));
      TotalCost=0;
      for(i=0;i<data.length;i++)
      {
        TotalCost+=data[i].Price;
      }
      // console.log(TotalCost);
      res.render("cart", { title: "Shopping Cart",foodDetails: result, num: length, Name:UserFirstName,Total:TotalCost });
      // res.render("home", { title: "Home Page"});
    });
  // res.render("cart",{ title: "Shopping Cart" })
});

app.get("/error",function(req,res){
  res.render("error",{ title: "Error" });
  // res.redirect("/");
})

app.get("/profile",(req,res)=>{
  let sql = `select * from users where PHONENUMBER = '${number}'`;
  db.query(sql, function (err, result1, fields) 
    {
      if (err) throw err;
      var data1 = JSON.parse(JSON.stringify(result1));
      console.log(data1);
      UserFirstName = data1[0].FName;
      UserLastName = data1[0].LName;
      number = data1[0].PhoneNumber;
      UserAddress = data1[0].Address;

      // res.render("home", { title: "Home Page"});
    });
    let sql2 = `select * from invoice where PhoneNumber = '${number}'`;
    db.query(sql2, function (err, result2, fields){
      var length = Object.keys(result2).length;
      var data2= JSON.parse(JSON.stringify(result2));

      res.render("profile", { title: "Profile",Name:UserFirstName, Lname: UserLastName, Addr: UserAddress,PhoneNum:number,size:length,invoices:data2 });
    });
})

//post Requests
app.post("/signingUp",function(req,res){
    // var flag=0;
    var Fname = req.body.First_Name;
    var Lname = req.body.Last_Name;
    var PhoneNumber = req.body.Phone;
    var Address = req.body.add;
    UserFirstName= Fname;
    number=PhoneNumber;
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

app.post("/done",(req,res)=>{
    var d = new Date();
    var data = {
      PhoneNumber: number,
      Cost:TotalCost,
      Date: d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
    };
    let sql2 = "insert into invoice set ?";
      db.query(sql2, data, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Invoice inserted");
          // res.redirect("/home");
        }
      });
  res.redirect("/home");
});

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
      // console.log(result[0]);
      // console.log(result[0].RowDataPacket.FName);
      if(err)
      {
        console.log(err);
      }
      else{
        var data = JSON.parse(JSON.stringify(result));
        if(data[0]!=undefined)
        {
          console.log(data[0].PhoneNumber);
          UserFirstName= data[0].FName;
          number= data[0].PhoneNumber;
        }
        if(result[0]==undefined) 
        {
          console.log("User not present");
          res.render("error",{ title: "Error" });
        }
        else{
          console.log("Post Fetched");
          res.redirect("/home");
        }
      }
  });
});

app.post("/addingTocart",function(req,res){
  console.log(req.body.PText);
  console.log(req.body.PPrice);
  ProductName = req.body.PText;
  ProductPrice = req.body.PPrice;
  // TotalCost+=ProductPrice; this way if we directly went to cart it wont show any price so its not good method

  let data = {
    Name: ProductName,
    Price: ProductPrice    
  };
  let sql = "Insert into Cart set ?";
  let query = db.query(sql, data, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("data inserted");
      res.redirect("/home");
    }
  });
})

app.post("/cart",function(req,res){
  res.redirect("/cart");
})

app.post("/invoice",function(req,res){
    let sql = `delete from cart`
    let query = db.query(sql,function(err,result){
        if(err) throw err;
        console.log(result);
    });
    res.render("invoice",{title:"Payment Invoice",Total:TotalCost});
})

app.post("/", function (req, res) {
  res.redirect("/");
});

app.listen("3000", function () {
  console.log("Server started at 3000 port...");
});
