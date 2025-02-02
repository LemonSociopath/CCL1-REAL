class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });
    this.hp = typeof this.hp === "undefined" ? this.maxHp : this.hp;
    this.battle = battle;
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;
    return percent > 0 ? percent : 0;
  }

  get isActive() {
    return this.battle.activeCombatants[this.team] === this.id;
  }

  get givesXp() {
    return this.level * 20;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = `
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
      </div>
      <svg viewBox="0 0 26 3" class="Combatant_life-container">
      <rect x=0 y=0 width="0%" height=1 fill="#ff4d4d" />
      <rect x=0 y=1 width="0%" height=2 fill="#d40000" />
      </svg>
      <p class="Combatant_status"></p>
    `;

    this.combatantElement = document.createElement("img");
    this.combatantElement.classList.add("Fighter");
    this.combatantElement.setAttribute("src", this.src);
    this.combatantElement.setAttribute("alt", this.name);
    this.combatantElement.setAttribute("data-team", this.team);

    this.hpFills = this.hudElement.querySelectorAll(
      ".Combatant_life-container > rect"
    );
    this.xpFills = this.hudElement.querySelectorAll(
      ".Combatant_xp-container > rect"
    );
  }

  update(changes = {}) {
    //Update anything incoming
    Object.keys(changes).forEach((key) => {
      this[key] = changes[key];
    });

    //Update active flag to show the correct combatant & hud
    this.hudElement.setAttribute("data-active", this.isActive);

    //Update HP & XP percent fills
    this.hpFills.forEach((rect) => (rect.style.width = `${this.hpPercent}%`));
    //Update level on screen
    this.hudElement.querySelector(".Combatant_level").innerText = this.level;

    //Update status
    // const statusElement = this.hudElement.querySelector(".Combatant_status");
    // if (this.status) {
    //   statusElement.innerText = this.status.type;
    //   statusElement.style.display = "block";
    // } else {
    //   statusElement.innerText = "";
    //   statusElement.style.display = "none";
    // }
  }

  getReplacedEvents(originalEvents) {
    if (
      this.status?.type === "confused" &&
      utils.randomFromArray([true, false, false])
    ) {
      return [{ type: "textMessage", text: `${this.name} covers their ears.` }];
    }

    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "crying") {
      return [
        { type: "textMessage", text:`"A wave of acceptance washes over ${this.name}` },
        { type: "stateChange", recover: 7, onCaster: true },
      ];
    }
    return [];
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if (this.status.expiresIn === 0) {
        this.update({
          status: null,
        });
        return {
          type: "textMessage",
          text: "Status expired!",
        };
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.combatantElement);
    this.update();
  }
}
