<template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      <div class="grid-position">
        <div class="grid-container" id="gridContainer">
          <div v-for="(item, index) in grid" :key="index"
            :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
            @mouseover="highlightGrid(item.row, item.col)" @click="createTable(item.row + 1, item.col + 1)">
          </div>
        </div>
        <br />
        <div id="dimensionsDisplay"></div>
      </div>

      <div class="header">
        <button class="mainBtn" @click="generateCrossWords">Criar</button>
        <button class="mainBtn" @click="checkWords">Check Word</button>
      </div>

      <div id="inputTips">
        <h1>Dicas:</h1>
      </div>
    </div>

    <div id="table-container" v-html="tableHTML"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: 10,
      cols: 10,
      selectedRows: 0,
      selectedCols: 0,
      grid: [],
      tipMap: {}, // Mapeia números para inputTip
      tableHTML: '',
      nextNumber: 1,
    };
  },
  methods: {
    createGrid() {
      this.grid = [];
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.grid.push({ row: i, col: j });
        }
      }
    },
    isSelected(row, col) {
      return row <= this.selectedRows && col <= this.selectedCols;
    },
    highlightGrid(row, col) {
      this.selectedRows = row;
      this.selectedCols = col;
      this.displayDimensions(this.selectedCols + 1, this.selectedRows + 1);
    },
    createTable(rows, cols) {
      this.selectedRows = rows;
      this.selectedCols = cols;
      this.displayDimensions(cols, rows);

      let tableHTML = '<div class="table">';
      for (let i = 0; i < cols; i++) {
        tableHTML += '<div class="col">';
        for (let j = 0; j < rows; j++) {
          const inputID = `input_${i}_${j}`;
          tableHTML += `<div class="row">
                          <input type="text" class="inputLetter" id="${inputID}" maxLength="1">
                        </div>`;
        }
        tableHTML += '</div>';
      }
      tableHTML += '</div>';
      this.tableHTML = tableHTML;

      this.$nextTick(() => {
        document.querySelectorAll('.inputLetter').forEach(input => {
          input.addEventListener('dblclick', (event) => {
            this.addNumberToCell(event.target);
          });
        });
      });
    },
    addNumberToCell(input) {
      const numberSpan = input.closest('.row').querySelector('.number');
      if (numberSpan) {
        const number = parseInt(numberSpan.textContent, 10);
        numberSpan.remove();
        this.removeTipInput(number);
        this.adjustLargerNumbers(number);
        this.updateNextNumber();
      } else {
        const newNumberSpan = document.createElement('span');
        newNumberSpan.classList.add('number');
        newNumberSpan.textContent = this.nextNumber++;
        input.closest('.row').appendChild(newNumberSpan);
        this.addTipInput(newNumberSpan.textContent);
      }
    },
    addTipInput(number) {
      const inputTip = document.createElement('input');
      const label = document.createElement('label');
      inputTip.setAttribute('type', 'text');
      inputTip.setAttribute('id', `inputTip_${number}`);
      inputTip.classList.add('tip-input');
      inputTip.placeholder = 'Digite a dica aqui';

      const divTip = document.getElementById('inputTips');
      if (divTip) {
        divTip.appendChild(inputTip);
        this.tipMap[number] = inputTip;
      }
    },
    removeTipInput(number) {
      const inputTip = this.tipMap[number];
      if (inputTip) {
        inputTip.remove();
        const label = inputTip.previousSibling;
        if (label) {
          label.remove();
        }
        delete this.tipMap[number];
      }
    },
    updateNextNumber() {
      let maxNumber = 0;
      document.querySelectorAll('.number').forEach(span => {
        const currentNumber = parseInt(span.textContent, 10);
        if (currentNumber > maxNumber) {
          maxNumber = currentNumber;
        }
      });
      this.nextNumber = maxNumber + 1;
    },
    adjustLargerNumbers(removedNumber) {
      document.querySelectorAll('.number').forEach(span => {
        const currentNumber = parseInt(span.textContent, 10);
        if (currentNumber > removedNumber) {
          span.textContent = currentNumber - 1;
          this.updateTipLabel(currentNumber, currentNumber - 1);
        }
      });
    },
    updateTipLabel(oldNumber, newNumber) {
      const label = document.querySelector(`label[for="inputTip_${oldNumber}"]`);
      const input = document.getElementById(`inputTip_${oldNumber}`);
      if (label && input) {
        label.innerHTML = `Dica ${newNumber}: `;
        label.setAttribute('for', `inputTip_${newNumber}`);
        input.setAttribute('id', `inputTip_${newNumber}`);
        this.tipMap[newNumber] = input;
        delete this.tipMap[oldNumber];
      }
    },
    generateCrossWords() {
      this.$nextTick(() => {
        const inputs = document.querySelectorAll('#table-container input');
        const table = document.querySelector('#table-container .table');
        const cols = table.querySelectorAll('.col');

        this.initialArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

        cols.forEach((col, x) => {
          const rows = col.querySelectorAll('.row');
          rows.forEach((row, y) => {
            const input = row.querySelector('input');
            if (input) {
              const inputValue = input.value;
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value;
          if (inputValue === '') {
            input.remove();
            const row = input.closest('.row');
            if (row) row.style.visibility = 'hidden';
          } else if (isNaN(inputValue)) {
            input.value = '';
          } else {
            input.readOnly = true;
          }
        });

        const inputsTip = document.querySelectorAll('.tip-input');
        const divTip = document.getElementById('inputTips');
        const labels = document.querySelectorAll('label');
        let cont = 1;
        inputsTip.forEach((input) => {
          const p = document.createElement('p');
          divTip.appendChild(p);
          p.innerHTML = cont + '. ' + ' ' + input.value;
          input.remove();
          labels.forEach((label) => {
            label.remove();
          });
          cont++;
        });
      });
    },
    checkWords() {
      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            currentArray[x][y] = input.value === '' ? '0' : input.value;
          }
        });
      });

      console.log('Array atual das letras preenchidas:', currentArray);

      let isCorrect = true;
      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const input = document.getElementById(`input_${i}_${j}`);
          if (this.initialArray[i][j] === currentArray[i][j]) {
            if (input && input.value !== '') {
              input.style.backgroundColor = 'green';
            }
          } else {
            isCorrect = false;
            if (input && input.value !== '') {
              input.style.backgroundColor = 'red';
            }
          }
        }
      }

      if (isCorrect) {
        alert('A palavra está correta!');
        const inputs = document.querySelectorAll('.inputLetter');
        const btnReset = document.createElement('button');
        btnReset.textContent = 'Resetar';
        btnReset.classList.add('mainBtn');
        btnReset.addEventListener('click', () => {
          inputs.forEach(input => input.value = '');
          inputs.forEach(input => input.style.backgroundColor = '');
        });
        document.querySelector('.header').appendChild(btnReset);
      } else {
        alert('A palavra está incorreta!');
      }
    },
    displayDimensions(cols, rows) {
      const dimensionsDisplay = document.getElementById('dimensionsDisplay');
      if (dimensionsDisplay) {
        dimensionsDisplay.innerHTML = `Dimensões: ${cols} x ${rows}`;
      }
    }
  },
  mounted() {
    this.createGrid();
  }
};
</script>

<style>
@import "../assets/style.css";
</style>
