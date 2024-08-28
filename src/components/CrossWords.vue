<!-- <template>
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
            // input.remove();
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
</style> -->








<!-- <template>
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
        <button class="mainBtn" @click="resetCrossWords">Resetar</button>
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
      isCreated: false, // Adiciona esta variável
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
      if (this.isCreated) {
        return; // Não permite adicionar números após a criação
      }

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
            // input.remove();
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

        // Atualize o estado para indicar que o crucigrama foi gerado
        this.isCreated = true;
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
        const inputs = document.querySelectorAll('#table-container input');
        inputs.forEach(input => {
          input.style.backgroundColor = 'green';
        });
      } else {
        alert('A palavra está incorreta. Verifique os valores.');
      }
    },
    resetCrossWords() {
      this.isCreated = false;
      this.tableHTML = '';
      document.getElementById('inputTips').innerHTML = '';
      this.createGrid();
    },
    displayDimensions(cols, rows) {
      const dimensionsDisplay = document.getElementById('dimensionsDisplay');
      if (dimensionsDisplay) {
        dimensionsDisplay.textContent = `Dimensões Selecionadas: ${cols} x ${rows}`;
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
.container {
  margin: 20px;
}

.grid-position {
  display: flex;
  flex-wrap: wrap;
}

.grid-item {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.grid-item.selected {
  background-color: #e0e0e0;
}

.table {
  display: flex;
}

.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.inputLetter {
  width: 30px;
  height: 30px;
  text-align: center;
}

.number {
  margin-left: 5px;
  color: red;
}

.header {
  margin-bottom: 10px;
}

.mainBtn {
  margin-right: 5px;
}

#inputTips input {
  margin-bottom: 5px;
}
</style> -->










<!-- <template>
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
        <button class="mainBtn" @click="checkWords" :disabled="!isCreated">Check Word</button>
        <button class="mainBtn" @click="resetCrossWords">Resetar</button>
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
      isCreated: false, // Adiciona esta variável
      initialArray: [], // Adiciona esta variável para armazenar o array inicial das letras
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
      if (this.isCreated) {
        return; // Não permite adicionar números após a criação
      }

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
            // input.remove();
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

        // Atualize o estado para indicar que o crucigrama foi gerado
        this.isCreated = true;
      });
    },
    checkWords() {
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

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
          if (this.initialArray[i][j] !== currentArray[i][j]) {
            isCorrect = false;
            break;
          }
        }
        if (!isCorrect) break;
      }

      if (isCorrect) {
        alert('Todas as palavras estão corretas!');
        document.querySelectorAll('#table-container input').forEach(input => {
          input.style.backgroundColor = 'green';
        });
      } else {
        alert('A palavra está incorreta. Verifique os valores.');
      }
    },
    resetCrossWords() {
      this.isCreated = false;
      this.tableHTML = '';
      document.getElementById('inputTips').innerHTML = '';
      this.createGrid();
    },
    displayDimensions(cols, rows) {
      const dimensionsDisplay = document.getElementById('dimensionsDisplay');
      if (dimensionsDisplay) {
        dimensionsDisplay.textContent = `Dimensões Selecionadas: ${cols} x ${rows}`;
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

</style> -->















<!-- <template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      <div class="grid-position">
        <div class="grid-container" id="gridContainer">
          <div v-for="(item, index) in grid" :key="index"
            :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
            @mouseover="highlightGrid(item.row, item.col)" 
            @click="createTable(item.row + 1, item.col + 1)">
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
      isCreated: false, // Define se o crucigrama foi criado
      initialArray: [], // Array para armazenar as letras iniciais
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
      this.isCreated = true; // Define que o crucigrama foi criado

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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            currentArray[x][y] = input.value.trim().toUpperCase(); // Normaliza para maiúsculas
          }
        });
      });

      console.log('Array atual das palavras inseridas:', currentArray);
      console.log('Array inicial das letras preenchidas:', this.initialArray);

      let isCorrect = true;
      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const input = document.getElementById(`input_${i}_${j}`);
          if (this.initialArray[i][j] === currentArray[i][j]) {
            input.style.backgroundColor = 'lightgreen';
          } else {
            input.style.backgroundColor = 'salmon';
            isCorrect = false;
          }
        }
      }
    },
    displayDimensions(cols, rows) {
      const displayElement = document.getElementById('dimensionsDisplay');
      if (displayElement) {
        displayElement.innerHTML = `Número de colunas: ${cols}<br>Número de linhas: ${rows}`;
      }
    },
    resetGame() {
      this.isCreated = false;
      this.nextNumber = 1;
      this.grid = [];
      this.tableHTML = '';
      this.selectedRows = 0;
      this.selectedCols = 0;
      this.initialArray = [];
      this.tipMap = {};

      const inputTipsDiv = document.getElementById('inputTips');
      if (inputTipsDiv) {
        inputTipsDiv.innerHTML = '<h1>Dicas:</h1>';
      }

      const tableContainer = document.getElementById('table-container');
      if (tableContainer) {
        tableContainer.innerHTML = '';
      }

      const inputs = document.querySelectorAll('#table-container input');
      inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
      });
    },
  },
  created() {
    this.createGrid();
  },
};
</script>

