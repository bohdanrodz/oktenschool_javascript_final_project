const id = new URLSearchParams(location.search).get('id');
const userBlock = document.getElementById('user-info');

if (!id) {
    userBlock.innerText = 'User ID is required';
    throw new Error('Missing user ID');
}

fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user details');
        return response.json();
    })
    .then(user => {
        const userFirstInfoBlock = document.createElement('div');
        userFirstInfoBlock.classList.add('user-info-block');
        userFirstInfoBlock.innerText = `ID: ${user.id}
                Name: ${user.name}
                Username: ${user.username}
                Email: ${user.email}
                Address:
            `
        const userSecondInfoBlock = document.createElement('ul');
        userSecondInfoBlock.classList.add('user-info-block');
        for (const addressLine in user.address) {
            if (typeof user.address[addressLine] !== 'object') {
                const li = document.createElement('li');
                li.innerText = `${addressLine.charAt(0).toUpperCase() + addressLine.slice(1)}: ${user.address[addressLine]}`;
                userSecondInfoBlock.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.innerText = `${addressLine}:`;
                const innerUl = document.createElement('ul');
                for (const innerAddressLine in user.address[addressLine]) {
                    const li = document.createElement('li');
                    li.innerText = `${innerAddressLine.charAt(0).toUpperCase() + innerAddressLine.slice(1)}: ${user.address[addressLine][innerAddressLine]}`;
                    innerUl.appendChild(li);
                }
                li.appendChild(innerUl);
                userSecondInfoBlock.appendChild(li);
            }
        }
        const userThirdInfoBlock = document.createElement('div');
        userThirdInfoBlock.classList.add('user-info-block');
        userThirdInfoBlock.innerText = `Phone: ${user.phone}
                Website: ${user.website}
                Company:`
        const userFourthInfoBlock = document.createElement('ul');
        userFourthInfoBlock.classList.add('user-info-block');
        for (const addressLine in user.company) {
            const li = document.createElement('li');
            li.innerText = `${addressLine.charAt(0).toUpperCase() + addressLine.slice(1)}: ${user.company[addressLine]}`;
            userFourthInfoBlock.appendChild(li);
        }
        userBlock.append(userFirstInfoBlock, userSecondInfoBlock, userThirdInfoBlock, userFourthInfoBlock);
    })
    .catch(() => {
        userBlock.innerText = "Failed to fetch user details";
    })

const getPostsButton = document.getElementById('get-posts');
const heading = document.getElementsByClassName('user-posts__heading')[0];

getPostsButton.onclick = (e) => {
    e.preventDefault();
    heading.style.display = 'block';
    const mainDiv = document.getElementById('user-posts');
    if (mainDiv.querySelector('.post-list')) {
        mainDiv.querySelector('.post-list').remove();
    }
    const postsContainer = document.createElement('div');
    postsContainer.classList.add('post-list');
    fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch posts');
            return response.json()
        })
        .then(posts => {
            console.log(posts);
            for (const post of posts) {
                const postContainer = document.createElement('div');
                postContainer.classList.add('post');
                postContainer.innerHTML = `<span class="bold">${post.title}.</span><br> (Click <a href="./post-details.html?postId=${post.id}">here</a>)`
                postsContainer.appendChild(postContainer);
            }
        })
        .catch(() => {
            postsContainer.innerText = "Failed to fetch posts";
        })
    mainDiv.appendChild(postsContainer)

}