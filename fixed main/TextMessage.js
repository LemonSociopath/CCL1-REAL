class TextMessage {
  constructor({ text, character, onComplete }) {
    this.text = text;
    this.character = character;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage-container");

    this.element.innerHTML = `
      ${this.character ? `<img src="${this.character}" class="Speaker" />` : ""}
      <div class="TextMessage"> 
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button">Next</button>
      </div>
    `;

    //Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text,
    });

    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