<style>
@import "../assets/style.css";
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
}

.grid-item {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.grid-item.selected {
  background-color: lightblue;
}

.table {
  display: flex;
}

.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.inputLetter {
  width: 30px;
  height: 30px;
  text-align: center;
}

.number {
  position: absolute;
  font-size: 12px;
  color: red;
}

.header {
  margin: 20px 0;
}

.mainBtn {
  margin: 5px;
}

#dimensionsDisplay {
  margin: 10px 0;
}

.tip-input {
  margin: 5px;
}

#inputTips {
  margin-top: 20px;
}
</style> -->
























<!-- <template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      <div class="grid-position">
        <div class="grid-container" id="gridContainer">
          <div v-for="(item, index) in grid" :key="index"
            :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
            @mouseover="highlightGrid(item.row, item.col)" 
            @click="createTable(item.row + 1, item.col + 1)">
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

      <div class="reset-button-container">
        <button class="mainBtn" @click="resetGame">Resetar</button>
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
      tipMap: {},
      tableHTML: '',
      nextNumber: 1,
      isCreated: false, 
      initialArray: [], 
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
                          <input type="text" class="inputLetter" id="${inputID}" maxLength="1" ${this.isCreated ? 'disabled' : ''}>
                        </div>`;
        }
        tableHTML += '</div>';
      }
      tableHTML += '</div>';
      this.tableHTML = tableHTML;
      this.isCreated = true; 

      this.$nextTick(() => {
        if (!this.isCreated) return; 
        document.querySelectorAll('.inputLetter').forEach(input => {
          input.addEventListener('dblclick', (event) => {
            if (!this.isCreated) {
              this.addNumberToCell(event.target);
            }
          });
        });
      });
    },
    addNumberToCell(input) {
      if (this.isCreated) {
        return; // Não permite adicionar números após a criação
      }

     
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
          this.isCreated = true;
        });
      });
    },
    checkWords() {
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            const inputValue = input.value.trim().toUpperCase();
            currentArray[x][y] = inputValue;
          }
        });
      });

      console.log('Array atual das letras preenchidas:', currentArray);

      let isCorrect = true;

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i}_${j}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
              isCorrect = false;
            }
          }
        }
      }

      if (isCorrect) {
        alert('Parabéns! Todas as palavras estão corretas.');
        
      } else {
        alert('Algumas palavras estão incorretas. Verifique os campos destacados.');
      }
    },
    displayDimensions(cols, rows) {
      const displayElement = document.getElementById('dimensionsDisplay');
      if (displayElement) {
        displayElement.innerHTML = `Número de colunas: ${cols}<br>Número de linhas: ${rows}`;
      }
    },
    resetGame() {
     
      this.isCreated = false;
      this.nextNumber = 1;
      this.grid = [];
      this.tableHTML = '';
      this.selectedRows = 0;
      this.selectedCols = 0;
      this.initialArray = [];
      this.tipMap = {};

     
      this.createGrid();
      this.displayDimensions(this.selectedCols, this.selectedRows);

      const inputTipsDiv = document.getElementById('inputTips');
      if (inputTipsDiv) {
        inputTipsDiv.innerHTML = '<h1>Dicas:</h1>';
      }

      const tableContainer = document.getElementById('table-container');
      if (tableContainer) {
        tableContainer.innerHTML = '';
      }

      const inputs = document.querySelectorAll('#table-container input');
      inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.disabled = false; 
      });
    },
  },
  created() {
    this.createGrid();
  },
};
</script>

<style>
@import "../assets/style.css";
</style> -->











<!-- <template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      <div class="grid-position">
        <div class="grid-container" id="gridContainer">
          <div v-for="(item, index) in grid" :key="index"
            :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
            @mouseover="highlightGrid(item.row, item.col)" 
            @click="createTable(item.row + 1, item.col + 1)">
          </div>
        </div>
        <br />
        <div id="dimensionsDisplay"></div>
      </div>

      <div class="header">
        <button class="mainBtn" @click="generateCrossWords">Criar</button>
        <button class="mainBtn" @click="checkWords">Check Words</button>
      </div>

      <div id="inputTips">
        <h1>Dicas:</h1>
      </div>

      <div class="reset-button-container">
        <button class="mainBtn" @click="resetGame">Resetar</button>
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
      isCreated: false, // Define se o crucigrama foi criado
      initialArray: [], // Array para armazenar as letras iniciais
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
                          <input type="text" class="inputLetter" id="${inputID}" maxLength="1" ${this.isCreated ? 'disabled' : ''}>
                        </div>`;
        }
        tableHTML += '</div>';
      }
      tableHTML += '</div>';
      this.tableHTML = tableHTML;

      if (this.isCreated) return; // Não adicione eventos se já estiver criado

      this.$nextTick(() => {
        document.querySelectorAll('.inputLetter').forEach(input => {
          input.addEventListener('dblclick', (event) => {
            if (!this.isCreated) {
              this.addNumberToCell(event.target);
            }
          });
        });
      });

      this.isCreated = true; // Define que o crucigrama foi criado
    },
    addNumberToCell(input) {
      if (input.disabled) return; // Não faça nada se o input estiver desativado

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
      
      label.innerHTML = `Dica ${number}: `;
      label.setAttribute('for', `inputTip_${number}`);

      const divTip = document.getElementById('inputTips');
      if (divTip) {
        divTip.appendChild(label);
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('input');
          if (input) {
            const inputValue = input.value.trim().toUpperCase();
            currentArray[x][y] = inputValue;
          }
        });
      });

      console.log('Array atual das letras preenchidas:', currentArray);

      let isCorrect = true;

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i}_${j}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
              isCorrect = false;
            }
          }
        }
      }

      if (isCorrect) {
        alert('Parabéns! Todas as palavras estão corretas.');
        // O botão de reset já está sempre visível, então não há necessidade de alterar a visibilidade.
      } else {
        alert('Algumas palavras estão incorretas. Verifique os campos destacados.');
      }
    },
    displayDimensions(cols, rows) {
      const displayElement = document.getElementById('dimensionsDisplay');
      if (displayElement) {
        displayElement.innerHTML = `Número de colunas: ${cols}<br>Número de linhas: ${rows}`;
      }
    },
    resetGame() {
      // Redefine todos os atributos e variáveis
      this.isCreated = false;
      this.nextNumber = 1;
      this.grid = [];
      this.tableHTML = '';
      this.selectedRows = 0;
      this.selectedCols = 0;
      this.initialArray = [];
      this.tipMap = {};

      // Atualiza a visualização
      this.createGrid();
      this.displayDimensions(this.selectedCols, this.selectedRows);

      const inputTipsDiv = document.getElementById('inputTips');
      if (inputTipsDiv) {
        inputTipsDiv.innerHTML = '<h1>Dicas:</h1>';
      }

      const tableContainer = document.getElementById('table-container');
      if (tableContainer) {
        tableContainer.innerHTML = '';
      }

      const inputs = document.querySelectorAll('#table-container input');
      inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.disabled = false; // Reativa a edição dos inputs ao resetar
      });
    },
  },
  created() {
    this.createGrid();
  },
};
</script>

