Lighting =
  init: ->
    container.mask = Lighting.mask
    container.addChild Lighting.filter

  render: ->
    Lighting.mask.clear()
    Lighting.filter.clear()

    for light in Lighting.lights
      # draw mask
      Lighting.mask.beginFill 0xffffff, 1
      Lighting.mask.drawCircle light.x, light.y, light.r

      # draw filter
      Lighting.filter.beginFill light.c, light.a
      Lighting.filter.drawCircle light.x, light.y, light.r

      # draw shadow
      for i in [0..light.r / 4] # why 4?
        Lighting.filter.beginFill light.c, 0
        Lighting.filter.lineStyle 2, 0x000000, 1 - i / 50
        Lighting.filter.drawCircle light.x, light.y, light.r - i * 2

  mask: new PIXI.Graphics()
  filter: new PIXI.Graphics()
  lights: []

class Light
  constructor: (x, y, r, c, a) ->
    Lighting.lights.push { x: x, y: y, r: r, c: c, a: a }