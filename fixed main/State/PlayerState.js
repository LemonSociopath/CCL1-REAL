class PlayerState {
  constructor() {
    this.fighters = {
      p1: {
        fighterId: "s001",
        hp: 40,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: { type: "crying" },
      },
      
    };
    this.lineup = ["p1"];
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
      { actionId: "item_recoverHp", instanceId: "item4" },
      { actionId: "item_recoverHp", instanceId: "item5" },
      { actionId: "item_recoverStatus", instanceId: "item6" },
      { actionId: "item_recoverStatus", instanceId: "item7" },
      
    ];
    this.storyFlags = {
      DEFEATED_ALL_NPCS: false, // Add this flag
    };
  }

  checkCompletion() {
    const totalXp = Object.values(this.fighters).reduce(
      (sum, fighter) => sum + fighter.xp,
      0
    );
    if (totalXp >= 120) {
      this.storyFlags["DEFEATED_ALL_NPCS"] = true;
    }
  }
}
window.playerState = new PlayerState();
