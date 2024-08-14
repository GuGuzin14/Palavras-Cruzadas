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
            </div>

            <div class="header">
                <button class="mainBtn" @click="generateCrossWords">Criar</button>
                <button class="mainBtn" @click="checkWords">Check Word</button>
            </div>

            <div id="inputTips">
                <h1>Dicas:</h1>
                <label for="">Insira a Dica: </label><input type="text" id="inputTip" v-model="tip">
                <button id="addInputTip" @click="addTip">+</button>
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
            initialArray: [],
            grid: [],
            tip: '',
            tableHTML: '',
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
        },
        createTable(rows, cols) {
            this.selectedRows = rows;
            this.selectedCols = cols;
            let tableHTML = '<div class="table">';
            for (let i = 0; i < cols; i++) {
                tableHTML += '<div class="col">';
                for (let j = 0; j < rows; j++) {
                    const inputID = `input_${i}_${j}`;
                    tableHTML += `<div class="row"><input type="text" class="inputLetter" id="${inputID}" maxLength="1"></div>`;
                }
                tableHTML += '</div>';
            }
            tableHTML += '</div>';
            this.tableHTML = tableHTML;
        },

        displayDimensions(width, height) {
            const dimensionsDisplay = document.getElementById('dimensionsDisplay');
            if (dimensionsDisplay) {
                dimensionsDisplay.textContent = `Dimensões selecionadas: ${width} x ${height}`;
            }
        },
        generateCrossWords() {
            const inputs = document.querySelectorAll('#table-container input');
            const table = document.querySelector('#table-container .table');
            const cols = table.querySelectorAll('.col');

            this.initialArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

            cols.forEach((col, x) => {
                const rows = col.querySelectorAll('.row');
                rows.forEach((row, y) => {
                    const inputValue = row.querySelector('input').value;
                    if (inputValue !== '') {
                        this.initialArray[x][y] = inputValue;
                    }
                });
            });

            console.log('Array inicial das letras preenchidas:', this.initialArray);

            inputs.forEach((input) => {
                const inputValue = input.value;
                if (inputValue === '') {
                    const row = input.closest('.row');
                    input.remove();
                    if (row) {
                        row.style.visibility = 'hidden';
                    }
                } else if (isNaN(inputValue)) {
                    input.value = '';
                } else {
                    input.readOnly = true;
                }
            });

            const inputsTip = document.querySelectorAll('#inputTip');
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

                this.$refs.buttonTip.remove();
                cont++;
                console.log(cont);
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
                        if (input && isNaN(input.value)) {
                            input.style.backgroundColor = 'green';
                        }
                    } else {
                        isCorrect = false;
                        if (input && isNaN(input.value)) {
                            input.style.backgroundColor = 'red';
                        }
                    }
                }
            }

            if (isCorrect) {
                alert('A palavra está correta!');
                const inputs = document.querySelectorAll('.inputLetter');
                const btnReset = document.createElement('button');
                const mainElements = document.getElementById('main-elements');
                inputs.forEach((input) => {
                    input.readOnly = true;
                });
                mainElements.appendChild(btnReset);
                console.log(btnReset);
            } else {
                alert('A palavra está incorreta. Tente novamente.');
            }
        },
        addTip() {
            const inputTip = document.createElement('input');
            const label = document.createElement('label');
            label.innerHTML = 'Insira a Dica: ';
            inputTip.setAttribute('type', 'text');
            inputTip.setAttribute('id', 'inputTip');
            console.log(inputTip);

            const divTip = document.getElementById('inputTips');
            if (divTip) {
                this.$refs.buttonTip.remove();
                divTip.appendChild(label);
                divTip.appendChild(inputTip);
                divTip.appendChild(this.$refs.buttonTip);
            }
        },
    },
    mounted() {
        this.createGrid();
    },
};
</script>

<style>
@import '../assets/style.css';
</style> -->





