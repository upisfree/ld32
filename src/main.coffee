window.ontouchmove = (e) ->
  e.preventDefault()

window.w = window.innerWidth
window.h = window.innerHeight

animate = ->
  requestAnimFrame animate

  Game.tick()

  renderer.render stage

Game.start()