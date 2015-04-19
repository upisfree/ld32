(function() {
  var Engine, NPC, getByClass, getById, getByTag, i, mx, my, npcs, player, setCamera, vectorFromAngle, _i;

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

  npcs = [];

  NPC = (function() {
    function NPC(x, y) {
      this.body = Matter.Bodies.rectangle(x, y, 125, 75, {
        mass: 1000,
        frictionAir: 0.1,
        render: {
          sprite: {
            texture: 'assets/player-2.png'
          }
        }
      });
      this.body.i = npcs.length;
      this.body.label += ',npc';
      Matter.Composite.add(Engine.world, this.body);
      npcs.push(this.body);
    }

    NPC.prototype.destroy = function() {
      Matter.Composite.remove(Engine.world, this.body);
      return npcs.splice(npcs.indexOf(this.body), 1);
    };

    return NPC;

  })();

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

  setCamera = function(p) {
    return Engine.render.context.offset = new PIXI.Point(p.x, p.y);
  };

  player = Matter.Bodies.rectangle(window.w / 2, window.h / 2, 125, 75, {
    mass: 1000,
    frictionAir: 0.1,
    render: {
      sprite: {
        texture: 'assets/player-2.png'
      }
    }
  });

  Matter.Composite.add(Engine.world, player);

  player.label += ',player';

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

  for (i = _i = 0; _i < 2; i = ++_i) {
    new NPC(Math.randomInt(0, window.w), Math.randomInt(0, window.h));
  }

  Matter.Events.on(Engine, 'collisionActive', function(e) {
    var pair, _j, _len, _ref, _results;
    _ref = e.pairs;
    _results = [];
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      pair = _ref[_j];
      if ((pair.bodyA.label.split(',')[2] === 'player' && pair.bodyB.label.split(',')[2] === 'npc') || (pair.bodyB.label.split(',')[2] === 'player' && pair.bodyA.label.split(',')[2] === 'npc')) {
        _results.push(console.log('DIE'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });

  Matter.Events.on(Engine, 'tick', function(e) {
    var npc, _j, _len, _results;
    setCamera({
      x: window.w / 2 - player.position.x,
      y: window.h / 2 - player.position.y
    });
    player.angle = Math.atan2(window.h / 2 - my, window.w / 2 - mx) - Math.PI / 2;
    if (Math.random() < 0.1) {
      _results = [];
      for (_j = 0, _len = npcs.length; _j < _len; _j++) {
        npc = npcs[_j];
        _results.push(Matter.Body.applyForce(npc, {
          x: 0,
          y: 0
        }, Matter.Vector.mult(Matter.Vector.sub({
          x: npc.position.x,
          y: npc.position.y
        }, {
          x: player.position.x,
          y: player.position.y
        }), -0.1)));
      }
      return _results;
    }
  });

}).call(this);
