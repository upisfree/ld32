Game.tick = ->
  if player.speed.x > 0
    player.speed.x -= 1
  else if player.speed.x < 0
    player.speed.x += 1

  if player.speed.y > 0
    player.speed.y -= 1
  else if player.speed.y < 0
    player.speed.y += 1

  player.s.position.x += player.speed.x
  player.s.position.y += player.speed.y

  # set camera
  Camera.set window.w / 2 - player.s.position.x, window.h / 2 - player.s.position.y