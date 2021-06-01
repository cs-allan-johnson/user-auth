require("dotenv-safe").config();
const express = require('express'); 
const jwt = require('jsonwebtoken');
const app = express(); 
 
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.get('/', (req, res, next) => {
    res.json({message: "route is ready!"});
})


app.get('/users', verifyJWT, (req, res, next) => { 
    console.log("Returned all users!");
    res.json([
        {id:1, nome:'Allan Johnson'},
        {id:2, nome:'Matheus Galdino'},
        {id:3, nome:'Henrique Lopes' }
    ]);
})

app.post('/login', (req, res, next) => {
    if(req.body.user === 'username' && req.body.pwd === 'adm123'){
      
    const id = 1; 
    const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300
      });
      return res.json({ auth: true, token: token });
    }
    console.log(req.body)
    res.status(500).json({message: 'Login Fail !'});
})

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      req.userId = decoded.id;
      next();
    });
}

app.listen(3000, ()=>{
    console.log("Server is running  (port: 3000)...")
});