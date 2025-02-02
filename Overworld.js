class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
 }

  gameLoopStepWork(){
    //Clear off the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Establish the camera person
    const cameraPerson = this.map.gameObjects.hero;

    //Update all objects
    Object.values(this.map.gameObjects).forEach(object => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      })
    })

    //Draw Lower layer
    this.map.drawLowerImage(this.ctx, cameraPerson);

    //Draw Game Objects
    Object.values(this.map.gameObjects).sort((a,b) => {
      return a.y - b.y;
    }).forEach(object => {
      object.sprite.draw(this.ctx, cameraPerson);
    })

    //Draw Upper layer
    this.map.drawUpperImage(this.ctx, cameraPerson);
  }
  startGameLoop() {

    let previousMs;
    const step= 1/100;

    const stepFn = (timestampMs) => {
      
      if(previousMs===undefined){
        previousMs=timestampMs;
      }
      let delta=(timestampMs-previousMs)/1000;
      while(delta>=step){
        this.gameLoopStepWork();
        delta-=step;
      }
      previousMs=timestampMs-delta*1000;

      requestAnimationFrame(stepFn)
    }
    requestAnimationFrame(stepFn)
 }

 bindActionInput() {
   new KeyPressListener("Enter", () => {
     //Is there a person here to talk to?
     this.map.checkForActionCutscene()
   })
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       //Hero's position has changed
       this.map.checkForFootstepCutscene()
     }
   })
 }

 startMap(mapConfig) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();

  
}
  //this.map.playStartingCutscene();
 //}

 async init() {
  // Display the title screen
  const titleScreen = new TitleScreen({});
  await titleScreen.init(this.element); // Wait for the "Start Game" button to be pressed

  //helps start the music on the very first key down, so that the audio can play, cuz autoplay is blocked by browser >:(
  document.addEventListener("keydown", () => {
    soundManager.play("/music/OVERWORLD THEME.mp3");
  }, { once: true }); 

  this.startMap(window.OverworldMaps.DemoRoom);


  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  this.startGameLoop();

   this.map.startCutscene([

    { who: "hero", type: "walk",  direction: "down" },
    { who: "hero", type: "walk",  direction: "down" },
    { who: "hero", type: "walk",  direction: "down" },
    { who: "hero", type: "walk",  direction: "down" },
    { who: "hero", type: "walk",  direction: "down" },
    { who: "host", type: "walk",  direction: "up", time:5 },
    { who: "host", type: "walk",  direction: "down", time:5 },
    { who:"host", type: "stand", direction: "left"},
    { type: "textMessage", text: "You're finally back!", character:"/images/characters/people/hostexcited.png"},
    { who:"hero", type: "stand", direction: "right"},
    { type: "textMessage", text: "I've missed you, you know...", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "Not just me, we all did!", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "But I knew you couldn't ignore us forever! I knew you'd be back!", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "We were just having dessert when you came...", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "That's a great opportunity to reconnect!", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "Go on, talk to them. You've always been someone they can vent to. ", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "When you were gone, some of their troubles piled up...", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "So now that you've made us wait so long, you have to listen!", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "Have fun~", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "...And don't forget about me, okay? I am patient and will wait till others have spoken to you..", character:"/images/characters/people/hostexcited.png"},
    { type: "textMessage", text: "...But please don't forget about me.", character:"/images/characters/people/hostsad.png"},
    { who:"host", type: "stand", direction: "right"},
   ])

 }
}