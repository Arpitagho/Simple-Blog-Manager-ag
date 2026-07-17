const express = require("express");    //brings express in this file

const app = express();    //create a new Express application & store it in the variable app

app.use(express.static("public"));

const PORT = 3000

app.get("/", (req, res) =>{
   // res.send("Hello World!");
   res.sendFile(__dirname + "/views/index.html");
});

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});