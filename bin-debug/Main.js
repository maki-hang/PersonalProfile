//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var allPages = new egret.DisplayObjectContainer();
        var firstPage = new egret.DisplayObjectContainer();
        var SecondPage = new egret.DisplayObjectContainer();
        this.addChild(allPages);
        allPages.addChild(firstPage);
        allPages.addChild(SecondPage);
        SecondPage.y = stageH;
        //allPages.scrollRect = new egret.Rectangle(0, 0, stageW, stageH * 2);
        // var myallPages = new addPages(this.stage.stageWidth, this.stage.stageHeight);
        //以下为第一页
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        firstPage.addChild(bg);
        var bgEffect = this.createBitmapByName("BgEffect_png");
        firstPage.addChild(bgEffect);
        bgEffect.x = stageW / 2;
        bgEffect.y = stageH / 2;
        bgEffect.anchorOffsetX += bgEffect.width / 2;
        bgEffect.anchorOffsetY += bgEffect.height / 2;
        bgEffect.alpha = 0;
        var bgText = new egret.TextField();
        firstPage.addChild(bgText);
        bgText.text = "I'm here for building amazing games!";
        bgText.size = 32;
        bgText.width = stageW;
        bgText.textAlign = egret.HorizontalAlign.CENTER;
        bgText.x = stageW / 2 - bgText.width / 2;
        bgText.y = stageH / 2 - bgText.height / 2 - 10;
        bgText.alpha = 0;
        var containerTextfield = new egret.DisplayObjectContainer();
        firstPage.addChild(containerTextfield);
        var textfield = new egret.TextField();
        containerTextfield.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 32;
        textfield.textColor = 0xffffff;
        textfield.x = stageW / 2 - textfield.width / 2;
        textfield.y = stageH / 2 - textfield.height / 2 - 10;
        this.textfield = textfield;
        textfield.touchEnabled = true;
        textfield.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(bgEffect).to({ alpha: 1 }, 200, egret.Ease.circIn);
            Main.doTextAnimation = false;
            egret.Tween.get(bgText).wait(200).to({ alpha: 1 }, 200, egret.Ease.circIn);
            egret.Tween.get(containerTextfield).to({ alpha: 0 }, 200);
            //var deleteContainerTextfield: Function = function () {
            //    this.removeChild(containerTextfield);
            //}
            var rotateBgEffect = function () {
                var bgTw = egret.Tween.get(bgEffect);
                bgTw.to({ rotation: 360 }, 100000);
                bgTw.call(rotateBgEffect, 100000);
            };
            rotateBgEffect();
            var setBgEffectAlpha = function () {
                var bgTw = egret.Tween.get(bgEffect);
                bgTw.to({ alpha: 0 }, 1000).wait(500).to({ alpha: 1 }, 1000).wait(2000);
                bgTw.call(setBgEffectAlpha, 4500);
            };
        }, this);
        var containerCircle = new egret.DisplayObjectContainer();
        var MusicIcon = this.createBitmapByName("Music_png");
        containerCircle.addChild(MusicIcon);
        MusicIcon.alpha = 1;
        firstPage.addChild(containerCircle);
        var Circle = this.createBitmapByName("Circle_png");
        containerCircle.addChild(Circle);
        var CircleInner = this.createBitmapByName("CircleInner_png");
        containerCircle.addChild(CircleInner);
        containerCircle.width = containerCircle.height = Circle.width;
        Circle.x = Circle.y = stageW / 2;
        Circle.anchorOffsetX = Circle.anchorOffsetY += Circle.width / 2;
        CircleInner.x = CircleInner.y = stageW / 2;
        CircleInner.anchorOffsetX = CircleInner.anchorOffsetY += CircleInner.width / 2;
        MusicIcon.x = MusicIcon.y = stageW / 2;
        MusicIcon.anchorOffsetX = MusicIcon.anchorOffsetY += MusicIcon.width / 2;
        MusicIcon.scaleX = MusicIcon.scaleY = 0.8;
        containerCircle.scaleX = containerCircle.scaleY = 0.2;
        var rotateCircle = function () {
            var circleInnerTw = egret.Tween.get(CircleInner);
            circleInnerTw.to({ rotation: -360 }, 50000);
            var circleTw = egret.Tween.get(Circle);
            circleTw.to({ rotation: 360 }, 50000);
            circleTw.call(rotateCircle, 50000);
        };
        rotateCircle();
        var sound = RES.getRes("Florence + The Machine - Seven Devils_mp3");
        var channal;
        var musicIn = false;
        containerCircle.touchEnabled = true;
        containerCircle.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (musicIn) {
                channal.stop();
                channal = null;
                musicIn = false;
            }
            else {
                channal = sound.play(0, 0);
                musicIn = true;
            }
        }, this);
        if (musicIn) {
            MusicIcon.alpha = 0;
            console.log("yeah");
        }
        else if (!musicIn) {
            MusicIcon.alpha = 1;
            console.log("ohno");
        }
        //egret.Tween.get(MusicIcon).to({ alpha: 0 }, 200);
        var moveContainerCircle = function () {
            var containerCircleTW = egret.Tween.get(containerCircle);
            containerCircleTW.to({ x: stageW / (Math.random() * 10 + 1), y: stageH / (Math.random() * 10 + 1) }, 10000 * Math.random() * 2 + 1);
            containerCircleTW.call(moveContainerCircle, 1000 * Math.random());
        };
        moveContainerCircle();
        //以下为第二页
        var Secondbg = this.createBitmapByName("bg_jpg");
        SecondPage.addChild(Secondbg);
        var SecondTag = new egret.Shape();
        SecondTag.graphics.beginFill(0x000000);
        SecondTag.graphics.drawRect(0, stageH * 2 / 5, stageW, stageH / 6);
        SecondTag.graphics.endFill();
        SecondTag.alpha = 0.5;
        SecondPage.addChild(SecondTag);
        var secondText = new egret.TextField();
        secondText.text = "此处应该有视频或者其他的一些新东西，然而遇到的问题太多了，10.7又有事没法去答疑，sorry";
        SecondPage.addChild(secondText);
        secondText.width = stageW * 0.8;
        secondText.textAlign = egret.HorizontalAlign.CENTER;
        secondText.size = 32;
        secondText.textColor = 0xffffff;
        secondText.x = stageW / 2 - secondText.width / 2;
        secondText.y = stageH / 2 - secondText.height / 2 - 10;
        /*
              var myVideo = new egret.Video();
              firstPage.addChild(myVideo);
              myVideo.x = 0;                       //设置视频坐标x
              myVideo.y = 0;                       //设置视频坐标y
              myVideo.width = 640;                 //设置视频宽
              myVideo.height = 320;                //设置视频高
              myVideo.fullscreen = false;
              myVideo.poster = "resource/assets/KingSSM.jpg";
              myVideo.load("http://player.video.qiyi.com/08bf03b45d6bd666983b081710358dc1/0/295/w_19rr1lqtc1.swf-albumId=1170016109-tvId=1170016109-isPurchase=0-cnId=5");
              myVideo.play();
      */
        //以下是翻页
        //设定2个偏移量
        var offsetY;
        var setY;
        //手指按到屏幕，触发 startMove 方法
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, beginMove, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startMove, this);
        //手指离开屏幕，触发 stopMove 方法
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, stopMove, this);
        function beginMove(e) {
            setY = e.stageY;
        }
        function startMove(e) {
            setY = e.stageY;
        }
        function stopMove(e) {
            offsetY = setY - e.stageY;
            if (offsetY > stageH / 4) {
                containerCircle.touchEnabled = false;
                textfield.touchEnabled = false;
                egret.Tween.get(SecondPage).to({ y: 0 }, 1000, egret.Ease.backOut);
                if (channal == null) {
                    channal = sound.play();
                    musicIn = true;
                }
            }
            else if (offsetY < -stageH / 4) {
                containerCircle.touchEnabled = true;
                textfield.touchEnabled = true;
                egret.Tween.get(SecondPage).to({ y: stageH }, 1000, egret.Ease.backOut);
            }
        }
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            if (Main.doTextAnimation) {
                tw.to({ "alpha": 1 }, 200);
                tw.wait(2000);
                tw.to({ "alpha": 0 }, 200);
                tw.call(change, self);
            }
            else
                tw.to({ "alpha": 0 }, 80);
        };
        change();
    };
    p.startImageAnimation = function () {
        var self = this;
        var FirstImage = this.createBitmapByName("KingSSM_jpg");
        var SecondImage = this.createBitmapByName("egret_icon_png");
        var ChangeImages = [];
        ChangeImages[0] = FirstImage;
        ChangeImages[1] = SecondImage;
        var count = -1;
        var change = function () {
            count++;
            if (count >= ChangeImages.length) {
                count = 0;
            }
            var lineArr = ChangeImages[count];
            var tw = egret.Tween.get(ChangeImages);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    Main.doTextAnimation = true;
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
/*自己写的全是问题-----------------------------------------------------------------------------------------------
class addPages extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }

    public createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class addFirstPage extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.creatFirstPage();
    }
    public createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    private creatFirstPage(): void {
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);

        var bgEffect: egret.Bitmap = this.createBitmapByName("BgEffect_png");
        this.addChild(bgEffect);
        bgEffect.x = stageW / 2;
        bgEffect.y = stageH / 2;
        bgEffect.anchorOffsetX += bgEffect.width / 2;
        bgEffect.anchorOffsetY += bgEffect.height / 2;
        bgEffect.alpha = 0;

        var bgText = new egret.TextField();
        this.addChild(bgText);
        bgText.text = "I'm here for building amazing games!"
        bgText.size = 32;
        bgText.width = stageW;
        bgText.textAlign = egret.HorizontalAlign.CENTER;
        bgText.x = stageW / 2 - bgText.width / 2;
        bgText.y = stageH / 2 - bgText.height / 2 - 10;
        bgText.alpha = 0;

        var containerTextfield = new egret.DisplayObjectContainer();
        this.addChild(containerTextfield);

        var textfield = new egret.TextField();
        containerTextfield.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 32;
        textfield.textColor = 0xffffff;
        textfield.x = stageW / 2 - textfield.width / 2;
        textfield.y = stageH / 2 - textfield.height / 2 - 10;
        //this.textfield = textfield;

        textfield.touchEnabled = true;
        textfield.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            textfield.alpha = 0;
            egret.Tween.get(bgEffect).to({ alpha: 1 }, 200, egret.Ease.circIn);
            Main.doTextAnimation = false;
            egret.Tween.get(bgText).wait(200).to({ alpha: 1 }, 200, egret.Ease.circIn);
            egret.Tween.get(containerTextfield).to({ alpha: 0 }, 200);
            var rotateBgEffect: Function = function () {
                var bgTw = egret.Tween.get(bgEffect);
                bgTw.to({ rotation: 360 }, 100000);
                bgTw.call(rotateBgEffect, 100000);
            };
            rotateBgEffect();
            var setBgEffectAlpha: Function = function () {
                var bgTw = egret.Tween.get(bgEffect);
                bgTw.to({ alpha: 0 }, 1000).wait(500).to({ alpha: 1 }, 1000).wait(2000);
                bgTw.call(setBgEffectAlpha, 4500);
            }
        }, this)
    }
}
*/
//# sourceMappingURL=Main.js.map