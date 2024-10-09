<template>
  <div class="container is-responsive">
    <div class="box" id="main-elements">
      <div class="header">
        <button class="button is-link is-medium is-fullwidth is-responsive" @click="generateCrossWords">Criar</button>
        <br>
        <button class="button is-link is-medium is-fullwidth is-responsive" @click="checkWords">Checar Palavras</button>
      </div>

      <div id="inputTips">
        <h1>Dicas:</h1>
      </div>

      <div class="reset-button-container">
        <button class="button is-link is-medium is-fullwidth is-responsive" @click="resetGame">Resetar</button>
      </div>
    </div>

    <div id="table-container">
      <div class="table">
        <div class="col" v-for="col in cols" :key="col">
          <div class="row" v-for="row in rows" :key="row">
            <input type="text" class="inputLetter" :id="`input_${col}_${row}`" maxLength="1" :tabindex="(col - 1) * rows + row">
          </div>
        </div>
      </div>
    </div>
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
      tipMap: {},
      nextNumber: 1,
      isCreated: true,
      initialArray: [],
      isGenerated: false,
    };
  },
  methods: {
    addNumberToCell(event) {
      if (this.isGenerated) return;

      const input = event.target;
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
      const input = document.getElementById(`inputTip_${oldNumber}`);
      if (input) {
        input.setAttribute('id', `inputTip_${newNumber}`);
        this.tipMap[newNumber] = input;
        delete this.tipMap[oldNumber];
      }
    },
    generateCrossWords() {
      if (!this.isCreated) {
        return;
      }
      this.isGenerated = true;
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
          p.setAttribute('id', 'tip-text');
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
            currentArray[x][y] = input.value.trim().toUpperCase();
          }
        });
      });

      console.log('Array atual das palavras inseridas:', currentArray);

      for (let i = 0; i < this.initialArray.length; i++) {
        for (let j = 0; j < this.initialArray[i].length; j++) {
          const inputValue = currentArray[i][j];
          const initialValue = this.initialArray[i][j];

          const input = document.querySelector(`#input_${i + 1}_${j + 1}`);
          if (input) {
            if (inputValue === initialValue) {
              input.style.backgroundColor = 'lightgreen';
            } else {
              input.style.backgroundColor = 'salmon';
            }
          }
        }
      }
    },
    addArrowMovement() {
      document.querySelectorAll('.inputLetter').forEach(input => {
        input.addEventListener('keydown', (event) => {
          if (event.key.startsWith('Arrow')) {
            this.arrowMovement(event);
          }
        });
        input.addEventListener('dblclick', this.addNumberToCell);
      });
    },
    arrowMovement(event) {
      event.preventDefault();

      const currentInput = event.target;
      const currentTabIndex = parseInt(currentInput.tabIndex, 10);
      let newTabIndex;

      switch (event.key) {
        case 'ArrowUp':
          newTabIndex = currentTabIndex - 1;
          break;
        case 'ArrowDown':
          newTabIndex = currentTabIndex + 1;
          break;
        case 'ArrowLeft':
          newTabIndex = currentTabIndex - 10;
          break;
        case 'ArrowRight':
          newTabIndex = currentTabIndex + 10;
          break;
        default:
          return;
      }

      const newInput = document.querySelector(`.inputLetter[tabindex="${newTabIndex}"]`);
      if (newInput) {
        newInput.focus();
      }
    },
    resetGame() {
      console.log('Resetando o jogo...');
      this.isGenerated = false;
      this.isCreated = false;
      this.tipMap = {};
      this.nextNumber = 1;

      // Remove all tip inputs and tip texts
      const inputsTip = document.querySelectorAll('.tip-input');
      const tipsText = document.querySelectorAll('#tip-text');

      inputsTip.forEach((inputTip) => {
        inputTip.remove();
      });

      tipsText.forEach((tipText) => {
        tipText.remove();
      });

      // Clear all input fields and reset their styles
      const inputs = document.querySelectorAll('.inputLetter');
      inputs.forEach((input) => {
        input.value = '';
        input.style.backgroundColor = '';
        input.readOnly = false;
        input.closest('.row').style.visibility = 'visible';
      });

      // Remove all number spans
      const numberSpans = document.querySelectorAll('.number');
      numberSpans.forEach((span) => {
        span.remove();
      });

      this.$nextTick(() => {
        this.isCreated = true;
      });

      console.log('Tabela recriada após reset.');
    },
  },
  mounted() {
    this.addArrowMovement();
  }
};
</script>

<style>
@import "../assets/style.css";
</style>
