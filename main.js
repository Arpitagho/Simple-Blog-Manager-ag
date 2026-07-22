const express = require("express");   

const app = express();    

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 3000

app.get("/", (req, res) =>{
   res.sendFile(__dirname + "/add_blog.html");
});

let blogs = []

app.post("/api/blogs", (req, res)=>{
    const title = req.body.title;
    const category = req.body.category;
    const author = req.body.author;
    const imageUrl = req.body["image-url"];
    const shortDesc = req.body.shortDesc;
    const content = req.body.content;
    const tags = req.body.tags;

    const newBlog ={
        id: Date.now(),
        title: title,
        category: category,
        author: author,
        imageUrl : imageUrl,
        shortDesc: shortDesc,
        content: content,
        tags: tags,
        createdAt: new Date().toLocaleString()

    };

    blogs.push(newBlog);
    console.log("--------------- New Blog Added to the Array --------------");
    console.log(blogs);
    console.log("---------------------------------------------------");

    

    // console.log("--------------- New Blog Submission --------------");
    // console.log("Title              : " + title);
    // console.log("Category           : " + category);
    // console.log("Author             : " + author);
    // console.log("Image URL          : " + imageUrl);
    // console.log("Short Description  : " + shortDesc);
    // console.log("Content            : " + content);
    // console.log("Tags               : " + tags);
    // console.log("---------------------------------------------------")

   // res.status(200).send(newBlogs);

   res.status(201).json({
    success: true,
    message: "Blog added successfully!",
    data: newBlog
});
});


app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`);
});