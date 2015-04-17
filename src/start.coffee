Game.start = ->
  stage = new PIXI.Stage 0x000000
  renderer = new PIXI.WebGLRenderer window.w, window.h
  renderer.view.style.zIndex = 1
  document.body.appendChild renderer.view

  container = new PIXI.DisplayObjectContainer()
  stage.addChild container

  city = PIXI.Sprite.fromImage 'http://i.imgur.com/zRabOpb.gif'
  city.width = window.w
  city.height = window.h
  city.position.x = 0
  city.position.y = 0
  container.addChild city

  zombie = PIXI.Sprite.fromImage 'http://i.imgur.com/6HA7HJ6.png'
  zombie.width = 200
  zombie.height = 250
  zombie.position.x = window.w / 2 - zombie.width / 2
  zombie.position.y = window.h - zombie.height
  container.addChild zombie

  Lighting.init()

  new Light 100, 100, 100, 0xffff00, 0.2

  #gl = new PIXI.Graphics()
  #gl.beginFill 0x000000, 1
  #gl.drawRect 100, 100, 100,100
  #container.addChild gl
  #
  #
  #  

  requestAnimFrame animate