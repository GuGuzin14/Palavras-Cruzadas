const gridContainer = document.getElementById('gridContainer');
const tableContainer = document.getElementById('table-container');
const generateBtn = document.getElementById('generateButton');
const checkBtn = document.getElementById('checkButton'); // Assumindo que existe um botão para checar a palavra
const rows = 10;
const cols = 10;
let selectedRows = 0;
let selectedCols = 0;
let initialArray = []; // Armazenar o array inicial

// Create the grid
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.addEventListener('mouseover', () => {
            highlightGrid(i, j);
        });
        gridItem.addEventListener('click', () => {
            createTable(i + 1, j + 1);
        });
        gridContainer.appendChild(gridItem);
    }
}

generateBtn.addEventListener('click', () => {
    generateCrossWords();
});

checkBtn.addEventListener('click', () => {
    checkWords();
});

function highlightGrid(row, col) {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.remove('selected'));
    for (let i = 0; i <= row; i++) {
        for (let j = 0; j <= col; j++) {
            gridItems[i * cols + j].classList.add('selected');
        }
    }
}

function createTable(rows, cols) {
    selectedRows = rows;
    selectedCols = cols;
    let tableHTML = '<div class="table">';
    for (let i = 0; i < cols; i++) {
        tableHTML += '<div class="col">';
        for (let j = 0; j < rows; j++) {
            const inputID = 'input_' + i + '_' + j;
            tableHTML += `<div class="row"><input type="text" class="inputLetter" id="${inputID}" maxLength="1"></div>`;
        }
        tableHTML += '</div>';
    }
    tableHTML += '</div>';
    tableContainer.innerHTML = tableHTML;
}

function generateCrossWords() {
    const inputs = document.querySelectorAll('#table-container input');
    const table = document.querySelector('#table-container .table');
    const cols = table.querySelectorAll('.col');

    initialArray = Array.from({ length: selectedCols }, () => Array(selectedRows).fill('0'));

    cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
            const inputValue = row.querySelector("input").value;
            if (inputValue !== "") {
                initialArray[x][y] = inputValue;
            }
        });
    });

    console.log("Array inicial das letras preenchidas:", initialArray);

    inputs.forEach((input) => {
        if (input.value === '') {
            const row = input.closest('.row');
            input.remove();
            if (row) {
                row.style.visibility = 'hidden';
            }
        } else {
            input.value = "";
        }
    });
}

function checkWords() {
    const table = document.querySelector('#table-container .table');
    const cols = table.querySelectorAll('.col');

    let currentArray = Array.from({ length: selectedCols }, () => Array(selectedRows).fill('0'));

    cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
            const input = row.querySelector("input");
            if (input) {
                currentArray[x][y] = input.value === "" ? "0" : input.value;
            }
        });
    });

    console.log("Array atual das letras preenchidas:", currentArray);

    let isCorrect = true;
    for (let i = 0; i < initialArray.length; i++) {
        for (let j = 0; j < initialArray[i].length; j++) {
            const input = document.getElementById(`input_${i}_${j}`);
            if (initialArray[i][j] === currentArray[i][j]) {
                if (input) {
                    input.style.backgroundColor = 'green'; // Marca os inputs corretos com verde
                }
            } else {
                isCorrect = false;
                if (input) {
                    input.style.backgroundColor = 'red'; // Reseta a cor dos inputs incorretos
                }
            }
        }
    }

    if (isCorrect) {
        alert("A palavra está correta!");
    } else {
        alert("A palavra está incorreta. Tente novamente.");
    }
}
