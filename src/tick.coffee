Game.tick = ->
  # rotate player
  player.s.rotation = Math.atan2(window.h / 2 - Mouse.y, window.w / 2 - Mouse.x) - Math.PI / 2

  bounds = player.s.getBounds()

  walls[0].isCollide [
    {
      x: bounds.x
      y: bounds.y # left top
    }
    {
      x: bounds.x + bounds.width # right top
      y: bounds.y / Math.sin Math.rToD player.s.rotation
    }
    {
      x: Math.sqrt(bounds.width ^ 2 + bounds.height ^ 2) / Math.cos(Math.rToD(player.s.rotation)) # right bottom
      y: Math.sqrt(bounds.width ^ 2 + bounds.height ^ 2) / Math.sin(Math.rToD(player.s.rotation))
    }
    {
      x: bounds.x / Math.cos Math.rToD player.s.rotation
      y: bounds.x + bounds.height
    }
  ],
  [
    {
      x: walls[0].s.position.x
      y: walls[0].s.position.y
    }
    {
      x: walls[0].s.position.x + walls[0].s.width
      y: walls[0].s.position.y
    }
    {
      x: walls[0].s.position.x + walls[0].s.width
      y: walls[0].s.position.y + walls[0].s.height
    }
    {
      x: walls[0].s.position.x
      y: walls[0].s.position.y + walls[0].s.height
    }
  ]

  #for wall in walls
  #  wall.isColliso

  # set camera
  Camera.set window.w / 2 - player.s.position.x, window.h / 2 - player.s.position.y