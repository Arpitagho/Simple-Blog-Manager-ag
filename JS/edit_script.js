document.addEventListener("DOMContentLoaded", async () => {
    // collect blog id from url (eg: edit_blog.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        alert("No Blog ID provided!");
        window.location.href = "home.html";
        return;
    }

    // 2. to fill up the the form by taking the current data from backend of that particular blog 
    try {
        const response = await fetch(`/api/blogs/${blogId}`);
        const result = await response.json();

        if (result.success) {
            const blog = result.data;
            document.getElementById("title").value = blog.title;
            document.getElementById("author").value = blog.author;
            document.getElementById("image-url").value = blog.imageUrl || "";
            document.getElementById("shortDesc").value = blog.shortDesc;
            document.getElementById("txt").value = blog.content;
            document.getElementById("category").value = blog.category;
            document.getElementById("tags").value = blog.tags || "";
        } else {
            alert("Blog not found!");
            window.location.href = "home.html";
        }
    } catch (error) {
        console.error("Error fetching blog details:", error);
    }

    // If the form is submitted then send request to PUT API
    const form = document.getElementById("edit-content");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const image = document.getElementById("image-url").value.trim();
        const shortDesc = document.getElementById("shortDesc").value.trim();
        const content = document.getElementById("txt").value.trim();

        // validation
        if (title.length < 5) {
            alert("Blog title should contain at least 5 characters.");
            return;
        }

        if (content.length < 50) {
            alert("Blog content should contain at least 50 characters.");
            return;
        }

        try {
            const updateResponse = await fetch(`/api/blogs/${blogId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    author: author,
                    "image-url": image,
                    shortDesc: shortDesc,
                    content: content,
                    category: document.getElementById("category").value,
                    tags: document.getElementById("tags").value
                })
            });

            if (updateResponse.ok) {
                //on successful updation go back to home page
                window.location.href = "home.html";
            } else {
                alert("Failed to update blog.");
            }
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    });
});