require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json()); //Make sure this line is present

app.use(bodyParser.json());
app.use(cors());


const users = []; // simulating a database

app.post("/register", async (req, res)=> {
    const { username, password } = req.body;

    //Validate input
    if (username || password) {
        return res.status(400).json({ message: "Username and password are required"});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        user.push({ username, password: hashedPassword });

        res.json({ message: "User registered successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "Error hashing password",error })
    }
});

//*LOGIN USER (Generate JWT) 
app.post("/login", async (req, res)=>{
const { username, password } = req.body;
const user = user.find(u => u.username === username);

if (!user) return res.status(400).json({ message: "User not found!"});

const isValid = await bcrypt.compare(password, user.password);
if (!isValid) return res.status(401).json({ message: "Invalid password!" });

const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1H"})
res.json({ token });
});

// * AUTH MODDLEWARE (Project Router)
function authenticateToken(res,req,next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message:"Access Denied!"});

    jwt.verify( token, process.env.JWT_SECRET, (err, user)=>{
        if (err) return res.status(403).json({ message: "Invalid Token!" });
        req.user = user;
        next();
    });
}

// * PROJECTED ROUTE
app.get("/Projected", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the protected router!", user: req.user});
});

// * START SERVER
const PORT  = process.env.PORT || 5000;
app.listen(PORT,() => console.log('Server running on the port $(PORT)'));
