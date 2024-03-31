// script.js

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsSection = document.getElementById('posts');

    // Function to fetch posts from the server and display them
    const fetchPosts = () => {
        fetch('/posts')
            .then(response => response.json())
            .then(posts => {
                postsSection.innerHTML = '';
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                    `;
                    postsSection.appendChild(postElement);
                });
            })
            .catch(error => console.error('Error fetching posts:', error));
    };

    // Fetch posts when the page loads
    fetchPosts();

    // Event listener for submitting a new post
    postForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(postForm);
        const title = formData.get('title');
        const content = formData.get('content');

        fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => {
            if (response.ok) {
                console.log('Post created successfully');
                fetchPosts(); // Refresh the posts after adding a new one
            } else {
                console.error('Error creating post:', response.statusText);
            }
        })
        .catch(error => console.error('Error creating post:', error));
    });
});
