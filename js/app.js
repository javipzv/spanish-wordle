const VOCABULARY_SIZE = 4553
const gridWords = document.querySelectorAll(".grid-item-words");
const button = document.getElementById("button-jugar");
const alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYyZz"
const gray = "rgb(85, 85, 85)";
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
    console.log(current_item)
    cleanGrid();
    colorItem(current_item);
    selectRandomWord();
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    if (playing) {
        if (alphabet.includes(event.key)) {
            current_item = getItem(current_row, current_col);
            current_item.textContent = event.key.toUpperCase();
            if (current_col < 5){
                current_col++;
                next_item = getItem(current_row, current_col);
                colorItem(next_item);
            }
            decolorItem(current_item);
        }
        if (event.key === "Enter") {
            last_item = getItem(current_row, 5);
            if (last_item.textContent != "") {
                createdWord = joinWord();
                wordExists(createdWord)
                    .then(exists => {
                        if (exists) {
                            chechWord(createdWord);
                        } else {
                            showMessage("La palabra introducida no existe.", red, 2000);
                        }
                    });
            }
            else {
                showMessage("La palabra introducida no tiene 5 letras.", red, 2000);
            }
        }
        if (event.key === "Backspace") {
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
    fetch('static/vocabulario_5_letras_sin_conjugaciones.txt')
        .then(response => response.text())  // Lee el archivo como texto
        .then(data => {
            const palabras = data.split('\n');  // Divide el contenido en líneas/palabras
            selectedWord = palabras[randomIndex].trim();  // Elimina posibles espacios en blanco
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
}

function colorItem(item) {
    console.log(item);
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
    const response = await fetch('static/vocabulario_5_letras_sin_conjugaciones.txt');
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

function chechWord(word) {
    let correct_letters = 0;
    for (let i = 0; i < 5; i++) {
        let column = i + 1
        cell = document.querySelector(".grid-item-words.r" + current_row + ".c" + column);
        if (word[i] == selectedWord[i]) {
            cell.style.backgroundColor = green;
            correct_letters++;
        }
        else if (word[i] != selectedWord[i] && selectedWord.includes(word[i])) {
            cell.style.backgroundColor = yellow;
        }
        else {
            cell.style.backgroundColor = gray;
        }
    }
    if (correct_letters == 5) {
        showMessage("¡Felicidades! Has acertado la palabra.", green, 5000);
        playing = false;
    }
    else {
        if (current_row == 6) {
            showMessage("Vaya, no has acertado. La palabra correcta era " + selectedWord.toUpperCase(), red, 5000);
            playing = false;
        }
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