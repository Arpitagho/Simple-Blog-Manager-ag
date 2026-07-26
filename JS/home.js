document.addEventListener("DOMContentLoaded", fetchAndDisplayBlogs);

let lastDeletedBlog = null; // to store blog data for undo
let toastTimeout = null;

async function fetchAndDisplayBlogs() {
    const blogContainer = document.getElementById("blog-container");

    try {
        // fetching blog data from Express GET API 
        const response = await fetch("/api/blogs");
        const result = await response.json();

        const blogs = result.data.slice(0,3);

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
                <img src="${blog.imageUrl || 'https://via.placeholder.com/320x180'}" alt="Blog Image" style="width: 100%; height: 180px; object-fit: cover;">
    
                <div style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1;">
        <h4 style="margin: 0 0 5px 0;">${blog.title}</h4>
        <p style="font-size:0.85em; color:gray; margin-bottom: 5px;">By ${blog.author} | ${blog.category}</p>
        
        <p style="margin-bottom: 15px; flex-grow: 1;">${blog.shortDesc}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
            <a href="blog_details.html?id=${blog.id}">Read more &#x2192;</a>
            
            <div style="display: flex; gap: 8px; align-items: center;">
                <a href="edit_blog.html?id=${blog.id}">
                    <button style="padding: 5px 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit</button>
                </a>
                <button onclick="deleteBlog('${blog.id}')" title="Delete Blog" style="background-color: #000; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-trash" style="font-size: 14px;"></i>
                </button>
            </div>
        </div>
    </div>
`;

            blogContainer.appendChild(blogCard);
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        blogContainer.innerHTML = "<p style='text-align:center; color:red;'>Failed to load blogs!</p>";
    }
}

async function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
        
        const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok && result.success) {
            //lastDeletedBlog = result.data;
            lastDeletedBlog = {
                blogData: result.data.blog,
                index: result.data.index
            };
            fetchAndDisplayBlogs(); // Instant UI Update
            showToast("Blog deleted successfully!", true);
        } else {
            showToast("Failed to delete blog.", false);
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
    }
}


function showToast(message, allowUndo = false) {
    const toast = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");
    const undoBtn = document.getElementById("undo-btn");

    if (!toast) return;

    toastMsg.innerText = message;
    if (allowUndo) {
        toastMsg.style.color = "#fff"; 
    } else {
        toastMsg.style.color = "#fff"; 
    }
    toast.style.display = "flex";

    if (allowUndo && lastDeletedBlog) {
        undoBtn.style.display = "inline";
       // undoBtn.onclick = null;
        undoBtn.onclick = async () => {
            await undoDelete();
        };
    } else {
        undoBtn.style.display = "none";
    }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.display = "none";
        lastDeletedBlog = null;
    }, 5000);
}

async function undoDelete() {
    if (!lastDeletedBlog) return;

    try {
        const response = await fetch('/api/blogs/restore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
           // body: JSON.stringify(lastDeletedBlog)
           body: JSON.stringify({
                blog: lastDeletedBlog.blogData,
                index: lastDeletedBlog.index
            })
        });

        if (response.ok) {
            document.getElementById("toast-notification").style.display = "none";
            fetchAndDisplayBlogs();
            showToast("Blog restored successfully!", false);
            lastDeletedBlog = null;
        }
    } catch (error) {
        console.error("Error restoring blog:", error);
    }
}


// --- Search Feature Logic for home.js ---
const searchForm = document.getElementById("f");

if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevents Page reload 
        
        const searchInput = searchForm.querySelector("input").value.trim();
        const blogContainer = document.getElementById("blog-container");

        if (!blogContainer) return;

        //if empty seach ip, then normally 3 blogs will be shown
        if (searchInput === "") {
            fetchAndDisplayBlogs();
            return;
        }

        try {
            // fetching API with Search Query
            const response = await fetch(`/api/blogs?search=${encodeURIComponent(searchInput)}`);
            const result = await response.json();

            if (result.success) {
                const blogs = result.data;

                if (!blogs || blogs.length === 0) {
                    blogContainer.innerHTML = "<p style='text-align: center; width: 100%; font-weight: bold; color: #666; margin: 30px auto;'>No matching blogs found!</p>";
                    return;
                }

                // Rendering search results on UI
                blogContainer.innerHTML = "";
                blogs.forEach(blog => {
                    const blogCard = `
                        <div class="blog-card">
                            <img src="${blog.imageUrl || 'https://via.placeholder.com/320x180'}" alt="${blog.title}" style="width: 100%; height: 180px; object-fit: cover;">
                            <div style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1;">
                                <h4 style="margin: 0 0 5px 0;">${blog.title}</h4>
                                <p style="font-size:0.85em; color:gray; margin-bottom: 5px;">By ${blog.author} | ${blog.category}</p>
                                <p style="margin-bottom: 15px; flex-grow: 1;">${blog.shortDesc}</p>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                                    <a href="blog_details.html?id=${blog.id}">Read more &#x2192;</a>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <a href="edit_blog.html?id=${blog.id}">
                                            <button style="padding: 5px 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit</button>
                                        </a>
                                        <button onclick="deleteBlog('${blog.id}')" title="Delete Blog" style="background-color: #000; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                            <i class="fa-solid fa-trash" style="font-size: 14px;"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    blogContainer.innerHTML += blogCard;
                });
            }
        } catch (error) {
            console.error("Error searching blogs:", error);
        }
    });
}