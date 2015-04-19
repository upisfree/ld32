window.ontouchmove = (e) ->
  e.preventDefault()

window.w = window.innerWidth
window.h = window.innerHeight

mx = 0
my = 0

# render
Matter.RenderPixi.body = (engine, body) -> # I hope we don't need primitives
  render = engine.render
  bodyRender = body.render
  spriteBatch = render.spriteBatch

  if not bodyRender.visible
    return

  if bodyRender.sprite and bodyRender.sprite.texture
    spriteId = 'b-' + body.id
    sprite = render.sprites[spriteId]
    
    # initialise body sprite if not existing
    if not sprite
      sprite = render.sprites[spriteId] = Matter.RenderPixi._createBodySprite render, body

    # add to scene graph if not already there
    if spriteBatch.children.indexOf(sprite) is -1
      spriteBatch.addChild sprite

    # update body sprite
    sprite.position.x = body.position.x
    sprite.position.y = body.position.y
    sprite.width      = body.label.split(',')[0]
    sprite.height     = body.label.split(',')[1]
    sprite.rotation   = body.angle

Matter.RenderPixi._getTexture = (render, imagePath) ->
  texture = render.textures[imagePath]

  if not texture
    texture = render.textures[imagePath] = PIXI.Texture.fromImage imagePath

  return texture

Matter.RenderPixi._createBodySprite = (render, body) ->
  bodyRender = body.render
  texturePath = bodyRender.sprite.texture
  texture = Matter.RenderPixi._getTexture render, texturePath
  sprite = new PIXI.Sprite texture

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  return sprite
# /render


Engine = Matter.Engine.create document.body,
  world:
    gravity:
      x: 0
      y: 0
    bounds:
      min:
        x: -Infinity
        y: -Infinity
      max:
        x: Infinity
        y: Infinity
  enableSleeping: true
  render:
    controller: Matter.RenderPixi
    options:
      currentBackground: 'none'
      width: window.w
      height: window.h
      wireframes: false

# Start
Matter.Engine.run Engine

# camera
setCamera = (p) ->
  Engine.render.context.offset = new PIXI.Point p.x, p.y
# /camera

# Filters
#if Config.debug is false
#  filter =
#    pixel: new PIXI.PixelateFilter()
#  filter.pixel.size = { x: 3, y: 3 }

#  Engine.render.spriteBatch.filters = [filter.pixel]

# player
player = Matter.Bodies.rectangle window.w / 2, window.h / 2, 125, 75,
  mass: 1000
  frictionAir: 0.1
  render:
    sprite:
      texture: 'assets/player-2.png'

Matter.Composite.add Engine.world, player

player.label += ',player'

window.onmousemove = (e) ->
  mx = e.x
  my = e.y


window.onkeydown = (e) -> # TODO: Mousetrap
  #switch player.render.sprite.texture
  #  when 'assets/player-1'
  #    player.render.sprite.texture = 'assets/player-2'
  #  when 'assets/player-2'
  #    player.render.sprite.texture = 'assets/player-3'
  #  when 'assets/player-3'
  #    player.render.sprite.texture = 'assets/player-1'

  switch e.keyCode
    when 87, 38 # up
      Matter.Body.applyForce player, { x: 0, y: 0 }, Matter.Vector.mult(vectorFromAngle(player.angle), 10)
    when 83, 40 # down
      Matter.Body.applyForce player, { x: 0, y: 0 }, Matter.Vector.neg(Matter.Vector.mult(vectorFromAngle(player.angle), 10))
    
#/ player

for i in [0...2]
  new NPC Math.randomInt(0, window.w), Math.randomInt(0, window.h)
#f = new PIXI.PixelateFilter()
#f.blur = 32
#Engine.render.context.__stage.children[0].filters = [f]

#console.log Engine.render.context

Matter. Events.on Engine, 'collisionActive', (e) ->
  for pair in e.pairs
    if (pair.bodyA.label.split(',')[2] is 'player' and pair.bodyB.label.split(',')[2] is 'npc') or
       (pair.bodyB.label.split(',')[2] is 'player' and pair.bodyA.label.split(',')[2] is 'npc')
      console.log 'DIE'

Matter.Events.on Engine, 'tick', (e) ->
  setCamera { x: window.w / 2 - player.position.x, y: window.h / 2 - player.position.y }
  player.angle = Math.atan2(window.h / 2 - my, window.w / 2 - mx) - Math.PI / 2 

  if Math.random() < 0.1
    for npc in npcs
      Matter.Body.applyForce npc, { x: 0, y: 0 }, Matter.Vector.mult(Matter.Vector.sub({ x: npc.position.x, y: npc.position.y }, { x: player.position.x, y: player.position.y }), -0.1)