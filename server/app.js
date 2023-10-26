const http = require('http');
const url = require('url');

const PORT = 3000;

const dictionary = [];
let number_of_requests = 0;

const validateInput = (word, definition) => {
    // If there is no word or definition
    if (!word || !definition) {
        return false;
    }
    // return false if the word isn't string
    if (typeof word !== "string" || typeof definition !== "string") {
        return false;
    }
    // check if the word has number
    if (/\d/.test(word)) {
        return false;
    }

    return true;
}

function handleExistingEntry(res, word) {
    res.writeHead(400, {
        'Content-Type': "application/json"
    })
    res.end(
        JSON.stringify({
            success: false,
            message: `Error!!  '${word}' already exists. Word notsaved!`,
            requests: number_of_requests,
            dictionary_length: dictionary.length
        })
    )
}

const server = http.createServer((req, res) => {
    console.log("The server received a request!");
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    // Enabling CORS for all routes
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    } else if (pathName === "/" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        })
        res.end("Server is up and running!");
    }

    if (pathName === '/api/definitions' && req.method === "POST") {
        number_of_requests++;
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        })
        req.on("end", () => {
            const {
                word,
                definition
            } = JSON.parse(body);

            if (validateInput(word, definition)) {
                const existingEntry = dictionary.find((entry) => entry.word === word);
                if (existingEntry) {
                    handleExistingEntry(res, word);
                } else {
                    dictionary.push({
                        word,
                        definition
                    });
                    res.writeHead(200, {
                        "Content-Tyepe": "application/json"
                    })
                    res.end(
                        JSON.stringify({
                            success: true,
                            message: `Word: ${word} and definition: ${definition} are stored now.`,
                            requests: number_of_requests,
                            dictionary_length: dictionary.length,
                        })
                    )
                }
            } else {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                })
                res.end(
                    JSON.stringify({
                        message: "Invalid input. Word and definition must be no empty strings.",
                        requests: number_of_requests,
                        dictionary_length: dictionary.length
                    })
                )
            }
        })
    } else if (pathName.includes("/api/definitions") && req.method === "GET") {
        number_of_requests++;
        const parsedUrl = url.parse(req.url, true);
        const searchWord = parsedUrl.query.word;

        const word_and_definition = dictionary.find((object) => object.word === searchWord);
        if (word_and_definition) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            res.end(JSON.stringify({
                success: true,
                message: `Word ${searchWord} found!`,
                definition: word_and_definition.definition,
                requests: number_of_requests,
                dictionary_length: dictionary.length
            }))
        } else {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            res.end(
                JSON.stringify({
                    message: `Word '${searchWord}' not found!`,
                    requests: number_of_requests,
                    dictionary_length: dictionary.length,
                })
            );
        }
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});