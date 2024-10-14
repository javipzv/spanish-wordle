const button = document.getElementById("button-jugar");
const VOCABULARY_SIZE = 5505

let selectedWord = "";


button.addEventListener("click", resetWord);

document.addEventListener('keydown', (event) => {

});

function resetWord() {
    selectRandomWord();
}

function selectRandomWord() {
    let randomIndex = Math.floor(Math.random() * (VOCABULARY_SIZE + 1));
    fetch('static/vocabulario_5_letras_sin_conjugaciones.txt')
        .then(response => response.text())  // Lee el archivo como texto
        .then(data => {
            const palabras = data.split('\n');  // Divide el contenido en líneas/palabras
            const palabraAleatoria = palabras[randomIndex].trim();  // Elimina posibles espacios en blanco
            console.log(palabraAleatoria)
        })
}