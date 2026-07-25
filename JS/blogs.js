let lastDeletedBlog = null;
let toastTimeout = null;

// function for rendering all blogs fetching from server in blogs.html page
async function loadAllBlogs() {
    try {
        const response = await fetch('/api/blogs');
        const result = await response.json();

        if (result.success) {
            //  container for the cards in blogs.html
            const container = document.querySelector('.blogs-grid') || document.querySelector('.blog-container');

            if (!container) return;

            container.innerHTML = ''; // removing old static cards

            result.data.forEach(blog => {
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
                container.innerHTML += blogCard;
            });
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}

//func to delete a blog
// async function deleteBlog(id) {
//     if (confirm("Are you sure you want to delete this blog?")) {
//         try {
//             const response = await fetch(`/api/blogs/${id}`, {
//                 method: 'DELETE'
//             });
//             const result = await response.json();
//             if (response.ok && result.success) {
//                 alert("Blog deleted successfully!");
//                 loadAllBlogs(); // Reload the list
//             } else {
//                 alert("Failed to delete blog.");
//             }
//         } catch (error) {
//             console.error("Error deleting blog:", error);
//         }
//     }
// }


async function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {

        const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok && result.success) {
           // lastDeletedBlog = result.data;
           const actualBlog = result.data.blog.blog ? result.data.blog.blog : result.data.blog;
           lastDeletedBlog = {
                blogData: result.data.blog,
                index: result.data.index
            };
           // loadAllBlogs(); // Instant UI Update
           if (typeof loadAllBlogs === 'function') loadAllBlogs();
            if (typeof fetchAndDisplayBlogs === 'function') fetchAndDisplayBlogs();
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
        undoBtn.onclick = null;
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
            //body: JSON.stringify(lastDeletedBlog)
            body: JSON.stringify({                          
                blog: lastDeletedBlog.blogData,
                index: lastDeletedBlog.index
            })
        });

        if (response.ok) {
            document.getElementById("toast-notification").style.display = "none";
            loadAllBlogs();
            showToast("Blog restored successfully!", false);
            lastDeletedBlog = null;
        }
    } catch (error) {
        console.error("Error restoring blog:", error);
    }
}


document.addEventListener('DOMContentLoaded', loadAllBlogs);