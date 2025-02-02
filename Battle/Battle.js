class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {};

    this.activeCombatants = {
      player: null, //"player1",
      enemy: null, //"enemy1",
    };

    //Dynamically add the Player team
    window.playerState.lineup.forEach((id) => {
      this.addCombatant(id, "player", window.playerState.fighters[id]);
    });
    //Now the enemy team
    Object.keys(this.enemy.fighters).forEach((key) => {
      this.addCombatant("e_" + key, "enemy", this.enemy.fighters[key]);
    });

    //Start empty
    this.items = [];

    //Add in player items
    window.playerState.items.forEach((item) => {
      this.items.push({
        ...item,
        team: "player",
      });
    });

    this.usedInstanceIds = {};
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant(
      {
        ...Fighters[config.fighterId],
        ...config,
        team,
        isPlayerControlled: team === "player",
      },
      this
    );

    //Populate first active pizza

    console.log(this);
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      //Add to correct team
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    soundManager.play("/music/BATTLE THEME.mp3");

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
      onWinner: (winner) => {
        if (winner === "player") {
          const playerState = window.playerState;
      
          // Update XP for player's fighters
          Object.keys(playerState.fighters).forEach((id) => {
            const playerFighterState = playerState.fighters[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerFighterState.hp = combatant.hp;
              playerFighterState.xp = combatant.xp;
              playerFighterState.maxXp = combatant.maxXp;
              playerFighterState.level = combatant.level;
            }
          });
      
          // Check if all NPCs are defeated and total XP >= 120
          const totalXp = Object.values(playerState.fighters).reduce(
            (sum, fighter) => sum + fighter.xp,
            0
          );
          if (totalXp >= 120) {
            playerState.storyFlags["DEFEATED_ALL_NPCS"] = true;
          }
        }
      

        

        this.element.remove();

        // Ensure overworld music restarts
        soundManager.play("/music/OVERWORLD THEME.mp3");
        this.onComplete();
      },
    });
    this.turnCycle.init();
  }
}
