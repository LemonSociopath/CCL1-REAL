class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    );

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(
        this.map.gameObjects["hero"].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text,
      character: this.event.character || null,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector(".game-container"));
  }



  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: () => {
        resolve();
      },
    });
    battle.init(document.querySelector(".game-container"));
  }

async endgame(resolve) {
  // Clear all existing DOM elements
  const container = document.querySelector(".game-container");
  container.innerHTML = "";

  // Create a full-screen slideshow container
  const slideshowElement = document.createElement("div");
  slideshowElement.classList.add("EndgameSlideshow");
  container.appendChild(slideshowElement);

  // Switch the background music
  soundManager.play("/music/ENDING.mp3");

  // Define the list of images for the slideshow
  const images = [
    "/images/ui/END1.jpg",
    "/images/ui/END2.jpg",

   
    
  ];

  // Display each image for 7 seconds, then move to the next
  for (let i = 0; i < images.length; i++) {
    slideshowElement.style.backgroundImage = `url('${images[i]}')`;
    await utils.wait(7000);
  }

}

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
