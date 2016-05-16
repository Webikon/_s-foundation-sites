'use strict';window.whatInput=function(){'use strict'; /*
    ---------------
    variables
    ---------------
  */ // array of actively pressed keys
var activeKeys=[]; // cache document.body
var body; // boolean: true if touch buffer timer is running
var buffer=false; // the last used input type
var currentInput=null; // `input` types that don't accept text
var nonTypingInputs=['button','checkbox','file','image','radio','reset','submit']; // detect version of mouse wheel event to use
// via https://developer.mozilla.org/en-US/docs/Web/Events/wheel
var mouseWheel=detectWheel(); // list of modifier keys commonly used with the mouse and
// can be safely ignored to prevent false keyboard detection
var ignoreMap=[16, // shift
17, // control
18, // alt
91, // Windows key / left Apple cmd
93 // Windows menu / right Apple cmd
]; // mapping of events to input types
var inputMap={'keydown':'keyboard','keyup':'keyboard','mousedown':'mouse','mousemove':'mouse','MSPointerDown':'pointer','MSPointerMove':'pointer','pointerdown':'pointer','pointermove':'pointer','touchstart':'touch'}; // add correct mouse wheel event mapping to `inputMap`
inputMap[detectWheel()]='mouse'; // array of all used input types
var inputTypes=[]; // mapping of key codes to a common name
var keyMap={9:'tab',13:'enter',16:'shift',27:'esc',32:'space',37:'left',38:'up',39:'right',40:'down'}; // map of IE 10 pointer events
var pointerMap={2:'touch',3:'touch', // treat pen like touch
4:'mouse'}; // touch buffer timer
var timer; /*
    ---------------
    functions
    ---------------
  */ // allows events that are also triggered to be filtered out for `touchstart`
function eventBuffer(){clearTimer();setInput(event);buffer=true;timer=window.setTimeout(function(){buffer=false;},650);}function bufferedEvent(event){if(!buffer)setInput(event);}function unBufferedEvent(event){clearTimer();setInput(event);}function clearTimer(){window.clearTimeout(timer);}function setInput(event){var eventKey=key(event);var value=inputMap[event.type];if(value==='pointer')value=pointerType(event); // don't do anything if the value matches the input type already set
if(currentInput!==value){var eventTarget=target(event);var eventTargetNode=eventTarget.nodeName.toLowerCase();var eventTargetType=eventTargetNode==='input'?eventTarget.getAttribute('type'):null;if( // only if the user flag to allow typing in form fields isn't set
!body.hasAttribute('data-whatinput-formtyping')&& // only if currentInput has a value
currentInput&& // only if the input is `keyboard`
value==='keyboard'&& // not if the key is `TAB`
keyMap[eventKey]!=='tab'&&( // only if the target is a form input that accepts text
eventTargetNode==='textarea'||eventTargetNode==='select'||eventTargetNode==='input'&&nonTypingInputs.indexOf(eventTargetType)<0)|| // ignore modifier keys
ignoreMap.indexOf(eventKey)>-1){ // ignore keyboard typing
}else {switchInput(value);}}if(value==='keyboard')logKeys(eventKey);}function switchInput(string){currentInput=string;body.setAttribute('data-whatinput',currentInput);if(inputTypes.indexOf(currentInput)===-1)inputTypes.push(currentInput);}function key(event){return event.keyCode?event.keyCode:event.which;}function target(event){return event.target||event.srcElement;}function pointerType(event){if(typeof event.pointerType==='number'){return pointerMap[event.pointerType];}else {return event.pointerType==='pen'?'touch':event.pointerType; // treat pen like touch
}} // keyboard logging
function logKeys(eventKey){if(activeKeys.indexOf(keyMap[eventKey])===-1&&keyMap[eventKey])activeKeys.push(keyMap[eventKey]);}function unLogKeys(event){var eventKey=key(event);var arrayPos=activeKeys.indexOf(keyMap[eventKey]);if(arrayPos!==-1)activeKeys.splice(arrayPos,1);}function bindEvents(){body=document.body; // pointer events (mouse, pen, touch)
if(window.PointerEvent){body.addEventListener('pointerdown',bufferedEvent);body.addEventListener('pointermove',bufferedEvent);}else if(window.MSPointerEvent){body.addEventListener('MSPointerDown',bufferedEvent);body.addEventListener('MSPointerMove',bufferedEvent);}else { // mouse events
body.addEventListener('mousedown',bufferedEvent);body.addEventListener('mousemove',bufferedEvent); // touch events
if('ontouchstart' in window){body.addEventListener('touchstart',eventBuffer);}} // mouse wheel
body.addEventListener(mouseWheel,bufferedEvent); // keyboard events
body.addEventListener('keydown',unBufferedEvent);body.addEventListener('keyup',unBufferedEvent);document.addEventListener('keyup',unLogKeys);} /*
    ---------------
    utilities
    ---------------
  */ // detect version of mouse wheel event to use
// via https://developer.mozilla.org/en-US/docs/Web/Events/wheel
function detectWheel(){return mouseWheel='onwheel' in document.createElement('div')?'wheel': // Modern browsers support "wheel"
document.onmousewheel!==undefined?'mousewheel': // Webkit and IE support at least "mousewheel"
'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox
} /*
    ---------------
    init

    don't start script unless browser cuts the mustard,
    also passes if polyfills are used
    ---------------
  */if('addEventListener' in window&&Array.prototype.indexOf){ // if the dom is already ready already (script was placed at bottom of <body>)
if(document.body){bindEvents(); // otherwise wait for the dom to load (script was placed in the <head>)
}else {document.addEventListener('DOMContentLoaded',bindEvents);}} /*
    ---------------
    api
    ---------------
  */return { // returns string: the current input type
ask:function ask(){return currentInput;}, // returns array: currently pressed keys
keys:function keys(){return activeKeys;}, // returns array: all the detected input types
types:function types(){return inputTypes;}, // accepts string: manually set the input type
set:switchInput};}();
!function ($) {

  "use strict";

  var FOUNDATION_VERSION = '6.2.1';

  // Global Foundation object
  // This is attached to the window, or used as a module for AMD/Browserify
  var Foundation = {
    version: FOUNDATION_VERSION,

    /**
     * Stores initialized plugins.
     */
    _plugins: {},

    /**
     * Stores generated unique ids for plugin instances
     */
    _uuids: [],

    /**
     * Returns a boolean for RTL support
     */
    rtl: function () {
      return $('html').attr('dir') === 'rtl';
    },
    /**
     * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
     * @param {Object} plugin - The constructor of the plugin.
     */
    plugin: function (plugin, name) {
      // Object key to use when adding to global Foundation object
      // Examples: Foundation.Reveal, Foundation.OffCanvas
      var className = name || functionName(plugin);
      // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
      // Examples: data-reveal, data-off-canvas
      var attrName = hyphenate(className);

      // Add to the Foundation object and the plugins list (for reflowing)
      this._plugins[attrName] = this[className] = plugin;
    },
    /**
     * @function
     * Populates the _uuids array with pointers to each individual plugin instance.
     * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
     * Also fires the initialization event for each plugin, consolidating repeditive code.
     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
     * @param {String} name - the name of the plugin, passed as a camelCased string.
     * @fires Plugin#init
     */
    registerPlugin: function (plugin, name) {
      var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
      plugin.uuid = this.GetYoDigits(6, pluginName);

      if (!plugin.$element.attr('data-' + pluginName)) {
        plugin.$element.attr('data-' + pluginName, plugin.uuid);
      }
      if (!plugin.$element.data('zfPlugin')) {
        plugin.$element.data('zfPlugin', plugin);
      }
      /**
       * Fires when the plugin has initialized.
       * @event Plugin#init
       */
      plugin.$element.trigger('init.zf.' + pluginName);

      this._uuids.push(plugin.uuid);

      return;
    },
    /**
     * @function
     * Removes the plugins uuid from the _uuids array.
     * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
     * Also fires the destroyed event for the plugin, consolidating repeditive code.
     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
     * @fires Plugin#destroyed
     */
    unregisterPlugin: function (plugin) {
      var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));

      this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
      plugin.$element.removeAttr('data-' + pluginName).removeData('zfPlugin')
      /**
       * Fires when the plugin has been destroyed.
       * @event Plugin#destroyed
       */
      .trigger('destroyed.zf.' + pluginName);
      for (var prop in plugin) {
        plugin[prop] = null; //clean up script to prep for garbage collection.
      }
      return;
    },

    /**
     * @function
     * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
     * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
     * @default If no argument is passed, reflow all currently active plugins.
     */
    reInit: function (plugins) {
      var isJQ = plugins instanceof $;
      try {
        if (isJQ) {
          plugins.each(function () {
            $(this).data('zfPlugin')._init();
          });
        } else {
          var type = typeof plugins,
              _this = this,
              fns = {
            'object': function (plgs) {
              plgs.forEach(function (p) {
                p = hyphenate(p);
                $('[data-' + p + ']').foundation('_init');
              });
            },
            'string': function () {
              plugins = hyphenate(plugins);
              $('[data-' + plugins + ']').foundation('_init');
            },
            'undefined': function () {
              this['object'](Object.keys(_this._plugins));
            }
          };
          fns[type](plugins);
        }
      } catch (err) {
        console.error(err);
      } finally {
        return plugins;
      }
    },

    /**
     * returns a random base-36 uid with namespacing
     * @function
     * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
     * @param {String} namespace - name of plugin to be incorporated in uid, optional.
     * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
     * @returns {String} - unique id
     */
    GetYoDigits: function (length, namespace) {
      length = length || 6;
      return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1) + (namespace ? '-' + namespace : '');
    },
    /**
     * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
     * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
     * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
     */
    reflow: function (elem, plugins) {

      // If plugins is undefined, just grab everything
      if (typeof plugins === 'undefined') {
        plugins = Object.keys(this._plugins);
      }
      // If plugins is a string, convert it to an array with one item
      else if (typeof plugins === 'string') {
          plugins = [plugins];
        }

      var _this = this;

      // Iterate through each plugin
      $.each(plugins, function (i, name) {
        // Get the current plugin
        var plugin = _this._plugins[name];

        // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
        var $elem = $(elem).find('[data-' + name + ']').addBack('[data-' + name + ']');

        // For each plugin found, initialize it
        $elem.each(function () {
          var $el = $(this),
              opts = {};
          // Don't double-dip on plugins
          if ($el.data('zfPlugin')) {
            console.warn("Tried to initialize " + name + " on an element that already has a Foundation plugin.");
            return;
          }

          if ($el.attr('data-options')) {
            var thing = $el.attr('data-options').split(';').forEach(function (e, i) {
              var opt = e.split(':').map(function (el) {
                return el.trim();
              });
              if (opt[0]) opts[opt[0]] = parseValue(opt[1]);
            });
          }
          try {
            $el.data('zfPlugin', new plugin($(this), opts));
          } catch (er) {
            console.error(er);
          } finally {
            return;
          }
        });
      });
    },
    getFnName: functionName,
    transitionend: function ($elem) {
      var transitions = {
        'transition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'otransitionend'
      };
      var elem = document.createElement('div'),
          end;

      for (var t in transitions) {
        if (typeof elem.style[t] !== 'undefined') {
          end = transitions[t];
        }
      }
      if (end) {
        return end;
      } else {
        end = setTimeout(function () {
          $elem.triggerHandler('transitionend', [$elem]);
        }, 1);
        return 'transitionend';
      }
    }
  };

  Foundation.util = {
    /**
     * Function for applying a debounce effect to a function call.
     * @function
     * @param {Function} func - Function to be called at end of timeout.
     * @param {Number} delay - Time in ms to delay the call of `func`.
     * @returns function
     */
    throttle: function (func, delay) {
      var timer = null;

      return function () {
        var context = this,
            args = arguments;

        if (timer === null) {
          timer = setTimeout(function () {
            func.apply(context, args);
            timer = null;
          }, delay);
        }
      };
    }
  };

  // TODO: consider not making this a jQuery function
  // TODO: need way to reflow vs. re-initialize
  /**
   * The Foundation jQuery method.
   * @param {String|Array} method - An action to perform on the current jQuery object.
   */
  var foundation = function (method) {
    var type = typeof method,
        $meta = $('meta.foundation-mq'),
        $noJS = $('.no-js');

    if (!$meta.length) {
      $('<meta class="foundation-mq">').appendTo(document.head);
    }
    if ($noJS.length) {
      $noJS.removeClass('no-js');
    }

    if (type === 'undefined') {
      //needs to initialize the Foundation object, or an individual plugin.
      Foundation.MediaQuery._init();
      Foundation.reflow(this);
    } else if (type === 'string') {
      //an individual method to invoke on a plugin or group of plugins
      var args = Array.prototype.slice.call(arguments, 1); //collect all the arguments, if necessary
      var plugClass = this.data('zfPlugin'); //determine the class of plugin

      if (plugClass !== undefined && plugClass[method] !== undefined) {
        //make sure both the class and method exist
        if (this.length === 1) {
          //if there's only one, call it directly.
          plugClass[method].apply(plugClass, args);
        } else {
          this.each(function (i, el) {
            //otherwise loop through the jQuery collection and invoke the method on each
            plugClass[method].apply($(el).data('zfPlugin'), args);
          });
        }
      } else {
        //error for no class or no method
        throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
      }
    } else {
      //error for invalid argument type
      throw new TypeError('We\'re sorry, ' + type + ' is not a valid parameter. You must use a string representing the method you wish to invoke.');
    }
    return this;
  };

  window.Foundation = Foundation;
  $.fn.foundation = foundation;

  // Polyfill for requestAnimationFrame
  (function () {
    if (!Date.now || !window.Date.now) window.Date.now = Date.now = function () {
      return new Date().getTime();
    };

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      var lastTime = 0;
      window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
          callback(lastTime = nextTime);
        }, nextTime - now);
      };
      window.cancelAnimationFrame = clearTimeout;
    }
    /**
     * Polyfill for performance.now, required by rAF
     */
    if (!window.performance || !window.performance.now) {
      window.performance = {
        start: Date.now(),
        now: function () {
          return Date.now() - this.start;
        }
      };
    }
  })();
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
        return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      if (this.prototype) {
        // native functions don't have a prototype
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
  // Polyfill to get the name of a function in IE9
  function functionName(fn) {
    if (Function.prototype.name === undefined) {
      var funcNameRegex = /function\s([^(]{1,})\(/;
      var results = funcNameRegex.exec(fn.toString());
      return results && results.length > 1 ? results[1].trim() : "";
    } else if (fn.prototype === undefined) {
      return fn.constructor.name;
    } else {
      return fn.prototype.constructor.name;
    }
  }
  function parseValue(str) {
    if (/true/.test(str)) return true;else if (/false/.test(str)) return false;else if (!isNaN(str * 1)) return parseFloat(str);
    return str;
  }
  // Convert PascalCase to kebab-case
  // Thank you: http://stackoverflow.com/a/8955580
  function hyphenate(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}(jQuery);
'use strict'; /**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */(function(){var container,button,menu,links,subMenus,i,len;container=document.getElementById('site-navigation');if(!container){return;}button=container.getElementsByTagName('button')[0];if('undefined'===typeof button){return;}menu=container.getElementsByTagName('ul')[0]; // Hide menu toggle button if menu is empty and return early.
if('undefined'===typeof menu){button.style.display='none';return;}menu.setAttribute('aria-expanded','false');if(-1===menu.className.indexOf('nav-menu')){menu.className+=' nav-menu';}button.onclick=function(){if(-1!==container.className.indexOf('toggled')){container.className=container.className.replace(' toggled','');button.setAttribute('aria-expanded','false');menu.setAttribute('aria-expanded','false');}else {container.className+=' toggled';button.setAttribute('aria-expanded','true');menu.setAttribute('aria-expanded','true');}}; // Get all the link elements within the menu.
links=menu.getElementsByTagName('a');subMenus=menu.getElementsByTagName('ul'); // Set menu items with submenus to aria-haspopup="true".
for(i=0,len=subMenus.length;i<len;i++){subMenus[i].parentNode.setAttribute('aria-haspopup','true');} // Each time a menu link is focused or blurred, toggle focus.
for(i=0,len=links.length;i<len;i++){links[i].addEventListener('focus',toggleFocus,true);links[i].addEventListener('blur',toggleFocus,true);} /**
	 * Sets or removes .focus class on an element.
	 */function toggleFocus(){var self=this; // Move up through the ancestors of the current link until we hit .nav-menu.
while(-1===self.className.indexOf('nav-menu')){ // On li elements toggle the class .focus.
if('li'===self.tagName.toLowerCase()){if(-1!==self.className.indexOf('focus')){self.className=self.className.replace(' focus','');}else {self.className+=' focus';}}self=self.parentElement;}}})();
'use strict'; /**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */(function(){var isWebkit=navigator.userAgent.toLowerCase().indexOf('webkit')>-1,isOpera=navigator.userAgent.toLowerCase().indexOf('opera')>-1,isIe=navigator.userAgent.toLowerCase().indexOf('msie')>-1;if((isWebkit||isOpera||isIe)&&document.getElementById&&window.addEventListener){window.addEventListener('hashchange',function(){var id=location.hash.substring(1),element;if(!/^[A-z0-9_-]+$/.test(id)){return;}element=document.getElementById(id);if(element){if(!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)){element.tabIndex=-1;}element.focus();}},false);}})();