const VOCABULARY_SIZE = 4553
const gridWords = document.querySelectorAll(".grid-item-words");
const button = document.getElementById("button-jugar");
const alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYyZz"
const gray = "rgb(85, 85, 85)";
const green = "rgb(71, 209, 71)";
const yellow = "rgb(255, 255, 102)";

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
    current_item = getCurrentItem(current_row, current_col);
    colorItem(current_item);
    cleanGrid();
    selectRandomWord();
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    if (playing) {
        if (alphabet.includes(event.key)) {
            current_item = getCurrentItem(current_row, current_col);
            current_item.textContent = event.key.toUpperCase();
            if (current_col < 5){
                current_col++;
                next_item = getCurrentItem(current_row, current_col);
                colorItem(next_item);
            }
            decolorItem(current_item);
        }
        if (event.key === "Enter") {
            createdWord = joinWord();
            if (wordExists(createdWord)) {
                chechWord(createdWord)
            };
        }
        if (event.key === "Backspace") {
            current_item = getCurrentItem(current_row, current_col);
            if (current_item.textContent === "" && current_col > 0) {
                current_col--;
                next_item = getCurrentItem(current_row, current_col);
                colorItem(next_item);
                decolorItem(current_item);
            }
            else {
                current_item.textContent = "";
                current_col--;
                next_item = getCurrentItem(current_row, current_col);
                colorItem(next_item);
                decolorItem(current_item);
            }
        }
    }
}

function getCurrentItem(r, c) {
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
    for (let i = 0; i < 5; i++) {
        console.log(word, selectedWord);
        console.log(".grid-item-words.r" + current_row + ".c" + i+1)
        let column = i + 1
        cell = document.querySelector(".grid-item-words.r" + current_row + ".c" + column);
        // console.log(cell);
        console.log(word[i], selectedWord[i]);
        if (word[i] == selectedWord[i]) {
            cell.style.backgroundColor = green;
        }
        else if (word[i] != selectedWord[i] && selectedWord.includes(word[i])) {
            cell.style.backgroundColor = yellow;
        }
        else {
            cell.style.backgroundColor = gray;
        }
    }
    current_col++;
}