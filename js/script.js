// js/script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Connect Registration Form ---
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault(); 
            
            const name = document.getElementById("name").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const errorMessage = document.getElementById("error-message");

            if (password !== confirmPassword) {
                errorMessage.textContent = "Passwords do not match.";
                return;
            }

            // Send data to the backend Registration API
            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registration successful! Please login.");
                    window.location.href = "login.html";
                } else {
                    errorMessage.textContent = data.error;
                }
            } catch (error) {
                errorMessage.textContent = "Failed to connect to the server.";
            }
        });
    }

    // --- 2. Connect Login Form ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault(); 
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save user info in browser memory to use on the dashboard
                    localStorage.setItem("currentUser", data.name);
                    window.location.href = "dashboard.html"; 
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert("Failed to connect to the server.");
            }
        });
    }

    // --- 3. Connect Create Blog Form ---
    const createBlogForm = document.getElementById("createBlogForm");
    if (createBlogForm) {
        createBlogForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const title = document.getElementById("title").value;
            const content = document.getElementById("content").value;
            const author = localStorage.getItem("currentUser") || "Unknown Author";

            try {
                const response = await fetch("http://localhost:3000/blogs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content, author })
                });

                if (response.ok) {
                    alert("Blog created successfully!");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Error creating blog.");
                }
            } catch (error) {
                alert("Failed to connect to the server.");
            }
        });
    }

    // --- 4. Fetch and Display Blogs on Dashboard ---
   // --- 4. Fetch and Display Blogs on Dashboard ---
    const blogGrid = document.querySelector(".blog-grid");
    if (blogGrid) {
        async function loadBlogs() {
            try {
                const response = await fetch("http://localhost:3000/blogs");
                const blogs = await response.json();

                // Clear the dummy HTML content so it's empty before adding real blogs
                blogGrid.innerHTML = "";

                if (blogs.length === 0) {
                    blogGrid.innerHTML = "<p>No blogs published yet. Be the first!</p>";
                    return;
                }

                // Loop through array and build HTML for each blog
                blogs.forEach(blog => {
                    const article = document.createElement("article");
                    article.className = "blog-card";
                    article.innerHTML = `
                        <h3>${blog.title}</h3>
                        <p class="author">By ${blog.author}</p>
                        <p class="excerpt">${blog.content}</p>
                        <a href="#" class="read-more">Read Full Post</a>
                    `;
                    blogGrid.appendChild(article);
                });
            } catch (error) {
                blogGrid.innerHTML = "<p>Failed to load blogs from the server.</p>";
            }
        }
        
        loadBlogs();
    }
});