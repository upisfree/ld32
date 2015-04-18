class Player
  constructor: (x, y) ->
    @s = PIXI.Sprite.fromImage 'http://i.imgur.com/S1gYEDP.png'
    @s.width = 150
    @s.height = 100
    @s.anchor.x = 0.5
    @s.anchor.y = 0.5
    @s.position.x = x
    @s.position.y = y

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
      switch e.keyCode
        when 87, 38 # up
          p.s.rotation = Math.dToR 0
        when 83, 40 # down
          p.s.rotation = Math.dToR 180
        when 65, 37 # left
          p.s.rotation = Math.dToR 270
        when 68, 39 # right
          p.s.rotation = Math.dToR 90