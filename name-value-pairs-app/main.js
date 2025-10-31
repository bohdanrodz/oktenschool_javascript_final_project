const pairsField = document.getElementById('pairs-list');
const pairsArr = JSON.parse(localStorage.getItem("pairsArray")) || [];
const form = document.forms.application;

window.onload = function () {
    for (const pair of pairsArr) {
        const option = document.createElement('option');
        option.innerText = `${pair.key}=${pair.value}`;
        option.value = pair.key;
        pairsField.appendChild(option);
    }
    form.addPair.value = ''
}

function saveArrayInLocalStorage() {
    localStorage.setItem('pairsArray', JSON.stringify(pairsArr));
}

function deletePair(name) {
    const i = pairsArr.findIndex(pair => pair.key === name);
    if (i > -1) {
        pairsArr.splice(i, 1);
        saveArrayInLocalStorage();
    }
}

function sortBy(field) {
    pairsField.replaceChildren();
    const sortedArr = pairsArr.sort((a, b) => a[field].localeCompare(b[field], undefined, {sensitivity: 'base'}));
    for (const item of sortedArr) {
        const option = document.createElement('option');
        option.value = item.key;
        option.innerText = `${item.key}=${item.value}`;
        pairsField.appendChild(option);
    }

}

function returnIfAlphaNumeric(userInput) {
    let [key, value] = userInput
        .split('=')
        .map(item => item.trim())
    if (/^[a-zA-Z0-9]+$/.test(key) && /^[a-zA-Z0-9]+$/.test(value)) {
        return [key, value];
    } else if (/^[a-zA-Z0-9]+$/.test(key.replaceAll(/\s/g, '')) && /^[a-zA-Z0-9]+$/.test(value)) {
        if (confirm('Spaces in key are not allowed. Convert to camelCase automatically?(the key will be changed)')) {
            const keyCamelCase = key
                .split(/\s+/)
                .map((word, index) => index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1))
                .join('');
            console.log(keyCamelCase, value);
            return [keyCamelCase, value];
        }
    } else {
        alert('Names and Values can contain only alpha-numeric characters.')
        return null;
    }
}


form.onsubmit = (e) => {     // Add pair
    e.preventDefault();
    let inputValue = form.addPair.value;
    if (inputValue.includes('=') && inputValue.split('=').length === 2) {
        const result = returnIfAlphaNumeric(inputValue);
        if (!result) return;                                  //exit if wrong syntax
        const [key, value] = result;
        let addFlag = true;
        for (const item of pairsArr) {
            if (item.key === key && confirm('You already have a pair with this name. Are you sure you want to change the value?')) {
                item.value = value;
                saveArrayInLocalStorage();
                addFlag = false;
                pairsField.querySelector(`[value="${key}"]`).innerText = `${key}=${value}`;
                break;
            }
        }
        if (addFlag) {
            pairsArr.push({
                key: key, value: value
            })
            saveArrayInLocalStorage();
            const optionToAdd = document.createElement('option');
            optionToAdd.value = key;
            optionToAdd.innerText = `${key}=${value}`;
            pairsField.appendChild(optionToAdd);
        }
        form.addPair.value = '';


    } else {
        alert('Pair is not added. Name/Value pair entry format should be: "name" = "value"')
    }
}


pairsField.onmousedown = (e) => {  // multiple choice without CTRL
    e.preventDefault();
    const option = e.target;
    if (option.tagName.toLowerCase() === 'option') {
        option.selected = !option.selected;
    }
}

const deleteBtn = document.getElementById('deleteBtn');
deleteBtn.onclick = (e) => {
    e.preventDefault();
    if ([...pairsField.selectedOptions].length === 0) {
        alert('Please select a pair to delete');
    } else if (confirm('Are you sure you want to delete selected pairs?')) {
        [...pairsField.selectedOptions].forEach(option => {
            const nameValueArr = option.innerText.split('=')
            deletePair(nameValueArr[0]);
            option.remove();
        })
    }
}

const sortByNameButton = document.getElementById('sortNameBtn');
sortByNameButton.onclick = (e) => {
    e.preventDefault()
    sortBy('key');
}

const sortByValueButton = document.getElementById('sortValueBtn');
sortByValueButton.onclick = (e) => {
    e.preventDefault()
    sortBy('value');
}
