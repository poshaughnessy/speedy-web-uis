/*
 * Original HTML5 Rocks Licence:
 *
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Original slides: Marcin Wichary (mwichary@google.com)
 * Modifications: Ernest Delgado (ernestd@google.com)
 * Alex Russell (slightlyoff@chromium.org)
 * Brad Neuberg
 *
 * Re-purposed and modified by Peter O'Shaughnessy (see comments)
 */
var Slides = function (demos) {

    var self = this;

    // Shortcut
    var doc = document;

    // Allow multi-step slides
    var disableBuilds = false;

    var ctr = 0;
    var spaces = /\s+/, a1 = [''];

    var toArray = function (list) {
        return Array.prototype.slice.call(list || [], 0);
    };

    var byId = function (id) {
        if (typeof id == 'string') {
            return doc.getElementById(id);
        }
        return id;
    };

    var query = function (query, root) {
        if (!query) {
            return [];
        }
        if (typeof query != 'string') {
            return toArray(query);
        }
        if (typeof root == 'string') {
            root = byId(root);
            if (!root) {
                return [];
            }
        }

        root = root || document;
        var rootIsDoc = (root.nodeType == 9);
        var doc = rootIsDoc ? root : (root.ownerDocument || document);

        // rewrite the query to be ID rooted
        if (!rootIsDoc || ('>~+'.indexOf(query.charAt(0)) >= 0)) {
            root.id = root.id || ('qUnique' + (ctr++));
            query = '#' + root.id + ' ' + query;
        }
        // don't choke on something like ".yada.yada >"
        if ('>~+'.indexOf(query.slice(-1)) >= 0) {
            query += ' *';
        }

        return toArray(doc.querySelectorAll(query));
    };

    var strToArray = function (s) {
        if (typeof s == 'string' || s instanceof String) {
            if (s.indexOf(' ') < 0) {
                a1[0] = s;
                return a1;
            } else {
                return s.split(spaces);
            }
        }
        return s;
    };

    var addClass = function (node, classStr) {
        classStr = strToArray(classStr);
        var cls = ' ' + node.className + ' ';
        for (var i = 0, len = classStr.length, c; i < len; ++i) {
            c = classStr[i];
            if (c && cls.indexOf(' ' + c + ' ') < 0) {
                cls += c + ' ';
            }
        }
        node.className = cls.trim();
    };

    var removeClass = function (node, classStr) {
        var cls;
        if (classStr !== undefined) {
            classStr = strToArray(classStr);
            cls = ' ' + node.className + ' ';
            for (var i = 0, len = classStr.length; i < len; ++i) {
                cls = cls.replace(' ' + classStr[i] + ' ', ' ');
            }
            cls = cls.trim();
        } else {
            cls = '';
        }
        if (node.className != cls) {
            node.className = cls;
        }
    };

    var toggleClass = function (node, classStr) {
        var cls = ' ' + node.className + ' ';
        if (cls.indexOf(' ' + classStr.trim() + ' ') >= 0) {
            removeClass(node, classStr);
        } else {
            addClass(node, classStr);
        }
    };

    var ua = navigator.userAgent;
    var isFF = parseFloat(ua.split('Firefox/')[1]) || undefined;
    var isWK = parseFloat(ua.split('WebKit/')[1]) || undefined;
    var isOpera = parseFloat(ua.split('Opera/')[1]) || undefined;

    var canTransition = (function () {
        var ver = parseFloat(ua.split('Version/')[1]) || undefined;
        // test to determine if this browser can handle CSS transitions.
        var cachedCanTransition =
                (isWK || (isFF && isFF > 3.6 ) || (isOpera && ver >= 10.5));
        return function () {
            return cachedCanTransition;
        }
    })();

    //
    // Slide class
    //
    var Slide = function (node, idx) {
        this._node = node;
        if (idx >= 0) {
            this._count = idx + 1;
        }
        if (this._node) {
            addClass(this._node, 'slide distant-slide');
        }
        this._makeBuildList();
    };

    Slide.prototype = {
        _node: null,
        _count: 0,
        _buildList: [],
        _visited: false,
        _currentState: '',
        _states: [ 'distant-slide', 'far-past',
            'past', 'current', 'future',
            'far-future', 'distant-slide' ],
        setState: function (state) {
            if (typeof state != 'string') {
                state = this._states[state];
            }
            if (state == 'current' && !this._visited) {
                this._visited = true;
                this._makeBuildList();
            }
            removeClass(this._node, this._states);
            addClass(this._node, state);
            this._currentState = state;

            // delay first auto run. Really wish this were in CSS.
            /*
             this._runAutos();
             */
            var _t = this;
            setTimeout(function () {
                _t._runAutos();
            }, 400);
        },
        _makeCounter: function () {
            if (!this._count || !this._node) {
                return;
            }
            var c = doc.createElement('span');
            c.innerHTML = this._count;
            c.className = 'counter';
            this._node.appendChild(c);
        },
        _makeBuildList: function () {
            this._buildList = [];
            if (disableBuilds) {
                return;
            }
            if (this._node) {
                // Peter added ignore for .current
                this._buildList = query('[data-build] > *:not(.current)', this._node);
            }
            this._buildList.forEach(function (el) {
                addClass(el, 'to-build');
            });
        },
        _runAutos: function () {
            if (this._currentState != 'current') {
                return;
            }
            // find the next auto, slice it out of the list, and run it
            var idx = -1;
            this._buildList.some(function (n, i) {
                if (n.hasAttribute('data-auto')) {
                    idx = i;
                    return true;
                }
                return false;
            });
            if (idx >= 0) {
                var elem = this._buildList.splice(idx, 1)[0];
                var transitionEnd = isWK ? 'webkitTransitionEnd' : (isFF ? 'mozTransitionEnd' : 'oTransitionEnd');
                var _t = this;
                if (canTransition()) {
                    var l = function (evt) {
                        elem.parentNode.removeEventListener(transitionEnd, l, false);
                        _t._runAutos();
                    };
                    elem.parentNode.addEventListener(transitionEnd, l, false);
                    removeClass(elem, 'to-build');
                } else {
                    setTimeout(function () {
                        removeClass(elem, 'to-build');
                        _t._runAutos();
                    }, 400);
                }
            }
        },
        buildNext: function () {
            if (!this._buildList.length) {
                return false;
            }
            var nextOne = this._buildList.shift();
            removeClass(nextOne, 'to-build');
            // Extended by Peter for slideshows
            if (typeof $('[data-build]', this._node).data('slideshow') != 'undefined') {
                $('[data-build] > *', this._node).removeClass('current');
                addClass(nextOne, 'current');
            }
            return true;
        },
        // Added by Peter so we can go backwards through transitions
        buildPrev: function () {

            var $currentSlideShowTransition = $('.current', this._node);

            if( $currentSlideShowTransition ) {

                var currentSlideShowIndex = $currentSlideShowTransition.index();

                if( currentSlideShowIndex > 0 ) {

                    var $prevSlideShowTransition = $currentSlideShowTransition.prev();

                    $prevSlideShowTransition.addClass('current').removeClass('to-build');

                    $currentSlideShowTransition.addClass('to-build').removeClass('current');

                    this._buildList.unshift($currentSlideShowTransition[0]);

                    return true;

                }

            }

            return false;

        }
    };

    //
    // SlideShow class
    //
    var SlideShow = function (slides) {
        this._slides = (slides || []).map(function (el, idx) {
            return new Slide(el, idx);
        });
        var h = window.location.hash;
        try {
            this.current = parseInt(h.split('#slide')[1], 10);
        } catch (e) { /* squeltch */
        }
        this.current = isNaN(this.current) ? 1 : this.current;
        var _t = this;
        doc.addEventListener('keydown',
                function (e) {
                    _t.handleKeys(e);
                }, false);
        doc.addEventListener('touchstart',
                function (e) {
                    _t.handleTouchStart(e);
                    e.preventDefault();
                }, false);
        doc.addEventListener('touchmove',
                function (e) {
                    e.preventDefault();
                }, false);
        doc.addEventListener('touchend',
                function (e) {
                    _t.handleTouchEnd(e);
                }, false);
        doc.ontouchmove = function (e) {
            e.preventDefault();
        }
        window.addEventListener('popstate',
                function (e) {
                    if (e.state) {
                        _t.go(e.state);
                    }
                }, false);
        this._update();
    };

    SlideShow.prototype = {
        _autoAdvance: false,
        _slides: [],
        _timeout: null,
        _update: function (dontPush) {
            if (history.pushState) {
                if (!dontPush) {
                    history.replaceState(this.current, 'Slide ' + this.current, '#slide' + this.current);
                }
            } else {
                window.location.hash = 'slide' + this.current;
            }
            for (var x = this.current - 1; x < this.current + 7; x++) {
                if (this._slides[x - 4]) {
                    this._slides[x - 4].setState(Math.max(0, x - this.current));
                }
            }
        },

        current: 0,
        next: function () {
            if (!this._slides[this.current - 1].buildNext()) {
                // Added by Peter
                if( this._timeout ) clearTimeout( this._timeout );
                var was = this.current;
                this.current = Math.min(this.current + 1, this._slides.length);
                this._update();
                // Added by Peter
                if( this.current !== was ) this.slideChanged();
            } else {
                this.slideShowChanged();
            }
        },
        prev: function () {
            // Added by Peter
            if( !this._slides[this.current - 1].buildPrev() ) {
                if( this._timeout ) clearTimeout( this._timeout );
                var was = this.current;
                this.current = Math.max(this.current - 1, 1);
                this._update();
                // Added by Peter
                if( this.current !== was ) this.slideChanged();
            } else {
                this.slideShowChanged();
            }

        },
        go: function (num) {
            // Added by Peter
            if( this._timeout ) clearTimeout( this._timeout );
            var was = this.current;
            this.current = num;
            this._update(true);
            // Added by Peter
            if( this.current !== was ) this.slideChanged();
        },

        _notesOn: false,
        showNotes: function () {
            var isOn = this._notesOn = !this._notesOn;
            query('.notes').forEach(function (el) {
                el.style.display = (notesOn) ? 'block' : 'none';
            });
        },
        switch3D: function () {
            toggleClass(document.body, 'three-d');
        },
        handleWheel: function (e) {
            var delta = 0;
            if (e.wheelDelta) {
                delta = e.wheelDelta / 120;
                if (isOpera) {
                    delta = -delta;
                }
            } else if (e.detail) {
                delta = -e.detail / 3;
            }

            if (delta > 0) {
                this.prev();
                return;
            }
            if (delta < 0) {
                this.next();
                return;
            }
        },
        handleKeys: function (e) {

            if (/^(input|textarea)$/i.test(e.target.nodeName)) return;

            switch (e.keyCode) {
                case 37: // left arrow
                    this.prev();
                    break;
                case 39: // right arrow
                case 32: // space
                    this.next();
                    break;
                case 50: // 2
                    this.showNotes();
                    break;
                case 51: // 3
                    this.switch3D();
                    break;
            }
        },
        _touchStartX: 0,
        handleTouchStart: function (e) {
            this._touchStartX = e.touches[0].pageX;
        },
        handleTouchEnd: function (e) {
            var delta = this._touchStartX - e.changedTouches[0].pageX;
            var SWIPE_SIZE = 150;
            if (delta > SWIPE_SIZE) {
                this.next();
            } else if (delta < -SWIPE_SIZE) {
                this.prev();
            }
        },
        // Added by Peter for integration with demos
        slideChanged : function() {

            if( demos ) {
                demos.onSlide(this.current - 1);
            }

            this.autoSlides();

        },
        // Added by Peter
        slideShowChanged : function() {

            if( demos ) {
                demos.onSlideShowChange();
            }

            this.autoSlides();

        },

        // Added by Peter
        autoSlides : function() {

            if( this._timeout ) clearTimeout( this._timeout );

            if( this.current > 1 ) {

                var thisSlideEl = this._slides[this.current-1]['_node'];

                var autoSlides = $('[data-autoslide]', $(thisSlideEl));

                if( autoSlides.length > 0 &&
                    $('.to-build', $(thisSlideEl)).length > 0 &&
                    $(autoSlides).attr('data-autoslide') !== 'undefined' &&
                    $(autoSlides).attr('data-autoslide') !== false ) {

                        // Schedule auto-proceed time-out

                        var slideTimeout = parseInt( $('.current', autoSlides).attr('data-autoslide') );

                        // If not defined on individual transition, use default

                        if( !slideTimeout ) slideTimeout = parseInt( $(autoSlides).attr('data-autoslide') );

                        var self = this;
                        this._timeout = setTimeout( function() { self.autoAdvance() }, slideTimeout );

                }

            }

        },

        // Added by Peter
        autoAdvance : function() {

            if( this._autoAdvance ) {
                this.next();
            }

        }
    };

    // Initialize

    this.slideshow = new SlideShow(query('.slide'));

    // For initial slide load
    this.slideshow.slideChanged();

    // Added by Peter so you change the slide by changing URL
    $(window).bind('hashchange', function () {

        var h = window.location.hash;

        var slideNum = 0;

        try {
            slideNum = parseInt(h.split('#slide')[1], 10);
        } catch (e) {
            // Swallow
        }

        self.slideshow.go(slideNum);

    });

};
