(function() {
  var Camera, Config, Engine, Game, Light, Lighting, Mouse, Player, Wall, animate, background, beds, container, getByClass, getById, getByTag, lava, player, renderer, stage, vectorFromAngle, viewSize, walls;

  Engine = Game = Mouse = {};

  viewSize = {};

  stage = container = renderer = background = beds = player = lava = null;

  Config = {};

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
      return renderer.offset = new PIXI.Point(x, y);
    }
  };

  Lighting = {
    init: function() {
      container.mask = Lighting.mask;
      return container.addChild(Lighting.filter);
    },
    render: function() {
      var i, light, _i, _len, _ref, _results;
      Lighting.mask.clear();
      Lighting.filter.clear();
      _ref = Lighting.lights;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        Lighting.mask.beginFill(0xffffff, 1);
        Lighting.mask.drawCircle(light.x, light.y, light.r);
        Lighting.filter.beginFill(light.c, light.a);
        Lighting.filter.drawCircle(light.x, light.y, light.r);
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (i = _j = 0, _ref1 = light.r / 4; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            Lighting.filter.beginFill(light.c, 0);
            Lighting.filter.lineStyle(2, 0x000000, 1 - i / 50);
            _results1.push(Lighting.filter.drawCircle(light.x, light.y, light.r - i * 2));
          }
          return _results1;
        })());
      }
      return _results;
    },
    mask: new PIXI.Graphics(),
    filter: new PIXI.Graphics(),
    lights: []
  };

  Light = (function() {
    function Light(x, y, r, c, a) {
      Lighting.lights.push({
        x: x,
        y: y,
        r: r,
        c: c,
        a: a
      });
    }

    return Light;

  })();

  Wall = (function() {
    function Wall(x, y, w, h, t) {
      this.s = new PIXI.TilingSprite(PIXI.Texture.fromImage(t));
      this.s.width = w;
      this.s.height = h;
      this.s.position.x = x;
      this.s.position.y = y;
      container.addChild(this.s);
      walls.push(this);
      return this;
    }

    Wall.prototype.isCollide = function(a, b) {
      var i, i1, i2, j, maxA, maxB, minA, minB, normal, p1, p2, polygon, polygons, projected;
      polygons = [a, b];
      minA = void 0;
      maxA = void 0;
      projected = void 0;
      i = void 0;
      i1 = void 0;
      j = void 0;
      minB = void 0;
      maxB = void 0;
      i = 0;
      while (i < polygons.length) {
        polygon = polygons[i];
        while (i1 < polygon.length) {
          i2 = (i1 + 1) % polygon.length;
          p1 = polygon[i1];
          p2 = polygon[i2];
          normal = {
            x: p2.y - p1.y,
            y: p1.x - p2.x
          };
          minA = maxA = void 0;
          while (j < a.length) {
            projected = normal.x * a[j].x + normal.y * a[j].y;
            if (isUndefined(minA) || projected < minA) {
              minA = projected;
            }
            if (isUndefined(maxA) || projected > maxA) {
              maxA = projected;
            }
            j++;
          }
          minB = maxB = void 0;
          while (j < b.length) {
            projected = normal.x * b[j].x + normal.y * b[j].y;
            if (isUndefined(minB) || projected < minB) {
              minB = projected;
            }
            if (isUndefined(maxB) || projected > maxB) {
              maxB = projected;
            }
            j++;
          }
          if (maxA < minB || maxB < minA) {
            console.log('polygons don\'t intersect!');
            return false;
          }
          i1++;
        }
        i++;
      }
      return true;
    };

    return Wall;

  })();

  walls = [];

  Player = (function() {
    function Player(x, y) {
      this.s = PIXI.Sprite.fromImage('http://i.imgur.com/N68T2hB.png');
      this.s.width = 100;
      this.s.height = 100;
      this.s.anchor.x = 0.5;
      this.s.anchor.y = 0.5;
      this.s.position.x = x;
      this.s.position.y = y;
      this.speed = new PIXI.Point(0, 0);
      container.addChild(this.s);
      this.enableControlling(this);
      return this;
    }

    Player.prototype.move = function(x, y) {
      this.s.position.x += x;
      return this.s.position.y += y;
    };

    Player.prototype.teleport = function(x, y) {
      this.s.position.x = x;
      return this.s.position.y = y;
    };

    Player.prototype.enableControlling = function(p) {
      window.onmousemove = function(e) {
        Mouse.x = e.x;
        return Mouse.y = e.y;
      };
      return window.onkeydown = function(e2) {
        var distance, limit, m, v, wall, _i, _j, _len, _len1, _results, _results1;
        distance = 2.5;
        limit = 10;
        v = vectorFromAngle(p.s.rotation);
        m = 20;
        switch (e2.keyCode) {
          case 87:
          case 38:
            p.move(v.x * m, v.y * m);
            _results = [];
            for (_i = 0, _len = walls.length; _i < _len; _i++) {
              wall = walls[_i];
              if (!wall.isCollide(p.s.position.x + (v.x * m), p.s.position.y + (v.y * m))) {
                _results.push(console.log('isCollide'));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
            break;
          case 83:
          case 40:
            p.move(-v.x * m, -v.y * m);
            _results1 = [];
            for (_j = 0, _len1 = walls.length; _j < _len1; _j++) {
              wall = walls[_j];
              if (!wall.isCollide(p.s.position.x + (-v.x * m), p.s.position.y + (-v.y * m))) {
                _results1.push(console.log('isCollide'));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
        }
      };
    };

    return Player;

  })();

  Game.tick = function() {
    var bounds;
    player.s.rotation = Math.atan2(window.h / 2 - Mouse.y, window.w / 2 - Mouse.x) - Math.PI / 2;
    bounds = player.s.getBounds();
    walls[0].isCollide([
      {
        x: bounds.x,
        y: bounds.y
      }, {
        x: bounds.x + bounds.width,
        y: bounds.y / Math.sin(Math.rToD(player.s.rotation))
      }, {
        x: Math.sqrt(bounds.width ^ 2 + bounds.height ^ 2) / Math.cos(Math.rToD(player.s.rotation)),
        y: Math.sqrt(bounds.width ^ 2 + bounds.height ^ 2) / Math.sin(Math.rToD(player.s.rotation))
      }, {
        x: bounds.x / Math.cos(Math.rToD(player.s.rotation)),
        y: bounds.x + bounds.height
      }
    ], [
      {
        x: walls[0].s.position.x,
        y: walls[0].s.position.y
      }, {
        x: walls[0].s.position.x + walls[0].s.width,
        y: walls[0].s.position.y
      }, {
        x: walls[0].s.position.x + walls[0].s.width,
        y: walls[0].s.position.y + walls[0].s.height
      }, {
        x: walls[0].s.position.x,
        y: walls[0].s.position.y + walls[0].s.height
      }
    ]);
    return Camera.set(window.w / 2 - player.s.position.x, window.h / 2 - player.s.position.y);
  };

  Game.start = function() {
    var wall;
    stage = new PIXI.Stage(0xffffff);
    renderer = new PIXI.WebGLRenderer(window.w, window.h);
    renderer.view.style.zIndex = 1;
    document.body.appendChild(renderer.view);
    container = new PIXI.DisplayObjectContainer();
    stage.addChild(container);
    wall = new Wall(500, 500, 200, 600, 'http://i.imgur.com/RgDhleZ.png');
    player = new Player(100, 100);
    return requestAnimFrame(animate);
  };

  window.ontouchmove = function(e) {
    return e.preventDefault();
  };

  window.w = window.innerWidth;

  window.h = window.innerHeight;

  animate = function() {
    requestAnimFrame(animate);
    Game.tick();
    return renderer.render(stage);
  };

  Game.start();

}).call(this);
