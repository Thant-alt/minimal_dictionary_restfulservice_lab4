function searchDefinition() {
    const searchWord = document.getElementById("word_search").value;
    if(!searchWord) {
        document.getElementById("word_search").innerHTML = "Please provide a search term.";
        return;
    }

    fetch(`http://localhost:3000/api/definitions/?word=${searchWord}`) 
        .then(response => {
            if(!response.ok) {
                throw new Error(`Word ' ${searchWord}' not found!`)
            }
            return response.json();
        })
        .then(data => {
            console.log('Sucess: ', data);
            document.getElementById("word_definition").innerHTML = `${data.definition}`;
        })
        .catch((error) => {
            console.error('Error: ', error);
            document.getElementById("word_definition").innnerHTML = 'Word not found';
        })
    
}
