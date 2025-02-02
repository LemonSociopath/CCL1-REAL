class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
  
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.requires || []).every((sf) => {
          return window.playerState.storyFlags[sf];
        });
      });
  
      if (relevantScenario) {
        this.startCutscene(relevantScenario.events);
      }
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/tablee.png",
    upperSrc: "/images/maps/lampf.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(2),
        y: utils.withGrid(1),
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(3),
        src: "/images/characters/people/npc.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Love or desire?",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "Which one do you cherish more?",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "The correct answer is of course love.",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "But is that the true answer?",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "If that is so, why do you run from an outstretched hand into the arms of those who don't know the real you?",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "You are scared to let yourself be loved.",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "But why is that?",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              { type: "battle", enemyId: "somberStudent" },
              {
                type: "textMessage",
                text: "...Maybe the warmth of another body is just something you can't live without.",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              {
                type: "textMessage",
                text: "But can it satisfy your craving for being loved for who you are as a person..?",
                faceHero:"npcA", 
                character: "/images/characters/people/him.png",
              },
              // { type: "textMessage", text: "Go away!"},
              //{ who: "hero", type: "walk",  direction: "up" },
            ],
          },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "/images/characters/people/npc.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "You don't crave forgiveness.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "That is not what you need.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "It's punishment, isn't it?",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "A punishment for all you did.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "And all you didn't do.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "Resolve your sins.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "Pay for it.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "And maybe then you can be at peace.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "Or not.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "Maybe never being at peace is part of the punishment.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },
              {
                type: "textMessage",
                text: "The one that you deserve.",
                faceHero: "npcB",
                character: "/images/characters/people/creature.png",
              },

              { type: "battle", enemyId: "creature" },
            ],
          },
        ],
        // behaviorLoop: [
        //   { type: "walk",  direction: "left" },
        //   { type: "stand",  direction: "up", time: 800 },
        //   { type: "walk",  direction: "up" },
        //   { type: "walk",  direction: "right" },
        //   { type: "walk",  direction: "down" },
        // ]
      }),

      npcC: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(3),
        src: "/images/characters/people/npc.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "She's upset.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "She's upset again.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "It doesn't even bother you anymore, does it?",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "That's a bit cruel.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "But it's okay.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "She's also cruel.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "So it's okay if she's upset.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "And you don't feel a thing.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "You don't owe her anything.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "Not a thing.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "Not your life.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "Not your accomplishments.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "Not even your time.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "So why is it that when she opens her arms",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "You want to hide in them?",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "...no",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "That's wrong.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "You don't want her embrace.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "You wish you wanted it though.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "But instead when she touches you",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "Your skin will be on fire",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "And mind a conflicted storm.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "One filled with guilt and discomfort.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "...It's okay.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",              },
              {
                type: "textMessage",
                text: "Don't push yourself.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "She will be okay again soon.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },
              {
                type: "textMessage",
                text: "Probably.",
                faceHero: "npcC",
                character: "/images/characters/people/girlSharp.png",
              },

              { type: "battle", enemyId: "sharpGirl" },
            ],
          },
        ],
      }),
      npcD: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(9),
        src: "/images/characters/people/npc.png",
        //looks stupid as shit without deltaTime
       // behaviorLoop: [
       //   { type: "walk", direction: "left", },
       //   { type: "walk", direction: "up",},
       //   { type: "walk", direction: "right",},
       //   { type: "walk", direction: "down",},
       // ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "kekeke...",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "Want to take a sip too?",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "You should loosen up.",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "If you drink you'll be hangover tomorrow.",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "But if you don't, tomorrow won't come.",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "Ain't that right?",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "Kekekeke...",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "You're boring as a sin.",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "Utterly incapable of forming meaningful bonds without the help of those burning liquids you pour down your throat.",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "Sacrifice your time, money and liver, all for that illusion of a genuine connection.",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "KEKEKEKE!",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              {
                type: "textMessage",
                text: "I don't care! One more drink!",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },


              { type: "battle", enemyId: "drunk" },
              {
                type: "textMessage",
                text: "*hic!*",
                faceHero: "npcD",
                character: "/images/characters/people/sami.png",
              },
              // { type: "textMessage", text: "Go away!"},
              //{ who: "hero", type: "walk",  direction: "up" },
            ],
          },
        ],
      }),
      npcE: new Person({
        x: utils.withGrid(13),
        y: utils.withGrid(9),
        src: "/images/characters/people/npc.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "He left.",
                faceHero:"npcE",   
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "He left you behind.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "And you're never getting him back.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "But he was never yours.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "But he left a hole in your heart, didn't he?",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "Though that's a really selfish and self centered way of looking at it, you know?",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "It wasn't love.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "You weren't even very familiar with each other.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "You just liked the person you thought he was.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "But you didn't reach out.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "You watched from afar.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "And missed your chance.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "Now he is gone.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "But maybe if you don't forget his face",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "A part of him can live on.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "Even if he lost his own strength long ago.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              { type: "battle", enemyId: "flowerFace" },
              {
                type: "textMessage",
                text: "...You should forgive yourself.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "You never got to know him enough to be sure ''that's what he would've wanted'' but...",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "You should forgive yourself.",
                faceHero:"npcE", 
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "...",
                character: "/images/characters/people/flower.png",
              },
              {
                type: "textMessage",
                text: "Rest in peace. In my memory, you will always shine like the brightest of stars.",
                character: "/images/characters/people/flower.png",
              },
              
              //{ who: "hero", type: "walk",  direction: "up" },
            ],
          },
        ],
      }),
      npcF: new Person({
        x: utils.withGrid(13),
        y: utils.withGrid(3),
        src: "/images/characters/people/npc.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I think you've heard enough, don't you agree?",
                faceHero:"npcF",   
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "All these accusations thrown your way... that can't feel good.", 
                faceHero:"npcF",     
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "Please forgive Them. They're not trying to be mean. They just hurt and want to be heard.",  
                faceHero:"npcF",    
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "Let's talk about something nicer.",
                faceHero:"npcF",      
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "Back in the other world, you have gathered a few people around yourself haven't you?",   
                faceHero:"npcF",   
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "They're awesome. They may hurt you sometimes, have their own problems or quirks... But you love them.", 
                faceHero:"npcF",     
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "I can tell. They're all you ever wanted. Your imperfectly perfect companions.",   
                faceHero:"npcF",   
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "And you know... I'm sure they love you too.", 
                faceHero:"npcF",     
                character: "/images/characters/people/girlSoft.png",
              },
              {
                type: "textMessage",
                text: "If they can keep smiling at you like they have until now... You'll be okay.",   
                faceHero:"npcF",   
                character: "/images/characters/people/girlSoft.png",
              },
              { type: "battle", enemyId: "softGirl" },
              {
                type: "textMessage",
                text: "Good luck out there.", 
                faceHero:"npcF",     
                character: "/images/characters/people/girlSoft.png",
              },
              // { type: "textMessage", text: "Go away!"},
              //{ who: "hero", type: "walk",  direction: "up" },
            ],
          },
        ],
      }),
      host: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(6),
        src: "/images/characters/people/host.png",
        behaviorLoop: [
         { type: "stand", direction: "right", time: 800 },
         { type: "stand", direction: "up", time: 300 },
         { type: "stand", direction: "right", time: 1200 },
         { type: "stand", direction: "down", time: 300 },
         // { type: "walk", direction: "left",  },
         // { type: "walk", direction: "up",  },
         // { type: "walk", direction: "right",  },
         // { type: "walk", direction: "down",  },
        ],
        talking: [
          {
            requires: ["DEFEATED_ALL_NPCS"], //  story flag check
            events: [
              {
                type: "textMessage",
                text: "YAAAY!",
                faceHero: "host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "You did it!",
                faceHero: "host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "So? Did you have fun?",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "...",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "...Sorry for putting you through it.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "...I know that coming here is painful for you. It makes you think of things you would rather forget.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "I don't know if you got anything out of this. I can't read you at all.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "I do wonder if you found it all abstract nonsense.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "Though They are a part of you...  So maybe you understood Them.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "At least some of it.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "But hearing what They said... I hope you can't relate to it. Well, with the exception of that one girl.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "Ahhhh I'm rambling again. Forgive me.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "I won't keep you here much longer. I know you have a better life out there.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "I'm happy for you! I wish I could know you out there too, but I guess I gotta work with what i have.",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "This is just a split moment for you but to me....",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "It means everything.",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "So before you go, let me just say this:",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "Bad thoughts and experiences will happen. Grief, shame and pain will all be there. Probably forever.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "All these experiences have made you who you are today.",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "But they don't define you. You don't have to grow from them. Just.. don't let them consume you, okay?",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "Don't deny yourself confrontation... or peace.",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "Now, we're nearing the end of our time.",
                faceHero: "host",
                character: "/images/characters/people/hostsad.png",
              },
              {
                type: "textMessage",
                text: "Thank you for it.",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "Let's have some cake, shall we?",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "textMessage",
                text: "It is dessert time after all.",
                faceHero: "host",
                character: "/images/characters/people/hostsmile.png",
              },
              {
                type: "endgame", // Trigger the new endgame event
              },
              
            ],
          },
          {
            events: [
              {
                type: "textMessage",
                text: "Go on! Talk to them!",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "Do you really need me to remind you how this works?",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "If you cry, you can recover some health over time. Each battle you start crying... ouch...",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "If you scream loud enough, you have a chance to deafen out their voice so they can't affect you.",
                character: "/images/characters/people/hostexcited.png",
                faceHero:"host",
              },
              {
                type: "textMessage",
                text: "...But you're too kind, you wouldnt do that, right?~~",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "Anyway, if the situation gets dire, don't forget to check your pockets.",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },
              {
                type: "textMessage",
                text: "Candies can also restore your resolve... And ribbon helps you focus back on the matter at hand!",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },

              {
                type: "textMessage",
                text: "Now shoo!",
                faceHero:"host",
                character: "/images/characters/people/hostexcited.png",
              },
            
             // { who: "hero", type: "walk",  direction: "up" },
            ],
          },
        ],
      }), 
      
    },
    
    walls: {
      // [utils.asGridCoord(5,6)] : true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(7, 4)]: true,
      [utils.asGridCoord(8, 4)]: true,
      [utils.asGridCoord(9, 4)]: true,
      [utils.asGridCoord(10,4)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(13, 4)]: true,
      [utils.asGridCoord(14, 4)]: true,
      [utils.asGridCoord(15, 4)]: true,
      [utils.asGridCoord(16, 4)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(7, 5)]: true,
      [utils.asGridCoord(8, 5)]: true,
      [utils.asGridCoord(9, 5)]: true,
      [utils.asGridCoord(10, 5)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(12, 5)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(14, 5)]: true,
      [utils.asGridCoord(15, 5)]: true,
      [utils.asGridCoord(16, 5)]: true,
      [utils.asGridCoord(6, 6)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(9, 6)]: true,
      [utils.asGridCoord(10, 6)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(12, 6)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(14, 6)]: true,
      [utils.asGridCoord(15, 6)]: true,
      [utils.asGridCoord(16, 6)]: true,
      
    },
  //  startingCutscene: [
  //    { type: "textMessage", text: "Welcome to the game!" },
  //    { type: "textMessage", text: "Your journey begins now." },
  //  ],
    //    cutsceneSpaces: {
    //      [utils.asGridCoord(2,3)]: [
    //        {
    //          events: [
                //  { type: "textMessage", text:"You! You're finally here! ", faceHero: "host", character: "/images/characters/people/girlSoft.png"}
    //            { who: "hero", type: "walk",  direction: "down" },
    //            { who: "npcB", type: "stand",  direction: "up", time: 500 },
    //            { type: "textMessage", text:"You can't be in there!"},
    //            { who: "npcB", type: "walk",  direction: "right" },
    //            { who: "hero", type: "walk",  direction: "down" },
    //            { who: "hero", type: "walk",  direction: "left" },
    //          ]
    //        }
    //      ],
  
  },
};