<style>
@import "../assets/style.css";
</style> -->












<!-- <template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      <div class="grid-position">
        <div class="grid-container" id="gridContainer">
          <div v-for="(item, index) in grid" :key="index"
            :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
            @mouseover="highlightGrid(item.row, item.col)" 
            @click="createTable(item.row + 1, item.col + 1)">
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

      <div class="reset-button-container">
        <button class="mainBtn" @click="resetGame">Resetar</button>
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
      isCreated: false, // Define se o crucigrama foi criado
      initialArray: [], // Array para armazenar as letras iniciais
      // Removed isResetButtonVisible, since the button should always be visible
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
      this.isCreated = true; // Define que o crucigrama foi criado

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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            currentArray[x][y] = input.value.trim().toUpperCase(); // Normaliza para maiúsculas
          }
        });
      });

      console.log('Array atual das palavras inseridas:', currentArray);

      let isCorrect = true;

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i}_${j}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
              isCorrect = false;
            }
          }
        }
      }

      if (isCorrect) {
        alert('Parabéns! Todas as palavras estão corretas.');
        // Não esconda o botão de reset, pois deve estar sempre visível
      } else {
        alert('Algumas palavras estão incorretas. Verifique os campos destacados.');
      }
    },
    displayDimensions(cols, rows) {
      const displayElement = document.getElementById('dimensionsDisplay');
      if (displayElement) {
        displayElement.innerHTML = `Número de colunas: ${cols}<br>Número de linhas: ${rows}`;
      }
    },
    resetGame() {
      // Redefine todos os atributos e variáveis
      this.isCreated = false;
      this.nextNumber = 1;
      this.grid = [];
      this.tableHTML = '';
      this.selectedRows = 0;
      this.selectedCols = 0;
      this.initialArray = [];
      this.tipMap = {};

      // Atualiza a visualização
      this.createGrid();
      this.displayDimensions(this.selectedCols, this.selectedRows);

      const inputTipsDiv = document.getElementById('inputTips');
      if (inputTipsDiv) {
        inputTipsDiv.innerHTML = '<h1>Dicas:</h1>';
      }

      const tableContainer = document.getElementById('table-container');
      if (tableContainer) {
        tableContainer.innerHTML = '';
      }

      const inputs = document.querySelectorAll('#table-container input');
      inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
      });
    },
  },
  created() {
    this.createGrid();
  },
};
</script>

