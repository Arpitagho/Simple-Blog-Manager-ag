const express = require("express");   
const app = express();    

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/home.html");
});

// Default blogs
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
    },
    {
        id: 4,
        title: "Why Learn JavaScript?",
        category: "JavaScript",
        author: "John Doe",
        imageUrl: "https://19604448.fs1.hubspotusercontent-na1.net/hubfs/19604448/JavaScript%20un%20lenguaje%20de%20programaci%C3%B3n.jpg",
        shortDesc: "JavaScript makes websites interactive and dynamic. It is one of the core technologies of the web.",
        content: "JavaScript is a programming language that allows you to implement complex features on web pages...",
        tags: "#JavaScript #Frontend"
    },
    {
        id: 5,
        title: "Introduction to React",
        category: "JavaScript",
        author: "Jane Smith",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPVt9oana3b1Pr4OUoaV-D6Ph2qAN1E36coEChbGO5lPt6JPYeYcF6Bmpa&s=10",
        shortDesc: "React is a JavaScript library for building user interfaces. It is maintained by Facebook.",
        content: "React makes it painless to create interactive UIs. Design simple views for each state in your application...",
        tags: "#ReactJS #Frontend"
    },
    {
        id: 6,
        title: "Getting Started with MongoDB",
        category: "Node.js",
        author: "Olivia Davis",
        imageUrl: "https://www.mongodb.com/community/forums/uploads/default/original/3X/9/d/9d85761397187bb6e8309e779e8dded757679d1b.jpeg",
        shortDesc: "MongoDB is a NoSQL database used in many modern web applications.",
        content: "MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing...",
        tags: "#MongoDB #Database"
    }
];

//
let messages = [];

// GET All Blogs (with search support)
app.get("/api/blogs", (req, res) => {
    const { query } = req.query;

    if (query) {
        const q = query.toLowerCase();
        const filteredBlogs = blogs.filter(b => 
            b.title.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            (b.tags && b.tags.toLowerCase().includes(q))
        );

        return res.status(200).json({
            success: true,
            data: filteredBlogs
        });
    }

    res.status(200).json({
        success: true,
        data: blogs
    });
});


// GET Single Blog by ID
app.get("/api/blogs/:id", (req, res) => {
    try{
        const blogId = parseInt(req.params.id);
        const blog = blogs.find(b => b.id === blogId);

        if (!blog) {
            return res.status(404).json({
            success: false,
            message: "Blog not found!"
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });
            
    }catch(err){
         console.error(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
});

// POST New Blog
app.post("/api/blogs", (req, res) => {
    try{
        const { title, category, author, shortDesc, content, tags } = req.body;
        const imageUrl = req.body["image-url"] || req.body.imageUrl;

        // Backend Validation
        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required."
            });
        }

        if (!author?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Author is required."
            });
        }

        if (!shortDesc?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Short description is required."
            });
        }

        if (!content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Content is required."
            });
        }



        const newID = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;

        const newBlog = {
            id: newID,
            title,
            category,
            author,
            imageUrl,
            shortDesc,
            content,
            tags,
            createdAt: new Date().toLocaleString()
        };

        blogs.unshift(newBlog);
        console.log("--------------- New Blog Added ---------------");
        console.table(blogs.map(b => ({
            ID: b.id,
            Title: b.title.length > 25 ? b.title.substring(0, 22) + "..." : b.title,
            Category: b.category,
            Author: b.author
        })));

        res.status(201).json({
            success: true,
            message: "Blog added successfully!",
            data: newBlog
        });

    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
});

// PUT Update Blog
app.put("/api/blogs/:id", (req, res) => {
    try{
        const blogId = parseInt(req.params.id);
        const blogIndex = blogs.findIndex(b => b.id === blogId);

        if (blogIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Blog not found!"
            });
        }

        blogs[blogIndex] = {
            ...blogs[blogIndex],
            title: req.body.title || blogs[blogIndex].title,
            category: req.body.category || blogs[blogIndex].category,
            author: req.body.author  || blogs[blogIndex].author,
            imageUrl: req.body["image-url"] !== undefined ? req.body["image-url"] : blogs[blogIndex].imageUrl,
            shortDesc: req.body.shortDesc || blogs[blogIndex].shortDesc,
            content: req.body.content || blogs[blogIndex].content,
            tags: req.body.tags || blogs[blogIndex].tags
        };

        console.log(`\n================ BLOG ID ${blogId} UPDATED ================`);
        console.table(blogs.map(b => ({
            ID: b.id,
            Title: b.title.length > 25 ? b.title.substring(0, 22) + "..." : b.title,
            Category: b.category,
            Author: b.author
        })));

        res.status(200).json({
            success: true,
            message: "Blog updated successfully!",
            data: blogs[blogIndex]
        });
    }catch(err){
            console.error(err);

        res.status(500).json({
        success:false,
        message:"Internal Server Error"
        });
    }
});

// DELETE Blog API Route
app.delete("/api/blogs/:id", (req, res) => {
   try{
        const blogId = parseInt(req.params.id);
        const blogIndex = blogs.findIndex(b => b.id === blogId);

        if (blogIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Blog not found!"
            });
        }

        const [deletedBlog] = blogs.splice(blogIndex, 1);

        console.log(`\n------------- BLOG ID ${blogId} DELETED -------------`);
        console.table(blogs.map(b => ({
            ID: b.id,
            Title: b.title.length > 25 ? b.title.substring(0, 22) + "..." : b.title,
            Category: b.category,
            Author: b.author
        })));

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully!",
            data: {
                blog: deletedBlog,
                index: blogIndex // index of the deleted blog
            }
        });
   }catch(err){
         console.error(err);

        res.status(500).json({
        success:false,
        message:"Internal Server Error"
    });

   }
});

// RESTORE Blog Route (Undo functionality)
app.post("/api/blogs/restore", (req, res) => {
    let { blog, index } = req.body;

    if (!blog) {
        return res.status(400).json({ success: false, message: "No blog data provided" });
    }

    if (blog.blog) {
        blog = blog.blog;
    }

    // 
    if (index !== undefined && index !== null && index >= 0 && index <= blogs.length) {
        blogs.splice(index, 0, blog);
    } else {
        blogs.unshift(blog); // Default fallback
    }

    console.log(`\n--------------- BLOG RESTORED AT INDEX ${index} ---------------`);

    res.status(200).json({
        success: true,
        message: "Blog restored successfully!",
        data: blog
    });
});

// Contact Form API
app.post("/api/contact", (req, res) => {

    try {

        const {name, email, subject, message} = req.body;

        // Backend validation
        if(!name || !email || !subject || !message){

            return res.status(400).json({
                success:false,
                message:"All fields are required."
            });

        }


        const newMessage = {
            id: messages.length + 1,
            name,
            email,
            subject,
            message,
            createdAt: new Date().toLocaleString()
        };


        messages.push(newMessage);


        console.log("New Contact Message:");
        console.log(newMessage);


        res.status(201).json({
            success:true,
            message:"Message sent successfully!"
        });


    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

});

// 404 Route (must be the last route)
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Go Back Home</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});