# mobile-slide
mobile slide screen for activities fast

参考的[大神级repo1](https://github.com/powy1993/fullpage),[大神级repo2](https://github.com/hahnzhu/parallax.js),[大神级repo3](https://github.com/yanhaijing/zepto.fullpage)

快速迭代移动端滑屏运营活动
```javascript
var s = new slider({
        id: "wraper",//外围的父容器
        durationTime: 1000,//滑屏时间 默认为800
        slide:true,//是否允许用户拖动
        animate: {
            transform: {//滑屏时的transform变化
                scale: [0, 1],
                rotate: [0, 340]
            },
            opacity: [0, 1],//滑屏时的透明度变化
            easing: "ease-in"//动画的贝塞尔曲线,linear,ease-in,ease-in-out,ease-out,ease
        },
        callback: function(index){//滑动到当前index的回调
            //todo  what you want
            console.log(index);
        }
    }).init();
```
```javascript
/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         镇邪      永无BUG
*/
```