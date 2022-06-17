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
      //initial position hero 
      utils.withGrid(-2.5) - cameraPerson.x, 
      utils.withGrid(-13) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/Worldmap.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
     
    },
    walls: {
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(8,7)] : true,

      [utils.asGridCoord(6,7)] : true,
      [utils.asGridCoord(6,6)] : true,
      
      [utils.asGridCoord(5,6)] : true,
      [utils.asGridCoord(5,7)] : true,

      //LIMITE INFERIOR CALLE
      [utils.asGridCoord(0,7)] : true,
      [utils.asGridCoord(0,8)] : true,
      [utils.asGridCoord(1,7)] : true,
      [utils.asGridCoord(1,8)] : true,
      [utils.asGridCoord(2,7)] : true,
      [utils.asGridCoord(2,8)] : true,
      [utils.asGridCoord(3,7)] : true,
      [utils.asGridCoord(3,8)] : true,
      [utils.asGridCoord(4,7)] : true,
      [utils.asGridCoord(4,8)] : true,

      //[utils.asGridCoord(-1,-6)] : true,
      //[utils.asGridCoord(-1,-5)] : true,
      [utils.asGridCoord(-1,-4)] : true,
      [utils.asGridCoord(-1,-3)] : true,
      [utils.asGridCoord(-1,-2)] : true,
      [utils.asGridCoord(-1,-1)] : true,
      [utils.asGridCoord(-1,0)] : true,
      [utils.asGridCoord(-1,1)] : true,
      [utils.asGridCoord(-1,2)] : true,
      [utils.asGridCoord(-1,3)] : true,
      [utils.asGridCoord(-1,4)] : true,
      [utils.asGridCoord(-1,5)] : true,
      [utils.asGridCoord(-1,6)] : true,
      [utils.asGridCoord(-1,7)] : true,

      
      
      [utils.asGridCoord(0,-6)] : true,
      [utils.asGridCoord(0,-5)] : true,
      [utils.asGridCoord(1,-6)] : true,
      [utils.asGridCoord(1,-5)] : true,
      [utils.asGridCoord(2,-6)] : true,
      [utils.asGridCoord(2,-5)] : true,
      [utils.asGridCoord(3,-6)] : true,
      [utils.asGridCoord(3,-5)] : true,
      [utils.asGridCoord(4,-6)] : true,
      [utils.asGridCoord(4,-5)] : true,
      [utils.asGridCoord(5,-6)] : true,
      [utils.asGridCoord(5,-5)] : true,
      [utils.asGridCoord(6,-6)] : true,
      [utils.asGridCoord(6,-5)] : true,
      [utils.asGridCoord(7,-6)] : true,
      [utils.asGridCoord(7,-5)] : true,
      [utils.asGridCoord(8,-6)] : true,
      [utils.asGridCoord(8,-5)] : true,
      [utils.asGridCoord(9,-6)] : true,
      [utils.asGridCoord(9,-5)] : true,
      [utils.asGridCoord(10,-6)] : true,
      [utils.asGridCoord(10,-5)] : true,
      //education
      [utils.asGridCoord(11,-6)] : true,
      [utils.asGridCoord(11,-5)] : true,
      
      [utils.asGridCoord(12,-6)] : true,
      [utils.asGridCoord(12,-5)] : true,
      [utils.asGridCoord(13,-6)] : true,
      [utils.asGridCoord(13,-5)] : true,
      [utils.asGridCoord(14,-6)] : true,
      [utils.asGridCoord(14,-5)] : true,
      [utils.asGridCoord(15,-6)] : true,
      [utils.asGridCoord(15,-5)] : true,
      [utils.asGridCoord(16,-6)] : true,
      [utils.asGridCoord(16,-5)] : true,
      [utils.asGridCoord(17,-6)] : true,
      [utils.asGridCoord(17,-5)] : true,
      [utils.asGridCoord(18,-6)] : true,
      [utils.asGridCoord(18,-5)] : true,
      [utils.asGridCoord(19,-8)] : true,
      [utils.asGridCoord(19,-7)] : true,
      [utils.asGridCoord(20,-8)] : true,
      [utils.asGridCoord(20,-7)] : true,
      [utils.asGridCoord(21,-8)] : true,
      [utils.asGridCoord(21,-7)] : true,
      [utils.asGridCoord(22,-6)] : true,
      [utils.asGridCoord(22,-5)] : true,
      [utils.asGridCoord(23,-7)] : true,
      [utils.asGridCoord(23,-6)] : true,
      [utils.asGridCoord(24,-7)] : true,
      [utils.asGridCoord(24,-6)] : true,
      [utils.asGridCoord(25,-6)] : true,
      [utils.asGridCoord(25,-5)] : true,
      [utils.asGridCoord(26,-6)] : true,
      [utils.asGridCoord(26,-5)] : true,
      
      //jobs
      [utils.asGridCoord(27,-6)] : true,
      [utils.asGridCoord(27,-5)] : true,
      
      [utils.asGridCoord(28,-6)] : true,
      [utils.asGridCoord(28,-5)] : true,
      [utils.asGridCoord(29,-6)] : true,
      [utils.asGridCoord(29,-5)] : true,
      [utils.asGridCoord(30,-7)] : true,
      [utils.asGridCoord(30,-6)] : true,
      [utils.asGridCoord(31,-7)] : true,
      [utils.asGridCoord(31,-6)] : true,
      [utils.asGridCoord(32,-7)] : true,
      [utils.asGridCoord(32,-6)] : true,
      [utils.asGridCoord(33,-6)] : true,
      [utils.asGridCoord(33,-5)] : true,
      [utils.asGridCoord(33,-4)] : true,
      [utils.asGridCoord(33,-3)] : true,
      [utils.asGridCoord(33,-2)] : true,
      [utils.asGridCoord(33,-1)] : true,
      [utils.asGridCoord(33,0)] : true,
      [utils.asGridCoord(32,1)] : true,
      [utils.asGridCoord(31,1)] : true,
      [utils.asGridCoord(30,1)] : true,
      [utils.asGridCoord(29,1)] : true,
      [utils.asGridCoord(29,2)] : true,
      [utils.asGridCoord(29,3)] : true,
      [utils.asGridCoord(29,4)] : true,
      [utils.asGridCoord(29,5)] : true,
      [utils.asGridCoord(29,6)] : true,
      [utils.asGridCoord(28,7)] : true,
      [utils.asGridCoord(27,7)] : true,
      [utils.asGridCoord(26,7)] : true,
      [utils.asGridCoord(25,6)] : true,
      [utils.asGridCoord(25,5)] : true,
      [utils.asGridCoord(25,4)] : true,
      [utils.asGridCoord(25,3)] : true,
      [utils.asGridCoord(25,2)] : true,
      [utils.asGridCoord(25,1)] : true,
      [utils.asGridCoord(24,1)] : true,
      [utils.asGridCoord(23,1)] : true,
      [utils.asGridCoord(22,1)] : true,
      [utils.asGridCoord(22,2)] : true,
      [utils.asGridCoord(22,3)] : true,
      [utils.asGridCoord(22,4)] : true,
      [utils.asGridCoord(22,5)] : true,
      [utils.asGridCoord(22,6)] : true,
      [utils.asGridCoord(22,7)] : true,
      [utils.asGridCoord(21,8)] : true,
      [utils.asGridCoord(20,8)] : true,
      [utils.asGridCoord(19,8)] : true,
      [utils.asGridCoord(18,7)] : true,
      [utils.asGridCoord(18,6)] : true,
      [utils.asGridCoord(18,5)] : true,
      [utils.asGridCoord(18,4)] : true,
      [utils.asGridCoord(18,3)] : true,
      [utils.asGridCoord(18,2)] : true,
      [utils.asGridCoord(18,1)] : true,
      [utils.asGridCoord(17,7)] : true,
      [utils.asGridCoord(16,7)] : true,
      [utils.asGridCoord(15,7)] : true,
      [utils.asGridCoord(14,7)] : true,
      [utils.asGridCoord(13,7)] : true,
      [utils.asGridCoord(12,7)] : true,
      [utils.asGridCoord(11,7)] : true,
      [utils.asGridCoord(10,7)] : true,
      //[utils.asGridCoord(9,7)] : true,
      //[utils.asGridCoord(8,7)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(6,7)] : true,

      [utils.asGridCoord(11,6)] : true,
      [utils.asGridCoord(11,5)] : true,
      [utils.asGridCoord(11,4)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(11,2)] : true,
      [utils.asGridCoord(11,1)] : true,
      [utils.asGridCoord(10,1)] : true,
      [utils.asGridCoord(9,1)] : true,
      [utils.asGridCoord(8,1)] : true,
      [utils.asGridCoord(7,1)] : true,
      [utils.asGridCoord(6,1)] : true,
      [utils.asGridCoord(5,1)] : true,

      [utils.asGridCoord(5,4)] : true,
      [utils.asGridCoord(5,5)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(5,2)] : true,
      [utils.asGridCoord(5,1)] : true,
      
      //[utils.asGridCoord(6,3)] : true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(11,-4)]: [
        {
          events: [
            { type: "textMessage", text:"• Software Engineer (2020)       • Software Developer (2017)"},
          ]
        }
      ],
      [utils.asGridCoord(27,-4)]: [
        {
          events: [
            { type: "textMessage", text:"• Mercado Libre                             • Findo                                              • Global Processing"},
          ]
        }
      ],
    }
  },
}