function validateWordAndDefinition() {
    const word = document.getElementById("word").value;
    const definition = document.getElementById("wordDefinition").value;

    var hasNumber = /\d/;
    if (hasNumber.test(word)) {
        document.getElementById("feedback").innerHTML = "Error: Word contains a number!";
    } else if (word.trim() === "" || definition.trim() === "") {
        document.getElementById("feedback").innerHTML = "Error: Word and Definition cannot be empty!"
    } else {
        const dictionaryInput = {
            word: word,
            definition: definition
        }
        storeWord(dictionaryInput);
    }
}

function storeWord(dictionaryInput) {
    fetch(`http://localhost:3000/api/definitions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dictionaryInput)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success: ', data);
        console.log(data.message);
        document.getElementById("feedback").innerHTML = `Attempting to save...\n ${data.message}`;
        document.getElementById("dictionary_length").innerHTML = `Dictionary Length: ${data.dictionary_length}`;
        document.getElementById("total_requests").innerHTML = `Total Number of Requests: ${data.requests}`;
    })
    .catch((error) => {
        console.error('Error: ', error);
        document.getElementById("feedback").innerHTML = 'Error saving word and definition', error;
    })
}
