(function() {
  var Engine, LIFES, MIN_SAMPLES, NPC, TIME, ZOMBIES, analyser, audioContext, buf, buflen, color, destroyAllNPC, getByClass, getById, getByTag, getRandomColor, gotStream, i, mediaStreamSource, mx, my, npcs, player, rgbToHex, scene, setCamera, updateMirco, vectorFromAngle, _i;

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

  destroyAllNPC = function() {
    var i;
    i = 0;
    while (i < npcs.length - 1) {
      npcs[i].destroy();
      i += 1;
    }
    return npcs = [];
  };

  NPC = (function() {
    function NPC(x, y) {
      this.body = Matter.Bodies.rectangle(x, y, 125, 75, {
        mass: 1000,
        frictionAir: 0.1,
        render: {
          sprite: {
            texture: 'assets/zombie.png'
          }
        }
      });
      this.body.i = npcs.length;
      this.body.label += ',npc';
      Matter.Composite.add(Engine.world, this.body);
      npcs.push(this);
    }

    NPC.prototype.destroy = function() {
      return Matter.Composite.remove(Engine.world, this.body);
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

  LIFES = 500;

  ZOMBIES = 0;

  TIME = 0;

  scene = PIXI.Sprite.fromImage('assets/scene.png');

  scene.width = window.w;

  scene.height = 1680;

  scene.position.x = 0;

  scene.position.y = window.h / 2 - scene.height;

  Matter.RenderPixi.create = function(options) {
    var defaults, render;
    defaults = {
      controller: Matter.RenderPixi,
      element: null,
      canvas: null,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#ffffff',
        wireframeBackground: '#222',
        enabled: true,
        wireframes: true,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false
      }
    };
    render = Matter.Common.extend(defaults, options);
    render.context = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, render.canvas, true, true);
    render.canvas = render.context.view;
    render.stage = new PIXI.Stage();
    render.textures = {};
    render.sprites = {};
    render.primitives = {};
    render.spriteBatch = new PIXI.DisplayObjectContainer();
    render.stage.addChild(render.spriteBatch);
    if (Matter.Common.isElement(render.element)) {
      render.element.appendChild(render.canvas);
    } else {
      Matter.Common.log('No "render.element" passed, "render.canvas" was not inserted into document.', 'warn');
    }
    render.canvas.oncontextmenu = function() {
      return false;
    };
    render.canvas.onselectstart = function() {
      return false;
    };
    return render;
  };

  Matter.RenderPixi.world = function(engine) {
    var bodies, constraints, context, i, map, options, render, stage, world, _i, _j, _len, _len1;
    render = engine.render;
    world = engine.world;
    map = engine.map;
    context = render.context;
    stage = render.stage;
    options = render.options;
    bodies = Matter.Composite.allBodies(world);
    constraints = Matter.Composite.allConstraints(world);
    render.spriteBatch.addChildAt(scene, 0);
    for (_i = 0, _len = bodies.length; _i < _len; _i++) {
      i = bodies[_i];
      Matter.RenderPixi.body(engine, i);
    }
    for (_j = 0, _len1 = constraints.length; _j < _len1; _j++) {
      i = constraints[_j];
      Matter.RenderPixi.constraint(engine, i);
    }
    return context.render(stage);
  };

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

  setTimeout(function() {
    getById('start-screen').style.display = 'none';
    return Matter.Engine.run(Engine);
  }, 4000);

  setCamera = function(p) {
    return Engine.render.context.offset = new PIXI.Point(p.x, p.y);
  };

  player = Matter.Bodies.rectangle(window.w / 2, window.h / 2 - 300, 125, 75, {
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

  for (i = _i = 0; _i < 5; i = ++_i) {
    new NPC(player.position.x + Math.randomInt(-window.w / 2, window.w / 2), player.position.y + Math.randomInt(-window.h / 2, window.h / 2));
  }

  Matter.Events.on(Engine, 'collisionActive', function(e) {
    var pair, _j, _len, _ref, _results;
    _ref = e.pairs;
    _results = [];
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      pair = _ref[_j];
      if ((pair.bodyA.label.split(',')[2] === 'player' && pair.bodyB.label.split(',')[2] === 'npc') || (pair.bodyB.label.split(',')[2] === 'player' && pair.bodyA.label.split(',')[2] === 'npc')) {
        if (LIFES === -1) {
          getById('end-screen').style.display = 'block';
          getByTag('canvas')[0].className = 'blur';
          _results.push(setTimeout(function() {
            return location.reload();
          }, 5000));
        } else {
          Matter.RenderPixi.setBackground(Engine.render, rgbToHex(Math.randomInt(0, 255), 0, 0));
          LIFES -= 1;
          _results.push(getById('lifes').innerText = 'LIFES: ' + LIFES);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });

  MIN_SAMPLES = 0;

  function autoCorrelate( buf, sampleRate ) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i=0;i<SIZE;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if (rms<0.01) // not enough signal
    return -1;

  var lastCorrelation=1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i=0; i<MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i])-(buf[i+offset]));
    }
    correlation = 1 - (correlation/MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation>0.9) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1, 
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate/best_offset;
  }
  return -1;
//  var best_frequency = sampleRate/best_offset;
};

  analyser = null;

  buflen = 1024;

  buf = new Float32Array(buflen);

  audioContext = null;

  mediaStreamSource = null;

  analyser = null;

  gotStream = function(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    return mediaStreamSource.connect(analyser);
  };

  updateMirco = function() {
    var ac, cycles;
    cycles = new Array;
    analyser.getFloatTimeDomainData(buf);
    ac = autoCorrelate(buf, audioContext.sampleRate);
    console.log(ac);
    if (ac > 50 && ac < 300) {
      return npcs[Math.randomInt(0, npcs.length - 1)].destroy();
    }
  };

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

  navigator.getUserMedia({
    "audio": {
      "mandatory": {
        "googEchoCancellation": "true",
        "googAutoGainControl": "true",
        "googNoiseSuppression": "true",
        "googHighpassFilter": "true"
      }
    },
    "optional": []
  }, gotStream, function() {
    return console.log('microphone fails');
  });

  getRandomColor = function() {
    return {
      r: Math.randomInt(0, 255),
      g: Math.randomInt(0, 255),
      b: Math.randomInt(0, 255)
    };
  };

  rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  color = getRandomColor();

  Matter.RenderPixi.setBackground(Engine.render, rgbToHex(color.r, color.g, color.b));

  Matter.Events.on(Engine, 'tick', function(e) {
    var npc, _j, _k, _len, _results;
    updateMirco();
    setCamera({
      x: window.w / 2 - player.position.x,
      y: window.h / 2 - player.position.y
    });
    player.angle = Math.atan2(window.h / 2 - my, window.w / 2 - mx) - Math.PI / 2;
    if (Math.random() < 0.05) {
      for (i = _j = 0; _j < 3; i = ++_j) {
        new NPC(player.position.x + Math.randomInt(-window.w / 2, window.w / 2), player.position.y + Math.randomInt(-window.h / 2, window.h / 2));
      }
    }
    if (Math.random() < 0.05) {
      _results = [];
      for (_k = 0, _len = npcs.length; _k < _len; _k++) {
        npc = npcs[_k];
        _results.push(Matter.Body.applyForce(npc.body, {
          x: 0,
          y: 0
        }, Matter.Vector.mult(Matter.Vector.sub({
          x: npc.body.position.x,
          y: npc.body.position.y
        }, {
          x: player.position.x,
          y: player.position.y
        }), -0.1)));
      }
      return _results;
    }
  });

}).call(this);
