!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(((e = e || self).LottieInteractivity = {}));
})(this, function (e) {
  "use strict";
  function t(e) {
    return (t =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function n(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function i(e, t) {
    if (null == e) return {};
    var n,
      i,
      a = (function (e, t) {
        if (null == e) return {};
        var n,
          i,
          a = {},
          r = Object.keys(e);
        for (i = 0; i < r.length; i++)
          (n = r[i]), t.indexOf(n) >= 0 || (a[n] = e[n]);
        return a;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      for (i = 0; i < r.length; i++)
        (n = r[i]),
          t.indexOf(n) >= 0 ||
            (Object.prototype.propertyIsEnumerable.call(e, n) && (a[n] = e[n]));
    }
    return a;
  }
  function a(e, t) {
    var n = t.get(e);
    if (!n)
      throw new TypeError("attempted to get private field on non-instance");
    return n.get ? n.get.call(e) : n.value;
  }
  var r = { player: "lottie-player" },
    o = "[lottieInteractivity]:",
    s = (function () {
      function e() {
        var s = this,
          P =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : r,
          M = P.actions,
          A = P.container,
          C = P.mode,
          T = P.player,
          H = i(P, ["actions", "container", "mode", "player"]);
        if (
          ((function (e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
          l.set(this, {
            writable: !0,
            value: function () {
              if (s.player) {
                var e = function () {
                  s.player.addEventListener("enterFrame", a(s, L)),
                    s.container.addEventListener("mouseenter", a(s, g)),
                    s.container.addEventListener("mouseleave", a(s, E)),
                    s.container.addEventListener("touchstart", a(s, g), {
                      passive: !0,
                    }),
                    s.container.addEventListener("touchend", a(s, E), {
                      passive: !0,
                    });
                };
                s.stateHandler.set("loop", function () {
                  s.actions[s.interactionIdx].loop
                    ? (s.player.loop =
                        parseInt(s.actions[s.interactionIdx].loop) - 1)
                    : (s.player.loop = !0),
                    (s.player.autoplay = !0);
                }),
                  s.stateHandler.set("autoplay", function () {
                    (s.player.loop = !1), (s.player.autoplay = !0);
                  }),
                  s.stateHandler.set("click", function () {
                    (s.player.loop = !1),
                      (s.player.autoplay = !1),
                      s.container.addEventListener("click", a(s, c));
                  }),
                  s.stateHandler.set("hover", function () {
                    (s.player.loop = !1),
                      (s.player.autoplay = !1),
                      s.container.addEventListener("mouseenter", a(s, c)),
                      s.container.addEventListener("touchstart", a(s, c), {
                        passive: !0,
                      });
                  }),
                  s.transitionHandler.set("click", function () {
                    s.container.addEventListener("click", a(s, d));
                  }),
                  s.transitionHandler.set("hover", function () {
                    s.container.addEventListener("mouseenter", a(s, d)),
                      s.container.addEventListener("touchstart", a(s, d), {
                        passive: !0,
                      });
                  }),
                  s.transitionHandler.set("hold", e),
                  s.transitionHandler.set("pauseHold", e),
                  s.transitionHandler.set("repeat", function () {
                    (s.player.loop = !0),
                      (s.player.autoplay = !0),
                      s.player.addEventListener("loopComplete", function e() {
                        a(s, m).call(s, { handler: e });
                      });
                  }),
                  s.transitionHandler.set("onComplete", function () {
                    "loop" === s.actions[s.interactionIdx].state
                      ? s.player.addEventListener("loopComplete", a(s, v))
                      : s.player.addEventListener("complete", a(s, v));
                  }),
                  s.transitionHandler.set("seek", function () {
                    s.player.stop(),
                      s.player.addEventListener("enterFrame", a(s, f)),
                      s.container.addEventListener("mousemove", a(s, h)),
                      s.container.addEventListener("touchmove", a(s, y), {
                        passive: !1,
                      }),
                      s.container.addEventListener("mouseout", a(s, u));
                  });
              }
            },
          }),
          c.set(this, {
            writable: !0,
            value: function () {
              var e = s.actions[s.interactionIdx].forceFlag;
              e || !0 !== s.player.isPaused
                ? e && a(s, I).call(s, !0)
                : a(s, I).call(s, !0);
            },
          }),
          p.set(this, {
            writable: !0,
            value: function () {
              0 === s.clickCounter
                ? (s.player.play(), s.clickCounter++)
                : (s.clickCounter++,
                  s.player.setDirection(-1 * s.player.playDirection),
                  s.player.play());
            },
          }),
          d.set(this, {
            writable: !0,
            value: function () {
              var e = s.actions[s.interactionIdx].forceFlag,
                t = s.actions[s.interactionIdx].state,
                n = s.actions[s.interactionIdx].transition;
              if ("chain" === s.mode) {
                if (s.actions[s.interactionIdx].count) {
                  var i = parseInt(s.actions[s.interactionIdx].count);
                  if (s.clickCounter < i - 1) return void (s.clickCounter += 1);
                }
                return (
                  (s.clickCounter = 0),
                  (!e && "click" === n && "click" === t) ||
                  ("hover" === n && "hover" === t)
                    ? s.transitionHandler.get("onComplete").call()
                    : s.nextInteraction(),
                  s.container.removeEventListener("click", a(s, d)),
                  void s.container.removeEventListener("mouseenter", a(s, d))
                );
              }
              e || !0 !== s.player.isPaused
                ? e && s.player.goToAndPlay(0, !0)
                : s.player.goToAndPlay(0, !0);
            },
          }),
          h.set(this, {
            writable: !0,
            value: function (e) {
              a(s, k).call(s, e.clientX, e.clientY);
            },
          }),
          y.set(this, {
            writable: !0,
            value: function (e) {
              e.cancelable && e.preventDefault(),
                a(s, k).call(s, e.touches[0].clientX, e.touches[0].clientY);
            },
          }),
          u.set(this, {
            writable: !0,
            value: function () {
              a(s, k).call(s, -1, -1);
            },
          }),
          v.set(this, {
            writable: !0,
            value: function () {
              "loop" === s.actions[s.interactionIdx].state
                ? s.player.removeEventListener("loopComplete", a(s, v))
                : s.player.removeEventListener("complete", a(s, v)),
                s.nextInteraction();
            },
          }),
          m.set(this, {
            writable: !0,
            value: function (e) {
              var t = e.handler,
                n = 1;
              s.actions[s.interactionIdx].repeat &&
                (n = s.actions[s.interactionIdx].repeat),
                s.playCounter >= n - 1
                  ? ((s.playCounter = 0),
                    s.player.removeEventListener("loopComplete", t),
                    (s.player.loop = !1),
                    (s.player.autoplay = !1),
                    s.nextInteraction())
                  : (s.playCounter += 1);
            },
          }),
          f.set(this, {
            writable: !0,
            value: function () {
              var e = s.actions[s.interactionIdx].frames;
              e &&
                s.player.currentFrame >= parseInt(e[1]) - 1 &&
                (s.player.removeEventListener("enterFrame", a(s, f)),
                s.container.removeEventListener("mousemove", a(s, h)),
                s.container.removeEventListener("mouseout", a(s, u)),
                setTimeout(s.nextInteraction, 0));
            },
          }),
          L.set(this, {
            writable: !0,
            value: function () {
              var e = s.actions[s.interactionIdx].frames;
              ((e && s.player.currentFrame >= e[1]) ||
                s.player.currentFrame >= s.player.totalFrames - 1) &&
                (s.player.removeEventListener("enterFrame", a(s, L)),
                s.container.removeEventListener("mouseenter", a(s, g)),
                s.container.removeEventListener("mouseleave", a(s, E)),
                s.container.removeEventListener("touchstart", a(s, g), {
                  passive: !0,
                }),
                s.container.removeEventListener("touchend", a(s, E), {
                  passive: !0,
                }),
                s.player.pause(),
                (s.holdStatus = !1),
                s.nextInteraction());
            },
          }),
          g.set(this, {
            writable: !0,
            value: function () {
              (-1 !== s.player.playDirection &&
                null !== s.holdStatus &&
                s.holdStatus) ||
                (s.player.setDirection(1),
                s.player.play(),
                (s.holdStatus = !0));
            },
          }),
          E.set(this, {
            writable: !0,
            value: function () {
              "hold" === s.actions[s.interactionIdx].transition ||
              "hold" === s.actions[0].type
                ? (s.player.setDirection(-1), s.player.play())
                : ("pauseHold" !== s.actions[s.interactionIdx].transition &&
                    "pauseHold" !== s.actions[0].type) ||
                  s.player.pause(),
                (s.holdStatus = !1);
            },
          }),
          w.set(this, {
            writable: !0,
            value: function () {
              var e = s.actions[s.interactionIdx].state,
                t = s.actions[s.interactionIdx].transition;
              ("hover" !== e && "click" !== e) ||
                (s.container.removeEventListener("click", a(s, c)),
                s.container.removeEventListener("mouseenter", a(s, c))),
                ("hover" !== t && "click" !== t) ||
                  (s.container.removeEventListener("click", a(s, d)),
                  s.container.removeEventListener("mouseenter", a(s, d)),
                  s.container.removeEventListener("touchstart", a(s, d), {
                    passive: !0,
                  }));
            },
          }),
          n(this, "jumpToInteraction", function (e) {
            a(s, w).call(s),
              (s.interactionIdx = e),
              s.interactionIdx < 0 ? (s.interactionIdx = 0) : s.interactionIdx,
              s.nextInteraction(!1);
          }),
          n(this, "nextInteraction", function () {
            var e =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0];
            (s.oldInterctionIdx = s.interactionIdx), a(s, w).call(s);
            var t = s.actions[s.interactionIdx].jumpTo;
            t
              ? t >= 0 && t < s.actions.length
                ? ((s.interactionIdx = t), a(s, b).call(s, { ignorePath: !1 }))
                : ((s.interactionIdx = 0),
                  s.player.goToAndStop(0, !0),
                  a(s, b).call(s, { ignorePath: !1 }))
              : (e && s.interactionIdx++,
                s.interactionIdx >= s.actions.length
                  ? s.actions[s.actions.length - 1].reset
                    ? ((s.interactionIdx = 0),
                      s.player.resetSegments(!0),
                      s.actions[s.interactionIdx].frames
                        ? s.player.goToAndStop(
                            s.actions[s.interactionIdx].frames,
                            !0
                          )
                        : s.player.goToAndStop(0, !0),
                      a(s, b).call(s, { ignorePath: !1 }))
                    : ((s.interactionIdx = s.actions.length - 1),
                      a(s, b).call(s, { ignorePath: !1 }))
                  : a(s, b).call(s, { ignorePath: !1 })),
              s.container.dispatchEvent(
                new CustomEvent("transition", {
                  bubbles: !0,
                  composed: !0,
                  detail: {
                    oldIndex: s.oldInterctionIdx,
                    newIndex: s.interactionIdx,
                  },
                })
              );
          }),
          I.set(this, {
            writable: !0,
            value: function (e) {
              var t = s.actions[s.interactionIdx].frames;
              if (!t)
                return (
                  s.player.resetSegments(!0), void s.player.goToAndPlay(0, !0)
                );
              "string" == typeof t
                ? s.player.goToAndPlay(t, e)
                : s.player.playSegments(t, e);
            },
          }),
          x.set(this, {
            writable: !0,
            value: function () {
              var e = s.actions[s.interactionIdx].path;
              if (!e)
                if (
                  "object" === t(s.enteredPlayer) &&
                  "AnimationItem" === s.enteredPlayer.constructor.name
                ) {
                  if (((e = s.enteredPlayer), s.player === e))
                    return void a(s, b).call(s, { ignorePath: !0 });
                } else {
                  var n = (e = s.loadedAnimation).substr(
                    e.lastIndexOf("/") + 1
                  );
                  if (
                    ((n = n.substr(0, n.lastIndexOf(".json"))),
                    s.player.fileName === n)
                  )
                    return void a(s, b).call(s, { ignorePath: !0 });
                }
              var i = s.container.getBoundingClientRect(),
                r =
                  "width: " +
                  i.width +
                  "px !important; height: " +
                  i.height +
                  "px !important; background: " +
                  s.container.style.background;
              if (
                (s.container.setAttribute("style", r),
                "object" !== t(s.enteredPlayer) ||
                  "AnimationItem" !== s.enteredPlayer.constructor.name)
              ) {
                if ("string" == typeof s.enteredPlayer) {
                  var l = document.querySelector(s.enteredPlayer);
                  l &&
                    "LOTTIE-PLAYER" === l.nodeName &&
                    (s.attachedListeners ||
                      (l.addEventListener("ready", function () {
                        (s.container.style.width = ""),
                          (s.container.style.height = "");
                      }),
                      l.addEventListener("load", function () {
                        (s.player = l.getLottie()),
                          a(s, b).call(s, { ignorePath: !0 });
                      }),
                      (s.attachedListeners = !0)),
                    l.load(e));
                } else
                  s.enteredPlayer instanceof HTMLElement &&
                    "LOTTIE-PLAYER" === s.enteredPlayer.nodeName &&
                    (s.attachedListeners ||
                      (s.enteredPlayer.addEventListener("ready", function () {
                        (s.container.style.width = ""),
                          (s.container.style.height = "");
                      }),
                      s.enteredPlayer.addEventListener("load", function () {
                        (s.player = s.enteredPlayer.getLottie()),
                          a(s, b).call(s, { ignorePath: !0 });
                      }),
                      (s.attachedListeners = !0)),
                    s.enteredPlayer.load(e));
                if (!s.player)
                  throw new Error(
                    "".concat(o, " Specified player is invalid."),
                    s.enteredPlayer
                  );
              } else {
                if (!window.lottie)
                  throw new Error(
                    "".concat(o, " A Lottie player is required.")
                  );
                s.stop(),
                  s.player.destroy(),
                  (s.container.innerHTML = ""),
                  "object" === t(e) && "AnimationItem" === e.constructor.name
                    ? (s.player = window.lottie.loadAnimation({
                        loop: !1,
                        autoplay: !1,
                        animationData: e.animationData,
                        container: s.container,
                      }))
                    : (s.player = window.lottie.loadAnimation({
                        loop: !1,
                        autoplay: !1,
                        path: e,
                        container: s.container,
                      })),
                  s.player.addEventListener("DOMLoaded", function () {
                    (s.container.style.width = ""),
                      (s.container.style.height = ""),
                      a(s, b).call(s, { ignorePath: !0 });
                  });
              }
              (s.clickCounter = 0), (s.playCounter = 0);
            },
          }),
          b.set(this, {
            writable: !0,
            value: function (e) {
              var t = e.ignorePath,
                n = s.actions[s.interactionIdx].frames,
                i = s.actions[s.interactionIdx].state,
                r = s.actions[s.interactionIdx].transition,
                o = s.actions[s.interactionIdx].path,
                l = s.stateHandler.get(i),
                c = s.transitionHandler.get(r),
                p = s.actions[s.interactionIdx].speed
                  ? s.actions[s.interactionIdx].speed
                  : 1,
                d = s.actions[s.interactionIdx].delay
                  ? s.actions[s.interactionIdx].delay
                  : 0;
              t ||
              !(
                o ||
                (s.actions[s.actions.length - 1].reset &&
                  0 === s.interactionIdx)
              )
                ? setTimeout(function () {
                    n &&
                      ((s.player.autoplay = !1),
                      s.player.resetSegments(!0),
                      s.player.goToAndStop(n[0], !0)),
                      l
                        ? l.call()
                        : "none" === i &&
                          ((s.player.loop = !1), (s.player.autoplay = !1)),
                      c && c.call(),
                      s.player.autoplay &&
                        (s.player.resetSegments(!0), a(s, I).call(s, !0)),
                      s.player.setSpeed(p);
                  }, d)
                : a(s, x).call(s);
            },
          }),
          k.set(this, {
            writable: !0,
            value: function (e, t) {
              if (-1 !== e && -1 !== t) {
                var n = s.getContainerCursorPosition(e, t);
                (e = n.x), (t = n.y);
              }
              var i = s.actions.find(function (n) {
                var i = n.position;
                if (i) {
                  if (Array.isArray(i.x) && Array.isArray(i.y))
                    return (
                      e >= i.x[0] && e <= i.x[1] && t >= i.y[0] && t <= i.y[1]
                    );
                  if (!Number.isNaN(i.x) && !Number.isNaN(i.y))
                    return e === i.x && t === i.y;
                }
                return !1;
              });
              if (i)
                if ("seek" === i.type || "seek" === i.transition) {
                  var a =
                      (e - i.position.x[0]) /
                      (i.position.x[1] - i.position.x[0]),
                    r =
                      (t - i.position.y[0]) /
                      (i.position.y[1] - i.position.y[0]);
                  s.player.playSegments(i.frames, !0),
                    i.position.y[0] < 0 && i.position.y[1] > 1
                      ? s.player.goToAndStop(
                          Math.floor(a * s.player.totalFrames),
                          !0
                        )
                      : s.player.goToAndStop(
                          Math.ceil(((a + r) / 2) * s.player.totalFrames),
                          !0
                        );
                } else
                  "loop" === i.type
                    ? s.player.playSegments(i.frames, !0)
                    : "play" === i.type
                    ? (!0 === s.player.isPaused && s.player.resetSegments(),
                      s.player.playSegments(i.frames))
                    : "stop" === i.type &&
                      (s.player.resetSegments(!0),
                      s.player.goToAndStop(i.frames[0], !0));
            },
          }),
          S.set(this, {
            writable: !0,
            value: function () {
              var e = s.getContainerVisibility(),
                t = s.actions.find(function (t) {
                  var n = t.visibility;
                  return e >= n[0] && e <= n[1];
                });
              if (t)
                if ("seek" === t.type) {
                  var n = t.frames[0],
                    i =
                      2 == t.frames.length
                        ? t.frames[1]
                        : s.player.totalFrames - 1;
                  null !== s.assignedSegment &&
                    (s.player.resetSegments(!0), (s.assignedSegment = null)),
                    s.player.goToAndStop(
                      n +
                        Math.round(
                          ((e - t.visibility[0]) /
                            (t.visibility[1] - t.visibility[0])) *
                            (i - n)
                        ),
                      !0
                    );
                } else
                  "loop" === t.type
                    ? ((s.player.loop = !0),
                      (null === s.assignedSegment ||
                        s.assignedSegment !== t.frames ||
                        !0 === s.player.isPaused) &&
                        (s.player.playSegments(t.frames, !0),
                        (s.assignedSegment = t.frames)))
                    : "play" === t.type
                    ? s.scrolledAndPlayed ||
                      ((s.scrolledAndPlayed = !0),
                      s.player.resetSegments(!0),
                      t.frames
                        ? s.player.playSegments(t.frames, !0)
                        : s.player.play())
                    : "stop" === t.type &&
                      s.player.goToAndStop(t.frames[0], !0);
            },
          }),
          (this.enteredPlayer = T),
          "object" !== t(T) || "AnimationItem" !== T.constructor.name)
        ) {
          if ("string" == typeof T) {
            var O = document.querySelector(T);
            O && "LOTTIE-PLAYER" === O.nodeName && (T = O.getLottie());
          } else
            T instanceof HTMLElement &&
              "LOTTIE-PLAYER" === T.nodeName &&
              (T = T.getLottie());
          if (!T) throw new Error(o + "Specified player:" + T + " is invalid.");
        }
        "string" == typeof A && (A = document.querySelector(A)),
          A || (A = T.wrapper),
          (this.player = T),
          (this.loadedAnimation =
            this.player.path + this.player.fileName + ".json"),
          (this.attachedListeners = !1),
          (this.container = A),
          (this.mode = C),
          (this.actions = M),
          (this.options = H),
          (this.assignedSegment = null),
          (this.scrolledAndPlayed = !1),
          (this.interactionIdx = 0),
          (this.oldInterctionIdx = 0),
          (this.clickCounter = 0),
          (this.playCounter = 0),
          (this.stateHandler = new Map()),
          (this.transitionHandler = new Map());
      }
      var s;
      return (
        (s = [
          {
            key: "getContainerVisibility",
            value: function () {
              var e = this.container.getBoundingClientRect(),
                t = e.top,
                n = e.height;
              return (window.innerHeight - t) / (window.innerHeight + n);
            },
          },
          {
            key: "getContainerCursorPosition",
            value: function (e, t) {
              var n = this.container.getBoundingClientRect(),
                i = n.top;
              return { x: (e - n.left) / n.width, y: (t - i) / n.height };
            },
          },
          {
            key: "initScrollMode",
            value: function () {
              this.player.stop(),
                window.addEventListener("scroll", a(this, S), !0);
            },
          },
          {
            key: "initCursorMode",
            value: function () {
              this.actions && 1 === this.actions.length
                ? "click" === this.actions[0].type
                  ? ((this.player.loop = !1),
                    this.player.stop(),
                    this.container.addEventListener("click", a(this, d)))
                  : "hover" === this.actions[0].type
                  ? ((this.player.loop = !1),
                    this.player.stop(),
                    this.container.addEventListener("mouseenter", a(this, d)),
                    this.container.addEventListener("touchstart", a(this, d), {
                      passive: !0,
                    }))
                  : "toggle" === this.actions[0].type
                  ? ((this.player.loop = !1),
                    this.player.stop(),
                    this.container.addEventListener("click", a(this, p)))
                  : "hold" === this.actions[0].type ||
                    "pauseHold" === this.actions[0].type
                  ? (this.container.addEventListener("mouseenter", a(this, g)),
                    this.container.addEventListener("mouseleave", a(this, E)),
                    this.container.addEventListener("touchstart", a(this, g), {
                      passive: !0,
                    }),
                    this.container.addEventListener("touchend", a(this, E), {
                      passive: !0,
                    }))
                  : "seek" === this.actions[0].type &&
                    ((this.player.loop = !0),
                    this.player.stop(),
                    this.container.addEventListener("mousemove", a(this, h)),
                    this.container.addEventListener("touchmove", a(this, y), {
                      passive: !1,
                    }),
                    this.container.addEventListener("mouseout", a(this, u)))
                : ((this.player.loop = !0),
                  this.player.stop(),
                  this.container.addEventListener("mousemove", a(this, h)),
                  this.container.addEventListener("mouseleave", a(this, u)),
                  a(this, k).call(this, -1, -1));
            },
          },
          {
            key: "initChainMode",
            value: function () {
              a(this, l).call(this),
                (this.player.loop = !1),
                this.player.stop(),
                a(this, b).call(this, { ignorePath: !1 });
            },
          },
          {
            key: "start",
            value: function () {
              var e = this;
              "scroll" === this.mode
                ? this.player.isLoaded
                  ? this.initScrollMode()
                  : this.player.addEventListener("DOMLoaded", function () {
                      e.initScrollMode();
                    })
                : "cursor" === this.mode
                ? this.player.isLoaded
                  ? this.initCursorMode()
                  : this.player.addEventListener("DOMLoaded", function () {
                      e.initCursorMode();
                    })
                : "chain" === this.mode &&
                  (this.player.isLoaded
                    ? this.initChainMode()
                    : this.player.addEventListener("DOMLoaded", function () {
                        e.initChainMode();
                      }));
            },
          },
          {
            key: "redefineOptions",
            value: function (e) {
              var n = e.actions,
                a = e.container,
                r = e.mode,
                s = e.player,
                l = i(e, ["actions", "container", "mode", "player"]);
              if (
                (this.stop(),
                (this.enteredPlayer = s),
                "object" !== t(s) || "AnimationItem" !== s.constructor.name)
              ) {
                if ("string" == typeof s) {
                  var c = document.querySelector(s);
                  c && "LOTTIE-PLAYER" === c.nodeName && (s = c.getLottie());
                } else
                  s instanceof HTMLElement &&
                    "LOTTIE-PLAYER" === s.nodeName &&
                    (s = s.getLottie());
                if (!s)
                  throw new Error(
                    o + "Specified player:" + s + " is invalid.",
                    s
                  );
              }
              "string" == typeof a && (a = document.querySelector(a)),
                a || (a = s.wrapper),
                (this.player = s),
                (this.loadedAnimation =
                  this.player.path + this.player.fileName + ".json"),
                (this.attachedListeners = !1),
                (this.container = a),
                (this.mode = r),
                (this.actions = n),
                (this.options = l),
                (this.assignedSegment = null),
                (this.scrolledAndPlayed = !1),
                (this.interactionIdx = 0),
                (this.clickCounter = 0),
                (this.playCounter = 0),
                (this.holdStatus = null),
                (this.stateHandler = new Map()),
                (this.transitionHandler = new Map()),
                this.start();
            },
          },
          {
            key: "stop",
            value: function () {
              if (
                ("scroll" === this.mode &&
                  window.removeEventListener("scroll", a(this, S), !0),
                "cursor" === this.mode &&
                  (this.container.removeEventListener("click", a(this, d)),
                  this.container.removeEventListener("click", a(this, p)),
                  this.container.removeEventListener("mouseenter", a(this, d)),
                  this.container.removeEventListener("touchstart", a(this, d)),
                  this.container.removeEventListener("touchmove", a(this, y)),
                  this.container.removeEventListener("mousemove", a(this, h)),
                  this.container.removeEventListener("mouseleave", a(this, u)),
                  this.container.removeEventListener("touchstart", a(this, g)),
                  this.container.removeEventListener("touchend", a(this, E))),
                "chain" === this.mode &&
                  (this.container.removeEventListener("click", a(this, d)),
                  this.container.removeEventListener("click", a(this, c)),
                  this.container.removeEventListener("mouseenter", a(this, d)),
                  this.container.removeEventListener("touchstart", a(this, d)),
                  this.container.removeEventListener("touchmove", a(this, y)),
                  this.container.removeEventListener("mouseenter", a(this, c)),
                  this.container.removeEventListener("touchstart", a(this, c)),
                  this.container.removeEventListener("mouseenter", a(this, g)),
                  this.container.removeEventListener("touchstart", a(this, g)),
                  this.container.removeEventListener("mouseleave", a(this, E)),
                  this.container.removeEventListener("mousemove", a(this, h)),
                  this.container.removeEventListener("mouseout", a(this, u)),
                  this.container.removeEventListener("touchend", a(this, E)),
                  this.player))
              )
                try {
                  this.player.removeEventListener("loopComplete", a(this, v)),
                    this.player.removeEventListener("complete", a(this, v)),
                    this.player.removeEventListener("enterFrame", a(this, f)),
                    this.player.removeEventListener("enterFrame", a(this, L));
                } catch (e) {}
              this.player = null;
            },
          },
        ]) &&
          (function (e, t) {
            for (var n = 0; n < t.length; n++) {
              var i = t[n];
              (i.enumerable = i.enumerable || !1),
                (i.configurable = !0),
                "value" in i && (i.writable = !0),
                Object.defineProperty(e, i.key, i);
            }
          })(e.prototype, s),
        e
      );
    })(),
    l = new WeakMap(),
    c = new WeakMap(),
    p = new WeakMap(),
    d = new WeakMap(),
    h = new WeakMap(),
    y = new WeakMap(),
    u = new WeakMap(),
    v = new WeakMap(),
    m = new WeakMap(),
    f = new WeakMap(),
    L = new WeakMap(),
    g = new WeakMap(),
    E = new WeakMap(),
    w = new WeakMap(),
    I = new WeakMap(),
    x = new WeakMap(),
    b = new WeakMap(),
    k = new WeakMap(),
    S = new WeakMap(),
    P = function (e) {
      var t = new s(e);
      return t.start(), t;
    };
  (e.LottieInteractivity = s),
    (e.create = P),
    (e.default = P),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
