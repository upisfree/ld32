Math.randomInt = (min, max) ->
  return Math.floor Math.random() * (max - min + 1) + min

Math.rToD = (r) ->
  return r * (180 / Math.PI)

Math.dToR = (d) ->
  return d * (Math.PI / 180)