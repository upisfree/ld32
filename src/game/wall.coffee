class Wall
  constructor: (x, y, w, h, t) ->
    @s = new PIXI.TilingSprite PIXI.Texture.fromImage t
    @s.width = w
    @s.height = h
    @s.position.x = x
    @s.position.y = y

    container.addChild @s
    walls.push @
    return @

  isCollide: (x, y) ->
    console.log 'wow'
  
walls = []