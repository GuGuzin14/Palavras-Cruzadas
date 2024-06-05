const gridContainer = document.getElementById('gridContainer');
const tableContainer = document.getElementById('table-container');
const generateBtn = document.getElementById('generateButton');
const buttonGenerateTip = document.getElementById('generateTip');
const buttonTip = document.getElementById('addInputTip');
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

// buttonGenerateTip.addEventListener('click', () => {
//     generateTip();
// })

buttonTip.addEventListener('click', () => {
    addTip();
})

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
        const inputValue = input.value;
        if (inputValue === '') {
            const row = input.closest('.row');
            input.remove();
            if (row) {
                row.style.visibility = 'hidden';
            }
        } else if (isNaN(inputValue)) {
            input.value = "";
        }
       else {
            input.readOnly = true; // Torna o input readonly se contiver um número
        }
     });

    const inputsTip = document.querySelectorAll('#inputTip');
    const divTip = document.getElementById('inputTips');
    const labels = document.querySelectorAll('label');
    let cont = 1;
    inputsTip.forEach(input => {
        const p = document.createElement('p');
        divTip.appendChild(p);
        p.innerHTML = cont + ". " + " " + input.value;
        input.remove();
        labels.forEach(label => {
            label.remove();
        });
        
        buttonTip.remove();
        cont++;
        console.log(cont);
    });
}

function checkWords() {
    const table = document.querySelector('#table-container .table');
    const cols = table.querySelectorAll('.col');

    let currentArray = Array.from({ length: selectedCols }, () => Array(selectedRows).fill('0'));

    cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
            const input = row.querySelector(".inputLetter");
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
                if (input && isNaN(input.value)) {
                    input.style.backgroundColor = 'green'; // Marca os inputs corretos com verde
                }
            } else {
                isCorrect = false;
                if (input && isNaN(input.value)) {
                    input.style.backgroundColor = 'red'; // Reseta a cor dos inputs incorretos
                }
            }
        }
    }

    if (isCorrect) {
        alert("A palavra está correta!");
        const inputs = document.querySelectorAll('.inputLetter');
        const btnReset = document.createElement('button');
        const mainElements = document.getElementById('main-elements');
        inputs.forEach(input => {
            input.readOnly = true;
        })
        mainElements.appendChild(btnReset);
        console.log(btnReset);
    } else {
        alert("A palavra está incorreta. Tente novamente.");
    }
}

function addTip(){
    const inputTip = document.createElement('input');
    const label = document.createElement('label');
    label.innerHTML = "Insira a Dica: ";
    inputTip.setAttribute('type', 'text');
    inputTip.setAttribute('id', 'inputTip');
    console.log(inputTip);

    const divTip = document.getElementById('inputTips');
    if(divTip){
        buttonTip.remove();
        divTip.appendChild(label);
        divTip.appendChild(inputTip);
        divTip.appendChild(buttonTip);
    }
}

// function generateTip(){
//     const inputsTip = document.querySelectorAll('#inputTip');
//     const divTip = document.getElementById('inputTips');
//     const labels = document.querySelectorAll('label');
    
//     inputsTip.forEach(input => {
//         const p = document.createElement('p');
//         divTip.appendChild(p);
//         p.innerHTML = input.value;
//         input.remove();

//         labels.forEach(label => {
//             label.remove();
//         })

//         buttonTip.remove();
//     })
// }