<!-- <template>
    <div class="container">
      <div class="main-elements" id="main-elements">
        <div class="grid-position">
          <div class="grid-container" id="gridContainer">
            <div
              v-for="(item, index) in grid"
              :key="index"
              :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
              @mouseover="highlightGrid(item.row, item.col)"
              @click="createTable(item.row + 1, item.col + 1)"
            ></div>
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
          <label for="">Insira a Dica: </label><input type="text" id="inputTip" v-model="tip">
          <button id="addInputTip" @click="addTip">+</button>
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
        initialArray: [],
        grid: [],
        tip: '',
        tableHTML: '',
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
    let count = 1; // Inicializa o contador para as legendas

    for (let i = 0; i < cols; i++) {
      tableHTML += '<div class="col">';
      for (let j = 0; j < rows; j++) {
        const inputID = `input_${i}_${j}`;
        tableHTML += `<div class="row" data-legenda="${count}">
                        <input type="text" class="inputLetter" id="${inputID}" maxLength="1">
                      </div>`;
        count++; // Incrementa o contador
      }
      tableHTML += '</div>';
    }

    tableHTML += '</div>';
    this.tableHTML = tableHTML;
  },
      generateCrossWords() {
        const inputs = document.querySelectorAll('#table-container input');
        const table = document.querySelector('#table-container .table');
        const cols = table.querySelectorAll('.col');
  
        this.initialArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));
  
        cols.forEach((col, x) => {
          const rows = col.querySelectorAll('.row');
          rows.forEach((row, y) => {
            const inputValue = row.querySelector('input').value;
            if (inputValue !== '') {
              this.initialArray[x][y] = inputValue;
            }
          });
        });
  
        console.log('Array inicial das letras preenchidas:', this.initialArray);
  
        inputs.forEach((input) => {
          const inputValue = input.value;
          if (inputValue === '') {
            const row = input.closest('.row');
            input.remove();
            if (row) {
              row.style.visibility = 'hidden';
            }
          } else if (isNaN(inputValue)) {
            input.value = '';
          } else {
            input.readOnly = true;
          }
        });
  
        const inputsTip = document.querySelectorAll('#inputTip');
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
  
          this.$refs.buttonTip.remove();
          cont++;
          console.log(cont);
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
              if (input && isNaN(input.value)) {
                input.style.backgroundColor = 'green';
              }
            } else {
              isCorrect = false;
              if (input && isNaN(input.value)) {
                input.style.backgroundColor = 'red';
              }
            }
          }
        }
  
        if (isCorrect) {
          alert('A palavra está correta!');
          const inputs = document.querySelectorAll('.inputLetter');
          const btnReset = document.createElement('button');
          const mainElements = document.getElementById('main-elements');
          inputs.forEach((input) => {
            input.readOnly = true;
          });
          mainElements.appendChild(btnReset);
          console.log(btnReset);
        } else {
          alert('A palavra está incorreta. Tente novamente.');
        }
      },
      addTip() {
        const inputTip = document.createElement('input');
        const label = document.createElement('label');
        label.innerHTML = 'Insira a Dica: ';
        inputTip.setAttribute('type', 'text');
        inputTip.setAttribute('id', 'inputTip');
        console.log(inputTip);
  
        const divTip = document.getElementById('inputTips');
        if (divTip) {
          this.$refs.buttonTip.remove();
          divTip.appendChild(label);
          divTip.appendChild(inputTip);
          divTip.appendChild(this.$refs.buttonTip);
        }
      },
      displayDimensions(width, height) {
        const dimensionsDisplay = document.getElementById('dimensionsDisplay');
        if (dimensionsDisplay) {
          dimensionsDisplay.textContent = `Dimensões selecionadas: ${width} x ${height}`;
        }
      },
    },
    mounted() {
      this.createGrid();
    },
  };
  </script>
  
  <style>
  @import '../assets/style.css';
  </style> -->
  

  <template>
    <div class="container">
      <div class="main-elements" id="main-elements">
        <div class="grid-position">
          <div class="grid-container" id="gridContainer">
            <div
              v-for="(item, index) in grid"
              :key="index"
              :class="['grid-item', { selected: isSelected(item.row, item.col) }]"
              @mouseover="highlightGrid(item.row, item.col)"
              @click="createTable(item.row + 1, item.col + 1)"
            ></div>
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
          <label for="">Insira a Dica: </label><input type="text" id="inputTip" v-model="tip">
          <button id="addInputTip" @click="addTip">+</button>
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
      initialArray: [],
      grid: [],
      tip: '',
      tableHTML: '',
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
    },
    generateCrossWords() {
      this.$nextTick(() => { // Aguarda o próximo ciclo de atualização do DOM
        const inputs = document.querySelectorAll('#table-container input');
        const table = document.querySelector('#table-container .table');
        const cols = table.querySelectorAll('.col');

        this.initialArray = Array.from({ length: this.selectedCols }, () => Array(this.selectedRows).fill('0'));

        let count = 1; // Inicializa o contador para as legendas
        const numMap = {}; // Mapeia a posição (x, y) para o número da palavra

        // Função para verificar se a célula é o início de uma palavra
        const isStartOfWord = (x, y) => {
          const input = document.getElementById(`input_${x}_${y}`);
          const isHorizontalStart = (y === 0 || this.initialArray[x][y - 1] === '0') && input.value !== '';
          const isVerticalStart = (x === 0 || this.initialArray[x - 1][y] === '0') && input.value !== '';
          return isHorizontalStart || isVerticalStart;
        };

        // Função para obter ou atribuir o número da palavra
        const getNumberForCell = (x, y) => {
          const input = document.getElementById(`input_${x}_${y}`);
          if (input && isStartOfWord(x, y)) {
            const number = count;
            numMap[`${x}_${y}`] = number;
            count++;
            return number;
          } else if (input) {
            // Verifica se a célula faz parte de uma palavra já numerada
            const leftCell = (y > 0) ? numMap[`${x}_${y-1}`] : null;
            const topCell = (x > 0) ? numMap[`${x-1}_${y}`] : null;
            return leftCell || topCell || null;
          }
          return null;
        };

        cols.forEach((col, x) => {
          const rows = col.querySelectorAll('.row');
          rows.forEach((row, y) => {
            const input = row.querySelector('input');
            const inputValue = input.value;
            if (inputValue !== '') {
              this.initialArray[x][y] = inputValue;

              // Atribui um número somente ao início de uma palavra
              const number = getNumberForCell(x, y);
              if (number) {
                row.classList.add('has-letter');
                row.setAttribute('data-legenda', number);
              }
            }
          });
        });

        console.log('Array inicial das letras preenchidas:', this.initialArray);

        inputs.forEach((input) => {
          const inputValue = input.value;
          if (inputValue === '') {
            const row = input.closest('.row');
            input.remove();
            if (row) {
              row.style.visibility = 'hidden';
            }
          } else if (isNaN(inputValue)) {
            input.value = '';
          } else {
            input.readOnly = true;
          }
        });

        const inputsTip = document.querySelectorAll('#inputTip');
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

          this.$refs.buttonTip.remove();
          cont++;
          console.log(cont);
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
            if (input && isNaN(input.value)) {
              input.style.backgroundColor = 'green';
            }
          } else {
            isCorrect = false;
            if (input && isNaN(input.value)) {
              input.style.backgroundColor = 'red';
            }
          }
        }
      }

      if (isCorrect) {
        alert('A palavra está correta!');
        const inputs = document.querySelectorAll('.inputLetter');
        const btnReset = document.createElement('button');
        const mainElements = document.getElementById('main-elements');
        inputs.forEach((input) => {
          input.readOnly = true;
        });
        mainElements.appendChild(btnReset);
        console.log(btnReset);
      } else {
        alert('A palavra está incorreta. Tente novamente.');
      }
    },
    addTip() {
      const inputTip = document.createElement('input');
      const label = document.createElement('label');
      label.innerHTML = 'Insira a Dica: ';
      inputTip.setAttribute('type', 'text');
      inputTip.setAttribute('id', 'inputTip');
      console.log(inputTip);

      const divTip = document.getElementById('inputTips');
      if (divTip) {
        this.$refs.buttonTip.remove();
        divTip.appendChild(label);
        divTip.appendChild(inputTip);
        divTip.appendChild(this.$refs.buttonTip);
      }
    },
    displayDimensions(width, height) {
      const dimensionsDisplay = document.getElementById('dimensionsDisplay');
      if (dimensionsDisplay) {
        dimensionsDisplay.textContent = `Dimensões selecionadas: ${width} x ${height}`;
      }
    },
  },
  mounted() {
    this.createGrid();
  },
};
</script>

<style>
@import '../assets/style.css';
</style>
