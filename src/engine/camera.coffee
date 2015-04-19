Camera =
  set: (x, y) ->
    Engine.render.context.offset = new PIXI.Point x, y