Game.start = ->
  stage = new PIXI.Stage 0xFFFFFF
  renderer = new PIXI.WebGLRenderer window.w, window.h
  renderer.view.style.zIndex = 1
  document.body.appendChild renderer.view

  container = new PIXI.DisplayObjectContainer()
  stage.addChild container

  gl = new PIXI.Graphics()
  gl.beginFill 0x000000, 1
  gl.drawRect 100, 100, 100,100
  container.addChild gl
  #
  #
  #  

  requestAnimFrame animate