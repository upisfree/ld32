npcs = []

class NPC
  constructor: (x, y) ->
    @body = Matter.Bodies.rectangle x, y, 125, 75,
      mass: 1000
      frictionAir: 0.1
      render:
        sprite:
          texture: 'assets/player-2.png'

    @body.i = npcs.length

    @body.label += ',npc'

    Matter.Composite.add Engine.world, @body
    npcs.push @
  destroy: ->
    Matter.Composite.remove Engine.world, @body
    npcs.splice npcs.indexOf(@), 1