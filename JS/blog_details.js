const id = new URLSearchParams(window.location.search).get("id");

async function loadBlog() {
    if (!id) {
        document.getElementById("content").innerText = "No Blog ID provided in URL.";
        return;
    }

    try {
        const response = await fetch(`/api/blogs/${id}`);
        const result = await response.json();

        if (result.success) {
            const blog = result.data;

            document.title = `${blog.title} - Blog Details`;
            document.getElementById("title").innerText = blog.title;
            document.getElementById("category").innerText = blog.category || "General";
            document.getElementById("author").innerText = blog.author || "Anonymous";
            document.getElementById("content").innerText = blog.content;

            if (blog.createdAt) {
                document.getElementById("date").innerHTML = `<i class="fa-regular fa-calendar"></i> ${blog.createdAt}`;
            }

            const imgElement = document.getElementById("image");
            imgElement.src = blog.imageUrl || "https://via.placeholder.com/800x400?text=No+Image+Available";
            imgElement.alt = blog.title;
        } else {
            document.getElementById("content").innerText = "Blog not found!";
        }
    } catch (error) {
        console.error("Error loading blog details:", error);
        document.getElementById("content").innerText = "Failed to load blog details. Please try again later.";
    }
}

document.addEventListener("DOMContentLoaded", loadBlog);