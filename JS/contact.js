document.addEventListener("DOMContentLoaded", ()=>{

const contactForm = document.getElementById("contact-form");


contactForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;


    try{

        const response = await fetch("/api/contact",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                subject,
                message
            })
        });


        const result = await response.json();

        alert(result.message);

        if(result.success){
            contactForm.reset();
        }


    }catch(error){

        console.error(error);
        alert("Something went wrong!");

    }

});

});