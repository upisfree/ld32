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

  isCollide: (a, b) ->
    polygons = [
      a
      b
    ]
    minA = undefined
    maxA = undefined
    projected = undefined
    i = undefined
    i1 = undefined
    j = undefined
    minB = undefined
    maxB = undefined
    i = 0
    while i < polygons.length
      # for each polygon, look at each edge of the polygon, and determine if it separates
      # the two shapes
      polygon = polygons[i]
      #    i1 = 0
      while i1 < polygon.length
        # grab 2 vertices to create an edge
        i2 = (i1 + 1) % polygon.length
        p1 = polygon[i1]
        p2 = polygon[i2]
        # find the line perpendicular to this edge
        normal = 
          x: p2.y - p1.y
          y: p1.x - p2.x
        minA = maxA = undefined
        # for each vertex in the first shape, project it onto the line perpendicular to the edge
        # and keep track of the min and max of these values
        #      j = 0
        while j < a.length
          projected = normal.x * a[j].x + normal.y * a[j].y
          if isUndefined(minA) or projected < minA
            minA = projected
          if isUndefined(maxA) or projected > maxA
            maxA = projected
          j++
        # for each vertex in the second shape, project it onto the line perpendicular to the edge
        # and keep track of the min and max of these values
        minB = maxB = undefined
        #      j = 0
        while j < b.length
          projected = normal.x * b[j].x + normal.y * b[j].y
          if isUndefined(minB) or projected < minB
            minB = projected
          if isUndefined(maxB) or projected > maxB
            maxB = projected
          j++
        # if there is no overlap between the projects, the edge we are looking at separates the two
        # polygons, and we know there is no overlap
        if maxA < minB or maxB < minA
          console.log 'polygons don\'t intersect!'
          return false
        i1++
      i++
    true
  
walls = []