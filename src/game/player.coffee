class Player
  constructor: (x, y) ->
    @s = PIXI.Sprite.fromImage 'http://i.imgur.com/S1gYEDP.png'
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
    window.onkeydown = (e) ->
      distance = 2.5
      limit = 10

      switch e.keyCode
        when 87, 38 # up
          if Math.rToD(p.s.rotation) isnt 0
            p.s.rotation = Math.dToR 0
          else
            p.speed.y -= distance if p.speed.y > -limit
        when 68, 39 # right
          if Math.rToD(p.s.rotation) isnt 90
            p.s.rotation = Math.dToR 90
          else
            p.speed.x += distance if p.speed.x < limit
        when 83, 40 # down
          if Math.rToD(p.s.rotation) isnt 180
            p.s.rotation = Math.dToR 180
          else
            p.speed.y += distance if p.speed.y < limit
        when 65, 37 # left
          if Math.rToD(p.s.rotation) isnt 270
            p.s.rotation = Math.dToR 270
          else
            p.speed.x -= distance if p.speed.x > -limit