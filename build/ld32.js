(function() {
  var Camera, Engine, getByClass, getById, getByTag, lala, mx, my, player, vectorFromAngle;

  Math.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  Math.rToD = function(r) {
    return r * (180 / Math.PI);
  };

  Math.dToR = function(d) {
    return d * (Math.PI / 180);
  };

  vectorFromAngle = function(a) {
    a -= Math.PI / 2;
    return {
      x: Math.cos(a),
      y: Math.sin(a)
    };
  };

  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };

  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };

  Array.prototype.remove = function(from, to) {
    var rest, _ref;
    rest = this.slice((to || from) + 1 || this.length);
    this.length = (_ref = from < 0) != null ? _ref : this.length + {
      from: from
    };
    return this.push.apply(this, rest);
  };

  getById = function(id) {
    return document.getElementById(id);
  };

  getByClass = function(c) {
    return document.getElementsByClassName(c);
  };

  getByTag = function(tag) {
    return document.getElementsByTagName(tag);
  };

  Camera = {
    set: function(x, y) {
      return Engine.render.context.offset = new PIXI.Point(x, y);
    }
  };

  window.ontouchmove = function(e) {
    return e.preventDefault();
  };

  window.w = window.innerWidth;

  window.h = window.innerHeight;

  mx = 0;

  my = 0;

  Matter.RenderPixi.body = function(engine, body) {
    var bodyRender, render, sprite, spriteBatch, spriteId;
    render = engine.render;
    bodyRender = body.render;
    spriteBatch = render.spriteBatch;
    if (!bodyRender.visible) {
      return;
    }
    if (bodyRender.sprite && bodyRender.sprite.texture) {
      spriteId = 'b-' + body.id;
      sprite = render.sprites[spriteId];
      if (!sprite) {
        sprite = render.sprites[spriteId] = Matter.RenderPixi._createBodySprite(render, body);
      }
      if (spriteBatch.children.indexOf(sprite) === -1) {
        spriteBatch.addChild(sprite);
      }
      sprite.position.x = body.position.x;
      sprite.position.y = body.position.y;
      sprite.width = body.label.split(',')[0];
      sprite.height = body.label.split(',')[1];
      return sprite.rotation = body.angle;
    }
  };

  Matter.RenderPixi._getTexture = function(render, imagePath) {
    var texture;
    texture = render.textures[imagePath];
    if (!texture) {
      texture = render.textures[imagePath] = PIXI.Texture.fromImage(imagePath);
    }
    return texture;
  };

  Matter.RenderPixi._createBodySprite = function(render, body) {
    var bodyRender, sprite, texture, texturePath;
    bodyRender = body.render;
    texturePath = bodyRender.sprite.texture;
    texture = Matter.RenderPixi._getTexture(render, texturePath);
    sprite = new PIXI.Sprite(texture);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    return sprite;
  };

  Engine = Matter.Engine.create(document.body, {
    world: {
      gravity: {
        x: 0,
        y: 0
      },
      bounds: {
        min: {
          x: -Infinity,
          y: -Infinity
        },
        max: {
          x: Infinity,
          y: Infinity
        }
      }
    },
    enableSleeping: true,
    render: {
      controller: Matter.RenderPixi,
      options: {
        currentBackground: 'none',
        width: window.w,
        height: window.h,
        wireframes: false
      }
    }
  });

  Matter.Engine.run(Engine);

  player = Matter.Bodies.rectangle(window.w / 2, window.h / 2, 150, 100, {
    mass: 1000,
    frictionAir: 0.1,
    render: {
      fillStyle: null,
      sprite: {
        xScale: 0,
        yScale: 0,
        texture: 'assets/player-1.png'
      }
    }
  });

  Matter.Composite.add(Engine.world, player);

  window.onmousemove = function(e) {
    mx = e.x;
    return my = e.y;
  };

  window.onkeydown = function(e) {
    switch (e.keyCode) {
      case 87:
      case 38:
        return Matter.Body.applyForce(player, {
          x: 0,
          y: 0
        }, Matter.Vector.mult(vectorFromAngle(player.angle), 10));
      case 83:
      case 40:
        return Matter.Body.applyForce(player, {
          x: 0,
          y: 0
        }, Matter.Vector.neg(Matter.Vector.mult(vectorFromAngle(player.angle), 10)));
    }
  };

  lala = Matter.Bodies.rectangle(100, 100, 150, 100, {
    mass: 1000,
    render: {
      fillStyle: null,
      sprite: {
        xScale: 0,
        yScale: 0,
        texture: 'assets/player-1.png'
      }
    }
  });

  Matter.Composite.add(Engine.world, lala);

  Matter.Events.on(Engine, 'tick', function(e) {
    Camera.set(window.w / 2 - player.position.x, window.h / 2 - player.position.y);
    return player.angle = Math.atan2(window.h / 2 - my, window.w / 2 - mx) - Math.PI / 2;
  });

}).call(this);
