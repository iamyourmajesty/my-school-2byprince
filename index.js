// lets make server 
const express = require("express")
const ejs=require("ejs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const axios = require("axios")

const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const app= express();

const port = process.env.PORT || 5000;

const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));

// parsing the incoming data
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//serving public file
app.use(express.static( __dirname + '/assets'));


// cookie parser middleware
app.use(cookieParser());

app.set('view engine','ejs')


// User Object
const user = {
    email: "princepandey2784@gmail.com",
    password : "9534157445"
};

// a variable to save a session
var session;


// working on mongoose 
mongoose.connect('mongodb+srv://prince:princepandey@cluster0.zppwoij.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log("connected to mongodb atlas successfully");
}).catch((err)=>{
    console.log(`Can't connected to the database : ${err}`);
})

const moviesSchema = {
    name: String,
    father : String,
    reg : Number,
    class : String,
    dob : String,
    phy:Number,
    chem:Number,
    maths:Number,
    eng:Number,
    hindi:Number,
    phyp:Number,
    chemp:Number,
    mathsp:Number,
    engp:Number,
    hindip:Number
}

const Movie = mongoose.model('Movie',moviesSchema)

//working on mongoose

app.get('/',(req,res) =>{
res.sendFile(__dirname + '/index.html')
})

/*app.get("/result",(req,res)=>{
    Movie.find({},function(err,movies){
        res.render('index',{
            moviesList : movies
        })
    })
})
*/
//extra

app.get("/result",(req,res)=>{
    res.sendFile(__dirname + '/result.html')
})

/*
app.get("/admin",(req,res)=>{
    Movie.find({},function(err,movies){
        res.render('admin',{
            students : movies
        })
    })
})
*/

// app.get("/admin",(req,res)=>{
//     res.sendFile(__dirname + '/admin.html')
// })

app.get('/admin',(req,res) => {
    session=req.session;
    if(session.user){
        Movie.find({},function(err,movies){
            res.render('admin',{
                students : movies
            })
        })
        // console.log("saved");
    }
    else
    {
        res.sendFile(__dirname + '/admin.html')
        // console.log("nothing saved");
    }
    
});



app.get("/addstudent0907u097adfj9000",(req,res)=>{
    res.sendFile(__dirname + '/addstudent0907u097adfj9000.html')
})


app.get("/update:id",(req,res)=>{
    const Id = req.params.id;
    // console.log(Id);
    Movie.findOne({_id:Id}).then((oneUser)=>{
        // console.log('one user is ')
        // console.log(oneUser)      
            
            res.render('update',{
                onestudent :oneUser
             })
        
        
    
    }).catch((err)=>{
        console.log(err)
        
    })   

    
})


app.get("/delete:id",(req,res)=>{
    const Id = req.params.id;
    // console.log(Id);
    Movie.findByIdAndDelete({_id :Id})
    .then((doc) => console.log("deleted succesfully"))
    .catch((err)=> console.log(err));
    
    res.redirect('admin')
})





app.post("/result",(req,res)=>{
   var Reg=req.body.REG;
   var Dob = req.body.DOB;
   
//    Movie.find({},function(err,movies){
//     res.render('rev',{
//         moviesList : movies
//     })
// })



Movie.findOne({reg:Reg}).then((oneUser)=>{
    console.log('one user is ')
    console.log(oneUser)
    if(oneUser===null)
    {
        res.send("your details does not mathes with our database")        
    }else{
        
        res.render('rev',{
            onestudent :oneUser
         })
    }
    

}).catch((err)=>{
    console.log(err)
    
})   
   
    });
    

app.post("/addstudent0907u097adfj9000",(req,res)=>{
    var obj=req.body;
    let newobj = new Movie(obj)
    newobj.save();
    // console.log(obj);
    // res.send("added succesfully")
    res.redirect('admin')
    
})

app.post("/update:id",(req,res)=>{
    const Id = req.params.id;
    
    // console.log(req.body);
   Movie.findByIdAndUpdate({_id:Id},{
    name: req.body.name,
    father : req.body.father,
    reg : req.body.reg,
    class : req.body.class,
    dob : req.body.dob,
    phy:req.body.phy,
    chem:req.body.chem,
    maths:req.body.maths,
    eng:req.body.eng,
    hindi:req.body.hindi,
    phyp:req.body.phyp,
    chemp:req.body.chemp,
    mathsp:req.body.mathsp,
    engp:req.body.engp,
    hindip:req.body.hindip
   }).then((doc)=>console.log("updated succesfully"))
   .catch((err)=> console.log(err));
    // res.send("updated succesfully")
    res.redirect('admin')
})

// app.post("/admin",(req,res)=>{
//     // console.log(req.body.email);
//     // console.log(req.body.password);
//     if(req.body.email==="princepandey2784@gmail.com" && req.body.password==="9534157445"){
//         Movie.find({},function(err,movies){
//             res.render('admin',{
//                 students : movies
//             })
//         })
//     }
//     else{
//         res.sendFile(__dirname + '/wrong.html')
//     }
// })


app.post('/admin',(req,res) => {
    if(req.body.email == user.email && req.body.password == user.password){
        // session=req.session;
        // session.userid=req.body.username;
        req.session.user = user;
        req.session.save();
        // console.log(req.session)
        Movie.find({},function(err,movies){
            res.render('admin',{
                students : movies
            })
        })        
    }
    else{
        res.sendFile(__dirname + '/wrong.html')
    }
})

// Logout page
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.sendFile(__dirname + '/admin.html')
});
 


app.listen(port,function() {
    console.log(`server is running`)
})

