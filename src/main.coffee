window.ontouchmove = (e) ->
  e.preventDefault()

window.w = window.innerWidth
window.h = window.innerHeight

mx = 0
my = 0


scene = PIXI.Sprite.fromImage 'assets/scene.png'
scene.width = window.w
scene.height = 1680
scene.position.x = 0
scene.position.y = window.h / 2 - scene.height


# render
Matter.RenderPixi.world = (engine) ->
  render = engine.render
  world = engine.world
  map = engine.map
  context = render.context
  stage = render.stage
  options = render.options
  bodies = Matter.Composite.allBodies world
  constraints = Matter.Composite.allConstraints world

  render.spriteBatch.addChildAt scene, 0

  for i in bodies
    Matter.RenderPixi.body engine, i

  for i in constraints
    Matter.RenderPixi.constraint engine, i

  context.render stage

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

for i in [0...5]
  new NPC player.position.x + Math.randomInt(-window.w / 2, window.w / 2), player.position.y + Math.randomInt(-window.h / 2, window.h / 2)
#f = new PIXI.PixelateFilter()
#f.blur = 32
#Engine.render.context.__stage.children[0].filters = [f]

#console.log Engine.render.context

Matter.Events.on Engine, 'collisionActive', (e) ->
  for pair in e.pairs
    if (pair.bodyA.label.split(',')[2] is 'player' and pair.bodyB.label.split(',')[2] is 'npc') or
       (pair.bodyB.label.split(',')[2] is 'player' and pair.bodyA.label.split(',')[2] is 'npc')
      return
      #console.log 'DIE'






# microphone
MIN_SAMPLES = 0

`function autoCorrelate( buf, sampleRate ) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i=0;i<SIZE;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if (rms<0.01) // not enough signal
    return -1;

  var lastCorrelation=1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i=0; i<MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i])-(buf[i+offset]));
    }
    correlation = 1 - (correlation/MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation>0.9) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1, 
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate/best_offset;
  }
  return -1;
//  var best_frequency = sampleRate/best_offset;
}`


analyser = null
buflen = 1024
buf = new Float32Array buflen
audioContext = null
mediaStreamSource = null
analyser = null

gotStream = (stream) ->
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    audioContext = new AudioContext()

    mediaStreamSource = audioContext.createMediaStreamSource(stream)

    analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048
    mediaStreamSource.connect analyser

updateMirco = ->
  cycles = new Array
  analyser.getFloatTimeDomainData buf
  ac = autoCorrelate buf, audioContext.sampleRate

  if ac > 50 and ac < 300 and Math.random() < 0.25
    npcs[Math.randomInt(0, npcs.length - 1)].destroy()

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
navigator.getUserMedia
  "audio":
    "mandatory":
      "googEchoCancellation": "true",
      "googAutoGainControl": "true",
      "googNoiseSuppression": "true",
      "googHighpassFilter": "true"
  "optional": []
, gotStream
, ->
  console.log 'microphone fails'

# /microphone

Matter.Events.on Engine, 'tick', (e) ->
  updateMirco()
  setCamera { x: window.w / 2 - player.position.x, y: window.h / 2 - player.position.y }
  player.angle = Math.atan2(window.h / 2 - my, window.w / 2 - mx) - Math.PI / 2     

  if Math.random() < 0.005
    for i in [0...3]
      new NPC player.position.x + Math.randomInt(-window.w / 2, window.w / 2), player.position.y + Math.randomInt(-window.h / 2, window.h / 2)  

  if Math.random() < 0.05
    for npc in npcs
      Matter.Body.applyForce npc.body, { x: 0, y: 0 }, Matter.Vector.mult(Matter.Vector.sub({ x: npc.body.position.x, y: npc.body.position.y }, { x: player.position.x, y: player.position.y }), -0.15)