window.ontouchmove = (e) ->
  e.preventDefault()

window.w = window.innerWidth
window.h = window.innerHeight

animate = ->
  requestAnimFrame animate

  Lighting.render()
  Game.tick()

  renderer.render stage

Game.start()