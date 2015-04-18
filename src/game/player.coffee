class Player
  constructor: (x, y) ->
    @s = PIXI.Sprite.fromImage 'http://i.imgur.com/N68T2hB.png' # dK05LVU
    @s.width = 100
    @s.height = 100
    @s.anchor.x = 0.5
    @s.anchor.y = 0.5
    @s.position.x = x
    @s.position.y = y

    @speed = new PIXI.Point 0, 0

    container.addChild @s

    @enableControlling @
  
    return @
  move: (x, y) ->
    @s.position.x += x
    @s.position.y += y
  teleport: (x, y) ->
    @s.position.x = x
    @s.position.y = y
  enableControlling: (p) ->
    window.onmousemove = (e) ->
      Mouse.x = e.x
      Mouse.y = e.y

    window.onkeydown = (e2) ->
      distance = 2.5
      limit = 10

      v = vectorFromAngle p.s.rotation
      m = 20

      switch e2.keyCode
        when 87, 38 # up
          p.move v.x * m, v.y * m

          for wall in walls
            if not wall.isCollide p.s.position.x + (v.x * m), p.s.position.y + (v.y * m) 
              console.log 'isCollide'
        when 83, 40 # down
          p.move -v.x * m, -v.y * m

          for wall in walls
            if not wall.isCollide p.s.position.x + (-v.x * m), p.s.position.y + (-v.y * m) 
              console.log 'isCollide'