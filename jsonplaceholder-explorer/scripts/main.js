fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch details');
        return response.json()
    })
    .then(users => {
        if (!Array.isArray(users) || users.length === 0) {
            document.getElementById('users-container').innerText = "Couldn't find any users";
            return;
        }
        const usersContainer = document.getElementById('users-container');
        for (const user of users) {
            const userBlock = document.createElement('div');
            userBlock.classList.add('user-block');
            const idLabel = document.createElement('p');
            idLabel.innerText = `ID: ${user['id']}`;
            const nameLabel = document.createElement('p');
            nameLabel.innerText = `Name: ${user['name']}`;
            const detailsButton = document.createElement('a');
            detailsButton.classList.add('user-details__button');
            detailsButton.innerText = 'More Details';
            detailsButton.href = './user-details.html?id=' + user['id'];
            userBlock.append(idLabel, nameLabel, detailsButton);
            usersContainer.appendChild(userBlock);
        }
    })
    .catch(() => {
        document.getElementById('users-container').innerText = "Couldn't load users. Try again later.";
    });