<style>
@import "../assets/style.css";
</style> -->











<!-- <template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      <div class="grid-position">
        <div class="grid-container" id="gridContainer">
          <div v-for="(item, index) in grid" :key="index"
            :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
            @mouseover="highlightGrid(item.row, item.col)" 
            @click="createTable(item.row + 1, item.col + 1)">
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

      <div class="reset-button-container">
        <button class="mainBtn" @click="resetGame">Resetar</button>
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
      tipMap: {},
      tableHTML: '',
      nextNumber: 1,
      isCreated: false,
      initialArray: [],
      isGenerated: false, // Nova flag para controlar se o cruzadama foi gerado
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
      if (!this.isGenerated) { // Só permite destaque se o cruzadama não foi gerado
        this.selectedRows = row;
        this.selectedCols = col;
        this.displayDimensions(this.selectedCols + 1, this.selectedRows + 1);
      }
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
      this.isCreated = true;
      this.isGenerated = false; // Garantir que a flag está como não gerado após criar a tabela

      this.$nextTick(() => {
        // Adiciona evento de duplo clique somente se não estiver gerado
        if (!this.isGenerated) {
          document.querySelectorAll('.inputLetter').forEach(input => {
            input.addEventListener('dblclick', (event) => {
              this.addNumberToCell(event.target);
            });
          });
        }
      });
    },
    addNumberToCell(input) {
      if (this.isGenerated) return; // Não permite adicionar números se o cruzadama foi gerado

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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

      this.isGenerated = true; // Define que o cruzadama foi gerado

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            currentArray[x][y] = input.value.trim().toUpperCase(); // Normaliza para maiúsculas
          }
        });
      });

      console.log('Array atual das palavras inseridas:', currentArray);

      let isCorrect = true;

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i}_${j}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
              isCorrect = false;
            }
          }
        }
      }

      if (isCorrect) {
        alert('Parabéns! Todas as palavras estão corretas.');
        // Não esconda o botão de reset, pois deve estar sempre visível
      } else {
        alert('Algumas palavras estão incorretas. Verifique os campos destacados.');
      }
    },
    displayDimensions(cols, rows) {
      const displayElement = document.getElementById('dimensionsDisplay');
      if (displayElement) {
        displayElement.innerHTML = `Número de colunas: ${cols}<br>Número de linhas: ${rows}`;
      }
    },
    resetGame() {
      // Lógica para resetar o jogo
      this.createGrid();
      this.tableHTML = '';
      this.isCreated = false;
      this.isGenerated = false; // Reseta a flag
      this.tipMap = {};
      this.nextNumber = 1;
      this.initialArray = [];
      document.getElementById('inputTips').innerHTML = '';
    },
    displayDimensions(cols, rows) {
      document.getElementById('dimensionsDisplay').innerHTML = `Colunas: ${cols}, Linhas: ${rows}`;
    }
  },
  mounted() {
    this.createGrid();
  }
};
</script>

<style>
@import "../assets/style.css";
</style> -->









