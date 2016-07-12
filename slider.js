!function (window, document, undefined) {

    var browserInfo = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        prefix: (function (style) {
            var vendor = ['webkit', 'moz', 'ms', 'o'], i = 0;
            while (i < vendor.length) {
                if (typeof style[vendor[i] + 'Transition'] === 'string') {
                    return vendor[i];
                }
                i++;
            }
        })(document.createElement("div").style)
    }

    var slider = function (options) {
        this.options = options;
        this.pageWrap = document.getElementById(options.id);
        this.pageArr = this.pageWrap.children;
        this.pageMax = this.pageArr.length;
        this.currentIndex = 0;
        this.cubicCurve = {};
        this.zIndex = 1;
        this.done = true;
        this.direct = 0;
        this.slide = options.slide || false, this.duration = options.durationTime || 800;
        this.callback = options.callback || function () {
            };
        this.animate = options.animate;

        this.start = function (e) {
            if (!this.done) return;
            this.done = false;
            if (e.targetTouches.length != 1) return;
            var touch = e.targetTouches[0];
            this.startPos = {
                x: touch.pageX,
                y: touch.pageY
            }
            this.prev = this.currentIndex - 1;
            this.next = this.currentIndex + 1;
            if (this.prev >= 0) {
                this.pageArr[this.prev].style[browserInfo.prefix + 'Transform'] = 'translate(0,-' + browserInfo.height + 'px) translateZ(0)';
                this.pageArr[this.prev].style[browserInfo.prefix + 'TransformOrigin'] = '50% 50%';
                this.addClass("static", this.prev);
            }
            if (this.next <= this.pageMax - 1) {
                this.pageArr[this.next].style[browserInfo.prefix + 'Transform'] = 'translate(0,' + browserInfo.height + 'px) translateZ(0)';
                this.pageArr[this.next].style[browserInfo.prefix + 'TransformOrigin'] = '50% 50%';
                this.addClass("static", this.next);
            }
            this.pageWrap.addEventListener("touchmove", this.move, false);
            this.pageWrap.addEventListener("touchend", this.end, false);
        }.bind(this)

        this.move = function (e) {
            if (e.targetTouches.length != 1) return;
            var diffScale = 1;
            var diffOpacity = 1;
            var diffRotate = 1;
            var touch = e.targetTouches[0];
            this.movePos = {
                x: touch.pageX,
                y: touch.pageY
            }
            if (this.slide) {

                var diffPos = {
                    x: Math.abs(touch.pageX - this.startPos.x),
                    y: Math.abs(touch.pageY - this.startPos.y)
                }

                if (this.animate.transform && this.animate.transform.scale) {
                    diffScale = this.animate.transform.scale[1] - this.animate.transform.scale[0];
                }

                if (this.animate.transform && this.animate.transform.rotate) {
                    diffRotate = this.animate.transform.rotate[1] - this.animate.transform.rotate[0];
                }

                if (this.animate.opacity) {
                    diffOpacity = this.animate.opacity[1] - this.animate.opacity[0];
                }

                if (this.prev >= 0 && Math.abs(touch.pageY) - Math.abs(this.startPos.y) > 0) {
                    this.pageArr[this.prev].style.opacity = diffOpacity * diffPos.y / browserInfo.height;
                    this.setStyle3(this.pageArr[this.prev], 'Transform', "translate(0," + (diffPos.y * 2.5 - browserInfo.height) + "px) translateZ(0) " + "rotate(" + diffRotate * diffPos.y / browserInfo.height + "deg) scale(" + diffScale * diffPos.y / browserInfo.height + ")");
                }
                if (this.next <= this.pageMax - 1 && Math.abs(touch.pageY) - Math.abs(this.startPos.y) < 0) {
                    this.pageArr[this.next].style.opacity = diffOpacity * diffPos.y / browserInfo.height;
                    this.setStyle3(this.pageArr[this.next], 'Transform', "translate(0," + (browserInfo.height - diffPos.y * 2.5) + "px) translateZ(0) " + "rotate(" + diffRotate * diffPos.y / browserInfo.height + "deg) scale(" + diffScale * diffPos.y / browserInfo.height + ")");
                }

            }
        }.bind(this)

        this.end = function (e) {
            var touch = e.changedTouches[0];
            this.endPos = {
                x: touch.pageX,
                y: touch.pageY
            }

            //if (Math.abs(this.endPos.y) - Math.abs(this.startPos.y) > 0 && Math.abs(Math.abs(this.endPos.y) - Math.abs(this.startPos.y)) > 0.05 * browserInfo.height) {
            if (Math.abs(this.endPos.y) - Math.abs(this.startPos.y) > 0) {
                this.direct = -1
            } else {
                this.direct = 1;
            }
            if (this.direct == 0) {
                this.removeClass("static", this.prev);
                this.removeClass("static", this.next);
                return;
            }
            this.toPage();
            this.pageWrap.removeEventListener("touchmove", this.move, false);
            this.pageWrap.removeEventListener("touchend", this.end, false);
        }.bind(this)

        this.toPage = function (index) {
            this.newIndex = this.currentIndex + this.direct;
            if (this.newIndex < 0 || this.newIndex >= this.pageMax) return this.done = true;
            if ((this.direct < 0 && this.newIndex >= 0) || (this.direct > 0 && this.newIndex < this.pageMax)) {
                this.replaceClass("static", "slide", this.newIndex);
            }

            this.setStyle3(this.pageArr[this.newIndex], 'TransitionDuration', this.duration + "ms");
            this.setStyle3(this.pageArr[this.newIndex], 'Transform', "translate(0,0) translateZ(0) rotate(360deg) scale(1)");
            this.setStyle3(this.pageArr[this.newIndex], 'Opacity', "1");
            setTimeout(function () {
                this.removeClass("current", this.currentIndex);
                this.currentIndex = this.newIndex;
                this.replaceClass("slide", "current", this.currentIndex);
                this.callback(this.currentIndex);
                this.done = true;
            }.bind(this), this.duration + 123);
        }

    }

    slider.prototype.init = function (index) {

        document.body.addEventListener("touchmove", function (e) {
            e.preventDefault();
        }, false);

        this.pageWrap.style.height = browserInfo.height + "px";
        if (typeof this.options.animate.easing === 'string') {
            switch (this.options.animate.easing) {
                case 'ease' :
                    this.setCubic(0.25, 0.1, 0.25, 1);
                    break;
                case 'linear' :
                    this.setCubic(0, 0, 1, 1);
                    break;
                case 'ease-in' :
                    this.setCubic(0.42, 0, 1, 1);
                    break;
                case 'ease-out' :
                    this.setCubic(0, 0, 0.58, 1);
                    break;
                case 'ease-in-out' :
                    this.setCubic(0.42, 0, 0.58, 1);
                    break;
            }
        } else {
            this.setCubic(this.options.animate.easing[0], this.options.animate.easing[1], this.options.animate.easing[2], this.options.animate.easing[3]);
        }
        for (var i = 0; i < this.pageMax; i++) {
            this.setStyle3(this.pageArr[i], "transitionTimingFunction", 'cubic-bezier('
                + this.cubicCurve.A + ','
                + this.cubicCurve.B + ','
                + this.cubicCurve.C + ','
                + this.cubicCurve.D + ')')

        }
        this.pageWrap.addEventListener("touchstart", this.start, false);
        return this;
    }

    slider.prototype.setCubic = function (a, b, c, d) {
        this.cubicCurve.A = a;
        this.cubicCurve.B = b;
        this.cubicCurve.C = c;
        this.cubicCurve.D = d;
    }

    slider.prototype.setStyle3 = function (obj, name, value) {
        obj.style[browserInfo.prefix.charAt(0).toUpperCase() + browserInfo.prefix.substring(1) + name.charAt(0).toUpperCase() + name.substring(1)] = value;
        obj.style[name] = value;
    }

    slider.prototype.addClass = function (cla, index) {
        var className = this.pageArr[index].className;
        if (new RegExp(cla, "g").test(className)) {
            return this.pageArr[index];
        } else {
            this.pageArr[index].className += (" " + cla);
            return this.pageArr[index];
        }

    }

    slider.prototype.removeClass = function (cla, index) {
        var className = this.pageArr[index].className;
        if (!new RegExp(cla, "g").test(className)) {
            return this.pageArr[index];
        } else {
            className = className.replace(/\s+/g, " ").replace(new RegExp(cla, "g"), "");
            this.pageArr[index].className = className;
            return this.pageArr[index];
        }
    }

    slider.prototype.replaceClass = function (cla, xcla, index) {
        var className = this.pageArr[index].className;
        if (!new RegExp(cla, "g").test(className)) {
            return this.pageArr[index];
        } else {
            className = className.replace(/\s+/g, " ").replace(new RegExp(cla, "g"), xcla);
            this.pageArr[index].className = className;
            return this.pageArr[index];
        }
    }

    slider.prototype.getIndex = function (index) {
        console.log(this.currentIndex);
        return this.currentIndex;
    }

    window.slider = slider;
}(window, document);
