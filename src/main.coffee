window.ontouchmove = (e) ->
  e.preventDefault()

window.w = window.innerWidth
window.h = window.innerHeight


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
    sprite.rotation = body.angle

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

# Filters
#if Config.debug is false
#  filter =
#    pixel: new PIXI.PixelateFilter()
#  filter.pixel.size = { x: 3, y: 3 }

#  Engine.render.spriteBatch.filters = [filter.pixel]

# player
player = Matter.Bodies.rectangle window.w / 2, window.h / 2, 150, 100,
  render:
    fillStyle: null
    sprite:
      xScale: 0
      yScale: 0
      texture: 'assets/player-1.png'

Matter.Composite.add Engine.world, player


window.onmousemove = (e) ->
  player.angle = Math.atan2(window.h / 2 - e.y, window.w / 2 - e.x) - Math.PI / 2


#/ player














#player = new Player Screen.size.x / 2, Screen.size.y / 2
#Camera.followPlayer player

#Matter.Events.on Engine, 'tick', (e) ->
  #Camera.set
  #  x: window.w / 2 - player.position.x
  #  y: window.h / 2 - player.position.y