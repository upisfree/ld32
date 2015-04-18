(function() {
  var Camera, Config, Engine, Game, Light, Lighting, Mouse, Player, animate, background, beds, container, getByClass, getById, getByTag, lava, player, renderer, stage, vectorFromAngle, viewSize;

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

  Player = (function() {
    function Player(x, y) {
      this.s = PIXI.Sprite.fromImage('http://i.imgur.com/S1gYEDP.png');
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
        var distance, limit, m, v;
        distance = 2.5;
        limit = 10;
        v = vectorFromAngle(p.s.rotation);
        m = 10;
        switch (e2.keyCode) {
          case 87:
          case 38:
            return p.move(v.x * m, v.y * m);
          case 83:
          case 40:
            return p.move(-v.x * m, -v.y * m);
        }
      };
    };

    return Player;

  })();

  Game.tick = function() {
    player.s.rotation = Math.atan2(window.h / 2 - Mouse.y, window.w / 2 - Mouse.x) - Math.PI / 2;
    return Camera.set(window.w / 2 - player.s.position.x, window.h / 2 - player.s.position.y);
  };

  Game.start = function() {
    var floor, zombie;
    stage = new PIXI.Stage(0xffffff);
    renderer = new PIXI.WebGLRenderer(window.w, window.h);
    renderer.view.style.zIndex = 1;
    document.body.appendChild(renderer.view);
    container = new PIXI.DisplayObjectContainer();
    stage.addChild(container);
    floor = new PIXI.TilingSprite(PIXI.Texture.fromImage('http://i.imgur.com/RgDhleZ.png'));
    floor.width = window.w;
    floor.height = window.h;
    floor.position = {
      x: 0,
      y: 0
    };
    floor.tilePosition = {
      x: 0,
      y: 0
    };
    container.addChild(floor);
    zombie = PIXI.Sprite.fromImage('http://i.imgur.com/6HA7HJ6.png');
    zombie.width = 200;
    zombie.height = 250;
    zombie.position.x = window.w / 2 - zombie.width / 2;
    zombie.position.y = window.h - zombie.height;
    container.addChild(zombie);
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
