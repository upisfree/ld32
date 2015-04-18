Game.tick = ->
  # rotate player
  player.s.rotation = Math.atan2(window.h / 2 - Mouse.y, window.w / 2 - Mouse.x) - Math.PI / 2

  # set camera
  Camera.set window.w / 2 - player.s.position.x, window.h / 2 - player.s.position.y