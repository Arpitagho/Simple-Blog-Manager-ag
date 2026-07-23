document.addEventListener("DOMContentLoaded", fetchAndDisplayBlogs);

async function fetchAndDisplayBlogs() {
    const blogContainer = document.getElementById("blog-container");

    try {
        // fetching blog data from Express GET API 
        const response = await fetch("/api/blogs");
        const result = await response.json();

        const blogs = result.data;

        // if no blogs in the server
        if (!blogs || blogs.length === 0) {
            blogContainer.innerHTML = "<p style='text-align: center; width: 100%; font-weight: bold; color: #666; margin: 30px auto;'>No blogs added yet!</p>";
            return;
        }

        // renders the blog on screen
        blogContainer.innerHTML = ""; // remove old content

        blogs.forEach(blog => {
            const blogCard = document.createElement("div");
            blogCard.className = "blog-card";

            blogCard.innerHTML = `
                <img src="${blog.imageUrl || 'https://via.placeholder.com/320x180'}" alt="Blog Image">
                <div style="padding: 15px;">
                    <h4>${blog.title}</h4>
                    <p style="font-size:0.85em; color:gray; margin-bottom: 5px;">By ${blog.author} | ${blog.category}</p>
                    <p>${blog.shortDesc}</p>
                    <a href="#">Read more &#x2192;</a>
                </div>
            `;

            blogContainer.appendChild(blogCard);
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        blogContainer.innerHTML = "<p style='text-align:center; color:red;'>Failed to load blogs!</p>";
    }
}