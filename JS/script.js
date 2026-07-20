
const form = document.getElementById("content");

form.addEventListener("submit", function(event){
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const image = document.getElementById("image-url").value.trim();
    const shortDesc = document.getElementById("shortDesc").value.trim();
    const content = document.getElementById("txt").value.trim();

     if (title === "" && author === "" && shortDesc === "" && content === "") {
        alert("Please fill all the required fields.");
        return; 
    }
  
    if (title === "") {
        alert("Blog Title is required!");
        return; 
    }

    if (author === "") {
        alert("Author Name is required!");
        return; 
    }

    if (shortDesc === "") {
        alert("Short Description is required!");
        return; 
    }

    if (content === "") {
        alert("Blog Content is required!");
        return; 
    }

    if(title.length < 5){
        alert("Blog title should contain at least 5 characters.");
        return;
    }

    if(image !== "" && !image.startsWith("http")){
        alert("Please enter a valid image URL.");
        return;
    }

    if(content.length < 50){
        alert("Blog content should contain at least 50 characters.");
        return;
    }

    window.open("success.html","_blank");

});

// Clear Button Confirmation
form.addEventListener("reset", function(event){
    const confirmClear = confirm("Are you sure you want to clear all fields? All typed data will be lost.");
    
    if (!confirmClear) {
        event.preventDefault(); 
    }
});
