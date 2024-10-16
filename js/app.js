const VOCABULARY_SIZE = 1020
const gridWords = document.querySelectorAll(".grid-item-words");
const gridKeys = document.querySelectorAll(".grid-item-key");
const button = document.getElementById("button-jugar");
const alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYyZz"
const gray = "rgb(85, 85, 85)";
const darkGray = "rgb(35, 35, 35)"; 
const green = "rgb(71, 209, 71)";
const yellow = "rgb(230, 230, 0)";
const red = "rgb(255, 0, 0)";
const background_color = "#18191a";
const message = document.getElementById("message")

let selectedWord = "";
let playing;
let current_row = 1;
let current_col = 1;
let current_item;

button.addEventListener("click", function(event) {
    button.blur();
    resetGame();
});

function resetGame() {
    playing = true;
    current_row = 1;
    current_col = 1;
    current_item = getItem(current_row, current_col);
    cleanGrid();
    colorItem(current_item);
    selectRandomWord();
    document.addEventListener('keydown', handleKeyPressed);
    document.addEventListener('click', handleKeyClicked)
}

function handleKeyClicked(event) {
    const clickedElement = event.target;
    let buttonText = "";
    if (clickedElement.classList.contains("grid-item-key") || clickedElement.classList.contains("delete-icon")) {
        buttonText = clickedElement.textContent.trim();
        if (buttonText === "") {
            buttonText = "Borrar"; 
        }
    }
    handleKey(buttonText);
}

function handleKeyPressed(event) {
    handleKey(event.key);
}

function handleKey(input) {
    if (playing) {
        if (input != "" && alphabet.includes(input)) {
            current_item = getItem(current_row, current_col);
            current_item.textContent = input.toUpperCase();
            if (current_col < 5){
                current_col++;
                next_item = getItem(current_row, current_col);
                colorItem(next_item);
            }
            decolorItem(current_item);
        }
        if (input === "Enter" || input === "Enviar") {
            last_item = getItem(current_row, 5);
            if (last_item.textContent != "") {
                createdWord = joinWord();
                wordExists(createdWord)
                    .then(exists => {
                        if (exists) {
                            checkWord(createdWord);
                        } else {
                            showMessage("La palabra introducida no existe.", red, 2000);
                        }
                    });
            }
            else {
                showMessage("La palabra introducida no tiene 5 letras.", red, 2000);
            }
        }
        if (input === "Backspace" || input === "Borrar") {
            current_item = getItem(current_row, current_col);
            if (current_item.textContent === "" && current_col > 1) {
                current_col--;
                next_item = getItem(current_row, current_col);
                colorItem(next_item);
                decolorItem(current_item);
            }
            else {
                current_item.textContent = "";
                if (current_col > 1) {
                    current_col--;
                    next_item = getItem(current_row, current_col);
                    colorItem(next_item);
                    decolorItem(current_item);
                }
            }
        }
    }
}

function getItem(r, c) {
    let strPos = ".r" + r + ".c" + c;
    return document.querySelector(strPos);
}

function selectRandomWord() {
    let randomIndex = Math.floor(Math.random() * (VOCABULARY_SIZE + 1));
    fetch('static/palabras_elegibles.txt')
        .then(response => response.text())  // Lee el archivo como texto
        .then(data => {
            const palabras = data.split('\n');  // Divide el contenido en líneas/palabras
            selectedWord = palabras[randomIndex].trim();  // Elimina posibles espacios en blanco
            selectedWord = "perla";
        });
    playing = true;
}

function cleanGrid() {
    for (let i = 0; i < gridWords.length; i++) {
        let element = gridWords[i];
        element.textContent = "";
        element.style.backgroundColor = background_color;
        element.style.border = "solid rgb(85, 85, 85)";
    }

    for (let i = 0; i < gridKeys.length; i++) {
        const element = gridKeys[i];
        element.style.backgroundColor = "rgb(55, 53, 64)";
    }
}

function colorItem(item) {
    item.style.border = "solid #0099ff";
}

function decolorItem(item) {
    item.style.border = "solid rgb(85, 85, 85)";
}

function joinWord() {
    fullRow = document.querySelectorAll(".grid-item-words.r" + current_row);
    let newWord = "";
    for (let i = 0; i < fullRow.length; i++) {
        const element = fullRow[i].textContent;
        newWord += element;
    }
    return newWord.toLowerCase();
}

async function wordExists(word) {
    let exists = false;
    const response = await fetch('static/palabras_posibles.txt');
    const data = await response.text();
    
    const palabras = data.split('\n');  // Divide el contenido en líneas/palabras
    for (let i = 0; i < palabras.length; i++) {
        const element = palabras[i].trim();  // Eliminamos posibles espacios en blanco
        if (word === element) {
            exists = true;
            break;
        }
    }
    return exists;
}

function checkWord(word) {
    // Find out which letters match.
    let correct_letters = 0;
    let lettersQuantities = {};

    for (let i = 0; i < 5; i++) {
        let column = i + 1
        cell = document.querySelector(".grid-item-words.r" + current_row + ".c" + column);
        keyItem = getKeyItem(word[i]);

        // Letter matched
        if (word[i] == selectedWord[i]) {
            cell.style.backgroundColor = green;
            keyItem.style.backgroundColor = green;
            correct_letters++;
        }
        
        // Letter not matched. 
        else {
            lettersQuantities[selectedWord[i]]++;
        }
    }

    // Paint keys
    for (let i = 0; i < 5; i++) {
        let column = i + 1
        cell = document.querySelector(".grid-item-words.r" + current_row + ".c" + column);
        keyItem = getKeyItem(word[i]);
        if (word[i] != selectedWord[i]) {
            if (word[i] in lettersQuantities) {
                cell.style.backgroundColor = yellow;
                if (keyItem.style.backgroundColor != green) {
                    keyItem.style.backgroundColor = yellow;
                }
            }
            else {
                cell.style.backgroundColor = gray;
                if (keyItem.style.backgroundColor != green && keyItem.style.backgroundColor != yellow) {
                    keyItem.style.backgroundColor = darkGray;
                }
            }
        }
    }

    // Every letter is matched!
    if (correct_letters == 5) {
        showMessage("¡Felicidades! Has acertado la palabra.", green, 5000);
        playing = false;
    }

    // Not all the letters are matched.
    else {

        // It was the last attempt.
        if (current_row == 6) {
            showMessage("Vaya, no has acertado. La palabra correcta era " + selectedWord.toUpperCase() + ".", red, 5000);
            playing = false;
        }

        // Next attempt...
        else
        {
            nextLine();
        }
    }
}

function showMessage(message_text, color, time) {
    message.style.display = "block";
    message.textContent = message_text;
    message.style.backgroundColor = color;
    setTimeout(function() {
        message.style.display = "none";
    }, time);
}

function nextLine() {
    decolorItem(current_item);
    current_row++;
    current_col = 1;
    current_item = getItem(current_row, current_col);
    colorItem(current_item)

}

function getKeyItem(key) {
    item = document.getElementById(key.toUpperCase() + "-button");
    return item;
}