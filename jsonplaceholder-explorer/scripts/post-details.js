const id = new URLSearchParams(location.search).get('postId');

if (!id) {
    document.getElementsByClassName('post-details__content')[0].innerText = 'Post ID is required';
    throw new Error('Missing post ID');
}

fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(response => response.json())
    .then(post => {
        const postDetails = document.getElementsByClassName('post-details__content')[0];
        postDetails.innerText = `User ID: ${post.userId}
        Post ID: ${post.id}
        Title: ${post.title}
        Body: ${post.body}
        `
    })

const commentsContainer = document.getElementById('comments-wrapper')
const commentsDiv = document.getElementById('comments-container')
fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
    .then(response => {
        if (!response.ok) throw new Error('Failed to load comments');
        return response.json()
    })
    .then(comments => {
        const heading = document.createElement('h3');
        heading.innerText = 'Comments:';
        commentsDiv.prepend(heading);
        for (const comment of comments) {
            const commentBlock = document.createElement('div');
            commentBlock.classList.add('comment');
            const author = document.createElement('h4');
            author.classList.add('comment-author');
            const topic = document.createElement('p');
            topic.classList.add('comment-topic');
            const content = document.createElement('p');
            content.classList.add('comment-content');
            author.innerText = comment.email;
            topic.innerText = comment.name;
            content.innerText = comment.body;
            commentBlock.append(author, topic, content);
            commentsContainer.appendChild(commentBlock);
        }
    })
    .catch(() => {
        const error = document.createElement('p');
        error.innerText = 'Failed to load comments';
        commentsDiv.appendChild(error);
    })