<!-- <template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      

      <div class="header">
        <button class="mainBtn" @click="generateCrossWords">Criar</button>
        <button class="mainBtn" @click="checkWords">Check Word</button>
      </div>

      <div id="inputTips">
        <h1>Dicas:</h1>
      </div>

      <div class="reset-button-container">
        <button class="mainBtn" @click="resetGame">Resetar</button>
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
      selectedRows: 10,
      selectedCols: 10,
      tableHTML: '',
      tipMap: {},
      nextNumber: 1,
      isCreated: false,
      initialArray: [],
      isGenerated: false, // Nova flag para controlar se o cruzadama foi gerado
    };
  },
  methods: {
    createTable(rows, cols) {
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
      this.isCreated = true;

      this.$nextTick(() => {
        if (!this.isGenerated) {
          document.querySelectorAll('.inputLetter').forEach(input => {
            input.addEventListener('dblclick', (event) => {
              this.addNumberToCell(event.target);
            });
          });
        }
      });
    },
    addNumberToCell(input) {
      if (this.isGenerated) return; // Não permite adicionar números se o cruzadama foi gerado

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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

      this.isGenerated = true; // Define que o cruzadama foi gerado

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            currentArray[x][y] = input.value.trim().toUpperCase(); // Normaliza para maiúsculas
          }
        });
      });

      console.log('Array atual das palavras inseridas:', currentArray);

      let isCorrect = true;

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i}_${j}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
              isCorrect = false;
            }
          }
        }
      }
    },
    resetGame() {
      this.isGenerated = false; // Reseta a flag
      this.tipMap = {};
      this.isCreated = false;
      this.nextNumber = 1;
      this.selectedRows = 10,
      this.selectedCols = 10,
      this.tableHTML = '';
      
      this.initialArray = [];
      document.getElementById('inputTips').innerHTML = '';

      this.createTable(this.rows, this.cols);
    },
  },
  mounted() {
    this.createTable(this.rows, this.cols);
  }
};
</script>

<style>
@import "../assets/style.css";
</style> -->









<template>
  <div class="container">
    <div class="main-elements" id="main-elements">
      

      <div class="header">
        <button class="mainBtn" @click="generateCrossWords">Criar</button>
        <button class="mainBtn" @click="checkWords">Check Word</button>
      </div>

      <div id="inputTips">
        <h1>Dicas:</h1>
      </div>

      <div class="reset-button-container">
        <button class="mainBtn" @click="resetGame">Resetar</button>
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
      selectedRows: 10,
      selectedCols: 10,
      tableHTML: '',
      tipMap: {},
      nextNumber: 1,
      isCreated: false,
      initialArray: [],
      isGenerated: false, // Nova flag para controlar se o cruzadama foi gerado
    };
  },
  methods: {
    createTable(rows, cols) {
      console.log('Criando a tabela com', rows, 'linhas e', cols, 'colunas');
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
      this.isCreated = true;

      this.$nextTick(() => {
        if (!this.isGenerated) {
          document.querySelectorAll('.inputLetter').forEach(input => {
            input.addEventListener('dblclick', (event) => {
              this.addNumberToCell(event.target);
            });
          });
        }
      });
    },
    addNumberToCell(input) {
      if (this.isGenerated) return; // Não permite adicionar números se o cruzadama foi gerado

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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de gerar.');
        return;
      }

      this.isGenerated = true; // Define que o cruzadama foi gerado

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
              const inputValue = input.value.trim().toUpperCase();
              if (inputValue !== '') {
                this.initialArray[x][y] = inputValue;
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value.trim().toUpperCase();
          if (inputValue === '') {
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
      if (!this.isCreated) {
        alert('Por favor, crie o crucigrama antes de verificar.');
        return;
      }

      const table = document.querySelector('#table-container .table');
      const cols = table.querySelectorAll('.col');

      let currentArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

      cols.forEach((col, x) => {
        const rows = col.querySelectorAll('.row');
        rows.forEach((row, y) => {
          const input = row.querySelector('.inputLetter');
          if (input) {
            currentArray[x][y] = input.value.trim().toUpperCase(); // Normaliza para maiúsculas
          }
        });
      });

      console.log('Array atual das palavras inseridas:', currentArray);

      let isCorrect = true;

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i}_${j}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
              isCorrect = false;
            }
          }
        }
      }
    },
    resetGame() {
      console.log('Resetando o jogo...');
      this.isGenerated = false;
      this.isCreated = false;
      this.tipMap = {};
      this.nextNumber = 1;
      this.tableHTML = ''; // Limpa o HTML da tabela

      // Força uma nova criação da tabela
      this.$nextTick(() => {
        this.createTable(this.rows, this.cols);
      });
      
      console.log('Tabela recriada após reset.');
    },
  },
  mounted() {
    this.createTable(this.rows, this.cols);
  }
};
</script>

<style>
@import "../assets/style.css";
</style>