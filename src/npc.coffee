npcs = []

destroyAllNPC = ->
  i = 0
  
  while i < npcs.length - 1
    npcs[i].destroy()
    i += 1

  npcs = []

class NPC
  constructor: (x, y) ->
    @body = Matter.Bodies.rectangle x, y, 125, 75,
      mass: 1000
      frictionAir: 0.1
      render:
        sprite:
          texture: 'assets/zombie.png'

    @body.i = npcs.length

    @body.label += ',npc'

    Matter.Composite.add Engine.world, @body
    npcs.push @
  destroy: ->
    getByClass('zombie-death')[Math.randomInt(0, 2)].play()

    s = PIXI.Sprite.fromImage 'assets/blood.png'
    s.width = 75
    s.height = 75
    s.anchor.x = 0.5
    s.anchor.y = 0.5
    s.position.x = @body.position.x
    s.position.y = @body.position.y
    s.rotation = Math.randomInt 0, 2 * Math.PI

    bloodContainer.addChild s

    Matter.Composite.remove Engine.world, @body

    ZOMBIES += 1
    getById('zombies').innerText = 'ZOMBIES: ' + ZOMBIES

    #npcs.splice npcs.indexOf(@), 1