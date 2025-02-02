class TitleScreen {
    constructor({ progress }) {
      this.progress = progress;
    }
  
    getOptions(resolve) {
      return [
        { 
          label: "Start Game",
          description: "They're waiting for you.",
          handler: () => {
            this.close();
            resolve();
          }
        },
      ];
    }
  
    createElement() {
      this.element = document.createElement("div");
      this.element.classList.add("TitleScreen");
      this.element.innerHTML = `
        <img class="TitleScreen_logo" src="/images/logo.png" alt="Game Logo" />
      `;
    }
  
    close() {
      this.keyboardMenu.end();
      this.element.remove();
    }
  
    init(container) {
      return new Promise(resolve => {
        this.createElement();
        container.appendChild(this.element);
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions(resolve));
      });
    }
  }