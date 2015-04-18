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
  #Camera.set { x: window.w / 2 - player.s.position.x, y: renderer.offset.y }
  #Camera.set { x: renderer.offset.x, y: renderer.offset.y }