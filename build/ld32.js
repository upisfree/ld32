(function() {
  var Camera, Config, Engine, Game, Light, Lighting, Player, animate, background, beds, container, getByClass, getById, getByTag, lava, player, renderer, stage;

  Engine = Game = {};

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
      this.s.width = 150;
      this.s.height = 100;
      this.s.anchor.x = 0.5;
      this.s.anchor.y = 0.5;
      this.s.position.x = x;
      this.s.position.y = y;
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
      return window.onkeydown = function(e) {
        switch (e.keyCode) {
          case 87:
          case 38:
            return p.s.rotation = Math.dToR(0);
          case 83:
          case 40:
            return p.s.rotation = Math.dToR(180);
          case 65:
          case 37:
            return p.s.rotation = Math.dToR(270);
          case 68:
          case 39:
            return p.s.rotation = Math.dToR(90);
        }
      };
    };

    return Player;

  })();

  Game.tick = function() {};

  Game.start = function() {
    stage = new PIXI.Stage(0xffffff);
    renderer = new PIXI.WebGLRenderer(window.w, window.h);
    renderer.view.style.zIndex = 1;
    document.body.appendChild(renderer.view);
    container = new PIXI.DisplayObjectContainer();
    stage.addChild(container);
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
