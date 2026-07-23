const express = require("express");   

const app = express();    

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 3000

app.get("/", (req, res) =>{
   res.sendFile(__dirname + "/home.html");
});

// default bogs

let blogs = [
    {
        id: 1,
        title: "Getting Started with HTML",
        category: "HTML",
        author: "John Doe",
        imageUrl: "https://www.kenility.com/wp-content/uploads/2023/03/ImagenesBlogWeb_1-0ac.jpg",
        shortDesc: "Learn the basics of HTML and create your first web page from scratch.",
        content: "HTML is the standard markup language for creating Web pages...",
        tags: "#HTML #WebDev"
    },
    {
        id: 2,
        title: "Why CSS Matters",
        category: "CSS",
        author: "Jane Smith",
        imageUrl: "https://coursevania.com/wp-content/uploads/2024/02/5674674_c070.jpg",
        shortDesc: "CSS helps create attractive and responsive web pages.",
        content: "Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation...",
        tags: "#CSS #Design"
    },
    {
        id: 3,
        title: "Introduction to Node.js",
        category: "Node.js",
        author: "Olivia Davis",
        imageUrl: "https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FNode_js_Architecture_A_Comprehensive_Guide_1_af37a73e1e.png&w=4500&q=90",
        shortDesc: "Build fast server-side applications using JavaScript.",
        content: "Node.js is an open-source, cross-platform JavaScript runtime environment...",
        tags: "#NodeJS #Backend"
    }
];


app.get("/api/blogs", (req, res)=>{
    res.status(200).json({
        success: true,
        data: blogs
    })
});

app.post("/api/blogs", (req, res)=>{
    const title = req.body.title;
    const category = req.body.category;
    const author = req.body.author;
    const imageUrl = req.body["image-url"];
    const shortDesc = req.body.shortDesc;
    const content = req.body.content;
    const tags = req.body.tags;

    const newID = blogs.length > 0 ? Math.max(...blogs.map(b=>b.id)) + 1 : 1;

    const newBlog ={
        id: newID,
        title: title,
        category: category,
        author: author,
        imageUrl : imageUrl,
        shortDesc: shortDesc,
        content: content,
        tags: tags,
        createdAt: new Date().toLocaleString()

    };

    blogs.unshift(newBlog);
    console.log("--------------- New Blog Added to the Array --------------");
    console.table(blogs.map(b => ({
        ID: b.id,
        Title: b.title.length > 25 ? b.title.substring(0, 22) + "..." : b.title,
        Category: b.category,
        Author: b.author
    })));
    console.log(`Total items in the array: ${blogs.length}`)
    //console.log(blogs);
    //console.log("---------------------------------------------------");


   res.status(201).json({
    success: true,
    message: "Blog added successfully!",
    data: newBlog
    });
});

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`);
});