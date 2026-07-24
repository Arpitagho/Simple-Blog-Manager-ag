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
                        <img src="${blog.imageUrl}" alt="${blog.title}">
                        <h3>${blog.title}</h3>
                        <p class="author">By ${blog.author} | ${blog.category}</p>
                        <p>${blog.shortDesc}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <a href="blog_details.html?id=${blog.id}">Read more →</a>
                            <a href="edit_blog.html?id=${blog.id}">
                                <button style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Edit</button>
                            </a>
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

document.addEventListener('DOMContentLoaded', loadAllBlogs);