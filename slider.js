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
        this.slide = options.slide || false;
        this.enhance = options.enhance || false;
        this.duration = options.durationTime || 800;
        this.callback = options.callback || function () {};
        this.animate = options.animate;

        this.start = function (e) {
            if (e.targetTouches.length != 1) return;
            if (!this.done) return;
            var touch = e.targetTouches[0];
            this.startPos = {
                x: touch.pageX,
                y: touch.pageY
            }
            this.done = false;
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
            if(this.slide){
                this.diffScale = 1;
                this.diffOpacity = 1;
                this.diffRotate = 1;
                if (this.animate.transform && this.animate.transform.scale) {
                    this.diffScale = this.animate.transform.scale[1] - this.animate.transform.scale[0];
                }

                if (this.animate.transform && this.animate.transform.rotate) {
                    this.diffRotate = this.animate.transform.rotate[1] - this.animate.transform.rotate[0];
                }

                if (this.animate.opacity) {
                    this.diffOpacity = this.animate.opacity[1] - this.animate.opacity[0];
                }
            }
            this.pageWrap.addEventListener("touchmove", this.move, false);
            this.pageWrap.addEventListener("touchend", this.end, false);
        }.bind(this)

        this.move = function (e) {
            if (e.targetTouches.length != 1) return;
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

                if (this.prev >= 0 && Math.abs(touch.pageY) - Math.abs(this.startPos.y) > 0) {
                    if(this.enhance){
                        this.pageArr[this.prev].style.opacity = this.diffOpacity * diffPos.y / browserInfo.height;
                        this.setStyle3(this.pageArr[this.prev], 'transform', "translate(0," + (diffPos.y * 2.5 - browserInfo.height) + "px) translateZ(0) " + "rotate(" + this.diffRotate * diffPos.y / browserInfo.height + "deg) scale(" + this.diffScale * diffPos.y / browserInfo.height + ")");
                    }else{
                        this.setStyle3(this.pageArr[this.prev], 'transform', "translate(0," + (diffPos.y * 2.5 - browserInfo.height) + "px) translateZ(0) ");
                    }
                }else if (this.next <= this.pageMax - 1 && Math.abs(touch.pageY) - Math.abs(this.startPos.y) < 0) {
                    if(this.enhance){
                        this.pageArr[this.next].style.opacity = this.diffOpacity * diffPos.y / browserInfo.height;
                        this.setStyle3(this.pageArr[this.next], 'transform', "translate(0," + (browserInfo.height - diffPos.y * 2.5) + "px) translateZ(0) " + "rotate(" + this.diffRotate * diffPos.y / browserInfo.height + "deg) scale(" + this.diffScale * diffPos.y / browserInfo.height + ")");
                    }else{
                        this.setStyle3(this.pageArr[this.next], 'transform', "translate(0," + (browserInfo.height - diffPos.y * 2.5) + "px) translateZ(0) ");
                    }
                }

            }
        }.bind(this)

        this.end = function (e) {
            var touch = e.changedTouches[0];
            this.endPos = {
                x: touch.pageX,
                y: touch.pageY
            }

            if(Math.abs(this.startPos.y) - Math.abs(this.endPos.y) == 0){
                this.removeClass("static", this.prev);
                this.removeClass("static", this.next);
                this.done = true;
                return;
            }
            if (Math.abs(this.startPos.y) - Math.abs(this.endPos.y) > 33) {
                this.direct = 1
            } else if(Math.abs(this.endPos.y) - Math.abs(this.startPos.y) > 33) {
                this.direct = -1;
            }

            this.toPage();

            this.pageWrap.removeEventListener("touchmove", this.move, false);
            this.pageWrap.removeEventListener("touchend", this.end, false);
        }.bind(this)

        this.toPage = function (index) {
            if(this.direct == 0){this.done = true;return;}
            this.newIndex = this.currentIndex + this.direct;
            if (this.newIndex < 0 || this.newIndex >= this.pageMax){
                this.done = true;
                return;
            }
            if ((this.direct < 0 && this.newIndex >= 0) || (this.direct > 0 && this.newIndex < this.pageMax)) {
                this.replaceClass("static", "slide", this.newIndex);
            }

            this.setStyle3(this.pageArr[this.newIndex], 'transitionDuration', this.duration + "ms");

            if(this.enhance){
                this.setStyle3(this.pageArr[this.newIndex], 'transform', "translate(0,0) translateZ(0) rotate(360deg) scale(1)");
                this.setStyle3(this.pageArr[this.newIndex], 'opacity', "1");
            }else{
                this.setStyle3(this.pageArr[this.newIndex], 'transform', "translate(0,0) translateZ(0)");
            }

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

    slider.prototype.hexieIndex = function(index){
        if(index<0){
            return 0;
        }
        if(index>this.pageArr.length-1){
            return this.pageArr.length-1;
        }
        return index;
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
        var className = this.pageArr[this.hexieIndex(index)].className;
        if (new RegExp(cla, "g").test(className)) {
            return this.pageArr[index];
        } else {
            this.pageArr[index].className += (" " + cla);
            return this.pageArr[index];
        }

    }

    slider.prototype.removeClass = function (cla, index) {
        var className = this.pageArr[this.hexieIndex(index)].className;
        if (!new RegExp(cla, "g").test(className)) {
            return this.pageArr[index];
        } else {
            className = className.replace(/\s+/g, " ").replace(new RegExp(cla, "g"), "");
            this.pageArr[index].className = className;
            return this.pageArr[index];
        }
    }

    slider.prototype.replaceClass = function (cla, xcla, index) {
        var className = this.pageArr[this.hexieIndex(index)].className;
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
