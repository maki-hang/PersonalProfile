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
        //FirstPage
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x0000000);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        firstPage.addChild(bg);
        var back = this.createBitmapByName("back_jpg");
        firstPage.addChild(back);
        back.x = stageW / 2;
        back.y = stageH / 2;
        back.anchorOffsetX += back.width / 2;
        back.anchorOffsetY += back.height / 2;
        back.alpha = 0;
        var bgText = new egret.TextField();
        firstPage.addChild(bgText);
        bgText.text = "国庆这段时间在外地，刚回来，还没怎么看HelloWorld，这个是用别人的改的，之后会补习的......";
        bgText.textColor = 0xffffff;
        bgText.size = 32;
        bgText.width = stageW - 100;
        bgText.textAlign = egret.HorizontalAlign.CENTER;
        bgText.x = stageW / 2 - bgText.width / 2;
        bgText.y = 100;
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
            egret.Tween.get(back).to({ alpha: 1 }, 200, egret.Ease.circIn);
            Main.doTextAnimation = false;
            egret.Tween.get(bgText).wait(200).to({ alpha: 1 }, 200, egret.Ease.circIn);
            egret.Tween.get(containerTextfield).to({ alpha: 0 }, 200);
            var setbackAlpha = function () {
                var bgTw = egret.Tween.get(back);
                bgTw.to({ alpha: 0 }, 1000).wait(500).to({ alpha: 1 }, 1000).wait(2000);
                bgTw.call(setbackAlpha, 4500);
            };
        }, this);
        //SecondPage
        var Secondbg = this.createBitmapByName("back2_jpg");
        SecondPage.addChild(Secondbg);
        var SecondTag = new egret.Shape();
        SecondTag.graphics.beginFill(0x000000);
        SecondTag.graphics.drawRect(0, stageH * 2 / 5, stageW, stageH / 6);
        SecondTag.graphics.endFill();
        SecondTag.alpha = 0.5;
        SecondPage.addChild(SecondTag);
        //以下是翻页
        //设定2个偏移量
        var offsetY;
        var setY;
        //手指按到屏幕，触发 startMove 方法
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
                textfield.touchEnabled = false;
                egret.Tween.get(SecondPage).to({ y: 0 }, 1000, egret.Ease.backOut);
            }
            else if (offsetY < -stageH / 4) {
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
                tw.wait(3000);
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
//# sourceMappingURL=Main.js.map