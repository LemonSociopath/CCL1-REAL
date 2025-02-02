window.Actions = {
  damage1: {
    name: "Shove",
    description: "Make them shut up.",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "stateChange", damage: 10}
    ]
  },
  cryingStatus: {
    name: "Cry",
    description: "With confrontation comes acceptance.",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} cries their lungs out."},
      { type: "stateChange", status: { type: "crying", expiresIn: 3 } }
    ]
  },
  confusedStatus: {
    name: "Scream",
    description: "Deny their truth.",
    success: [
      { type: "textMessage", text: "{CASTER} deafened their opponent."},
      { type: "stateChange", status: { type: "confused", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is confused."},
    ]
  },
  //Items
  item_recoverStatus: {
    name: "Ribbon",
    description: "It's red and silky",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} fumbles with a ribbon."},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "{CASTER} quiets their mind.", },
    ]
  },
  item_recoverHp: {
    name: "Candy",
    description: "A taste long forgotten",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} eats a candy.", },
      { type:"stateChange", recover: 15, },
      { type:"textMessage", text: "It melts on their tongue. It's not as sweet as they remember.", },
    ]
  },
}