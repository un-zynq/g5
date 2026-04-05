

class WebPlatform {
    constructor() {
        this.navigateActive = false;
        let canvas = document.getElementById("layaCanvas");
        canvas && canvas.addEventListener("mouseup", () => {
            if (this.navigateActive) {
                this.navigateActive = false;
                YYGSDK.navigate(this._screenName, this._buttonName, this._gameId);
            }
        });
        canvas && canvas.addEventListener("touchend", () => {
            if (this.navigateActive) {
                this.navigateActive = false;
                YYGSDK.navigate(this._screenName, this._buttonName, this._gameId);
            }
        });
        this._prompt = new Prompt();
        this._prompt.init();
    }
    navigate(screenName, buttonName, gameId) {
        if (this.navigateActive === false) {
            this.navigateActive = true;
            this._screenName = screenName;
            this._buttonName = buttonName;
            this._gameId = gameId;
        }
    }
    showInterstitial(complete) {
        let needresume = false
        if(!Laya.SoundManager.muted){
            needresume = true;
            Laya.SoundManager.muted = true;
        }
        YYGSDK.showInterstitial(()=>{
            if(needresume){
                Laya.SoundManager.muted = false;
            }
            complete && complete();
        });
    }
    getStorageSync(key) {
        let v = Laya.LocalStorage.getItem(key);
        return JSON.parse(v);
    }
    setStorageSync(key, value) {
        return Laya.LocalStorage.setItem(key, JSON.stringify(value));
    }
    showReward(success, failure) {
        let needresume = false
        if(!Laya.SoundManager.muted){
            needresume = true;
            Laya.SoundManager.muted = true;
        }
        YYGSDK.adsManager.request(YYG.TYPE.REWARD, YYG.EventHandler.create(this, () => {
            if(needresume){
                Laya.SoundManager.muted = false;
            }
            success && success();
        }), YYG.EventHandler.create(this, (event) => {
            if(needresume){
                Laya.SoundManager.muted = false;
            }
            if (failure) {
                failure();
            }
            else {
                if (event == YYG.Event.AD_SKIPPED) {
                    this._prompt.prompt("Failed to get the reward, please watch the ads to the end.")
                }
            }
        }));
    }

    prompt(txt){
        this._prompt.prompt(txt)
    }
    
    getForgames() {
        let forgames = YYGSDK.forgames;
        forgames.sort(function (a, b) {
            return Math.random() - 0.5;
        });
        return forgames;
    }
    showLoading(title) { }
    hideLoading() { }
}

class platform {
    static _init_() {
        this._platform = new WebPlatform();
    }
    static getInstance() {
        if (!this._platform) {
            this._init_();
        }
        return this._platform;
    }
}
platform._platform = null;
window["platform"] = platform;


class Prompt{
    init(){
        this.bgSprite = new Laya.Image("common/img_infoBase.png"), 
        this.bgSprite.width   = Laya.stage.width - 40, 
        this.bgSprite.height  =  30, 
        this.bgSprite.anchorX = .5, 
        this.bgSprite.anchorY = .5, 
        this.bgSprite.x = Laya.stage.width /  2, 
        this.bgSprite.y = Laya.stage.height / 3, 
        this.textOffx = 30, 
        this.textOffy = 15, 

        this.tipText = new Laya.Label(), 
        this.bgSprite.addChild(this.tipText), 
        this.tipText.width = this.bgSprite.width - 2 * this.textOffx, 
        this.tipText.fontSize = 28, 
        this.tipText.align      = "center", 
        this.tipText.color      = "#ffffff",
        this.tipText.wordWrap   = true;
        this.tipText.y = this.textOffy, 
        this.bgSprite.zOrder = 2e3, 
        Laya.stage.addChild(this.bgSprite), 
        this.timeLine = new Laya.TimeLine(), 
        this.timeLine.addLabel("scale", 0).to(this.bgSprite, {
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 1
        }, 100, null, 0).addLabel("back", 0).to(this.bgSprite, {
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 100, null, 0).addLabel("show", 0).to(this.bgSprite, {
            alpha: 1
        }, 1e3, null, 0).addLabel("hide", 0).to(this.bgSprite, {
            alpha: 0
        }, 1e3, null, 0), this.timeLine.on(Laya.Event.COMPLETE, this, this.onComplete), 
        this.mouseThrough = !0;
        this.onComplete();
    }

    onComplete(){
        this.bgSprite.alpha = 0;
        this.visible = !1, this.mouseThrough = !0;
    }
    removeRes() {
        this.timeLine.destroy();
    }

    prompt(e) {
        this.tipText.text = e, this.tipText.x = this.textOffx, this.bgSprite.height = 50 + this.textOffx, 
        this.timeLine.play(0, !1), this.visible = !0;
    }
    resize() {
        this.bgSprite && (this.bgSprite.width = Laya.stage.width - 40, this.bgSprite.height = this.tipText.contextHeight + this.textOffx, 
        this.bgSprite.x = Laya.stage.width / 2, this.bgSprite.y = Laya.stage.height / 8, 
        this.tipText && (this.tipText.style.width = this.bgSprite.width - 2 * this.textOffx));
    }
}







(function() {
    "use strict";
    class Even_GameKey_tManager extends Laya.EventDispatcher {
        constructor() {
            super();
            /** 是否初始化管理 */            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            window.eventManager = this;
        }
        /**
     * 获取单例
     * @return {Even_GameKey_tManager}
     */        static getInstance$() {
            if (Even_GameKey_tManager.instance == null) {
                Even_GameKey_tManager.instance = new Even_GameKey_tManager();
            }
            return Even_GameKey_tManager.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            this.init_GameKey_Complete();
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.inited = true;
            this.initedCB && this.initedCB();
        }
        /**添加自定义事件监听，窗口类事件无需再手动清除*/        addE_GameKey_ventListener(eventType, caller, listener, args) {
            this.on(eventType, caller, listener, args);
        }
        /**删除自定义事件,关闭UI时，会自动清除*/        remo_GameKey_veEventListener(eventType, caller, listener) {
            this.off(eventType, caller, listener);
        }
        /**派发自定义事件*/        
        disp_GameKey_atchEvent(eventTag, data) {
            var e = {
                data: data,
                name: eventTag
            };
            this.event(eventTag, e);
            e = null;
        }
    }
    /** 私有单例 */    Even_GameKey_tManager.instance = undefined;
    /**
   * 游戏配置数据
   */    class GameSetting$ {
        constructor() {}
    }
    window.GameSetting = GameSetting$;
    /** 登录地址 */    GameSetting$.LOGIN_URL = "";
    /** 心跳间隔 */    GameSetting$.HEARTBEAT = Infinity;
    /** 屏幕与舞台单位比例 */    GameSetting$.ratio = 1;
    /** 是否有SDK */    GameSetting$.HAS_SDK = false;
    /** 开关合集 */    GameSetting$.SWITCH = {
        /** 是否联网模式 */
        ONLINE: false,
        /** 是否打印协议 */
        SHOW_PROTOCOL_LOG: false,
        /** 视频广告 */
        AD_VIDEO: true
    };
    /** 游戏特殊标识 */    GameSetting$.GAME_SIGN = "spiral";
    /** 登录平台 */    GameSetting$.LoginPlatform = "web";
    /** 是否上传报错消息 */    GameSetting$.REPORT = false;
    /** 加载data.js */    GameSetting$.LOAD_DATA_JS = true;
    /** 点击按钮音效 */    GameSetting$.CLICK_SOUND_ID = 1e3;
    /** 开始场景 */    GameSetting$.startScene = "MainScene";
    /** 弧度转角度换算单位 */    GameSetting$.ANGLE_1_RAD = 180 / Math.PI;
    /** 角度转弧度换算单位 */    GameSetting$.RAD_1_ANGLE = Math.PI / 180;
    /** 战斗配置 */    GameSetting$.FIGHT_CONFIG = {
        /** 金币关卡射击次数 */
        COIN_LEVEL_SHOOT_TIMES: 3
    };
    /**
   * 角色动画枚举
   */    GameSetting$.ROLE_GameKey_ANIM = {
        /** 待机 */
        Idle: "Idle",
        /** 踢球动画 */
        BallHitAnimation: "BallHitAnimation",
        /** 左下移动画 */
        BackwardLeft: "BackwardLeft",
        /** 右下移动画 */
        BackwardRight: "BackwardRight",
        /** 呼吸待机动画 */
        BreathIdle: "BreathIdle",
        /** 鸡舞动画 */
        ChickenDance: "ChickenDance",
        /** 左前移动动画 */
        ForwardLeft: "ForwardLeft",
        /** 右前移动画 */
        ForwardRight: "ForwardRight",
        /** 嘻哈舞动画 */
        HipHopDance: "HipHopDance",
        /** 向后动画 */
        RunBackward: "RunBackward",
        /** 向前动画 */
        RunForward: "RunForward",
        /** 左移动画 */
        RunLeft: "RunLeft",
        /** 右移动画 */
        RunRight: "RunRight",
        /** 桑巴舞动画 */
        SambaDance: "SambaDance",
        /** 踢球动画 */
        YmcaDance: "YmcaDance",
        /** 被击中 */
        BeHit: "BeHit",
        /** 被击中2 */
        BeHit2: "BeHit2"
    };
    /**
   * 战斗模式
   */    GameSetting$.BATTLE_MODE = {
        /** 普通模式 */
        NORMAL: 0
    };
    /**
   * 视频广告类型
   */    GameSetting$.VIDEO_TYPE = {
        /** 离线奖励 */
        OFFLINE_REWARD: "offline_reward",
        /** 签到奖励 */
        SIGN_REWARD: "sign_reward",
        /** 复活 */
        RELIVE: "relive",
        /** 获取宝箱奖励钥匙 */
        BOX_REWARD_KEY: "box_reward_key",
        /** 金币关卡奖励翻倍 */
        COIN_REWARD_PLUS: "coin_reward_plus",
        /** 获取金币 */
        GET_COIN: "get_coin",
        /** 获取商品 */
        GET_GOOD: "get_good",
        /** 跳过关卡 */
        JUMP_CHAPTER: "jump_chapter",
        /** 弹奏奖励 */
        PLUCK_REWARD_PLUS: "pluck_reward_plus"
    };
    /** 一天毫秒数 */    GameSetting$.DAY_MILLISECOND = 864e5;
    /** 广告获得金币数 */    GameSetting$.AD_GET_COIN = 300;
    /** 诱导出新角色概率 */    GameSetting$.INDUCE_ROLE_RATE = .5;
    /** 诱导必出新角色前几次 */    GameSetting$.INDUCE_SPEC_TIMES = 3;
    /** 诱导角色对换金币数 */    GameSetting$.INDUCE_ROLE_COIN = 100;
    /** banner延迟展示时长 ms */    GameSetting$.BANNER_DELAY_TIME = 1500;
    /** 摆件物品类型 */    GameSetting$.LAY_OBJ = {
        /** 原材料 */
        ROW: 1,
        /** 锯子 */
        SAW: 2,
        /** 普通墙 */
        WALL: 3,
        /** 金币 */
        COIN: 4,
        /** 旋转道具 */
        ROTATE_PROPS: 5,
        /** 普通道具 */
        NOR_PROPS: 6,
        /** 战利品盒子 */
        LOOT_BOX$: 7
    };
    /** 模型id */    GameSetting$.MODEL_ID = {
        /** 树块 */
        WOOD: 1,
        /** 原料 */
        RAW: 2,
        /** 铲子 */
        DIGER: 3,
        /** 锯子 */
        SAW: 4,
        /** 围墙 */
        WALL: 5,
        /** 结束点原料 */
        FINISH_RAW: 6,
        /** 战利品盒子 */
        LOOT_BOX: 7,
        /** 结束点滚动范围 */
        FINISH_SCROLL: 8,
        /** 金币 */
        COIN: 9,
        /** 木屑特效 */
        WOOD_DUST: 10,
        /** 获得金币特效 */
        COIN_GET: 11,
        /** 战利品盒子4 */
        LOOT_BOX_4: 12,
        /** 战利品礼花特效 */
        LOOT_BOX_LIHUA: 13,
        /** 圆盘 */
        PLAT: 14,
        /** 托盘2 */
        PLAT2$: 15
    };
    /** 碰撞组 */    GameSetting$.COLLIDER_GROUP$ = {
        /** 普通 */
        NOR$: Laya.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER,
        /** 硬币 */
        COOIN$: Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1,
        /** 墙 */
        WALL$: Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2,
        /** 锯子 */
        SAW$: Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3,
        /** 无 */
        NONE$: Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4
    };
    /** 摆件X间隔 m*/    GameSetting$.LAY_X_SPACING = 3;
    /** 回收物件高度值 */    GameSetting$.RECOVER_Y$ = -20;
    /**
   * 本地数据
   */    class LocalData$ {
        constructor() {}
        /**
     * 获取本地数据
     * @param {本地key} localKey 
     * @param {默认值} defaultValue 
     */        static getL_GameKey_ocalData(localKey, defaultValue) {
            localKey += GameSetting$.GAME_SIGN;
            let ret;
            // if(window.wx){
            //     LocalData$.localDataDic = SdkManager.getInstance().customData;
            // }
                        ret = LocalData$.localDataDic[localKey];
            if (ret != void 0) {
                return ret;
            }
            // if(!window.wx){
                        ret = Laya.LocalStorage.getItem(localKey);
            // }
                        if ((ret === void 0 || ret === null || ret === "null" || ret === "undefined" || ret === "") && defaultValue != null) {
                ret = defaultValue;
            } else if (typeof defaultValue == "boolean") {
                ret = LocalData$._toBoolean(ret, defaultValue);
            } else if (typeof defaultValue == "number") {
                ret = LocalData$._toNumber(ret, defaultValue);
            } else if (typeof defaultValue == "object") {
                ret = LocalData$._toJSON(ret, defaultValue);
            }
            LocalData$.localDataDic[localKey] = ret;
            return ret;
        }
        /**
     * 转为boolean类型
     * @param src 
     * @param def 
     */        static _toBoolean(src, def) {
            if (typeof src == "boolean") {
                return src;
            } else if (src == null || src == "") {
                return def;
            } else if (src == "false") {
                return false;
            } else if (src == "true") {
                return true;
            }
        }
        /**
     * 转为number类型
     * @param src 
     * @param def 
     */        static _toNumber(src, def) {
            let ret = Number(src);
            if (isNaN(ret)) {
                return def;
            } else {
                return ret;
            }
        }
        /**
     * 转为对象
     * @param src 
     * @param def 
     */        static _toJSON(src, def) {
            try {
                let ret = JSON.parse(src);
                if (typeof ret == "object" && ret) {
                    return ret;
                } else {
                    return def;
                }
            } catch (e) {
                return def;
            }
        }
        /**
     * 设置本地数据
     * @param {本地key} localKey 
     * @param {值} value 
     */        static setL_GameKey_ocalData(localKey, value) {
            localKey += GameSetting$.GAME_SIGN;
            // if(window.wx){
            //     LocalData$.localDataDic = SdkManager.getInstance().customData;
            // }
                        LocalData$.localDataDic[localKey] = value;
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            // if(window.wx){
            //     SdkManager.getInstance().sdkSaveData(LocalData$.localDataDic);
            // }else{
                        Laya.LocalStorage.setItem(localKey, value);
            // }
                }
        /**
     * 清除数据缓存
     */        clear() {
            LocalData$.localDataDic = {};
        }
    }
    /** 本地数据字典<key, value> */    LocalData$.localDataDic = {};
    /** 本地注册键 */    LocalData$.KEY = {
        /** 账号 */
        ACCO_GameKey_UNT: "account",
        /** 密码 */
        PASS_GameKey_WORD: "password",
        /** 音效音量 */
        SOUN_GameKey_D: "sound",
        /** 音乐音量 */
        MUSI_GameKey_C: "music",
        /** 声音开关 */
        SOUN_GameKey_D_SWITCH: "sound_switch",
        /** 震动 */
        SHAK_GameKey_E: "shake",
        /** 关卡 */
        LEVEL$: "level",
        /** 金币数量 */
        COIN$: "COIN",
        /** 已诱导次数 */
        INDUCE_TIMES$: "induce_times",
        /** 诱导时刻 */
        INDUCE_TIME$: "induce_time",
        /** 今日诱导次数 */
        INDUCE_CNT$: "induce_cnt",
        /** 最高得分 */
        BEST_SCORE$: "best_score"
    };
    /**
   * 设置数据
   * 作者：陈雅智
   * 日期：2019/11/21
   */    class Sett_GameKey_ingData {
        constructor() {}
        /**
     * 设置震动
     * @param shake 震动
     */        setS_GameKey_hake(shake) {
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.SHAK_GameKey_E, shake);
        }
        /**
     * 获取震动
     */        getS_GameKey_hake() {
            return LocalData$.getL_GameKey_ocalData(LocalData$.KEY.SHAK_GameKey_E, true);
        }
        /**
     * 改变震动开关
     */        chan_GameKey_geShakeSwitch() {
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.SHAK_GameKey_E, !this.getS_GameKey_hake());
        }
        /**
     * 设置音效开关
     * @param {*} isSoundSwitch 音效是否打开
     */        setS_GameKey_oundSwitch(isSoundSwitch) {
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.SOUN_GameKey_D_SWITCH, isSoundSwitch);
        }
        /**
     * 获取音效
     */        getS_GameKey_oundSwitch() {
            return false;
            // LocalData$.getL_GameKey_ocalData(LocalData$.KEY.SOUN_GameKey_D_SWITCH, true);
                }
        /**
     * 清除缓存
     */        clea_GameKey_r() {}
    }
    /**
   * 关卡数据
   * created by cyz 20200227
   */    class CustomData$ {
        constructor() {
            /** 关卡 */
            this._level$ = 0;
            /** 得分 */            this._bestScore$ = -1;
        }
        /**
     * 当前关卡
     */        get level$() {
            if (this._level$ == 0) {
                this._level$ = LocalData$.getL_GameKey_ocalData(LocalData$.KEY.LEVEL$, 1);
            }
            return this._level$;
        }
        /**
     * 最高得分
     */        get bestScore$() {
            if (this._bestScore$ == -1) this._bestScore$ = LocalData$.getL_GameKey_ocalData(LocalData$.KEY.BEST_SCORE$, 0);
            return this._bestScore$;
        }
        /**
     * 关卡通过
     */        levelPass$(score) {
            this._level$ = this.level$ + 1;
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.LEVEL$, this._level$);
            if (score > this.bestScore$) {
                this._bestScore$ = score;
                LocalData$.setL_GameKey_ocalData(LocalData$.KEY.BEST_SCORE$, this._bestScore$);
            }
        }
        /**
     * 清除数据
     */        clear$() {}
    }
    /**
   * 用户数据
   * created by cyz 20200301
   */    class UserData$ {
        constructor() {
            /** 金币数量 */
            this._coin$ = undefined;
        }
        get coin$() {
            if (this._coin$ == void 0) this._coin$ = LocalData$.getL_GameKey_ocalData(LocalData$.KEY.COIN$, 0);
            return this._coin$;
        }
        /**
     * 获得金币
     * @param {*} coin 
     */        onGetCoin$(coin) {
            this._coin$ = this.coin$ + coin;
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.COIN$, this._coin$);
        }
        /**
     * 清除数据
     */        clear$() {}
    }
    /**
   * 数据管理
   * 作者：陈雅智
   * 日期：2019/11/4
   */    class Data_GameKey_Manager {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            window.dataMgr = this;
        }
        /**
     * 获取单例
     * @return {Data_GameKey_Manager}
     */        static getInstance$() {
            if (Data_GameKey_Manager.instance == null) {
                Data_GameKey_Manager.instance = new Data_GameKey_Manager();
            }
            return Data_GameKey_Manager.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            this.init_GameKey_Datas();
            this.init_GameKey_Complete();
        }
        /**
     * 初始化数据引用
     */        init_GameKey_Datas() {
            /** 本地数据 */
            this.localData$ = new LocalData$();
            /** 设置数据 */            this.settingData$ = new Sett_GameKey_ingData();
            /** 关卡数据 */            this.customData$ = new CustomData$();
            /** 用户数据 */            this.userData$ = new UserData$();
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.inited = true;
            this.initedCB && this.initedCB();
        }
        /**
     * 获取诱导次数
     * @returns {number}
     */        getInduceCnt() {
            let induceT = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.INDUCE_TIME, 0));
            let induceCnt = 0;
            if (new Date(induceT).toDateString() === new Date().toDateString()) {
                induceCnt = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.INDUCE_CNT, 0));
            }
            return induceCnt;
        }
        /**
     * 增加诱导次数
     */        addInduceCnt() {
            let induceCnt = Data_GameKey_Manager.getInstance$().getInduceCnt();
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.INDUCE_CNT, induceCnt + 1);
            LocalData$.setL_GameKey_ocalData(LocalData$.KEY.INDUCE_TIME, Date.now());
        }
        /**
     * 清除数据缓存
     */        clea_GameKey_r() {
            this.localData$ && this.localData$.clear();
            this.settingData$ && this.settingData$.clear();
            this.customData$ && this.customData$.clear$();
            this.userData$ && this.userData$.clear$();
        }
    }
    /** 私有单例 */    Data_GameKey_Manager.instance = undefined;
    /**
   * 音频管理
   */    class Audi_GameKey_oManager {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            /** 音效字典 {url:[sound]} */            this.soun_GameKey_dDic = {};
            this.refr_GameKey_eshMusicVolume();
            this.refr_GameKey_eshSoundVolume();
        }
        /**
     * 获取单例
     * @return {Audi_GameKey_oManager}
     */        static getInstance$() {
            if (Audi_GameKey_oManager.instance == null) {
                Audi_GameKey_oManager.instance = new Audi_GameKey_oManager();
            }
            return Audi_GameKey_oManager.instance;
        }
        /**
     * 初始化
     * @param {初始化回调} callback 
     */        init(callback) {
            this.initedCB = callback;
            if (this.inited) {
                this.initedCB && this.initedCB();
                return;
            }
            var resArray = [];
            for (var key in D.musicBasic) {
                var config = D.musicBasic[key];
                if (config.type == 2) {
                    resArray.push(config.file);
                }
            }
            if (!Laya.Browser.onMiniGame) {
                // if(resArray.length == 0)
                this.init_GameKey_Complete();
                // else
                //     Laya.loader.load(resArray, Laya.Handler.create(this, this.init_GameKey_Complete));
                        } else {
                if (resArray.length == 0) this.init_GameKey_Complete(); else {
                    let config, soundChanel;
                    for (let key in D.musicBasic) {
                        config = D.musicBasic[key];
                        if (config.type == 2) {
                            soundChanel = this.play_GameKey_Sound(Number(key), false, true);
                            soundChanel && (soundChanel.volume = 0);
                        }
                    }
                    this.init_GameKey_Complete();
                }
            }
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 设置音乐开关
     */        setS_GameKey_oundSwitch(isSound) {
            Data_GameKey_Manager.getInstance$().settingData$.setS_GameKey_oundSwitch(isSound);
        }
        /**
     * 获取音效开关
     */        getS_GameKey_oundSwitch() {
            return Data_GameKey_Manager.getInstance$().settingData$.getS_GameKey_oundSwitch();
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.inited = true;
            this.initedCB && this.initedCB();
        }
        /**
     * 播放音乐外部
     */        play_GameKey_Music(musicId) {
            var visible = Laya.stage.isVisibility;
            if (!visible) {
                Laya.timer.once(1e3, this, this.play_GameKey_Music);
                return;
            }
            this._play_GameKey_Music(musicId);
        }
        /**
     * 播放音乐外部使用
     */        _play_GameKey_Music(musicId, force) {
            if (!this.getS_GameKey_oundSwitch()) return;
            this.playMusicId = musicId;
            var config = D.musicBasic[musicId];
            var file = config.file;
            var position = this._bgm ? this._bgm.position : 0;
            if (Laya.SoundManager._tMusic == file && !force) return;
            if (Laya.Browser.onMiniGame) {
                if (!this._bgm) this._bgm = wx.createInnerAudioContext();
                this._bgm.src = file;
                this._bgm.loop = true;
                this._bgm.play();
            } else {
                if (!this._bgm) this._bgm = Laya.SoundManager.playMusic(file, 0, undefined, this._bgm && this._bgm.url === file ? this._bgm.position : 0);
            }
            this.refr_GameKey_eshMusicVolume();
        }
        /**
     * 后台切回调用
     */        back_GameKey_PlayMusic() {
            //后台切回特用
            this._play_GameKey_Music(this.playMusicId, true);
        }
        /**
     * 获取当前音乐配置
     */        _get_GameKey_CurMusicConfig() {
            if (!this._bgm) return null;
            return D.musicBasic[this.playMusicId];
        }
        /**
     * 停止音乐
     */        stop_GameKey_Music() {
            if (!Laya.Browser.onMiniGame) {
                Laya.SoundManager.stopMusic();
                this._bgm = null;
            } else {
                this._bgm.stop();
            }
        }
        /**
     * 继续音乐
     */        resu_GameKey_meMusic() {
            if (this._bgm) this.play_GameKey_Music(this.playMusicId);
        }
        /**
     * 刷新音乐音量
     */        refr_GameKey_eshMusicVolume() {
            this.setM_GameKey_usicVolume(Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.MUSIC, 1)));
        }
        /**
     * 刷新音效音量
     */        refr_GameKey_eshSoundVolume() {
            this.soundVolume = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.SOUND, 1));
            Laya.SoundManager.soundVolume = this.soundVolume;
        }
        /**
     * 播放音效
     */        play_GameKey_Sound(soundId, loop, isForce) {
            if (!this.getS_GameKey_oundSwitch() && !isForce) return;
            // if(!LocalData$.getLocalData$(LocalData$.KEY.SOUND, true)) return;
                        var visible = Laya.stage.isVisibility;
            if (!visible) return;
            var config = D.musicBasic[soundId];
            let sound;
            // if(Laya.Browser.onMiniGame){
            //     sound = wx.createInnerAudioContext();
            //     sound.src = config.file;
            //     sound.onStop(function (){sound.destroy();});
            //     sound.volume = this.soundVolume * config.musicPower;
            //     sound.loop = loop;
            //     sound.play();
            //     return sound
            // }else{
                        sound = Laya.SoundManager.playSound(config.file, loop ? 0 : 1);
            var value = this.soundVolume;
            Laya.SoundManager.setSoundVolume(config.musicPower * value, config.file);
            // }
            // let sounds = this.soundDic[config.file];
            // if(!sounds){
            //     this.soundDic[config.file] = sounds = [];
            // }
            // sounds.push(sound);
                        return sound;
        }
        /**
     * 移除单个音效频道
     */        remo_GameKey_veChannel(channel) {
            if (channel) {
                Laya.SoundManager.removeChannel(channel);
                channel = null;
            }
        }
        /**
     * 停止对应id的所有音效
     */        stop_GameKey_Sound(soundId) {
            var visible = Laya.stage.isVisibility;
            if (!visible) return;
            var config = D.musicBasic[soundId];
            Laya.SoundManager.stopSound(config.file);
        }
        /**
     * 设置音乐音量
     */        setM_GameKey_usicVolume(value) {
            this.musicVolume = value;
            var config = this._get_GameKey_CurMusicConfig();
            config && this._mus_GameKey_icVolume(config.musicPower * this.musicVolume);
            Laya.SoundManager.musicVolume = (config ? config.musicPower : 1) * this.musicVolume;
        }
        /**
     * 设置音乐音量内部
     */        _mus_GameKey_icVolume(value) {
            if (!Laya.Browser.onMiniGame) {
                Laya.SoundManager._musicChannel && (Laya.SoundManager._musicChannel.volume = value);
            } else {
                this._bgm && (this._bgm.volume = value);
            }
        }
        /**
     * 音乐加载完毕
     */        musi_GameKey_cCheck() {
            if (Laya.SoundManager._musicChannel.isStopped) {
                Laya.SoundManager._musicChannel.play();
            }
        }
    }
    /** 私有单例 */    Audi_GameKey_oManager.instance = undefined;
    /** 事件枚举 */    class SSEV_GameKey_ENT {}
    //==================其它==================
    /** 屏幕大小发生改变 */    SSEV_GameKey_ENT.SCREEN_SIZE_CHANGE = 1;
    /** 音乐音量改变 */    SSEV_GameKey_ENT.MUSIC_VOLUME = 2;
    /** 音效音量改变 */    SSEV_GameKey_ENT.SOUND_VOLUME = 3;
    /** 断线离开游戏 */    SSEV_GameKey_ENT.ON_EXIT_GAME = 4;
    /** 当切回游戏 */    SSEV_GameKey_ENT.ON_SHOW_GAME = 5;
    /** 开始碰撞 */    SSEV_GameKey_ENT.COLLIDER_ENTER = "colliderEnter";
    /** 保持碰撞 */    SSEV_GameKey_ENT.COLLIDER_STAY = "colliderStay";
    /** 退出碰撞 */    SSEV_GameKey_ENT.COLLIDER_EXIT = "colliderExit";
    /** 触发开始 */    SSEV_GameKey_ENT.TRIGGER_ENTER = "triggerEnter";
    /** 触发持续 */    SSEV_GameKey_ENT.TRIGGER_STAY = "triggerStay";
    /** 触发退出 */    SSEV_GameKey_ENT.TRIGGER_EXIT = "triggerExit";
    //==================管理==================      
    /** data文件加载完毕 */    SSEV_GameKey_ENT.ON_DATA_LOAD = 1002;
    /** 进入战斗 */    SSEV_GameKey_ENT.ON_START_GAME = 1003;
    /** 重置战斗 */    SSEV_GameKey_ENT.REST_FIGHT = 1004;
    /** 被挖掘 e:{rowCtr} */    SSEV_GameKey_ENT.BE_DIG = 1005;
    /** 挖掘开始 */    SSEV_GameKey_ENT.DIG_START = 1006;
    /** 挖掘中 e:{data:挖掘距离}*/    SSEV_GameKey_ENT.DIGING = 1007;
    /** 挖掘结束 */    SSEV_GameKey_ENT.DIG_END = 1008;
    /** 输入区域手指按下 */    SSEV_GameKey_ENT.INPUT_MOUSE_DOWN = 1010;
    /** 输入区域手指移动 */    SSEV_GameKey_ENT.INPUT_MOUSE_MOVE = 1011;
    /** 输入区域手指抬起 */    SSEV_GameKey_ENT.INPUT_MOUSE_UP = 1012;
    /** 战斗失败 */    SSEV_GameKey_ENT.FIGHT_FAIL = 1013;
    /** 战斗胜利 */    SSEV_GameKey_ENT.FIGHT_WIN = 1014;
    /** 获取战利品 */    SSEV_GameKey_ENT.GETED_LOOTBOX = 1015;
    /** 获取金币 e:{data:coinNum} */    SSEV_GameKey_ENT.GETED_COIN = 1016;
    /** 得分变化 e:{data:{score,roll_progress}} */    SSEV_GameKey_ENT.SCORE_CHANGE$ = 1017;
    /** 添加得分 {score,pos} */    SSEV_GameKey_ENT.ADD_SCORE$ = 1018;
    /** 卷轴掉落消失 */    SSEV_GameKey_ENT.ROLL_DROP$ = 1019;
    /** 玩家复活 */    SSEV_GameKey_ENT.RELIVE$ = 1020;
    /** 网络链接失败 */    SSEV_GameKey_ENT.ON_NET_FAILD = 2e3;
    /** 注册/登录帐号 */    SSEV_GameKey_ENT.ON_REGISTER_FINISH = 2001;
    /** 登录游戏, 收到事件后调用显示主界面 */    SSEV_GameKey_ENT.ON_LOGINGAME_FINISH = 2002;
    /** 获取服务器列表 */    SSEV_GameKey_ENT.ON_SERVER_LIST_FINISH = 2003;
    /** 微信userInfo变化 */    SSEV_GameKey_ENT.ON_UPDATE_WX_USERINFO = 2004;
    //==================== 协议 =========================
        class Prot_GameKey_ocolManager {
        constructor() {
            this.rece_GameKey_ivedMsg = [];
            // 等待队列。需要进入游戏后才能执行。
                        this.wait_GameKey_tingMsg = [];
            //请求协议类
                        let ReqProtocolHandler = Laya.CyzClassMap["ReqProtocolHandler"];
            //接收协议类
                        let RspProtocolHandler = Laya.CyzClassMap["RspProtocolHandler"];
            /** 请求接口 */            this.reqH_GameKey_andler = new ReqProtocolHandler(this);
            /** 接收接口 */            this.hand_GameKey_ler = new RspProtocolHandler();
            // 登录地址
                        this.logi_GameKey_nUrl = GameSetting$.LOGIN_URL + "/protocol";
            // 最后发送请求时间
                        this.last_GameKey_ReqTime = 0;
            // 最后接收请求时间
                        this.last_GameKey_RecTime = 0;
            // 是否还在运行
                        this.runn_GameKey_ing = true;
            // 正在运行的HTTP请求
                        this._htt_GameKey_ps = [];
            // 连续出错的HTTP请求数量
                        this.erro_GameKey_rCount = 0;
            /** 是否初始化管理 */            this.init_GameKey_ed = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            /** 网络是否暂停 */            this.NET__GameKey_PAUSE = false;
            /** 是否已进入游戏 */            this.hasE_GameKey_nterGame = false;
            /** 对话id */            this.sess_GameKey_ionId = undefined;
            /** 登录参数 */            this.logi_GameKey_nSpID = undefined;
            /** SDK用户id */            this.SDK__GameKey_SP_UID = undefined;
            /** 选择的服id */            this.curS_GameKey_electServerId = undefined;
            /** 服务器与客户端时间差 */            this.serv_GameKey_erTimeDiff = 0;
            /** 帧循环 */            Laya.timer && Laya.timer.frameLoop(1, this, this.fram_GameKey_eLoop);
        }
        /**
     * 获取单例
     * @return {Prot_GameKey_ocolManager}
     */        static getInstance$() {
            if (Prot_GameKey_ocolManager.instance == null) {
                Prot_GameKey_ocolManager.instance = new Prot_GameKey_ocolManager();
            }
            return Prot_GameKey_ocolManager.instance;
        }
        /**
     * 报错反馈
     * @param {报错消息} msg 
     */        
    static repo_GameKey_rtError(msg) {
            console.log(msg);
            debugger;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.init_GameKey_ed;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            this.init_GameKey_Complete();
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.init_GameKey_ed = true;
            this.initedCB && this.initedCB();
        }
        /**
     * 循环
     */        fram_GameKey_eLoop() {
            this.currentTime = Laya.Browser.now() * .001;
            // 有限处理排队等待进入游戏后才能处理的消息
                        if (this.hasE_GameKey_nterGame) {
                var m = this.wait_GameKey_tingMsg.shift();
                while (m) {
                    this._pro_GameKey_cess(m);
                    m = this.wait_GameKey_tingMsg.shift();
                }
            }
            var msg = this.rece_GameKey_ivedMsg.shift();
            while (msg) {
                if (msg.rspList) {
                    while (msg.rspList.length > 0) {
                        m = msg.rspList.shift();
                        if (m) {
                            this._pro_GameKey_cess(m);
                        }
                    }
                }
                msg = this.rece_GameKey_ivedMsg.shift();
            }
            if (this.currentTime - this.last_GameKey_RecTime >= GameSetting$.HEARTBEAT) {
                this.last_GameKey_RecTime = this.currentTime;
                this.reqH_GameKey_andler.heartbeat();
            }
        }
        /**
     * 重置
     * 1. 清空未发送消息
     * 2. 清空队列
     * 3. 重置状态
     */        rese_GameKey_t() {
            this.rece_GameKey_ivedMsg.removeAll();
            this.last_GameKey_ReqTime = 0;
            this.erro_GameKey_rCount = 0;
            this.show_GameKey_Connecting(false);
            this._curSend = null;
            Laya.timer.clear(this, this.dela_GameKey_ySendCur);
            var loginUI = uiManager.getUI("ss.LoginUI");
            loginUI && loginUI.hideLinking && loginUI.hideLinking();
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.ON_REGISTER_FINISH, this, this.regi_GameKey_sterFinish);
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.ON_LOGINGAME_FINISH, this, this.logi_GameKey_nGameFinish);
        }
        /**
     * 展示重连提示
     * @param {提示id} warnId 
     * @param {提示信息} warnInfo 
     */        show_GameKey_ReconnectWarning(warnId, warnInfo) {
            this.rese_GameKey_t();
            this.runn_GameKey_ing = false;
            // 警告弹窗
                        if (warnId === 10 || warnId === 30) {
                utils.warnWindowById(warnId, this, warnInfo, this._toL_GameKey_oginUI);
            } else {
                utils.warnWindowById(107, this, null, this._toL_GameKey_oginUI);
            }
        }
        /**
     * 展示重连界面
     */        show_GameKey_ReSend() {
            this.NET__GameKey_PAUSE = true;
            if (!this.reWindow || this.reWindow._isClosed) this.reWindow = utils.warnWindowById(108, this, undefined, this._dela_GameKey_yReLogin);
        }
        /**
     * 延迟重新连接
     */        _dela_GameKey_yReLogin() {
            Laya.timer.once(1e3, this, this.reLo_GameKey_gin);
        }
        /**
     * 关闭重连界面
     */        clos_GameKey_eReSend() {
            this.NET__GameKey_PAUSE = false;
            this.reWindow && this.reWindow.destroy();
            this.reWindow = null;
        }
        /**
     * 跳转到登录界面
     */        _toL_GameKey_oginUI() {
            if (typeof LOAD_FAIL != "undefined") {
                window.location.reload();
                return;
            }
            this.runn_GameKey_ing = true;
            Prot_GameKey_ocolManager.getInstance$().clea_GameKey_r();
            this.hasE_GameKey_nterGame = false;
            // 清除缓存数据
                        dataManager && dataManager.clear();
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_EXIT_GAME);
            uiManager.closeAll();
            if (!Laya.Browser.onMiniGame) new LoginUI(); else new WxLoginLoadingUI();
            if (GameSetting$.HAS_SDK) {
                GameSDK.login();
            }
        }
        /**
     * 处理收到的协议
     * @param {数据信息} msg 
     */        _pro_GameKey_cess(msg) {
            this.last_GameKey_RecTime = this.currentTime;
            if (!this.hasE_GameKey_nterGame) {
                if ("RspCommonInfo" == msg.className || "RspBagItems" == msg.className) {
                    this.wait_GameKey_tingMsg.push(msg);
                    return;
                }
            }
            var handleMethod = this.hand_GameKey_ler["handle" + msg.className];
            if (!handleMethod) {
                console.error("ProtocolHandler缺少处理方法：handle" + msg.className);
                return;
            }
            try {
                var result = handleMethod.apply(this.hand_GameKey_ler, [ msg ]);
                if (result != -1) this._curSend = null;
            } catch (e) {
                Prot_GameKey_ocolManager.getInstance$().repo_GameKey_rtError(e.stack);
            }
        }
        /**
     * 通过HTTP方式发送数据
     * 如果正在等待返回消息, 则不发送
     * @param url
     * @param reqObj
     * @param isWait
     * @param isKeyReq 是否关键请求。如果是关键请求，失败直接回到登录界面；否则无视。
     * @private
     */        
    _sen_GameKey_dHttpData(url, reqObj, isWait, isKeyReq) {
        }
        /**
     * 请求完成
     * @param {Http协议} httpHr 
     */        onHt_GameKey_tpRequestComplete(httpHr) {
            this.last_GameKey_ReqTime = 0;
            this.erro_GameKey_rCount = 0;
            this.show_GameKey_Connecting(false);
            this.clos_GameKey_eReSend();
            var data = this.decr_GameKey_ypt(httpHr.data);
            this.rece_GameKey_ivedMsg.push(data);
            this._htt_GameKey_ps.remove(httpHr);
            httpHr.offAll();
            Laya.Pool.recover("HttpRequest", httpHr);
        }
        /**
     * 请求出错
     * @param {http协议} httpHr 
     * @param {错误信息} msg 
     */        onHt_GameKey_tpRequestError(httpHr, msg) {
            console.warn("协议请求异常：" + httpHr.$className);
            if (httpHr.$isKeyReq) {
                if (msg.indexOf("Request failed Status:0") == 0) {}
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_NET_FAILD);
            } else {
                this.erro_GameKey_rCount++;
                if (this.erro_GameKey_rCount >= 3 || !this.isWaiting) {
                    this.erro_GameKey_rCount = 0;
                    this.show_GameKey_ReSend();
                    // utils.prompt("网络不稳定!!!!!!!!!!!!");
                                } else {
                    utils.prompt("网络不稳定");
                    Laya.timer.once(2e3, this, this.dela_GameKey_ySendCur);
                }
            }
            this._htt_GameKey_ps.remove(httpHr);
            httpHr.offAll();
            Laya.Pool.recover("HttpRequest", httpHr);
        }
        /**
     * HTTP请求完成
     * @param {http} httpHr 
     */        onHt_GameKey_tpDone(httpHr) {
            this._htt_GameKey_ps.remove(httpHr);
            httpHr.offAll();
            Laya.Pool.recover("HttpRequest", httpHr);
        }
        /**
     * 清除进行中的请求
     */        clea_GameKey_r() {
            for (var i = this._htt_GameKey_ps.length - 1; i >= 0; i--) {
                var httpHr = this._htt_GameKey_ps.removeAt(i);
                httpHr.offAll();
                Laya.Pool.recover("HttpRequest", httpHr);
            }
            this.erro_GameKey_rCount = 0;
            //异常次数归零
                        this._preSend = null;
            Laya.timer.clear(this, this.dela_GameKey_ySendCur);
        }
        /**
     * 错误日志提交后台
     * @param msg 异常内容
     */        
        repo_GameKey_rtError(msg) {
        }
        /**
     * 获取请求接口
     */        getR_GameKey_eqHandle() {
            return this.reqH_GameKey_andler;
        }
        /**
     * 请求登录服数据
     * @param {数据体} data 
     * @param {是否等待} isWait 
     */        reqL_GameKey_oginData(data, isWait) {
            this._sen_GameKey_dHttpData(this.logi_GameKey_nUrl, data, isWait);
        }
        /**
     * 请求游戏服数据
     * @param {数据体} data 
     * @param {是否等待} isWait 
     * @param {是否关键请求，失败要重新登录} isKeyReq 
     */        reqS_GameKey_erverData(data, isWait, isKeyReq) {
            var serverUrl = this.logi_GameKey_nUrl;
            if (!serverUrl) {
                return;
            }
            this._sen_GameKey_dHttpData(serverUrl, data, isWait, isKeyReq);
        }
        /**
     * 展示断线重连
     * @param {是否展示} visible 
     */        show_GameKey_Connecting(visible) {
            this.isWaiting = visible;
            utils.showConnecting(visible);
        }
        /**
     * 展示重新登录
     */        reLo_GameKey_gin() {
            if (!this.runn_GameKey_ing) return;
            let account = LocalData$.getL_GameKey_ocalData(LocalData$.KEY.ACCO_GameKey_UNT);
            if (!account) return;
            let password = LocalData$.getL_GameKey_ocalData(LocalData$.KEY.PASS_GameKey_WORD);
            if (!password) return;
            this.isWaiting = false;
            this._preSend = this._curSend;
            Prot_GameKey_ocolManager.getInstance$().getR_GameKey_eqHandle().reqLoginAccount(accountt, password, GameSetting$.LoginPlatform, this.LoginSpID);
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.ON_REGISTER_FINISH, this, this.regi_GameKey_sterFinish);
        }
        /**
     * 注册完成
     */        regi_GameKey_sterFinish() {
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.ON_REGISTER_FINISH, this, this.regi_GameKey_sterFinish);
            if (!this.runn_GameKey_ing) return;
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.ON_LOGINGAME_FINISH, this, this.logi_GameKey_nGameFinish);
            Prot_GameKey_ocolManager.getInstance$().getR_GameKey_eqHandle().reqLoginGame();
        }
        /**
     * 登录游戏完成
     */        logi_GameKey_nGameFinish() {
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.ON_LOGINGAME_FINISH, this, this.logi_GameKey_nGameFinish);
            if (!this.runn_GameKey_ing) return;
            this.hasE_GameKey_nterGame = true;
            if (this._preSend) this._sen_GameKey_dHttpData.apply(this, this._preSend); else this.clos_GameKey_eReSend();
        }
        dela_GameKey_ySendCur() {
            if (this.isWaiting) {
                this.isWaiting = false;
                this._curSend && this._sen_GameKey_dHttpData.apply(this, this._curSend);
            }
        }
        encr_GameKey_ypt(data) {
            return data;
        }
        decr_GameKey_ypt(data) {
            return JSON.parse(data);
        }
    }
    /** 私有单例 */    Prot_GameKey_ocolManager.instance = undefined;
    var hexcase = 0;
    /* hex output format. 0 - lowercase; 1 - uppercase        */    var b64pad = "";
    /* base-64 pad character. "=" for strict RFC compliance   */    var chrsz = 8;
    /* bits per input character. 8 - ASCII; 16 - Unicode      */    class MD5 {
        static hex_md5(s) {
            return MD5.binl2hex(MD5.core_md5(MD5.str2binl(s), s.length * chrsz));
        }
        static b64_md5(s) {
            return MD5.binl2b64(MD5.core_md5(MD5.str2binl(s), s.length * chrsz));
        }
        static str_md5(s) {
            return MD5.binl2str(MD5.core_md5(MD5.str2binl(s), s.length * chrsz));
        }
        static hex_hmac_md5(key, data) {
            return MD5.binl2hex(MD5.core_hmac_md5(key, data));
        }
        static b64_hmac_md5(key, data) {
            return MD5.binl2b64(MD5.core_hmac_md5(key, data));
        }
        static str_hmac_md5(key, data) {
            return MD5.binl2str(MD5.core_hmac_md5(key, data));
        }
        /*
     * Perform a simple self-test to see if the VM is working
     */        static md5_vm_test() {
            return MD5.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
        }
        /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */        static core_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 128 << len % 32;
            x[(len + 64 >>> 9 << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = MD5.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = MD5.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = MD5.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = MD5.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = MD5.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = MD5.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = MD5.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = MD5.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = MD5.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = MD5.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = MD5.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = MD5.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = MD5.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = MD5.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = MD5.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = MD5.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = MD5.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = MD5.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = MD5.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = MD5.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = MD5.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = MD5.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = MD5.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = MD5.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = MD5.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = MD5.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = MD5.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = MD5.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = MD5.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = MD5.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = MD5.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = MD5.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = MD5.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = MD5.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = MD5.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = MD5.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = MD5.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = MD5.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = MD5.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = MD5.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = MD5.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = MD5.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = MD5.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = MD5.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = MD5.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = MD5.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = MD5.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = MD5.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = MD5.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = MD5.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = MD5.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = MD5.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = MD5.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = MD5.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = MD5.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = MD5.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = MD5.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = MD5.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = MD5.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = MD5.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = MD5.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = MD5.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = MD5.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = MD5.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = MD5.safe_add(a, olda);
                b = MD5.safe_add(b, oldb);
                c = MD5.safe_add(c, oldc);
                d = MD5.safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }
        /*
     * These  implement the four basic operations the algorithm uses.
     */        static md5_cmn(q, a, b, x, s, t) {
            return MD5.safe_add(MD5.bit_rol(MD5.safe_add(MD5.safe_add(a, q), MD5.safe_add(x, t)), s), b);
        }
        static md5_ff(a, b, c, d, x, s, t) {
            return MD5.md5_cmn(b & c | ~b & d, a, b, x, s, t);
        }
        static md5_gg(a, b, c, d, x, s, t) {
            return MD5.md5_cmn(b & d | c & ~d, a, b, x, s, t);
        }
        static md5_hh(a, b, c, d, x, s, t) {
            return MD5.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        static md5_ii(a, b, c, d, x, s, t) {
            return MD5.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        /*
     * Calculate the HMAC-MD5, of a key and some data
     */        static core_hmac_md5(key, data) {
            var bkey = MD5.str2binl(key);
            if (bkey.length > 16) bkey = MD5.core_md5(bkey, key.length * chrsz);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 909522486;
                opad[i] = bkey[i] ^ 1549556828;
            }
            var hash = MD5.core_md5(ipad.concat(MD5.str2binl(data)), 512 + data.length * chrsz);
            return MD5.core_md5(opad.concat(hash), 512 + 128);
        }
        /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */        static safe_add(x, y) {
            var lsw = (x & 65535) + (y & 65535);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 65535;
        }
        /*
     * Bitwise rotate a 32-bit number to the left.
     */        static bit_rol(num, cnt) {
            return num << cnt | num >>> 32 - cnt;
        }
        /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */        static str2binl(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
            return bin;
        }
        /*
     * Convert an array of little-endian words to a string
     */        static binl2str(bin) {
            var str = "";
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += chrsz) str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
            return str;
        }
        /*
     * Convert an array of little-endian words to a hex string.
     */        static binl2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
            }
            return str;
        }
        /*
     * Convert an array of little-endian words to a base-64 string
     */        static binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (binarray[i >> 2] >> 8 * (i % 4) & 255) << 16 | (binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 255) << 8 | binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 255;
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad; else str += tab.charAt(triplet >> 6 * (3 - j) & 63);
                }
            }
            return str;
        }
    }
    /**
   * SDK管理
   * 日期：2019/11/18
   */    class SdkManager$ {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            /** 应用ID */            this.appId = "wxd3d113919ed6a9ca";
            /** BannerId字典 */            this.BANNER_ID_DIC = {
                /** 首页 */
                MAIN: "adunit-295e6e2722bd2770",
                /**挑战 诱导*/
                INDUCE: "adunit-cedd9890d7dfe7d4",
                /**关卡失败*/
                LEVEL_FAIL: "adunit-7cea60c2bfe39f6e",
                /**复活*/
                RELIVE: "adunit-7ce01fdeebd98abe",
                /**宝箱奖励*/
                BOX_REWARD: "adunit-da31bd526c96e46b",
                /**礼物*/
                GIFT: "adunit-2cdc1cb511d2ed8c",
                /**金币关卡胜利*/
                COIN_LEVEL_WIN: "adunit-4ec856da3ddd8270",
                /**普通关卡胜利*/
                NORMAL_LEVEL_WIN: "adunit-0dc01d59a2c6de63",
                /**离线奖励*/
                OFFLINE: "adunit-42726f59c79ac763",
                /**签到*/
                SIGN: "adunit-c0e11cf4165620a0",
                /**游戏中心*/
                GAME_CENTER: "adunit-6eeb6ec6ed6c0225"
            };
            /** bannerid清单 */            this.bannerIds = [ this.BANNER_ID_DIC.MAIN, this.BANNER_ID_DIC.INDUCE, this.BANNER_ID_DIC.LEVEL_FAIL, this.BANNER_ID_DIC.RELIVE, this.BANNER_ID_DIC.BOX_REWARD, this.BANNER_ID_DIC.GIFT, this.BANNER_ID_DIC.COIN_LEVEL_WIN, this.BANNER_ID_DIC.NORMAL_LEVEL_WIN, this.BANNER_ID_DIC.OFFLINE, this.BANNER_ID_DIC.SIGN, this.BANNER_ID_DIC.GAME_CENTER ];
            /** banner字典<bannerId, {banner, state}> */            this.bannerDic = {};
            /** banner展示清单 {index: {bannerId, state, showIndex}} */            this.bannerShowDic = {};
            /** 最后一个展示的banner数据 */            this.lastBannerShowData = undefined;
            /** 展示的banner最大索引 */            this.bannerShowIndex = 0;
            /** 激励式视频广告位 */            this._videoUnitId = "adunit-c5e5951f0ffbf26f";
            /** 插屏广告位 */            this._insertUnitId = "adunit-0fc13b58ea7d87f2";
            /** banner刷新间隔时长 s */            this.bannerSpacingT = 60;
            /** 是否开启诱导 */            this.canTrick = false;
            /** 当前视频广告报错次数 */            this._videoErrorTimes = 0;
            /** 视频广告最大报错次数 */            this._MAX_VIDEO_ERROR_TIMES = 5;
            /** sdk版本 */            this.app_version = 1;
            /** 用户数据 */            this._customData = undefined;
            /** 诱导限制次数 */            this.induceLimit = 2;
            /** 诱导间隔ms */            this.induceSpacings = [ 45e3 ];
            /** 上次诱导时刻 */            this.lastInduceT = 0;
            /** banner切换数 */            this.bannerChangeCnt = 2;
            /** banner切换间隔 ms */            this.bannerChangeSpacing = 5e3;
            /** 好友邀请概率 */            this.inviteRate = .3;
            //好友邀请概率
            /** 是否插屏 */            this.isScreenAd = false;
            //是否插屏广告
            /** 是否好友邀请 */            this.isInviteFriend = false;
            //是否好友邀请
            /** 下拉导出概率 */            this.dropUIRate = .3;
            /** 是否误触 */            this.isCheat$ = false;
            /** 结算广告位移概率 */            this.billViewBannerShiftRate$ = 0;
            /** 结算视频位置切换概率 */            this.billViewButtonSwitchRate$ = 0;
            /** 游戏中心延迟Banner概率 */            this.gameCenterViewDelayRate$ = 0;
            /** 全局引用 */            window.sdkMgr = this;
        }
        /**
     * 获取单例
     * @return {SdkManager$}
     */        static getInstance$() {
            if (SdkManager$.instance == null) {
                SdkManager$.instance = new SdkManager$();
            }
            return SdkManager$.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        init(initedCB) {
            this.initedCB = initedCB;
            // this._getAds();
            // this._getSwitch();
            this._getShares();
            this._getParamData();
            this._getQySwitch$();
            SdkManager$.getInstance$().onIn_GameKey_iteComplete();
        }
        /**
     * 监听事件们
     */        moni_GameKey_torEvents() {
            if (window.wx) {
                wx.onHide(this.onCl_GameKey_oseGame);
            }
        }
        /**
     * 当关闭游戏
     */        onCl_GameKey_oseGame() {
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_EXIT_GAME);
            gameManager.onEx_GameKey_itGame();
        }
        /**
     * 初始化完成
     */        onIn_GameKey_iteComplete() {
            this.inited = true;
            this.initedCB && this.initedCB();
            this.initedCB = undefined;
        }
        /**
     * 初始化邀请风格
     * @param headIcon
     * @param nickName
     * @param tip
     */        initFriendInviteStyle(headIcon, nickName, tip) {
            if (!window.wx || !wx.postMessage) return;
            var inviteStyle = {
                type: "inviteStyle"
            };
            //头像
                        Laya.Point.TEMP.setTo((isNaN(headIcon.anchorX) ? 0 : headIcon.anchorX) * headIcon.width, (isNaN(headIcon.anchorY) ? 0 : headIcon.anchorY) * headIcon.height);
            headIcon.localToGlobal(Laya.Point.TEMP);
            inviteStyle.icon = {
                x: Laya.Point.TEMP.x,
                y: Laya.Point.TEMP.y,
                width: headIcon.width,
                height: headIcon.height
            };
            headIcon.visible = false;
            //名字
                        Laya.Point.TEMP.setTo(nickName.width * (isNaN(nickName.anchorX) ? 0 : nickName.anchorX), nickName.height * (isNaN(nickName.anchorY) ? 0 : nickName.anchorY) - nickName.height * .5);
            nickName.localToGlobal(Laya.Point.TEMP);
            inviteStyle.nickname = {
                x: Laya.Point.TEMP.x,
                y: Laya.Point.TEMP.y,
                height: nickName.height,
                fontSize: nickName.fontSize
            };
            nickName.visible = false;
            //提示
                        Laya.Point.TEMP.setTo(tip.width * (isNaN(tip.anchorX) ? 0 : tip.anchorX) - .2 * tip.width, tip.height * (isNaN(tip.anchorY) ? 0 : tip.anchorY) - tip.height);
            tip.localToGlobal(Laya.Point.TEMP);
            inviteStyle.tip = {
                x: Laya.Point.TEMP.x,
                y: Laya.Point.TEMP.y,
                height: tip.height,
                fontSize: tip.fontSize
            };
            tip.visible = false;
            wx.postMessage(JSON.stringify(inviteStyle));
        }
        /**
     * 展示朋友表现
     */        setShowFriendUI(isShow) {
            if (!window.wx || !wx.postMessage) return;
            if (!this.sharedCanvas) {
                var openDataContext = wx.getOpenDataContext();
                this.sharedCanvas = openDataContext.canvas;
                this.sharedCanvas.width = Laya.stage.width;
                this.sharedCanvas.height = Laya.stage.height;
                this.sharedSprite = new Laya.Sprite();
                this.sharedSprite.zOrder = 1e4;
                Laya.stage.addChild(this.sharedSprite);
                var texture2D = new Laya.Texture2D();
                texture2D.loadImageSource(this.sharedCanvas);
                this.shareTexture = new Laya.Texture(texture2D);
                this.shareTexture.bitmap.alwaysChange = false;
            }
            this.sharedSprite.visible = false;
            if (isShow) {
                wx.postMessage('{"type":"inviteShow"}');
                setTimeout(function() {
                    SdkManager$.getInstance$().sharedSprite.visible = true;
                    SdkManager$.getInstance$().shareTexture.bitmap.loadImageSource(SdkManager$.getInstance$().sharedCanvas);
                    SdkManager$.getInstance$().sharedSprite.graphics.clear();
                    SdkManager$.getInstance$().sharedSprite.graphics.drawTexture(SdkManager$.getInstance$().shareTexture, 0, 0, SdkManager$.getInstance$().shareTexture.width, SdkManager$.getInstance$().shareTexture.height);
                }, 600);
            }
        }
        /**
     * 设置客户数据
     */        set customData(value) {
            this._customData = value;
        }
        /**
     * 获取客户端数据
     */        get customData() {
            return this._customData;
        }
        _getAds() {
            let xhr = new Laya.HttpRequest();
            xhr.once(Laya.Event.COMPLETE, this, this.getAdFrameResult);
            let params = {
                appid: this.appId,
                nonce_str: String(Math.floor(Math.random() * 999999999)),
                time_stamp: Math.floor(Laya.timer.currTimer / 1e3)
            };
            let sign = this._getSign(params, "6689e367d3927fb2aa0248c1ba8e496d");
            let data = "appid=" + params.appid + "&nonce_str=" + params.nonce_str + "&time_stamp=" + params.time_stamp + "&sign=" + sign;
            xhr.send("https://tt.58pxw.com/casual_games_backend/api/v1/ads_info", data, "POST", "json", [ "Content-Type", "application/x-www-form-urlencoded;charset=utf-8" ]);
        }
        _getSwitch() {
            let xhr = new Laya.HttpRequest();
            xhr.once(Laya.Event.COMPLETE, this, this._onSwitchReady);
            let params = {
                appid: this.appId,
                nonce_str: String(Math.floor(Math.random() * 999999999)),
                time_stamp: Math.floor(Laya.timer.currTimer / 1e3),
                app_version: this.app_version
            };
            let sign = this._getSign(params, "6689e367d3927fb2aa0248c1ba8e496d");
            let data = "appid=" + params.appid + "&nonce_str=" + params.nonce_str + "&time_stamp=" + params.time_stamp + "&app_version=" + params.app_version + "&sign=" + sign;
            xhr.send("https://tt.58pxw.com/casual_games_backend/api/v1/switch_info", data, "POST", "json", [ "Content-Type", "application/x-www-form-urlencoded;charset=utf-8" ]);
        }
        _jsonSortEncAd(jsonMsg, newHash = "") {
            let keyCount = 0, newObj = {}, hash = `hash=${newHash}`, str = "", newMd = null;
            for (let k in jsonMsg) {
                keyCount++;
            }
            let newkey = Object.keys(jsonMsg).sort();
            for (let j = 0; j < newkey.length; j++) {
                newObj[newkey[j]] = String(jsonMsg[newkey[j]]);
            }
            for (let i in newObj) {
                str += i + "=" + MD5.hex_md5(newObj[i]) + "&&";
            }
            if (keyCount == 0) {
                str += "&&" + hash;
            } else {
                str += hash;
            }
            let len = str.length, md = MD5.hex_md5(MD5.hex_md5(MD5.hex_md5(str)));
            let num = len % 32;
            if (num == 0) {
                newMd = md;
            } else {
                newMd = md.substring(0, num - 1) + md.substring(num, 32);
            }
            return newMd;
        }
        _getSign(jsonMsg, api_key = "") {
            let keyCount = 0, str = "";
            let keySet = Object.keys(jsonMsg).sort();
            for (let j = 0; j < keySet.length; j++) {
                let key = keySet[j];
                let value = String(jsonMsg[key]);
                str += key + "=" + value + "&&";
            }
            str += "api_key=" + api_key;
            return MD5.hex_md5(str);
        }
        //拉取悬浮式广告的返回结果
        getAdFrameResult(vData) {
        }
        _onSwitchReady(vData) {
        }
        /**
     * 获取趣游开关
     */ _getQySwitch$() {
            // let xhr = new Laya.HttpRequest();
            // xhr.once(Laya.Event.COMPLETE, this, this.onQySwitchReady$);
            // let sceneData = window.wx && wx.getLaunchOptionsSync() || {};
            // xhr.send("https://api.game.hnquyou.com/api/Product/judgeRegion.html", {
            //     appid: this.appId,
            //     scene: sceneData.scene || 0
            // }, "POST", "json", [ "Content-Type", "application/x-www-form-urlencoded;charset=utf-8" ]);
        }
        /**
     * 收到趣游开关数据
     */        onQySwitchReady$(vData) {
            if (vData && vData.Status == 200) {
                /** 趣游误触开关加载 */
                SdkManager$.getInstance$().qyCheatSwitch$ = vData.Result.Status == 0;
            }
        }
        /**
     * 获取参数数据
     */        _getParamData() {
            let xhr = new Laya.HttpRequest();
            xhr.once(Laya.Event.COMPLETE, this, this._reciveParamData);
            xhr.send("https://game.littleboy.net/api/gameparams.jsp?appid=" + this.appId + "&version=" + this.app_version + "&t=" + Date.now(), null, "POST", "json", [ "Content-Type", "application/x-www-form-urlencoded;charset=utf-8" ]);
        }
        /**
     * 接收参数数据
     * @param {*} data 
     */        _reciveParamData(data) {
            let sdk = SdkManager$.getInstance$();
            sdk.induceLimit = data.data.induceCnt;
            sdk.induceSpacings = data.data.induceSpacingTs;
            sdk.inviteRate = data.data.inviteRate;
            //好友邀请概率
                        sdk.isScreenAd = data.data.isScreenAd;
            //是否插屏广告
                        sdk.isInviteFriend = data.data.isInviteFriend;
            //是否好友邀请
                        sdk.dropUIRate = data.data.dropUIRate;
            //下拉导出概率
                        sdk.bannerChangeCnt = data.data.bannerShowCnt;
            //banner切换数量
                        sdk.bannerChangeSpacing = data.data.bannerShowSpacing;
            //banner切换间隔 ms
                        sdk.billViewBannerShiftRate$ = data.data.billViewBannerShiftRate;
            sdk.billViewButtonSwitchRate$ = data.data.billViewButtonSwitchRate;
            sdk.gameCenterViewDelayRate$ = data.data.gameCenterViewDelayRate;
            sdk.isCheat$ = data.data.cheat;
        }
        /**
     * 是否移动结算页banner
     */        isMoveBanner$() {
            return this.qyCheatSwitch$ && this.isCheat$ && this.billViewBannerShiftRate$ >= Math.random();
        }
        /**
     * 是否更换视频按钮位置
     */        isChangeVideoAdBtnStyle$() {
            return this.qyCheatSwitch$ && this.isCheat$ && this.billViewButtonSwitchRate$ >= Math.random();
        }
        /**
     * 是否导出页面延迟展示广告
     */        isExportDelayShowBanner$() {
            return this.qyCheatSwitch$ && this.isCheat$ && this.gameCenterViewDelayRate$ >= Math.random();
        }
        /**
     * 获取下拉界面开关
     */        getDropDownUISwitch() {
            return this.canTrick && Math.random() <= SdkManager$.getInstance$().dropUIRate;
        }
        /**
     * 获取banner切换次数
     */        getBannerChangeCnt() {
            if (!SdkManager$.getInstance$().canTrick) return 0;
            let exRate = SdkManager$.getInstance$().bannerChangeCnt % 1;
            /** 广告切换次数 */            return Math.floor(SdkManager$.getInstance$().bannerChangeCnt) + (Math.random() <= exRate ? 1 : 0);
        }
        /**
     * 返回乱序的广告列表
     */        getUnsortedAds() {
            let all = [], result = [];
            if (!this.ads) return result;
            all.pushAll$(this.ads);
            while (all.length > 0) {
                result.push(all.removeAt(Math.floor(all.length * Math.random())));
            }
            return result;
        }
        /**
     * 随机返回一个广告
     */        getRandomAd() {
            return this.ads ? this.ads[Math.floor(this.ads.length * Math.random())] : null;
        }
        /**
     * 获取随机bannerid
     */        getRandomBannerId() {
            return this.bannerIds[Math.floor(this.bannerIds.length * Math.random())];
        }
        /**
     * 获取分享地址
     * @private
     */        _getShares() {
            this.shares = [ {
                title: "我插！我挖！我铲！ 不对！是推削圆！",
                imageUrl: "share/share1.jpg"
            }, {
                title: "这铲子有毒！据统计90%的人都过不了！",
                imageUrl: "share/share1.jpg"
            } ];
            if (!window.wx) return;
            // 随机设置一个右上角的分享数据
                        let share = this.shares[Math.floor(this.shares.length * Math.random())];
            let self = this;
            wx.onShareAppMessage(function() {
                return {
                    title: share.title,
                    imageUrl: share.imageUrl
                };
            });
        }
        createReqBtn(x, y, w, h) {
        }
        /**
         * 关闭请求权限按钮
         */        
        closeReqBtn() {
        }
        _onUserInfoBtnTap() {
        }
        // 登陆
        wxLogin() {
        }
        /**
     *
     * @param {string} url 请求地址
     * @param {"GET"|"POST"} method
     * @param data
     * @param caller
     * @param callback
     */        
        request(url, method, data, caller, callback) {
        }
        /**
     * SDK保存数据
     */        
    sdkSaveData(data) {
        }
    wxSaveRank(level) {}
    sdkGetData(callback) {}
    checkUserInfo() {}
    _getUserInfo() {}       
    share() {}
    getFriendInvitteSwitch() {}
        /**
     * 获取诱导间隔 s
     */        
    getInduceSpacing() {
            let induceT = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.INDUCE_TIME, 0));
            let induceCnt = 0;
            if (new Date(induceT).toDateString() === new Date().toDateString()) {
                induceCnt = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.INDUCE_CNT, 0));
            }
            let induceSpacings = SdkManager$.getInstance$().induceSpacings;
            if (!induceSpacings) return 9999999;
            return induceSpacings[Math.min(induceSpacings.length - 1, induceCnt)];
        }
        /**
     * 能否诱导
     */        
    getCanTrick() {
            let induceT = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.INDUCE_TIME, 0));
            let induceCnt = 0;
            if (new Date(induceT).toDateString() === new Date().toDateString()) {
                induceCnt = Number(LocalData$.getL_GameKey_ocalData(LocalData$.KEY.INDUCE_CNT, 0));
            }
            return SdkManager$.getInstance$().canTrick && (SdkManager$.getInstance$().induceLimit < 0 || induceCnt < SdkManager$.getInstance$().induceLimit) && Date.now() - induceT > SdkManager$.getInstance$().getInduceSpacing();
        }
        /**
     * 点击跳转
     * @param data
     * @param srcViewName 来源窗口
     * @param openCallback 打开回调
     * @param cancelCallback 关闭回调
     */        
    jumpToOtherGame(data, srcViewName, openCallback, cancelCallback) {}
    createInterstitialAd() {}
    showInterstitialAd() {}
    preloadSingleBanner(bannerId, callback) { }
    createSingleBanner(bannerId, left, top, height, state, callback) {}
    resizeBannerPos(banner, left, top, height) {}
    setBannerState(bannerId, state) {}
    getBannerState(showIndex) {}
    crea_GameKey_teBannerByUI(bannerId, ui, showIndex) {}
    setNoBanner(bannerId, showIndex) {}
    show_GameKey_Banner(bannerId) {}
    hide_GameKey_Banner(bannerId) {}
   eba_GameKey_ckBannerShow(showIndex) {}
    createVideoAd() {}
        showVideoAd(type) {
        }
        _showVideoAd() {
        }
        isGDT() {
        }
        /**
     * app onShow
     * @param levelId 等级id 必传
     * @param levelName 等级名称 必传
     */        onInitLevel(levelId, levelName) {
            if (!window.wx || !wx.aldLevel) return;
            wx.aldLevel.onInitLevel({
                levelId: levelId,
                levelName: levelName
            });
        }
    onSetLevel(levelId, levelName) { }
    funnelEvent(funnelId, funnelName) {}
    exportFunnelEvent() {}
    gameCenterFunnelEvent() {
    }
    };
    /**
   * 工具类
   * 作者：陈雅智
   * 日期：2019/10/12
   */    class Util_GameKey_s {
        constructor() {}
        /**
     * 移除数组元素
     * @param {数组} array 
     * @param {元素} element 
     */        static remo_GameKey_veArrayElement(array, element) {
            if (!array || !(array instanceof Array)) return;
            var i = array.length;
            while (--i > -1) {
                if (array[i] == element) {
                    array.splice(i, 1);
                }
            }
        }
        /**
     * 移除数组元素根据索引
     * @param {数组} array 
     * @param {索引} index 
     */        static remo_GameKey_veArrayElementAt(array, index) {
            if (!array || !(array instanceof Array)) return;
            array.splice(index, 1);
        }
        /**
     * 数组是否包含元素
     * @param {数组} array 
     * @param {元素} element 
     */        static arra_GameKey_yContains(array, element) {
            if (!array || !(array instanceof Array)) return false;
            return array.indexOf(element) != -1;
        }
        /**
     * 逐层查找对应名字的子对象
     * @param parent 父级
     * @param childName 子对象名称(面板Name字段)
     */        static getC_GameKey_hildDeep(parent, childName) {
            var child = parent.getChildByName(childName);
            if (child) return child;
            for (var i = 0; i < parent._children.length; i++) {
                child = Util_GameKey_s.getC_GameKey_hildDeep(parent._children[i], childName);
                if (child) return child;
            }
        }
        /**
     * 逐层查找对应名字的子对象数组
     * @param {*} parent 
     * @param {*} childName 
     */        static getC_GameKey_hildArrayDeep(parent, childName) {
            let childs = [];
            if (parent.name == childName) childs.push(parent);
            let i = parent._children.length;
            let vchilds;
            while (--i > -1) {
                vchilds = Util_GameKey_s.getC_GameKey_hildArrayDeep(parent._children[i], childName);
                if (vchilds) childs.pushAll$(vchilds);
            }
            return childs;
        }
        /**
     * 获取avater（带animator控件的对象）
     * @param {3D对象} sp 
     */        static getA_GameKey_vater(sp) {
            if (!sp || !sp.getComponent) return null;
            let avater = null;
            let animator = sp.getComponent(Laya.Animator);
            if (!animator) {
                let childs = sp._children;
                let i = 0;
                let l = childs.length;
                for (;i < l; i++) {
                    avater = Util_GameKey_s.getA_GameKey_vater(childs[i]);
                    if (avater) {
                        break;
                    }
                }
            } else {
                avater = sp;
            }
            return avater;
        }
        /**
     * 将之限制在取值范围内 [min, max]
     * @param {最小值} min 
     * @param {输入值} value 
     * @param {最大值} max 
     */        static clam_GameKey_p(min, value, max) {
            return Math.max(min, Math.min(value, max));
        }
        /**
     * 将日期转为字符串
     * @param {日期对象} date 
     */        static form_GameKey_atDateStr(date) {
            return date.format("yyyy-MM-dd hh:mm");
        }
        /**
     * 获取0点时间戳
     */        static getZ_GameKey_eroTime() {
            return Date.parse(new Date().toDateString());
        }
        /**
     * 浮点数随机
     * @param {最小值} min 
     * @param {最大值} max 
     */        static floa_GameKey_tRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        /**
     * 概率事件是否触发
     * @param {概率} chance 
     */        static rand_GameKey_omChance(chance) {
            return chance >= Math.random();
        }
        /**
     * 随机整数 [min, max)
     * @param {最小值} min 
     * @param {最大值} max 
     */        static intR_GameKey_ange(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
        /**
     * 获取图片路径
     * @param {图片id} id 
     */        static getS_GameKey_kinPathById(id) {
            var config = D.SpritePath[id];
            if (!config) config = D.SpritePath[100];
            return config.chs;
        }
        /**
     * 从数组中随机一个元素
     * @param {数组} array 
     */        static arra_GameKey_yRandom(array) {
            var idx = Util_GameKey_s.intR_GameKey_ange(0, array.length);
            return array[idx];
        }
        /**
     * 从数组中随机一个元素并从数组中删除
     * @param {数组} array 
     */        static shif_GameKey_tRandom(array) {
            var idx = Util_GameKey_s.intR_GameKey_ange(0, array.length);
            var value = array[idx];
            // Utils.removeArrayElementAt(array, idx);
                        array.removeAt(idx);
            return value;
        }
        // 在权重数组中随机一个index
        static rand_GameKey_omIndexByWeight(array, total) {
            if (!total) {
                total = 0;
                for (var i = 0; i < array.length; i++) total += array[i];
            }
            var ran = Util_GameKey_s.intR_GameKey_ange(0, total + 1);
            var index = 0;
            for (;index < array.length; index++) {
                ran -= array[index];
                if (ran <= 0) return index;
            }
            return 0;
        }
        /**
     * 获取字符串参数
     * @param {string} id 参数名
     */        static getS_GameKey_trParam(id) {
            var config = D.CommonParameter[id];
            return config ? config.Value : "";
        }
        /**
     * 获取数字参数
     * @param {string} id 参数名
     */        static getN_GameKey_umberParam(id) {
            return Number(Util_GameKey_s.getS_GameKey_trParam(id));
        }
        /**
     * 发送参数协议
     */        static send_GameKey_ParamHttp(url, reqObj, compeleteCallback) {
            var type = "text";
            var httpHr = new Laya.HttpRequest();
            httpHr._loadedSize = 0;
            httpHr._totalSize = 5e6;
            httpHr.once(Laya.Event.COMPLETE, Util_GameKey_s, Util_GameKey_s.onHt_GameKey_tpCompelete, [ httpHr, compeleteCallback ]);
            // httpHr.once(Laya.Event.ERROR, this, this.onHttpError, [httpHr]);
            // httpHr.on(Laya.Event.PROGRESS, this, this.onHttpSuccess, [httpHr]);
                        var formatStr = "&{0}={1}";
            for (key in reqObj) {
                url += Util_GameKey_s.stri_GameKey_ngFormat(formatStr, [ key, reqObj[key] ]);
            }
            httpHr.send(url, null, "get", type);
        }
        /**
     * 当http完成
     */        static onHt_GameKey_tpCompelete(httpHr, compeleteCallback) {
            compeleteCallback && compeleteCallback.runWith(httpHr.data);
        }
        /**
     * 设置名字
     * @param {*} vTarget 
     * @param {*} vName 
     * @param {*} vFixPixel 
     */        static setS_GameKey_howName(vTarget, vName, vFixPixel) {
            if (!vTarget) return;
            if (!vFixPixel) {
                vTarget.text = "名字六个字哦";
                vFixPixel = vTarget.textField.textWidth;
            }
            var i;
            var l = vName.length;
            vTarget.text = "";
            for (i = 0; i < l; i++) {
                vTarget.text += vName.charAt(i);
                if (vTarget.textField.textWidth > vFixPixel) {
                    vTarget.text = vName.substring(0, i);
                    // + "...";
                                        return;
                }
            }
            vTarget.text = vName;
        }
        static getS_GameKey_tring(stringId, arg) {
            if (!D.GameText[stringId]) {
                return stringId + arg;
            }
            var text = D.GameText[stringId]["chs"];
            if (!text) return D.GameText["0"].chs;
            if (!arg) return text;
            return Util_GameKey_s.stri_GameKey_ngFormat(text, arg);
        }
        static stri_GameKey_ngFormat(str, arg) {
            if (!str) return arg;
            var text = str;
            if (arg) {
                for (var i = 0; i < arg.length; i++) {
                    text = text.replaceAll("{" + i + "}", arg[i]);
                }
            }
            return text;
        }
        /** 按钮缩放事件
     *  回调到caller类的callName(e)方法
     */        static onBu_GameKey_ttonScaleEvent(target, caller, callName, sound) {
            !target.defaultScale && (target.defaultScale = {
                scaleX: target.scaleX || 1,
                scaleY: target.scaleY || 1
            });
            target.on(Laya.Event.MOUSE_DOWN, Util_GameKey_s, Util_GameKey_s._onSc_GameKey_aleBtnDown);
            target.on(Laya.Event.ROLL_OUT, Util_GameKey_s, Util_GameKey_s._onS_GameKey_caleBtnOut);
            target.on(Laya.Event.MOUSE_UP, Util_GameKey_s, Util_GameKey_s._onS_GameKey_caleBtnUp);
            target.on(Laya.Event.CLICK, Util_GameKey_s, Util_GameKey_s._onS_GameKey_caleBtnClick, [ caller, callName ]);
            // (sound === void 0) && (sound = true);
                        target._sound = sound;
        }
        static _onS_GameKey_caleBtnClick(caller, callName, event) {
            try {
                if (caller && caller[callName]) {
                    caller[callName](event);
                }
                Audi_GameKey_oManager.getInstance$().play_GameKey_Sound(event.target._sound || GameSetting$.CLICK_SOUND_ID);
            } catch (error) {
                Prot_GameKey_ocolManager.repo_GameKey_rtError(error.stack);
            }
            event.stopPropagation();
        }
        static _onSc_GameKey_aleBtnDown(e) {
            e.target.scale(e.target.defaultScale.scaleX * 1.1, e.target.defaultScale.scaleY * 1.1);
            e.stopPropagation();
        }
        static _onS_GameKey_caleBtnOut(e) {
            e.currentTarget.scale(e.target.defaultScale.scaleX * 1, e.target.defaultScale.scaleY * 1);
            e.stopPropagation();
        }
        static _onS_GameKey_caleBtnUp(e) {
            e.target.scale(e.target.defaultScale.scaleX * 1, e.target.defaultScale.scaleY * 1);
            e.stopPropagation();
        }
        /** 设置事件向下传递 */        static onBu_GameKey_ttonEvent(target, caller, callName) {
            if (!target) return;
            target.on(Laya.Event.MOUSE_DOWN, caller, Util_GameKey_s._onB_GameKey_tnDown);
            target.on(Laya.Event.ROLL_OUT, caller, Util_GameKey_s._onB_GameKey_tnOut);
            target.on(Laya.Event.MOUSE_UP, caller, Util_GameKey_s._onB_GameKey_tnUp);
            target.on(Laya.Event.CLICK, caller, Util_GameKey_s._onB_GameKey_tnClick, [ caller, callName ]);
        }
        static _onB_GameKey_tnClick(caller, callName, event) {
            try {
                if (caller && caller[callName]) {
                    caller[callName](event);
                }
            } catch (error) {
                Prot_GameKey_ocolManager.repo_GameKey_rtError(error.stack);
            }
            event.stopPropagation();
        }
        static _onB_GameKey_tnDown(e) {
            e.stopPropagation();
        }
        static _onB_GameKey_tnOut(e) {
            e.stopPropagation();
        }
        static _onB_GameKey_tnUp(e) {
            e.stopPropagation();
        }
        //添加鼠标事件
        static onEv_GameKey_ent(window, target) {
            target.on(Laya.Event.MOUSE_DOWN, window, window.onMouseEventHandler);
            target.on(Laya.Event.ROLL_OUT, window, window.onMouseEventHandler);
            target.on(Laya.Event.MOUSE_UP, window, window.onMouseEventHandler);
            target.on(Laya.Event.CLICK, window, window.onMouseEventHandler);
        }
        static offE_GameKey_vent(window, target) {
            target.off(Laya.Event.MOUSE_DOWN, window, window.onMouseEventHandler);
            target.off(Laya.Event.ROLL_OUT, window, window.onMouseEventHandler);
            target.off(Laya.Event.MOUSE_UP, window, window.onMouseEventHandler);
            target.off(Laya.Event.CLICK, window, window.onMouseEventHandler);
        }
        /**
     * 返回格式00:00样式的时间
     * @param second 秒
     * @returns {string}
     */        static form_GameKey_atTime(second, showHours) {
            var min = Math.floor(second / 60);
            second = second % 60;
            if (!showHours || min < 60) return Util_GameKey_s.time_GameKey_NumberFormat(min) + ":" + Util_GameKey_s.time_GameKey_NumberFormat(second);
            var hours = Math.floor(min / 60);
            min %= 60;
            return hours + ":" + Util_GameKey_s.time_GameKey_NumberFormat(min) + ":" + Util_GameKey_s.time_GameKey_NumberFormat(second);
        }
        /**
     * 时间个位数补零
     * @param {时间值} value 
     */        static time_GameKey_NumberFormat(value) {
            return (value < 10 ? "0" : "") + parseInt(value);
        }
        /**
     * 给三元素赋值
     * @param {3元素} v3 
     * @param {X值} x 
     * @param {Y值} y 
     * @param {Z值} z 
     */        static setV_GameKey_ector3(v3, x, y, z) {
            v3.x = x, v3.y = y, v3.z = z
            /**
     * 重置缩放
     */;
        }
        static rese_GameKey_tScale(sp) {
            if (!sp) return;
            let scale = sp.transform.localScale.clone();
            sp.transform.localScale = new Laya.Vector3(0, 0, 0);
            sp.transform.localScale = scale;
            let childs = sp._children;
            let i = childs ? childs.length : 0;
            while (--i > -1) {
                Util_GameKey_s.rese_GameKey_tScale(childs[i]);
            }
        }
        /**
     * 拷贝变量
     * @param {*} aV3 
     * @param {*} bV3 
     */        static copyVector3(aV3, bV3) {
            bV3.x = aV3.x;
            bV3.y = aV3.y;
            bV3.z = aV3.z;
        }
        /**
     * 获取3维长度
     * @param {*} v3 
     */        static getV3Length$(v3) {
            return Math.sqrt(Math.pow(v3.x, 2) + Math.pow(v3.y, 2) + Math.pow(v3.z, 2));
        }
    }
    /**
   * UI层级枚举
   */    class UILa_GameKey_yer {}
    UILa_GameKey_yer.LAYER_BG = "bg";
    //背景
        UILa_GameKey_yer.LAYER_MAINUI = "main_ui";
    //主界面
        UILa_GameKey_yer.LAYER_NORMAL = "normal";
    //普通层级
        UILa_GameKey_yer.LAYER_TOP = "top";
    //顶层
        UILa_GameKey_yer.LAYER_MESSAGE = "msg";
    //信息提示类层级
    /**
   * ui界面管理类
   * 作者：陈雅智
   * 日期：2019/10/12
   */    class UIMa_GameKey_nager {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            /** ui清单 */            this.uis = {};
            /** 层级清单 */            this.layers = {};
            /** 获取界面基类（避免依赖循环） */            this.baseWindowClass = Laya.CyzClassMap["BaseWindow"];
            window.uiMgr = this;
        }
        /**
     * 获取单例
     * @return {UIMa_GameKey_nager}
     */        static getInstance$() {
            if (UIMa_GameKey_nager.instance == null) {
                UIMa_GameKey_nager.instance = new UIMa_GameKey_nager();
            }
            return UIMa_GameKey_nager.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            // 添加层级, 背景层(场景), 普通层(UI), 顶层, 提示层
                        var zOrder = 0;
            var bgBox = this.crea_GameKey_teBox();
            Laya.stage.addChild(bgBox);
            this.layers[UILa_GameKey_yer.LAYER_BG] = bgBox;
            zOrder += 100;
            bgBox.zOrder = zOrder;
            var mainUIBox = this.crea_GameKey_teBox();
            Laya.stage.addChild(mainUIBox);
            this.layers[UILa_GameKey_yer.LAYER_MAINUI] = mainUIBox;
            zOrder += 100;
            mainUIBox.zOrder = zOrder;
            var normalBox = this.crea_GameKey_teBox();
            Laya.stage.addChild(normalBox);
            this.layers[UILa_GameKey_yer.LAYER_NORMAL] = normalBox;
            zOrder += 100;
            normalBox.zOrder = zOrder;
            var topBox = this.crea_GameKey_teBox();
            Laya.stage.addChild(topBox);
            this.layers[UILa_GameKey_yer.LAYER_TOP] = topBox;
            zOrder += 100;
            topBox.zOrder = zOrder;
            var msgBox = this.crea_GameKey_teBox();
            Laya.stage.addChild(msgBox);
            this.layers[UILa_GameKey_yer.LAYER_MESSAGE] = msgBox;
            zOrder += 100;
            msgBox.zOrder = zOrder;
            this.initRightTopCloseBtn$();
            this.init_GameKey_Complete();
        }
        /**
     * 初始化右上角按钮
     */        initRightTopCloseBtn$() {
            if (typeof wx !== "undefined" && wx.getMenuButtonBoundingClientRect) {
                let rect = wx.getMenuButtonBoundingClientRect();
                if (!rect) return;
                //微信没有适配结束
                                if (rect.left === 0) {
                    Laya.timer.once(100, this, this.initRightTopCloseBtn$);
                    return 0;
                }
                if (!this.btn_right_top_close) {
                    this.btn_right_top_close = Laya.stage.addChild(new Laya.Image());
                    this.btn_right_top_close.skin = "comp/ui/btnExitGame.png";
                    this.btn_right_top_close.zOrder = 600;
                    this.btn_right_top_close.on(Laya.Event.MOUSE_DOWN, this, this.onClickRightTopCloseBtn$);
                }
                this.btn_right_top_close.visible = true;
                let ratioW = Laya.stage.width / Laya.Browser.clientWidth;
                let ratioH = Laya.stage.height / Laya.Browser.clientHeight;
                // 如果系统“退出”按钮上方的空间允许，假“退出”按钮也可以随机出现在上方
                // if (rect.top >= rect.height) {
                //     this.btn_right_top_close.top = Math.random() < 0.5 ? (rect.bottom * ratioH) : ((rect.top - rect.height) * ratioH);
                // }
                // // “退出”按钮紧贴着微信右上角的退出按钮
                // else {
                                this.btn_right_top_close.top = rect.bottom * ratioH + 10;
                // }
                                this.btn_right_top_close.left = rect.left * ratioW;
                this.btn_right_top_close.width = rect.width * ratioW;
                this.btn_right_top_close.height = rect.height * ratioH;
            }
        }
        /**
     * 点击右上角关闭按钮
     */        onClickRightTopCloseBtn$() {
            Laya.physicsTimer.pause();
            window["qy"] && window["qy"].showCopyWx(null, function() {
                Laya.physicsTimer.resume();
            });
        }
        /**
     * 设置右上角关闭按钮展示状态
     */        setRightTopCloseBtnShow$(isShow) {
            if (!this.btn_right_top_close) return;
            this.btn_right_top_close.visible = isShow;
        }
        /**
     * 创建一个平铺的空盒子
     */        crea_GameKey_teBox() {
            var box = new Laya.Box();
            box.left = 0;
            box.right = 0;
            box.top = 0;
            box.bottom = 0;
            box.mouseThrough = true;
            return box;
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.inited = true;
            this.initedCB && this.initedCB();
        }
        /**
     * 获取UI对象
     * @param {ui类} uiClass 
     */        getU_GameKey_I(uiClass) {
            var array = this.uis[uiClass.className];
            return array && array.last$();
        }
        /**
     * 打开预载体ui
     * @param {界面类} uiClass 
     * @param {加载完回调} callback 
     * @param {参数} args
     */        open_GameKey_UI(uiClass, callback, ...args) {
            if (uiClass.uiConfig.only && this.getU_GameKey_I(uiClass)) {
                //界面唯一 且 界面已有
                callback && callback();
                return this.getU_GameKey_I(uiClass);
            }
            var uiSurrenal = this.crea_GameKey_teSurrenal(uiClass);
            Laya.loader.create(uiClass.url, Laya.Handler.create(this, obj => {
                if (uiClass.uiConfig.only && this.getU_GameKey_I(uiClass)) {
                    //界面唯一 且 界面已有
                    return;
                }
                let pre = new Laya.Prefab();
                pre.json = obj;
                let uiNode = pre.create();
                let ui = uiNode.getComponent(uiClass);
                //参数可从init传入
                                ui.init(args, callback, uiSurrenal);
                if (!this.uis[uiClass.className]) this.uis[uiClass.className] = [];
                this.uis[uiClass.className].push(ui);
                let uiLayer = uiClass.uiConfig.layer;
                let parent = this.layers[uiLayer];
                parent && parent.addChild(uiNode);
                // uiSurrenal && uiSurrenal.destroy();
                        }));
        }
        /**
     * 创建组件
     * @param {Laya.Sprite} parent 
     * @param {*} uiClass 
     * @param {*} callback 
     * @param {*} args 
     */        crea_GameKey_teComp(parent, uiClass, callback, ...args) {
            Laya.loader.create(uiClass.url, Laya.Handler.create(this, obj => {
                if (parent.destroyed) return;
                let pre = new Laya.Prefab();
                pre.json = obj;
                let uiNode = pre.create();
                let ui = uiNode.getComponent(uiClass);
                //参数可从init传入
                                ui.init(args, callback);
                parent && parent.addChild(uiNode);
            }));
        }
        /**
     * 创建界面等待遮罩
     */        crea_GameKey_teSurrenal(uiClass) {
            if (!uiClass.uiConfig.needUISurrenal) //不需要遮罩
            return null;
            var uiLayer = uiClass.uiConfig.layer;
            var uiSurrenal = this.crea_GameKey_teBox();
            uiSurrenal.mouseThrough = false;
            var parent = this.layers[uiLayer];
            parent && parent.addChild(uiSurrenal);
            Util_GameKey_s.onBu_GameKey_ttonEvent(uiSurrenal);
            return uiSurrenal;
        }
        /**
     * 获取UI层级
     * @param {ui层级枚举} uiLayer 
     */        getL_GameKey_ayer(uiLayer) {
            return this.layers[uiLayer];
        }
        /**
     * 关闭界面
     * @param {界面实例} ui 
     */        clos_GameKey_eUI(ui) {
            var array = this.uis[ui.constructor.className];
            // array && Utils.removeArrayElement(array, ui);
                        array && array.remove$(ui);
            ui.owner.destroy();
        }
        /**
     * 关闭所有界面
     */        clos_GameKey_eAll() {
            for (var key in this.uis) {
                var array = this.uis[key];
                if (!(array instanceof Array)) continue;
                let i = array.length;
                while (--i > -1) {
                    var item = array[i];
                    if (item instanceof this.baseWindowClass && !item.constructor.uiConfig.notClose) {
                        item.destroy();
                        array.removeAt$(i);
                    }
                }
            }
        }
    }
    /** 私有单例 */    UIMa_GameKey_nager.instance = undefined;
    /**
   * 界面基类
   * 作者：陈雅智
   * 日期：2019/10/12
   */class Base_GameKey_Window extends Laya.Script {
        constructor() {
            super();
            /** 加载完回调 */            this.finishCb = undefined;
            /** 注册的事件清单 */            this._eve_GameKey_nts = [];
            /** 广告banenr操作索引 */            this._bannerActIndex = undefined;
        }
        /**
     * 当唤醒脚本
     */onStart() {
            this.owner.visible = false;
            if (this.constructor.uiConfig.bannerId) {
                // this.bannerId = SdkManager$.getInstance$().getRandomBannerId();
                // SdkManager$.getInstance$().preloadSingleBanner(this.bannerId, this.onUI_GameKey_Load.bind(this));
            } else {
                this.onUI_GameKey_Load();
            }
        }
        /**
     * UI加载完成
     */        onUI_GameKey_Load() {
            if (this._isClosed) return;
            this.owner.visible = true;
            this.uiSurrenal && this.uiSurrenal.destroy();
            this.uiSurrenal = undefined;
            Laya.timer.callLater(this, function() {
                this.finishCb && this.finishCb(this.ui);
            });
        }
        /**
     * 初始化数据
     */        init_GameKey_Data() {}
        /**
     * 按钮监听
     */        moni_GameKey_torBtns() {}
        /**
     * 初始化
     * @param {参数} args 
     * @param {回调} callback 
     * @param {Laya.Sprite} uiSurrenal
     */        init(args, callback, uiSurrenal) {
            this.args = args;
            this.finishCb = callback;
            this.uiSurrenal = uiSurrenal;
            this.init_GameKey_Data();
        }
        /**
     * 注册事件
     * @param {事件枚举} event 
     * @param {方法} callback
     */        addE_GameKey_ventListener(event, callback) {
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(event, this, callback);
            this._eve_GameKey_nts.push({
                e: event,
                cn: callback
            });
        }
        /**
     * 取消事件注册
     * @param {事件枚举} event 
     * @param {方法} callback 
     */        remo_GameKey_veEventListener(event, callback) {
            var i = this._eve_GameKey_nts.length;
            var item;
            while (--i > -1) {
                item = this._eve_GameKey_nts[i];
                if (item.e == event && item.cn == callback) {
                    this._eve_GameKey_nts.removeAt(i);
                    break;
                }
            }
        }
        /**
     * 移除所有事件监听
     */        remo_GameKey_veAllEventListener() {
            var item;
            while (this._eve_GameKey_nts.length) {
                item = this._eve_GameKey_nts.shift();
                Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(item.e, this, item.cn);
            }
            this._eve_GameKey_nts = [];
        }
    crea_GameKey_teBannerByUI(ui, isRefresh) {}
    hide_GameKey_Banner() {}
    reba_GameKey_ckBanner() {}
    refr_GameKey_eshBanner() {}
    onLoadedNewBanner(isLoaded) {}
        /**
     * 关闭界面
     */        doCl_GameKey_ose() {
            if (this._isClosed) return;
            this.uiSurrenal && this.uiSurrenal.destroy();
            this.uiSurrenal = undefined;
            this.reba_GameKey_ckBanner();
            this._isClosed = true;
            this.remo_GameKey_veAllEventListener();
            Laya.timer.clearAll(this);
            UIMa_GameKey_nager.getInstance$().clos_GameKey_eUI(this);
            this.args && this.args.closeHandler && this.args.closeHandler.run();
        }
        /**
     * 销毁界面
     */        destroy() {
            this.doCl_GameKey_ose();
        }
    }
    /** 界面路径 */    Base_GameKey_Window.url = "";
    /** 界面类名 */    Base_GameKey_Window.className = "";
    /** 界面配置  layer : 层级, only : 是否唯一,  needUISurrenal ：需要UI遮罩等待界面加载完毕, notClose : 不关闭, bannerId*/    Base_GameKey_Window.uiConfig = {
        layer: UILa_GameKey_yer.LAYER_NORMAL,
        only: true,
        needUISurrenal: true,
        notClose: false,
        bannerId: undefined
    };
    /**
   * 得分
   * created by cyz 20200302
   */    class ScoreUpAnimUIControl$ extends Laya.Script {
        constructor() {
            super();
            /** @prop {name:label_score, tips:"得分文本", type:Node} */            this.label_score = null;
            /** 视口坐标 */            this.viewPos = new Laya.Vector3();
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} position 
     * @param {*} score 
     */        static create$(parent, position, score) {
            Laya.loader.create("Prefab/Battle/UpScoreAnimUI.json", Laya.Handler.create(this, obj => {
                if (parent.destroyed) return;
                let pre = new Laya.Prefab();
                pre.json = obj;
                let uiNode = pre.create();
                let ui = uiNode.getComponent(ScoreUpAnimUIControl$);
                ui.setData$(position, score);
                parent && parent.addChild(uiNode);
            }));
        }
        /**
     * 
     * @param {*} pos 
     * @param {*} score 
     */        setData$(pos, score) {
            /** 世界参照坐标 */
            this.pos$ = pos.clone();
            /** 得分 */            this.score$ = score;
        }
        onStart() {
            this.label_score.text = "+" + this.score$;
            this.owner.ani1.on(Laya.Event.COMPLETE, this, this.destroy);
            this.owner.ani1.play(0, false);
        }
        onUpdate() {
            this.refreshPos$();
        }
        /**
     * 刷新坐标
     */        refreshPos$() {
            curScene.getStagePos$(this.pos$, this.viewPos);
            Laya.Point.TEMP.setTo(this.viewPos.x, this.viewPos.y);
            this.owner.parent.globalToLocal(Laya.Point.TEMP);
            this.owner.pos(Laya.Point.TEMP.x, Laya.Point.TEMP.y);
        }
    }
    /**
   * 战斗界面
   * created by cyz 20200219
   */    class BattleUI$ extends Base_GameKey_Window {
        constructor() {
            super();
            this.winName = "战斗界面";
            /** @prop {name:input_box, tips:"操作输入区域", type:Node} */            this.input_box = null;
            /** @prop {name:label_score, tips:"得分", type:Node} */            this.label_score = null;
            /** @prop {name:label_lv, tips:"关卡", type:Node} */            this.label_lv = null;
            /** @prop {name:roll_progress_bar, tips:"得分进度条", type:Node} */            this.roll_progress_bar = null;
            /** @prop {name:label_coin, tips:"金币", type:Node} */            this.label_coin = null;
            /** @prop {name:handGuide, tips:"引导UI", type:Node} */            this.handGuide = null;
            /** @prop {name:upScoreParent, tips:"得分动画展示父级", type:Node} */            this.upScoreParent = null;
            /** @prop {name:adList, tips:"", type:Node} */            this.adList = null;
            /** @prop {name:yad, tips:"", type:Node} */             this.yad = null;

            
        }
        init_GameKey_Data() {
            /** 关卡 */
            this.level$ = Data_GameKey_Manager.getInstance$().customData$.level$;
            /** 滚动进度 */            this.roll_progress$ = 0;
            /** 刷新得分 */            this.score$ = 0;
        }
        onUI_GameKey_Load() {
            super.onUI_GameKey_Load();
            this.initUI$();
            this.moni_GameKey_torBtns();
            this.monitorEvents$();
            /** 广告包围盒 */           
        }
        /**
     * 初始化界面
     */        
       initUI$() {
            this.label_lv.text = "LEVEL: " + this.level$;
            this.refreshScoreUI$();
            this.refreshCoinUI$();
            this.setGuideShow$(true);

            this.adList.renderHandler = new Laya.Handler(this,this.onRenderHandler )
            this.adList.array = platform.getInstance().getForgames();
            this.yad.on(Laya.Event.MOUSE_DOWN,this.yad,()=>{platform.getInstance().navigate("GAME","LOGO")});


            this.owner.timer.loop(6e3,this,()=>{
                this.adList.array = platform.getInstance().getForgames();
            });
        }
        onDestroy() {
            super.onDestroy();
            this.carouseAd = null;
            Laya.uiMgr$.onUIClose$(this);
        }
        /**
     * 展示banner
     */
    onRenderHandler(box) {
        box.offAll(Laya.Event.MOUSE_DOWN);
        box.on(Laya.Event.MOUSE_DOWN,box,()=>{platform.getInstance().navigate("GAME","MORE",box.dataSource.id)});

    }
        /**
     * 设置引导状态
     */        
    setGuideShow$(isShow) {
            if (this.level$ != 1) return;
            this.handGuide.visible = isShow;
            isShow && this.owner.ani1.play(0, true);
        }
        /**
     * 刷新得分表现
     */        refreshScoreUI$() {
            let coinStr = undefined;
            if (this.score$ > 999) {
                coinStr = this.score$ + "";
                coinStr = coinStr.substr(0, coinStr.length - 3) + " " + coinStr.substr(coinStr.length - 3);
            } else {
                coinStr = "" + this.score$;
            }
            this.label_score.text = coinStr;
            this.roll_progress_bar.value = this.roll_progress$;
        }
        /**
     * 刷新金币表现
     */        
        refreshCoinUI$() {
            let coinStr = undefined;
            let coin = Data_GameKey_Manager.getInstance$().userData$.coin$;
            coinStr = "" + coin;
            this.label_coin.text = coinStr;
        }
        moni_GameKey_torBtns() {
            if (this.input_box) {
                this.input_box.on(Laya.Event.MOUSE_DOWN, this, this.onInputMouseDown$);
                this.input_box.on(Laya.Event.MOUSE_MOVE, this, this.onInputMouseMove$);
                this.input_box.on(Laya.Event.MOUSE_UP, this, this.onInputMouseUp$);
                this.input_box.on(Laya.Event.MOUSE_OUT, this, this.onInputMouseUp$);
            }
        }
        /**
         * 输入区域按下
         */        
        onInputMouseDown$(e) {
            this.setGuideShow$(false);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.INPUT_MOUSE_DOWN, e);
        }
        /**
     * 输入区域移动
     */        onInputMouseMove$(e) {
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.INPUT_MOUSE_MOVE, e);
        }
        /**
     * 输入区域抬起
     */        onInputMouseUp$(e) {
            this.setGuideShow$(true);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.INPUT_MOUSE_UP, e);
        }
        /**
     * 监听事件
     */        monitorEvents$() {
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.SCORE_CHANGE$, this.onScoreChange$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.GETED_COIN, this.onGetCoin$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.ADD_SCORE$, this.onAddScore$);
        }
        /**
     * 得分变化
     * @param {*} e {data:{score,roll_progress}}
     */        onScoreChange$(e) {
            this.score$ = e.data.score;
            this.roll_progress$ = e.data.roll_progress;
            this.refreshScoreUI$();
        }
        /**
     * 当增加破坏得分
     * @param {*} e 
     */        onAddScore$(e) {
            ScoreUpAnimUIControl$.create$(this.upScoreParent, e.data.pos, e.data.score);
        }
        /**
     * 获取金币
     * @param {*} e 
     */        onGetCoin$(e) {
            this.refreshCoinUI$();
        }
    }
    /** 场景路径 */    BattleUI$.url = "Prefab/Battle/BattleWindow.json";
    /** 类名 */    BattleUI$.className = "BattleUI";
    /** 界面配置  layer : 层级, only : 是否唯一,  needUISurrenal ：需要UI遮罩等待界面加载完毕, notClose : 不关闭*/    BattleUI$.uiConfig = {
        layer: UILa_GameKey_yer.LAYER_NORMAL,
        only: true,
        needUISurrenal: true,
        notClose: false
    };
    /**
   * 主界面
   * created by cyz 20200227
   */class MainUI$ extends Base_GameKey_Window {
        constructor() {
            super();
            this.winName = "主界面";
            /** @prop {name:btn_start, tips:"", type:Node} */            this.btn_start = null;
            /** @prop {name:btn_moreGame, tips:"", type:Node} */            this.btn_moreGame = null;
            /** @prop {name:label_best_score, tips:"", type:Node} */            this.label_best_score = null;

            
        }
        onUI_GameKey_Load() {
            super.onUI_GameKey_Load();
            this.moni_GameKey_torBtns();
            this.label_best_score.text = "BEST: " + Data_GameKey_Manager.getInstance$().customData$.bestScore$;
        }
        moni_GameKey_torBtns() {
            Util_GameKey_s.onBu_GameKey_ttonScaleEvent(this.btn_start, this, "onClickStart");
            this.btn_moreGame.on(Laya.Event.MOUSE_DOWN,this,()=>{ platform.getInstance().navigate("HOME","LOGO")});
        }
        /**
         * 点击开始游戏
         */        
        onClickStart() {
            platform.getInstance().showInterstitial(()=>{
                this.destroy();
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_START_GAME);
                UIMa_GameKey_nager.getInstance$().open_GameKey_UI(BattleUI$);
            })
           
        }
    }
    /** 场景路径 */    MainUI$.url = "Prefab/Main/MainWindow.json";
    /** 类名 */    MainUI$.className = "MainUI";
    /** 界面配置  layer : 层级, only : 是否唯一,  needUISurrenal ：需要UI遮罩等待界面加载完毕, notClose : 不关闭*/    MainUI$.uiConfig = {
        layer: UILa_GameKey_yer.LAYER_NORMAL,
        only: true,
        needUISurrenal: true,
        notClose: false
    };

  class BattleRestartUI$ extends Base_GameKey_Window {
        constructor() {
            super();
            this.winName = "战斗失败界面";
            /** @prop {name:btn_restart, tips:"重新开始按钮", type:Node} */            this.btn_restart = null;
            /** @prop {name:btn_relive, tips:"复活按钮", type:Node} */            this.btn_relive = null;
            /** @prop {name:label_close, tips:"关闭文本", type:Node} */            this.label_close = null;
            /** @prop {name:label_score, tips:"得分", type:Node} */            this.label_score = null;
            /** @prop {name:label_best_score, tips:"", type:Node} */            this.label_best_score = null;
            /** @prop {name:adList, tips:"", type:Node} */            this.adList = null;
            this.moveSpeed$ = 1.5;
        }
        onUI_GameKey_Load() {
            super.onUI_GameKey_Load();
            this.initUI$();
            this.moni_GameKey_torBtns();
            /** 是否移动banner */            this.isMoveBanner$ = SdkManager$.getInstance$().isMoveBanner$();
            /** 是否改变按钮风格 */            this.isChangeBtnStyle$ = SdkManager$.getInstance$().isChangeVideoAdBtnStyle$();
            /** 广告包围盒 */            this.bannerPos = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "bannerPos");
            Laya.uiMgr$.onUIOpen$(this);
            this.playBannerMoveAnim$();
        }
        /**
         * 初始化界面
         */        
        initUI$() {
            this.label_score.text = "SCORE: " + (this.args[0] || 0) + "";
            this.label_best_score.text = "BEST: " + Data_GameKey_Manager.getInstance$().customData$.bestScore$;
            this.btn_restart.active = false;
            this.refreshAdBtnStyle$();
            this.showGameOverAd();
            this.adList.renderHandler =  new Laya.Handler(this,this.onRenderHandler )
            this.adList.array = platform.getInstance().getForgames();
       
        }
        /**
         * 展示banner
         */
        onRenderHandler(box) {
            box.offAll(Laya.Event.MOUSE_DOWN);
            box.on(Laya.Event.MOUSE_DOWN,box,()=>{platform.getInstance().navigate("GAME","MORE",box.dataSource.id)});

        }
        /**
     * 刷新视频按钮位置风格
     */        refreshAdBtnStyle$() {
            if (!this.isChangeBtnStyle$) return;
            this.btn_relive.centerX = -this.btn_relive.centerX;
            this.label_close.centerX = -this.label_close.centerX;
        }
        /**
     * 播放banner移动动画
     */        
    playBannerMoveAnim$() {
            if (!this.isMoveBanner$) {
                this.restoreBanner$();
                return;
            }
            this.playUpAnim$();
            Laya.timer.once(1500, this, this.restoreBanner$);
        }
        /**
     * 播放上升动画
     */        playUpAnim$() {
            /** 播放上升动画 */
            this.isPlayUpAnim$ = true;
            /** 延迟移动倒计时 */            this.delayMoveCountT$ = 2e3;
            this.btn_relive.sy = this.btn_relive.y;
            this.label_close.sy = this.label_close.y;
            this.btn_relive.y = Laya.stage.height - 105 - .5 * (Laya.stage.height - 1280);
            this.label_close.y = Laya.stage.height - 120 - .5 * (Laya.stage.height - 1280);
            this.moveDirect$ = this.btn_relive.sy - this.btn_relive.y > 0 ? 1 : -1;
        }
     
    refreshUpAnim$() {
            if (!this.isPlayUpAnim$) return;
            if (this.delayMoveCountT$ > 0) {
                this.delayMoveCountT$ -= Laya.timer.delta;
                return;
            }
            this.btn_relive.y = Math.max(this.btn_relive.y + Laya.timer.delta * this.moveSpeed$ * this.moveDirect$, this.btn_relive.sy);
            this.label_close.y = Math.max(this.label_close.y + Laya.timer.delta * this.moveSpeed$ * this.moveDirect$, this.label_close.sy);
            if (this.label_close.y == this.label_close.sy) this.isPlayUpAnim$ = false;
        }
        onUpdate() {
            this.refreshUpAnim$();
        }
        /**
     * 展示中间广告位
     */ showGameOverAd() {
        }
        onDestroy() {
            super.onDestroy();
            this.gameOverAd = null;
            Laya.uiMgr$.onUIClose$(this);
        }
        /**
         * 展示banner
         */ 
        restoreBanner$() {
        }
        moni_GameKey_torBtns() {
            Util_GameKey_s.onBu_GameKey_ttonScaleEvent(this.btn_restart, this, "onClickRestart$");
            Util_GameKey_s.onBu_GameKey_ttonScaleEvent(this.btn_relive, this, "onClickRelive$");
            Util_GameKey_s.onBu_GameKey_ttonEvent(this.label_close, this, "onClickClose$");
        }
        /**
     * 点击开始游戏
     */        onClickRestart$() {
            if (this.isPlayUpAnim$) return;
            this.destroy();
            UIMa_GameKey_nager.getInstance$().open_GameKey_UI(MainUI$);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.REST_FIGHT);
        }
        /**
         * 点击复活
         */ 
        onClickRelive$() {
            platform.getInstance().showReward(()=>{
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.RELIVE$);
                this.destroy();
            });
            //打开视频
            // this.onAdReliveOk$();
            //跳转仿微信广告页
            // this.showCopyWx();
            // pgdk$.showVideoAd$(this.onRelive$.bind(this));
        }
        /**
     * 当复活
     * @param {*} isClose 
     */        
        onRelive$(isClose) {
            if (this.owner.destroyed) return;
            if (!isClose && !SdkManager$.getInstance$().isCheat$) return;
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.RELIVE$);
            this.destroy();
        }
        /**
         * 跳转导出页
         */   
        showAdExport() {
            UIMa_GameKey_nager.getInstance$().open_GameKey_UI(MainUI$);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.REST_FIGHT);
        }
        // /**
        //  * 跳转广告仿微信页
        //  */
        // showCopyWx(){
        //     let openHandler = Laya.Handler.create(this, () => {
        //         this.onAdReliveOk$();
        //     })
        //     window["qy"].showCopyWx(null,openHandler);
        // }
        /**
     * 点击关闭
     */
        onClickClose$() {
            if (this.isPlayUpAnim$) return;
            this.destroy();
            this.showAdExport();
        }
        /**
     * 复活视频光看成功
     */        onAdReliveOk$() {
            this.destroy();
            UIMa_GameKey_nager.getInstance$().open_GameKey_UI(MainUI$);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.REST_FIGHT);
        }
    }
    /** 场景路径 */    BattleRestartUI$.url = "Prefab/Battle/RestartWindow.json";
    /** 类名 */    BattleRestartUI$.className = "BattleRestartUI";
    /** 界面配置  layer : 层级, only : 是否唯一,  needUISurrenal ：需要UI遮罩等待界面加载完毕, notClose : 不关闭*/    BattleRestartUI$.uiConfig = {
        layer: UILa_GameKey_yer.LAYER_NORMAL,
        only: true,
        needUISurrenal: true,
        notClose: false
    };
    /**
   * 战斗胜利
   * created by cyz 20200227
   */    class BattleWinUI$ extends Base_GameKey_Window {
        constructor() {
            super();
            this.winName = "战斗胜利界面";
            /** @prop {name:btn_next, tips:"next", type:Node} */            this.btn_next = null;
             /** @prop {name:adList, tips:"", type:Node} */            this.adList = null;

            
            /** 动画移动速度 pix/ms */            this.moveSpeed$ = 1.5;
        }
        onUI_GameKey_Load() {
            super.onUI_GameKey_Load();
            this.moni_GameKey_torBtns();
            this.showGameOverAd();
            /** 是否移动banner */            this.isMoveBanner$ = SdkManager$.getInstance$().isMoveBanner$();
            /** 广告包围盒 */            this.bannerPos = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "bannerPos");
            Laya.uiMgr$.onUIOpen$(this);
            this.playBannerMoveAnim$();

            this.adList.renderHandler =  new Laya.Handler(this,this.onRenderHandler )
            this.adList.array = platform.getInstance().getForgames();
        }
        /**
         * 展示banner
         */
        onRenderHandler(box) {
            box.offAll(Laya.Event.MOUSE_DOWN);
            box.on(Laya.Event.MOUSE_DOWN,box,()=>{platform.getInstance().navigate("GAME","MORE",box.dataSource.id)});

        }
        /**
         * 展示游戏结束页的互推位
         */ 
        showGameOverAd() {
        }
        /**
         * 播放banner移动动画
         */ 
        playBannerMoveAnim$() {
        }
        /**
     * 播放上升动画
     */        playUpAnim$() {
            /** 播放上升动画 */
            this.isPlayUpAnim$ = true;
            /** 延迟移动倒计时 */            this.delayMoveCountT$ = 2e3;
            this.btn_share.sy = this.btn_share.y;
            this.btn_next.sy = this.btn_next.y;
            this.btn_share.y = this.btn_next.y = Laya.stage.height - 100 - .5 * (Laya.stage.height - 1280);
            this.moveDirect$ = this.btn_next.sy - this.btn_next.y > 0 ? 1 : -1;
        }
        /**
     * 刷新上升动画
     */        
    refreshUpAnim$() {
            if (!this.isPlayUpAnim$) return;
            if (this.delayMoveCountT$ > 0) {
                this.delayMoveCountT$ -= Laya.timer.delta;
                return;
            }
            this.btn_next.y = this.btn_share.y = Math.max(this.btn_share.y + Laya.timer.delta * this.moveSpeed$ * this.moveDirect$, this.btn_share.sy);
            if (this.btn_share.y == this.btn_share.sy) this.isPlayUpAnim$ = false;
        }
        onDestroy() {
            super.onDestroy();
            this.gameOverAd = null;
            Laya.uiMgr$.onUIClose$(this);
        }
        /**
         * 展示banner
         */ 
        restoreBanner$() {
        }
        moni_GameKey_torBtns() {
            Util_GameKey_s.onBu_GameKey_ttonScaleEvent(this.btn_next, this, "onClickNext$");
            // Util_GameKey_s.onBu_GameKey_ttonScaleEvent(this.btn_share, this, "onClickShare$");
        }
        /**
     * 点击下一关
     */ 
       onClickNext$() {
            if (this.isPlayUpAnim$) return;
           
            platform.getInstance().showInterstitial(()=>{
                this.destroy();
                UIMa_GameKey_nager.getInstance$().open_GameKey_UI(MainUI$);
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.REST_FIGHT);
            })
        }
        /**
     * 点击分享
     */        onClickShare$() {
            SdkManager$.getInstance$().share();
        }
    }
    /** 场景路径 */    BattleWinUI$.url = "Prefab/Battle/WinWindow.json";
    /** 类名 */    BattleWinUI$.className = "BattleWinUI";
    /** 界面配置  layer : 层级, only : 是否唯一,  needUISurrenal ：需要UI遮罩等待界面加载完毕, notClose : 不关闭*/    BattleWinUI$.uiConfig = {
        layer: UILa_GameKey_yer.LAYER_NORMAL,
        only: true,
        needUISurrenal: true,
        notClose: false
    };
    /**
   * 登录加载界面
   * 作者：陈雅智
   * 日期：2019/11/15
   */    class Logi_GameKey_nLoadingUI extends Base_GameKey_Window {
        constructor() {
            super();
            this.winName = "登录加载";
        }
        onUI_GameKey_Load() {
            super.onUI_GameKey_Load();
            /** 加载拖尾文字 */            this._tai_GameKey_lValue = [ ".", "..", "...", "....", ".....", "......" ];
            /** 拖尾动画索引 */            this._tai_GameKey_lIndex = 0;
            /** 进度更新时间 */            this._pro_GameKey_gressUpdateTime = 200;
            /** 进度更新倒计时 */            this._pro_GameKey_gressTime = this._pro_GameKey_gressUpdateTime;
            /**加载回调 */            this.load_GameKey_edCallback = this.args[0];
            /** 分包清单 */            this.pack_GameKey_ages = [ "models" ];
            /** 进度长度 */            this.progressLength = this.pack_GameKey_ages.length;
            /** 进度条 */            this.progress_bar = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "progress_bar");
            /** 进度图标 */            this.progress_icon = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "progress_icon");
            /** 拖尾文本 */            this.labelTail = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "label_tail");
            this.refreshProgressUI();
            this.load_GameKey_SubPacks();
        }
        /**
     * 刷新进度界面
     */        refreshProgressUI() {
            if (!this.progress_bar) return;
            let p = this.pack_GameKey_ages == void 0 ? 0 : 1 - this.pack_GameKey_ages.length / this.progressLength;
            p = this.progress_bar.value + Math.min(p - this.progress_bar.value, .001 * Laya.timer.delta);
            this.progress_bar.value = p;
            this.progress_icon.x = this.progress_bar.width * p;
        }
        /**
     * 加载子包
     */        load_GameKey_SubPacks() {
            var vPack = this.pack_GameKey_ages.shift();
            if (vPack) {
            } else {
                this.onlo_GameKey_adedPacks();
            }
        }
        /**
     * 当加载单个包
     */        
        onLo_GameKey_adedSinglePack(res) {
            this.load_GameKey_SubPacks();
        }
        /**
     * 当加载完分包
     */        onlo_GameKey_adedPacks() {
            this.load_GameKey_edCallback && this.load_GameKey_edCallback();
            this.load_GameKey_edCallback = undefined;
            Laya.timer.once(100, this, this.destroy);
        }
        /**
     * 更新拖尾文本
     */        upda_GameKey_teTail() {
            this.labelTail.text = this._tai_GameKey_lValue[this._tai_GameKey_lIndex];
            this._tai_GameKey_lIndex = (this._tai_GameKey_lIndex + 1) % this._tai_GameKey_lValue.length;
        }
        onUpdate() {
            this._pro_GameKey_gressTime += Laya.timer.delta;
            if (this._pro_GameKey_gressTime > this._pro_GameKey_gressUpdateTime) {
                this._pro_GameKey_gressTime = 0;
                this.upda_GameKey_teTail();
            }
            this.refreshProgressUI();
        }
    }
    /** 场景路径 */    Logi_GameKey_nLoadingUI.url = "Prefab/Loading/LoginLoadingWindow.json";
    /** 类名 */    Logi_GameKey_nLoadingUI.className = "LoginLoadingUI";
    /** 界面配置  layer : 层级, only : 是否唯一,  needUISurrenal ：需要UI遮罩等待界面加载完毕, notClose : 不关闭*/    Logi_GameKey_nLoadingUI.uiConfig = {
        layer: UILa_GameKey_yer.LAYER_TOP,
        only: true,
        needUISurrenal: true,
        notClose: false
    };
    /**
   * 场景管理
   * 作者：陈雅智
   * 日期：2019/10/12
   */    class Scen_GameKey_eManager {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            /** 场景字典 */            this.sceneMap = {};
        }
        /**
     * 获取单例
     * @return {Scen_GameKey_eManager}
     */        static getInstance$() {
            if (Scen_GameKey_eManager.instance == null) {
                Scen_GameKey_eManager.instance = new Scen_GameKey_eManager();
            }
            return Scen_GameKey_eManager.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            this.init_GameKey_Complete();
            // GameSetting.startScene && Laya.Scene.open(GameSetting.startScene);
                }
        /**
     * 打开初始场景
     */        open_GameKey_InitScene() {
            // this.openScene(Laya.CyzClassMap[GameSetting.startScene]);
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.open_GameKey_InitScene();
            this.inited = true;
            this.initedCB && this.initedCB();
        }
        /**
     * 打开场景
     * @param sceneClass 
     * @param zOrder 
     * @param callback 
     * @param onProgress 
     * @param args 
     */        open_GameKey_Scene(sceneClass, callback, onProgress, ...args) {
            Laya.Scene.open(sceneClass.url, true, args, Laya.Handler.create(this, e => {
                callback && callback.run();
                //对使用资源进行销毁,注意调用资源destroy的话，就算加锁也是会被销毁的。
                // Laya.Resource.destroyUnusedResources();
                        }), onProgress);
        }
        /**
     * 添加场景
     * @param {场景实例} scene 
     */        add_GameKey_Scene(scene) {
            this.sceneMap[scene.constructor.className] = scene;
        }
        /**
     * 移除场景
     * @param {场景实例} scene 
     */        remo_GameKey_veScene(scene) {
            delete this.sceneMap[scene.constructor.className];
        }
        /**
     * 获取场景实例
     * @param {场景类} sceneClass 
     */        getS_GameKey_cene(sceneClass) {
            return this.sceneMap[sceneClass.className];
        }
    }
    /** 私有单例 */    Scen_GameKey_eManager.instance = undefined;
    /**
   * 场景管理基类
   * 作者：陈雅智
   * 日期：2019/10/12
   */    class Base_GameKey_Scene extends Laya.Scene {
        constructor() {
            super();
            /** 注册的事件清单 */            this._even_GameKey_ts = [];
            //注册监听
                        Scen_GameKey_eManager.getInstance$().add_GameKey_Scene(this);
        }
        /**
     * 注册事件
     * @param {事件枚举} event 
     * @param {方法} callFunc 
     */        addE_GameKey_ventListener(event, callFunc) {
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(event, this, callFunc);
            this._even_GameKey_ts.push({
                e: event,
                cn: callFunc
            });
        }
        /**
     * 取消事件注册
     * @param {事件枚举} event 
     * @param {方法名字} callName 
     */        remo_GameKey_veEventListener(event, callName) {
            var i = this._even_GameKey_ts.length;
            var item;
            while (--i > -1) {
                item = this._even_GameKey_ts[i];
                if (item.e == event && item.cn == callName) {
                    // Utils.removeArrayElementAt(this._even_GameKey_ts, i);
                    this._even_GameKey_ts.removeAt(i);
                    break;
                }
            }
        }
        /**
     * 移除所有事件监听
     */        remo_GameKey_veAllEventListener() {
            var item;
            while (this._even_GameKey_ts.length) {
                item = this._even_GameKey_ts.shift();
                Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(item.e, this, item.cn);
            }
            this._even_GameKey_ts = [];
        }
        /**
     * 当销毁
     */        onDestroy() {
            //移除监听
            Scen_GameKey_eManager.getInstance$().remo_GameKey_veScene(this);
            this.remo_GameKey_veAllEventListener();
            this.close();
        }
    }
    /** 场景路径 */    Base_GameKey_Scene.url = "";
    /** 类名 */    Base_GameKey_Scene.className = "";
    class CameraMoveScript extends Laya.Script3D {
        constructor() {
            super();
            this._tempVector3 = new Laya.Vector3();
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.rotaionSpeed = 6e-5;
        }
        onAwake() {
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
            this.camera = this.owner;
        }
        _onDestroy() {
            //关闭监听函数
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        }
        onUpdate(state) {
            var elapsedTime = Laya.timer.delta * 5;
            if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
                var scene = this.owner.scene;
                Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-.01 * elapsedTime);
                //W
                                Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(.01 * elapsedTime);
                //S
                                Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-.01 * elapsedTime);
                //A
                                Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(.01 * elapsedTime);
                //D
                                Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(.01 * elapsedTime);
                //Q
                                Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-.01 * elapsedTime);
                //E
                                var offsetX = Laya.stage.mouseX - this.lastMouseX;
                var offsetY = Laya.stage.mouseY - this.lastMouseY;
                var yprElem = this.yawPitchRoll;
                yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
                yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
                this.updateRotation();
            }
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
        }
        mouseDown(e) {
            //获得鼠标的旋转值
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            //获得鼠标的xy值
                        this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            //设置bool值
                        this.isMouseDown = true;
        }
        mouseUp(e) {
            //设置bool值
            this.isMouseDown = false;
        }
        /**
     * 向前移动。
     */        moveForward(distance) {
            this._tempVector3.x = 0;
            this._tempVector3.y = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        /**
     * 向右移动。
     */        moveRight(distance) {
            this._tempVector3.y = 0;
            this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        /**
     * 向上移动。
     */        moveVertical(distance) {
            this._tempVector3.x = this._tempVector3.z = 0;
            this._tempVector3.y = distance;
            this.camera.transform.translate(this._tempVector3, false);
        }
        updateRotation() {
            if (Math.abs(this.yawPitchRoll.y) < 1.5) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
        }
    }
    /**
   * 模型工具
   * 作者：陈雅智
   * 日期：2019/11/14
   */    class Mode_GameKey_lUtils {
        constructor() {}
        /**
     * 初始化
     */        static init() {
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.SCREEN_SIZE_CHANGE, null, Mode_GameKey_lUtils.onRe_GameKey_size);
        }
        /**
     * 创建UI模型
     * @param {*} uiTarget UI目标
     * @param {*} modelId 模型Id
     * @param {*} loadedHandler 加载完回调
     */        static crea_GameKey_teUIModel(uiTarget, modelId, loadedHandler) {
            //创建UI模型字典
            if (!Mode_GameKey_lUtils.uiModelDic) {
                Mode_GameKey_lUtils.uiModelDic = {};
                Mode_GameKey_lUtils.uiModelMaxId = 0;
            }
            //界面唯一Id
                        if (!uiTarget.UMId) uiTarget.UMId = ++Mode_GameKey_lUtils.uiModelMaxId;
            //ui建模数据
                        let uiData = Mode_GameKey_lUtils.getU_GameKey_IData(uiTarget, true);
            let UIMode3D = Laya.CyzClassMap["UIMode3D"];
            let uiModelCtr = UIMode3D.create(uiTarget, modelId, loadedHandler);
            return uiModelCtr;
        }
        /**
     * 界面重置
     */        static onRe_GameKey_size() {
            Mode_GameKey_lUtils.resi_GameKey_zeScenes();
        }
        /**
     * 重置场景们适配
     */        static resi_GameKey_zeScenes() {
            if (!Mode_GameKey_lUtils.uiModelDic) return;
            let mid;
            for (mid in Mode_GameKey_lUtils.uiModelDic) {
                Mode_GameKey_lUtils.resi_GameKey_zeScene(Mode_GameKey_lUtils.uiModelDic[mid]);
            }
        }
        /**
     * 获取ui模型数据
     * @param {*} uiTarget UI模型载体
     * @param {*} isCreate 是否创建新的数据
     */        static getU_GameKey_IData(uiTarget, isCreate) {
            let uiData = Mode_GameKey_lUtils.uiModelDic[uiTarget.UMId];
            if (!uiData && isCreate) {
                Mode_GameKey_lUtils.uiModelDic[uiTarget.UMId] = uiData = {};
                let scene = uiTarget.addChild(new Laya.Scene3D());
                scene.ambientColor = new Laya.Vector3(.3, .3, .3);
                let camera = scene.addChild(new Laya.Camera(0, .1, 1e3));
                camera.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
                camera.transform.position = new Laya.Vector3(0, 0, -500);
                camera.orthographic = true;
                camera.orthographicVerticalSize = 5;
                camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
                uiData.camera = camera;
                uiData.scene = scene;
                Mode_GameKey_lUtils.resi_GameKey_zeScene(uiData);
            }
            return uiData;
        }
        /**
   * 获取3DUI舞台对应场景位置
   */        static get3_GameKey_DUIPos(stageX, stageY, targetUI, vPos) {
            if (!targetUI) {
                return null;
            }
            if (!vPos) vPos = new Laya.Vector3();
            var data = Mode_GameKey_lUtils.getU_GameKey_IData(targetUI);
            var sceneStageRate = data.sceneStageRate;
            var camera = data.camera;
            vPos.x = (stageX - Laya.stage.width * .5) * sceneStageRate.x + camera.transform.position.x;
            vPos.y = (stageY - Laya.stage.height * .5) * sceneStageRate.y + camera.transform.position.y;
            vPos.z = camera.transform.position.z + 100;
            return vPos;
        }
        /**
     * 刷新场景屏幕适配数据
     * @param {*} uiData UI数据
     */        static resi_GameKey_zeScene(uiData) {
            let camera = uiData.camera;
            let pos1 = new Laya.Vector3(0, 0, 0);
            let pos2 = new Laya.Vector3(0, 0, 0);
            let pos = new Laya.Vector3(0, 0, 0);
            camera.convertScreenCoordToOrthographicCoord(pos, pos1);
            let vScaleX = Laya.RenderState.clientWidth / Laya.stage.width || 1;
            let vScaleY = Laya.RenderState.clientHeight / Laya.stage.height || 1;
            pos = new Laya.Vector3(vScaleX, vScaleY, 0);
            camera.convertScreenCoordToOrthographicCoord(pos, pos2);
            uiData.sceneStageRate = new Laya.Vector2(pos2.x - pos1.x, pos2.y - pos1.y);
        }
        /**
     * 销毁UI模型
     * @param {*} uiTarget UI载体
     * @param {*} modelId 模型Id
     */        static dest_GameKey_royUIModel(uiTarget, modelId) {
            let uiData = Mode_GameKey_lUtils.getU_GameKey_IData(uiTarget);
            if (!uiData) return;
            uiData.scene.destroy();
            delete Mode_GameKey_lUtils.uiModelDic[uiTarget.UMId];
            uiTarget.UMId = undefined;
        }
        /**
     * 获取相对目标的本地坐标
     * @param {Laya.Transform3D} parent 父级
     * @param {*} pos 世界坐标
     */        static getL_GameKey_ocalPosition(parent, pos, localPosition) {
            let worldMatrix = parent.worldMatrix;
            localPosition || (localPosition = new Laya.Vector3());
            var parentInvMat = Laya.Transform3D._tempMatrix0;
            worldMatrix.invert(parentInvMat);
            Laya.Vector3.transformCoordinate(pos, parentInvMat, localPosition);
            return localPosition;
        }
        /**
     * 获取本地旋转角度
     * @param {Laya.Transform3D} parent 
     * @param {*} rotation 
     */        static getL_GameKey_ocalRotation(parent, rotation, localRotation) {
            localRotation || (localRotation = new Laya.Quaternion());
            if (parent != null) {
                parent.rotation.invert(Laya.Transform3D._tempQuaternion0);
                Laya.Quaternion.multiply(Laya.Transform3D._tempQuaternion0, rotation, localRotation);
            } else {
                rotation.cloneTo(localRotation);
            }
            return localRotation;
        }
        /**
     * 获取本地缩放
     * @param {Laya.Transform3D} parent 
     * @param {*} scale 
     * @param {*} localScale 
     */        static getL_GameKey_ocalScale(parent, scale, localScale) {
            localScale || (localScale = new Laya.Vector3());
            if (parent !== null) {
                let scaleMat = Laya.Transform3D._tempMatrix3x33;
                let localScaleMat = Laya.Transform3D._tempMatrix3x33;
                let localScaleMatE = localScaleMat.elements;
                let parInvScaleMat = parent._getScaleMatrix();
                parInvScaleMat.invert(parInvScaleMat);
                Laya.Matrix3x3.createFromScaling(scale, scaleMat);
                Laya.Matrix3x3.multiply(parInvScaleMat, scaleMat, localScaleMat);
                localScale.x = localScaleMatE[0];
                localScale.y = localScaleMatE[4];
                localScale.z = localScaleMatE[8];
            } else {
                scale.cloneTo(localScale);
            }
            return localScale;
        }
        /**
     * 刷新钢铁碰撞器 包括所有子对象
     * @param {Laya.Sprite3D} sp 刷新对象
     */        static refreshRigidbodysColliderShape(sp) {
            let rigidbody = sp.getComponent(Laya.Rigidbody3D);
            if (rigidbody) {
                Mode_GameKey_lUtils.refreshSingleRigidbodyColliderShape(rigidbody, sp);
            }
            if (!sp._children) return;
            let i = sp._children.length;
            while (--i > -1) {
                Mode_GameKey_lUtils.refreshRigidbodysColliderShape(sp._children[i]);
            }
        }
        /**
     * 刷新单个钢铁碰撞器
     * @param {Laya.RigidBody3D} rigidbody 刚体
     * @param {Laya.Matrix4x4} worldMatrix 世界矩阵
     * @param {Laya.Sprite3D} sp 碰撞器目标载体
     */        static refreshSingleRigidbodyColliderShape(rigidbody, sp) {
            let spRigidbody = sp.getComponent(Laya.Rigidbody3D);
            if (spRigidbody && spRigidbody != rigidbody) return;
            let collider = sp.getComponent(Laya.PhysicsCollider);
            if (collider) {
                let newShape = collider.colliderShape.clone();
                newShape._localRotation = Mode_GameKey_lUtils.getL_GameKey_ocalRotation(rigidbody.owner.transform, sp.transform.rotation);
                newShape._scale = Mode_GameKey_lUtils.getL_GameKey_ocalScale(rigidbody.owner.transform, sp.transform.getWorldLossyScale());
                newShape._localOffset = Mode_GameKey_lUtils.getL_GameKey_ocalPosition(rigidbody.owner.transform, sp.transform.position);
                newShape.updateLocalTransformations();
                sp._destroyComponent(collider);
                if (!rigidbody.colliderShape) rigidbody.colliderShape = new Laya.CompoundColliderShape();
                rigidbody.colliderShape.addChildShape && rigidbody.colliderShape.addChildShape(newShape);
            }
            if (!sp._children) return;
            let i = sp._children.length;
            while (--i > -1) {
                Mode_GameKey_lUtils.refreshSingleRigidbodyColliderShape(rigidbody, sp._children[i]);
            }
        }
    }
    /**
   * 模型控制
   * 作者：陈雅智
   * 日期：2019/10/26
   */    class Mode_GameKey_l3D extends Laya.Script {
        constructor() {
            super();
            /** 模型id */            this._modelId = 0;
            /** 挂载模型 */            this.sprite = null;
            /** 模型对应animator */            this._animator = null;
            /** 模型对应avater */            this.avater = null;
            /** 所有子animator */            this._canimators = [];
            /** 父节点 */            this._parent = null;
            /** 额外挂载模型 */            this._addModels = [];
            /** 骨骼点 */            this._bones = {};
            /** 加载结束回调 */            this._loadedHandler = null;
            /** 初始世界坐标 */            this._position = new Laya.Vector3(NaN, NaN, NaN);
            /** 初始本地坐标 */            this._localPosition = new Laya.Vector3(0, 0, 0);
            /** 初始缩放 */            this._localScale = new Laya.Vector3(1, 1, 1);
            /** 初始本地角度 */            this._localRotation = new Laya.Vector3(0, 0, 0);
            /** 是否加载结束 */            this.loaded = false;
            /** 是否显示 */            this._active = true;
            ///** 对应资源配置 */
            // this._modelConfig = null;
            /** 模型配置数据 */            this._config = undefined;
            /** 模型名字 */            this._name = undefined;
            /** 是否已销毁 */            this._isDestroyed = undefined;
            /** 是否是轨迹 */            this._isOrbit = undefined;
            /** 绑点模型清单 [模型id, 绑点名称]*/            this._adds = undefined;
            /** 已加载的绑点模型索引 */            this._addLoadIndex = undefined;
        }
        /**
     * 重置
     * @param {父级} parent 
     * @param {模型id} modelId 
     * @param {加载回调} loadedHandler 
     */        reset(parent, modelId, loadedHandler) {
            this._parent = parent;
            this._modelId = modelId;
            this._loadedHandler = loadedHandler;
            this._isDestroyed = false;
            this._config = D.PrefabsPath[modelId];
            var chs = this._config.chs;
            // this._modelConfig = D.ModelConfig[chs];
                        this._name = chs.substring(chs.lastIndexOf("/") + 1);
            this.setLocalScale(this._config.scale);
            this._isOrbit = !!this._config.path;
            this._adds = [];
            this._addLoadIndex = 0;
            if (this._config.additionalId) {
                var adds = this._config.additionalId.split("&");
                for (var i = 0; i < adds.length; i++) {
                    var p = adds[i].split("#");
                    this._adds.push([ p[0], p[1] ]);
                    //[模型id, 绑点名称];
                                }
            }
            if (this._isOrbit) {
                this.creareOrbit();
            } else {
                this.create();
            }
        }
        /**
     * 创建
     */        create() {
            if (!this.loaded) {
                let modelId = this._modelId;
                Mode_GameKey_l3D.prepareLoad([ this._modelId ], Laya.Handler.create(this, this._onC_GameKey_omplete, [ modelId ]));
            } else {
                Laya.timer.once(1, this, this._onA_GameKey_llCompleted);
            }
        }
        /**
     * 完成回调
     */        _onC_GameKey_omplete(modelId) {
            if (modelId != this._modelId) return;
            // 未加载完毕就已经被销毁
                        if (this._isDestroyed) {
                return;
            }
            var lh = this._config.chs;
            if (!lh.endWith$(".lh")) {
                lh += "/" + this._name + ".lh";
            }
            // this.sprite = Laya.Sprite3D.load(lh);
                        this.sprite = Laya.Loader.getRes(lh);
            this.sprite = Laya.Sprite3D.instantiate(this.sprite);
            this.sprite.$model = this;
            this.sprite.$name = "Model_" + this._modelId;
            this.avater = Util_GameKey_s.getA_GameKey_vater(this.sprite);
            if (this.avater) this._animator = this.avater.getComponent(Laya.Animator);
            //获取Animator动画组件
            // for (var i = 0; i < this._config.subModel.length; i++) {
            //     var childName = this._config.subModel[i];
            //     if (childName == "0") {
            //         break;
            //     }
            //     var child = this.avater.getChildByName(childName);
            //     if (!child) {
            //         continue;
            //     }
            //     var canimator = child.getComponent(Laya.Animator);
            //     canimator && this._canimators.push(canimator);
            // }
                        for (var i = 0; i < this._adds.length; i++) {
                var item = this._adds[i];
                var addModel = Mode_GameKey_l3D.create(this.getBone(item[1]), item[0]);
            }
            Laya.timer.once(1, this, this._onA_GameKey_llCompleted);
        }
        /**
     * 改变父级
     * @param {*} parent 父级 
     */        changeParent(parent) {
            let lastPos = this.sprite.transform.position.clone();
            let lastAngle = this.sprite.transform.rotationEuler.clone();
            let lastScale = this.sprite.transform.getWorldLossyScale().clone();
            this.sprite.removeSelf();
            this._parent = parent;
            this._parent.addChild(this.sprite);
            this.sprite.transform.position = lastPos;
            this.sprite.transform.rotationEuler = lastAngle;
            this.sprite.transform.setWorldLossyScale(lastScale);
        }
        /**
     * 设置世界坐标
     * @param {x值} x 
     * @param {y值} y 
     * @param {z值} z 
     */        setPosition(x, y, z) {
            Util_GameKey_s.setV_GameKey_ector3(this._position, x, y, z);
            this.loaded && (this.sprite.transform.position = this._position);
        }
        /**
     * 设置本地坐标
     * @param {x值} x 
     * @param {y值} y 
     * @param {z值} z 
     */        setLocalPosition(x, y, z) {
            Util_GameKey_s.setV_GameKey_ector3(this._localPosition, x, y, z);
            this.loaded && (this.sprite.transform.localPosition = this._localPosition);
        }
        /**
     * 设置本地缩放
     * @param {x值} x 
     * @param {y值} y 
     * @param {z值} z 
     */        setLocalScale(x, y, z) {
            x === void 0 && (x = 1);
            y === void 0 && (y = x);
            z === void 0 && (z = x);
            Util_GameKey_s.setV_GameKey_ector3(this._localScale, x, y, z);
            // this.loaded && (this.sprite.transform.localScale = this._localScale);
                        if (this.loaded) {
                // let scale = this.sprite.transform.localScale;
                // scale.setValue(x, y, z);
                this.sprite.transform.localScale = this._localScale.clone();
                Util_GameKey_s.rese_GameKey_tScale(this.sprite);
            }
        }
        /**
     * 设置本地旋转值
     * @param {y轴旋转值} yaw 
     * @param {x轴旋转值} pitch 
     * @param {z轴旋转值} roll 
     */        setLocalRotation(yaw, pitch, roll, isRad) {
            // (isRad == void 0) && (isRad = false);
            if (!isRad) {
                //转换成弧度
                yaw *= GameSetting$.RAD_1_ANGLE;
                pitch *= GameSetting$.RAD_1_ANGLE;
                roll *= GameSetting$.RAD_1_ANGLE;
            }
            Util_GameKey_s.setV_GameKey_ector3(this._localRotation, yaw, pitch, roll);
            this.loaded && this._setLocalRotation();
        }
        /**
     * 设置本地旋转速度
     */        _setLocalRotation() {
            var transform = this.sprite.transform;
            Laya.Quaternion.createFromYawPitchRoll(this._localRotation.x, this._localRotation.y, this._localRotation.z, transform._localRotation);
            transform.localRotation = transform._localRotation;
        }
        /**
     * 设置是否激活
     * @param {是否激活} active 
     */        setActive(active) {
            if (this._active == active) {
                return;
            }
            this._active = active;
            this.loaded && (this.sprite.active = active);
        }
        /**
     * 旋转
     * @param {旋转角度} rotation 
     * @param {是否本地} isLocal 
     * @param {是否弧度} isRadian 
     */        rotate(rotation, isLocal, isRadian) {
            this.loaded && this.sprite.transform.rotate(rotation, isLocal, isRadian);
        }
        /**
     * 当模型加载完成
     * @param {预设体} model 
     */        _onLoadedModel(model) {
            if (this._isDestroyed) {
                return;
            }
            this.sprite = Laya.Sprite3D.instantiate(model);
            this.avater = this.sprite.getChildAt(0);
            this._animator = this.avater.getComponent(Laya.Animator);
            //获取Animator动画组件
                        for (var i = 0; i < this._config.subModel.length; i++) {
                var childName = this._config.subModel[i];
                if (childName == "0") {
                    break;
                }
                var child = this.avater.getChildByName(childName);
                if (!child) {
                    continue;
                }
                var canimator = child.getComponent(Laya.Animator);
                canimator && this._canimators.push(canimator);
            }
            this._loadAdds();
        }
        /**
     * 加载挂载对象
     */        _loadAdds() {
            if (this._isDestroyed) {
                return;
            }
            if (this._addLoadIndex >= this._adds.length) {
                this._onA_GameKey_llCompleted();
                return;
            }
            this._addModels.push(Mode_GameKey_l3D.create(undefined, this._adds[this._addLoadIndex][0], Laya.Handler.create(this, this._onA_GameKey_ddLoaded)));
        }
        /**
     * 加载完成
     */        _onA_GameKey_ddLoaded() {
            if (this._isDestroyed) {
                return;
            }
            var m = this._addModels.last();
            var boneName = this._adds[this._addLoadIndex][1];
            this.bindBone(boneName, m.sprite);
            this._addLoadIndex++;
            this._loadAdds();
        }
        /**
     * 当所有模型加载完
     */        _onA_GameKey_llCompleted() {
            this.loaded = true;
            if (this._isDestroyed) {
                return;
            } else if (this._waitDestroy) {
                this.dispose();
                return;
            }
            this._parent && this._parent.addChild(this.sprite);
            this.sprite.transform.localScale = this._localScale;
            this.refreshRigidbodysColliderShape(this.sprite);
            //会影响位置
                        if (!isNaN(this._position.x)) {
                this.sprite.transform.position = this._position;
            } else {
                this.sprite.transform.localPosition = this._localPosition;
            }
            this._setLocalRotation();
            if (this._config.color && this._config.color.length > 0) {
                Mode_GameKey_l3D.chan_GameKey_geMaterialColor(this.sprite, this._config.color[0], this._config.color[1], this._config.color[2], this._config.color[3]);
            }
            this.sprite.active = this._active;
            if (this._parent.destroyed) return;
            this._loadedHandler && this._loadedHandler.runWith(this);
        }
        /**
     * 刷新钢铁碰撞器 包括所有子对象
     * @param {Laya.Sprite3D} sp 刷新对象
     */        refreshRigidbodysColliderShape(sp) {
            let rigidbody = sp.getComponent(Laya.Rigidbody3D);
            if (rigidbody) {
                this.refreshSingleRigidbodyColliderShape(rigidbody, sp);
            }
            if (!sp._children) return;
            let i = sp._children.length;
            while (--i > -1) {
                this.refreshRigidbodysColliderShape(sp._children[i]);
            }
        }
        /**
     * 刷新单个钢铁碰撞器
     * @param {Laya.RigidBody3D} rigidbody 刚体
     * @param {Laya.Matrix4x4} worldMatrix 世界矩阵
     * @param {Laya.Sprite3D} sp 碰撞器目标载体
     */        refreshSingleRigidbodyColliderShape(rigidbody, sp) {
            let collider = sp.getComponent(Laya.PhysicsCollider);
            if (collider) {
                let newShape = collider.colliderShape.clone();
                newShape._localRotation = Mode_GameKey_lUtils.getL_GameKey_ocalRotation(rigidbody.owner.transform, sp.transform.rotation);
                newShape._scale = Mode_GameKey_lUtils.getL_GameKey_ocalScale(rigidbody.owner.transform, sp.transform.getWorldLossyScale());
                // newShape._sizeX = newShape._scale.x;
                // newShape._sizeY = newShape._scale.y;
                // newShape._sizeZ = newShape._scale.z;
                                newShape._localOffset = Mode_GameKey_lUtils.getL_GameKey_ocalPosition(rigidbody.owner.transform, sp.transform.position);
                newShape.updateLocalTransformations();
                sp._destroyComponent(collider);
                rigidbody.colliderShape.addChildShape && rigidbody.colliderShape.addChildShape(newShape);
            }
            if (!sp._children) return;
            let i = sp._children.length;
            while (--i > -1) {
                this.refreshSingleRigidbodyColliderShape(rigidbody, sp._children[i]);
            }
        }
        /**
     * 绑定骨骼点
     * @param boneName 骨骼名称
     * @param boneChild 子物体
     */        bindBone(boneName, boneChild) {
            var bone = this.getBone(boneName);
            bone && bone.addChild(boneChild);
        }
        /**
     * 获取骨骼点
     * @param {骨骼名称} boneName
     */        getBone(boneName) {
            var bone = this._bones[boneName];
            if (!bone) {
                if (boneName === Mode_GameKey_l3D.ORBIT_POINT.POINT3 && !this._animator._avatarNodeMap[boneName]) {
                    bone = this.avater;
                } else {
                    if (!this._animator._avatarNodeMap[boneName]) {
                        return null;
                    }
                    bone = this.sprite.addChild(new Laya.Sprite3D());
                    this._animator.linkSprite3DToAvatarNode(boneName, bone);
                }
                this._bones[boneName] = bone;
            }
            return bone;
        }
        /**
     * 播放动画
     * @param {动画名字} animName 
     * @param {是否循环播放} isLoop 
     * @param {调用对象} caller 
     * @param {回调} callback 
     */        playAnim(animName, isLoop, caller, callback, speed, isForce) {
            //TODO cyz 回调
            let animState;
            if (this._animator) animState = this._animator._controllerLayers[0]._statesMap[animName];
            if (animState) {
                if (!isForce && this._animator.getControllerLayer()._currentPlayState.name == animName) return;
                //已在播放
                                animState.clip.islooping = isLoop;
                animState.speed = speed != void 0 ? speed : 1;
                if (isForce) this._animator.play(animName, 0, 0); else this._animator.crossFade(animName, .2);
                // if (caller && callback) {
                //     this._animator.once(Laya.Event.STOPPED, caller, callback);
                // }
                        } else {
                // if (caller && callback) {
                //     callback.call(caller);
                // }
            }
            // if (this._animator && this._animator._controllerLayers[0]._statesMap[animName]) {
            //     this._animator.play(animName);
            //     if (caller && callback) {
            //         this._animator.once(Laya.Event.STOPPED, caller, callback);
            //     }
            // } else {
            //     if (caller && callback) {
            //         callback.call(caller);
            //     }
            // }
            // for (var i = 0; i < this._canimators.length; i++) {
            //     var animator = this._canimators[i];
            //     animator.getClip(animName) && animator.play(animName);
            // }
                }
        /**
     * 暂停粒子发射
     */        pauseEmission() {
            this.sprite && this._setEmission$(this.sprite, false);
        }
        /**
     * 恢复粒子发射
     */        resumeEmission() {
            this.sprite && this._setEmission$(this.sprite, true);
        }
        _setEmission$(node, enable) {
            node.particleSystem && (node.particleSystem.emission.enable = enable);
            if (node._children && node._children.length > 0) {
                for (let i = 0; i < node._children.length; i++) {
                    this._setEmission$(node._children[i], enable);
                }
            }
        }
        /**
     * 改变所有材质球颜色
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     * @param {*} a 
     * @param {*} materialName
     */        static chan_GameKey_geMaterialColor(sprite, r, g, b, a, materialName) {
            Mode_GameKey_l3D._cha_GameKey_ngeMaterialColor(sprite, r, g, b, a, materialName);
            for (let i = 0; i < sprite._children.length; i++) {
                Mode_GameKey_l3D.chan_GameKey_geMaterialColor(sprite._children[i], r, g, b, a, materialName);
            }
        }
        /**
     * 改变单个物体材质球颜色
     * @param {*} sprite 
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     * @param {*} a 
     * @param {*} materialName
     */        static _cha_GameKey_ngeMaterialColor(sprite, r, g, b, a, materialName) {
            let materials = [];
            if (sprite instanceof Laya.MeshSprite3D || sprite instanceof Laya.SkinnedMeshSprite3D) {
                if (materialName != void 0) {
                    let vMaterials = sprite._render.materials;
                    if (vMaterials) {
                        let i = vMaterials.length;
                        let vMaterial;
                        while (--i > -1) {
                            vMaterial = vMaterials[i];
                            if (vMaterial.name != materialName) continue;
                            materials.push(vMaterial);
                        }
                    } else if (sprite._render.material.name == materialName) {
                        materials.push(sprite._render.material);
                    }
                } else {
                    materials.push(sprite._render.material);
                    let vMaterials = sprite._render.materials;
                    if (vMaterials) {
                        let i = vMaterials.length;
                        while (--i > -1) {
                            materials.push(vMaterials[i]);
                        }
                    }
                }
            }
            if (materials && materials.length > 0) {
                let i = materials.length;
                while (--i > -1) {
                    Mode_GameKey_l3D.setM_GameKey_aterialColor(materials[i], r, g, b, a);
                }
            }
        }
        /**
     * 修改单个材质球颜色
     * @param {*} material 
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     * @param {*} a 
     */        static setM_GameKey_aterialColor(material, r, g, b, a) {
            if (!material.defualtAlbedoColor) {
                material.defualtAlbedoColor = material.albedoColor != void 0 ? material.albedoColor.clone() : material.color;
            }
            material.albedoColor != void 0 ? material.albedoColor = new Laya.Vector4(r, g, b, a) : material.color = new Laya.Vector4(r, g, b, a);
        }
        /**
     * 设置摩檫力
     * @param {*} sprite 
     * @param {*} friction 
     */        static setF_GameKey_riction(sprite, friction) {
            let components = sprite._components;
            let i;
            if (components) {
                i = components.length;
                let vComponent;
                while (--i > -1) {
                    vComponent = components[i];
                    if (vComponent instanceof Laya.PhysicsCollider || vComponent instanceof Laya.Rigidbody3D) {
                        vComponent.friction = friction;
                    }
                }
            }
            let childrens = sprite._children;
            if (!childrens) return;
            i = childrens.length;
            while (--i > -1) {
                Mode_GameKey_l3D.setF_GameKey_riction(childrens[i], friction);
            }
        }
        /**
     * 获取材质球清单
     */        getMaterials$() {
            if (!this.loaded) return;
            return this._getMaterials(this.sprite);
        }
        /**
     * 获取材质球清单
     * @param {*} sprite 
     */        _getMaterials(sprite) {
            let materials = [];
            if (sprite instanceof Laya.MeshSprite3D || sprite instanceof Laya.SkinnedMeshSprite3D) {
                if (sprite._render.materials) {
                    let i = sprite._render.materials.length;
                    while (--i > -1) materials.push(sprite._render.materials[i]);
                } else {
                    materials.push(sprite._render.material);
                }
            }
            let childrens = sprite._children;
            if (childrens) {
                let i = childrens.length;
                while (--i > -1) {
                    let childMaterials = this._getMaterials(childrens[i]);
                    let j = childMaterials.length;
                    while (--j > -1) {
                        materials.push(childMaterials[i]);
                    }
                }
            }
            return materials;
        }
        /**
     * 重置材质球颜色
     */        rese_GameKey_tMaterialsColor(sprite) {
            this._res_GameKey_etMaterialColor(sprite);
            for (let i = 0; i < sprite._children.length; i++) {
                this.rese_GameKey_tMaterialsColor(sprite._children[i]);
            }
        }
        /**
     * 重置单个材质球
     * @param {*} sprite 
     */        _res_GameKey_etMaterialColor(sprite) {
            if (sprite instanceof Laya.MeshSprite3D || sprite instanceof Laya.SkinnedMeshSprite3D) {
                if (sprite._render.material.defualtAlbedoColor) sprite._render.material.albedoColor != void 0 ? sprite._render.material.albedoColor = sprite._render.material.defualtAlbedoColor.clone() : material.color = sprite._render.material.defualtAlbedoColor.clone();
                let materials = sprite._render.materials;
                if (materials) {
                    let i = materials.length;
                    let vMaterial;
                    while (--i > -1) {
                        vMaterial = materials[i];
                        vMaterial.defualtAlbedoColor && (vMaterial.albedoColor != void 0 ? vMaterial.albedoColor = vMaterial.defualtAlbedoColor.clone() : vMaterial.color = vMaterial.defualtAlbedoColor.clone());
                    }
                }
            }
        }
        /**
     * 重新展示(隐藏再展示)
     */        replay() {
            this.setActive(false);
            this.setActive(true);
        }
        /**
     * 创建轨迹
     */        creareOrbit() {
            var vOrbitUrl = Mode_GameKey_l3D._fullChs(Mode_GameKey_l3D.ORBIT_DATA[this._config.path]);
            // this.spritePrefab = Laya.Sprite3D.load(vOrbitUrl);
                        this.spritePrefab = Laya.Loader.getRes(vOrbitUrl);
            this.spritePrefab = Laya.Sprite3D.instantiate(this.spritePrefab);
            if (this.spritePrefab.loaded) {
                Laya.timer.once(1, this, this.onLo_GameKey_adedOrbit, null, false);
            } else {
                this.spritePrefab.once(Laya.Event.HIERARCHY_LOADED, this, this.onLo_GameKey_adedOrbit);
            }
        }
        /**
     * 当轨迹加载完成
     */        onLo_GameKey_adedOrbit() {
            //轨迹加载完
            if (this._isDestroyed) {
                return;
            }
            this._onLoadedModel(this.spritePrefab);
            this._onA_GameKey_llCompleted();
            var itemNum = 0;
            if (this._config.path === Mode_GameKey_l3D.ORBIT_TYPE.SURROUND) {
                itemNum = 3;
            } else if (this._config.path === Mode_GameKey_l3D.ORBIT_TYPE.UPROUND) {
                itemNum = 2;
            } else if (this._config.path === Mode_GameKey_l3D.ORBIT_TYPE.DRAGON) {
                itemNum = 1;
            }
            this.prepareOrbitItems(itemNum);
        }
        /**
     * 准备轨迹子对象
     * @param {子对象数量} itemNum 
     */        prepareOrbitItems(itemNum) {
            var url = Mode_GameKey_l3D._getUrlById(this._modelId);
            // this._orbitItemPrefab = Laya.Sprite3D.load(url);
                        this._orbitItemPrefab = Laya.Loader.getRes(url);
            this._orbitItemPrefab = Laya.Sprite3D.instantiate(this._orbitItemPrefab);
            if (this._orbitItemPrefab.loaded) {
                this.onLo_GameKey_adedOrbitItems(itemNum);
            } else {
                this._orbitItemPrefab.once(Laya.Event.HIERARCHY_LOADED, this, this.onLo_GameKey_adedOrbitItems, [ itemNum ]);
            }
        }
        /**
     * 当子对象全部加载完
     * @param {子对象数量} itemNum 
     */        onLo_GameKey_adedOrbitItems(itemNum) {
            //绑定轨迹子对象
            if (this._isDestroyed) {
                return;
            }
            if (itemNum > 0) {
                var orbitItemGo;
                while (--itemNum > -1) {
                    orbitItemGo = Laya.Sprite3D.instantiate(this._orbitItemPrefab);
                    this.bindBone(Mode_GameKey_l3D.ORBIT_POINT["POINT" + (itemNum + 1)], orbitItemGo);
                }
            }
        }
        /**
     * 释放
     */        dispose() {
            if (this._isDestroyed || !this.loaded) {
                this._waitDestroy = true;
                return;
            }
            this._isDestroyed = true;
            this.loaded = false;
            for (var i = 0; i < this._addModels.length; i++) {
                this._addModels[i].dispose();
            }
            this._orbitItemPrefab && this._orbitItemPrefab.destroy(true);
            this.spritePrefab && this.spritePrefab.destroy(true);
            this._addModels = [];
            if (!this._parent || !this._parent.destroyed) {
                this.sprite.destroy(true);
            }
            this.sprite = null;
            this._animator = null;
            this.avater = null;
            this._canimators = [];
            this._parent = null;
            this._addModels = [];
            this._bones = {};
            this._loadedHandler = null;
            this._active = true;
            this._waitDestroy = false;
            this._position = new Laya.Vector3(NaN, NaN, NaN);
            this._localPosition = new Laya.Vector3(0, 0, 0);
            this._localScale = new Laya.Vector3(1, 1, 1);
            this._localRotation = new Laya.Vector3(0, 0, 0);
            Laya.Pool.recover("ssModel", this);
            Mode_GameKey_l3D.modelUsedCnt[this._modelId]--;
            // if (!Model3D.modelUsedCnt[this._modelId]) {
            //     Model3D.destroyResArray(this._modelConfig.resource);
            //     Model3D.destroyResArray(this._modelConfig.zipResource);
            // }
            // this._modelConfig = null;
                }
        /**
     * 设置是否接受阴影
     * @param {*} value 
     */        
    setReceiveShadow(value) {
            this._set_GameKey_ReceiveShadow(this.sprite, value);
        }
        /**
     * 设置接收影子
     * @param {*} sprite 
     * @param {*} isReceive 
     */        
    _set_GameKey_ReceiveShadow(sprite, isReceive) {
            if (sprite instanceof Laya.MeshSprite3D) {
                sprite.meshRenderer.receiveShadow = isReceive;
                return;
            }
            for (let i = 0; i < sprite._children.length; i++) {
                this._set_GameKey_ReceiveShadow(sprite._children[i], isReceive);
            }
        }
        /**
     * 设置是否产生阴影
     * @param {*} value 是否阴影
     */        
    setCastShadow(value) {
            this._set_GameKey_CastShadow(this.sprite, value);
        }
        /**
     * 设置投影
     * @param {*} sprite 投影父级
     * @param {*} isCast 是否投影
     */        
    _set_GameKey_CastShadow(sprite, isCast) {
            if (sprite instanceof Laya.MeshSprite3D) {
                sprite.meshRenderer.castShadow = isCast;
            } else if (sprite instanceof Laya.SkinnedMeshSprite3D) {
                sprite.skinnedMeshRenderer.castShadow = isCast;
            }
            for (let i = 0; i < sprite._children.length; i++) {
                this._set_GameKey_CastShadow(sprite._children[i], isCast);
            }
        }
        /**
     * 是否加载中
     * @param {模型id清单} ids 
     */        static _isLoading(ids) {
            for (var i = 0; i < ids.length; i++) {
                if (Mode_GameKey_l3D.curLoad.indexOf(ids[i]) != -1) {
                    return true;
                }
            }
            return false;
        }
        /**
     * 预加载
     * @param {模型id清单} ids 
     * @param {加载完成回调} completeHandler 
     */        static prepareLoad(ids, completeHandler) {
            if (Mode_GameKey_l3D._isLoading(ids)) {
                var data = {
                    ids: ids,
                    completeHandler: completeHandler
                };
                Mode_GameKey_l3D.waitting.push(data);
                return;
            }
            if (Mode_GameKey_l3D.curLoadingNum >= Mode_GameKey_l3D.MAX_LOADING_NUM) {
                var data = {
                    ids: ids,
                    completeHandler: completeHandler
                };
                Mode_GameKey_l3D.waitting.push(data);
                return;
            }
            var urls = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var config = D.PrefabsPath[id];
                var chs = id;
                if (Number(id)) {
                    if (!config) continue;
                    Mode_GameKey_l3D.curLoad.push(id);
                    chs = config.chs;
                }
                // 预加载绑定特效
                var additionalId = config ? config.additionalId : 0;
                if (additionalId) {
                    var adds = additionalId.split("&");
                    for (var j = 0; j < adds.length; j++) {
                        var effectId = adds[j].split("#")[0];
                        !ids.contains(effectId) && ids.push(effectId);
                    }
                }
                urls.push(chs + chs.substr(chs.lastIndexOf("/")) + ".lh");
            }
            var addRefCnt = function(urls) {
                if (!urls) return;
                for (n = 0; n < urls.length; n++) {
                    var url = urls[n];
                    Mode_GameKey_l3D.loadedCount[url] = (Mode_GameKey_l3D.loadedCount[url] || 0) + 1;
                }
            };
            Mode_GameKey_l3D.curLoadingNum++;
            Laya.loader.create(urls, Laya.Handler.create(null, function() {
                Mode_GameKey_l3D.curLoadingNum--;
                // 记录已经加载过的ID
                                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    var config = D.PrefabsPath[id];
                    var chs = id;
                    if (Number(id)) {
                        if (!config) continue;
                        chs = config.chs;
                    }
                    Mode_GameKey_l3D.curLoad.remove$(id);
                }
                completeHandler.run();
                // 加载等待队列中的任务
                                var next;
                for (var i = Mode_GameKey_l3D.waitting.length - 1; i >= 0; i--) {
                    next = Mode_GameKey_l3D.waitting[i];
                    if (!Mode_GameKey_l3D._isLoading(next)) {
                        Mode_GameKey_l3D.waitting.removeAt$(i);
                        Mode_GameKey_l3D.prepareLoad(next.ids, next.completeHandler);
                        return;
                    }
                }
            }));
        }
        /**
     * 创建模型
     * @param {父级} parent 
     * @param {模型id} modelId 
     * @param {加载完成回调} loadedHandler 
     * @returns {Mode_GameKey_l3D} model
     */        static create(parent, modelId, loadedHandler) {
            var model = Laya.Pool.getItem("ssModel") || new Mode_GameKey_l3D();
            model.reset(parent, modelId, loadedHandler);
            Mode_GameKey_l3D._addModelUsedCnt(modelId);
            return model;
        }
        /**
     * 增加模型使用次数
     * @param {模型id} modelId 
     */        static _addModelUsedCnt(modelId) {
            Mode_GameKey_l3D.modelUsedCnt[modelId] = (Mode_GameKey_l3D.modelUsedCnt[modelId] || 0) + 1;
        }
        /**
     * 获取模型路径
     * @param {模型id} modelId 
     */        static _getUrlById(modelId) {
            var config = D.PrefabsPath[modelId];
            return Mode_GameKey_l3D._fullChs(config.chs);
        }
        /**
     * 获取模型绝对路径
     * @param {模型配表路径} chs 
     */        static _fullChs(chs) {
            var resName = chs.substring(chs.lastIndexOf("/") + 1);
            var url = chs + "/" + resName + ".lh";
            return url;
        }
        /**
     * 销毁资源
     * @param {资源} res 
     */        static destroyRes(res) {
            if (res) {
                if (res.destroy && !res.destroyed) {
                    res.destroy();
                } else if (res.dispose && !res.disposed) {
                    res.dispose();
                }
            }
        }
        /**
     * 销毁资源清单
     * @param {资源清单} resources 
     */        static destroyResArray(resources) {
            if (!resources) return;
            for (var i = 0; i < resources.length; i++) {
                var url = resources[i];
                if (GameSetting$.SWITCH.MODEL_LOG) console.log(":" + url);
                if (Mode_GameKey_l3D.loadedCount[url]) {
                    Mode_GameKey_l3D.loadedCount[url]--;
                    if (Mode_GameKey_l3D.loadedCount[url] == 0) {
                        Mode_GameKey_l3D.destroyRes(Laya.Loader.getRes(url));
                        Laya.Loader.clearRes(Laya.URL.formatURL(url), true);
                        //引擎有BUG，回收不干净，容错处理
                                        }
                } else {
                    // console.warn("销毁未加载资源:" + url);
                }
            }
        }
    }
    /** 轨迹绑点类型 */    Mode_GameKey_l3D.ORBIT_POINT = {};
    Mode_GameKey_l3D.ORBIT_POINT.POINT1 = "leftPoint";
    Mode_GameKey_l3D.ORBIT_POINT.POINT2 = "rightPoint";
    Mode_GameKey_l3D.ORBIT_POINT.POINT3 = "waistPoint";
    Mode_GameKey_l3D.ORBIT_POINT.POINT4 = "solePoint";
    /** 轨迹类型枚举(根据配表) */    Mode_GameKey_l3D.ORBIT_TYPE = {};
    Mode_GameKey_l3D.ORBIT_TYPE.SURROUND = 1;
    //圆形环绕(三个绑点)
        Mode_GameKey_l3D.ORBIT_TYPE.UPROUND = 2;
    //上升环绕(二个绑点)
        Mode_GameKey_l3D.ORBIT_TYPE.DRAGON = 3;
    // 龙
    /** 轨迹数据(key:类型，value:路径) */    Mode_GameKey_l3D.ORBIT_DATA = {};
    // Model3D.ORBIT_DATA[Model3D.ORBIT_TYPE.SURROUND] = "";
        Mode_GameKey_l3D.ORBIT_DATA[Mode_GameKey_l3D.ORBIT_TYPE.UPROUND] = "models/orbit/guiji_luoxuan01";
    Mode_GameKey_l3D.ORBIT_DATA[Mode_GameKey_l3D.ORBIT_TYPE.DRAGON] = "models/orbit/guiji_long01";
    /** 最大同时加载数量 */    Mode_GameKey_l3D.MAX_LOADING_NUM = 3;
    /** 当前加载数量 */    Mode_GameKey_l3D.curLoadingNum = 0;
    /** 等待预加载的队列 */    Mode_GameKey_l3D.waitting = [];
    /** 已加载的资源计数 */    Mode_GameKey_l3D.loadedCount = {};
    /** 在用资源计数 */    Mode_GameKey_l3D.modelUsedCnt = {};
    /** 加载中的资源清单 */    Mode_GameKey_l3D.curLoad = [];
    /**
   * 卷尺控制
   * created by cyz 20200219
   */    class RollControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 方块长度 */
            this.cubeLength$ = .2;
            /** 方块偏移旋转角度 */            this.cubeOffsetAngle$ = 2;
            /** 半径 */            this.r$ = .2;
            /** 中心点 */            this.centerPos$ = new Laya.Vector2(0, 0);
            /** 当前旋转角度 [0,360) */            this.angle$ = 0;
            /** 上次创建角度 [0,360) */            this.lastCreateAngle$ = 0;
            /** 当前角度差 */            this.deltaAngle$ = 0;
            /** 创建需要角度差 [0,360)  */            this.createNeedDeltaAngle$ = 0;
            /** 创建数量 */            this.createCnt$ = 0;
            /** 质量 */            this.massRate = 10;
            /** 模型控制清单 */            this.modelCtrs$ = [];
            /** 飞行速度 */            this.flyLinearV$ = new Laya.Vector3(0, 4, 25);
            /** 飞行角速度 */            this.flyAngleV$ = new Laya.Vector3(-5, 0, 0);
            /** 上次坐标 */            this.lastPos$ = new Laya.Vector3();
            /** 最小高度 */            this.minY$ = GameSetting$.RECOVER_Y$;
            /** 重力比例 */            this.gravityRate$ = 2;
        }
        /**
     * 创建场景
     * @param {*} scene 
     */        static create$(scene, modelId, width, height) {
            let roll = scene.addChild(new Laya.Sprite3D());
            roll.rollCtr = roll.addComponent(RollControl$);
            roll.rollCtr.refreshData$(modelId, width, height);
            return roll;
        }
        /**
     * 刷新数据
     * @param {*} modelId 
     * @param {*} width 
     * @param {*} height 
     */        refreshData$(modelId, width, height) {
            /** 模型id */
            this.modelId$ = modelId || 1;
            /** 宽度 */            this.width$ = width || 1;
            /** 最大方块高度 */            this.maxCubeH$ = height || 1.2;
        }
        onStart() {
            /** 移动矩阵引用 */
            this.transform$ = this.owner.transform;
        }
        /**
     * 滚动
     * @param {*} ds
     */        scroll$(ds, addCubePos) {
            this.roateAngle$(ds);
            this.checkCreateCube$();
            this.refreshParentPos$(addCubePos);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.DIGING, ds);
        }
        /**
     * 旋转角度
     */        roateAngle$(ds) {
            this.angle$ += ds / this.r$ * 180 / Math.PI;
            if (this.angle$ > 360) {
                this.angle$ %= 360;
            }
            let euler = this.transform$.localRotationEuler;
            euler.x = this.angle$ + 90;
            this.transform$.localRotationEuler = euler;
        }
        /**
     * 检查创建方块
     */        checkCreateCube$() {
            this.deltaAngle$ = this.angle$ - this.lastCreateAngle$;
            if (this.deltaAngle$ < 0) {
                this.deltaAngle$ += 360;
            }
            if (this.deltaAngle$ < this.createNeedDeltaAngle$) return;
            // if(this.createCnt$ > 50)return;
                        this.createCube$();
            this.refreshCreateCubeData$();
            this.checkCreateCube$();
        }
        /**
     * 刷新父级位置
     */        refreshParentPos$(addCubePos) {
            let pos = this.transform$.position;
            pos.x = addCubePos.x;
            pos.y = addCubePos.y + this.r$;
            pos.z = addCubePos.z;
            this.transform$.position = pos;
        }
        /**
     * 获取当前方块高度
     */        getCubeH$() {
            return Math.min(this.r$ * .1, this.maxCubeH$);
        }
        /**
     * 发射
     */        shoot$() {
            this.isShooting$ = true;
            //抬到原材料上面 防止碰撞
                        let pos = this.owner.transform.position;
            pos.y = this.r$ + .5;
            this.owner.transform.position = pos;
            //添加质量组件
                        this.rigidbody$ = this.owner.addComponent(Laya.Rigidbody3D);
            //质量根据当前半径来
                        this.rigidbody$.mass = this.r$ * this.massRate;
            //外面一圈生成碰撞器
                        let shape = new Laya.CylinderColliderShape(this.r$, this.width$, Laya.ColliderShape.SHAPEORIENTATION_UPX);
            this.rigidbody$.colliderShape = shape;
            this.rigidbody$.friction = 1;
            this.rigidbody$.angularDamping = .5;
            this.rigidbody$.linearDamping = .1;
            this.rigidbody$.restitution = 0;
            this.rigidbody$.overrideGravity = true;
            this.rigidbody$.gravity = new Laya.Vector3(0, -10 - this.r$ * this.gravityRate$, 0);
            //给一个向前上方的速度
                        this.refreshFlyV$();
            this.rigidbody$.linearVelocity = this.flyLinearV$.clone();
            this.rigidbody$.angularVelocity = this.flyAngleV$.clone();
        }
        /**
     * 刷新飞行速度
     */        refreshFlyV$() {
            this.flyLinearV$.y = 2 + this.r$ * 1.5;
            this.flyLinearV$.z = 24 + this.r$ * 5;
        }
        onUpdate() {
            this.checkDestroy$();
            this.refreshFollowCamera$();
            this.rebackLinearV$();
        }
        onLateUpdate() {
            this.recordLinearV$();
        }
        /**
     * 记录线性速度
     */        recordLinearV$() {
            if (!this.rigidbody$) return;
            if (this.lastLinearV$ == void 0) {
                this.lastLinearV$ = new Laya.Vector3();
                this.lastPos$ = new Laya.Vector3();
            }
            Util_GameKey_s.copyVector3(this.rigidbody$.linearVelocity, this.lastLinearV$);
            Util_GameKey_s.copyVector3(this.transform$.position, this.lastPos$);
        }
        /**
     * 检测销毁
     */        checkDestroy$() {
            if (this.transform$.position.y < this.minY$) {
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ROLL_DROP$, this.owner);
                this.owner.destroy();
            }
        }
        /**
     * 当跟破坏道具碰撞
     * @param {*} col 
     */        onCollisionEnter(col) {
            if (curScene.fight_state$ == 0) return;
                        if (col.other.isKiller$ && !col.other.isHited$) {
                /** 需要恢复速度 */
                this.needRebackLinearV$ = true;
            }
        }
        /**
     * 恢复碰撞前速度
     */        rebackLinearV$() {
            if (!this.needRebackLinearV$) return;
            this.needRebackLinearV$ = false;
            // if(v.z <= 0)debugger;
                        if (this.lastLinearV$ == void 0) {
                this.refreshFlyV$();
                this.lastLinearV$ = this.flyLinearV$.clone();
                this.lastPos$ = this.transform$.position.clone();
            }
            this.rigidbody$.linearVelocity = this.lastLinearV$.clone();
            // this.transform$.position = this.lastPos$.clone();
                }
        /**
     * 创建方块
     */        createCube$() {
            this.lastCreateAngle$ = this.lastCreateAngle$ + this.createNeedDeltaAngle$;
            if (this.lastCreateAngle$ > 360) {
                this.lastCreateAngle$ %= 360;
            }
            this.createCnt$++;
            let h = this.getCubeH$();
            let rad = Math.PI * this.lastCreateAngle$ / 180;
            this.startPos$ = new Laya.Vector2(this.centerPos$.x + Math.cos(rad) * this.r$, this.centerPos$.y + Math.sin(rad) * this.r$);
            //中心点
                        let cubeAngle = 90 + this.cubeOffsetAngle$ - this.lastCreateAngle$;
            let cubeRad = cubeAngle * Math.PI / 180;
            this.endPos$ = new Laya.Vector2(this.startPos$.x - this.cubeLength$ * Math.cos(cubeRad), this.startPos$.y + this.cubeLength$ * Math.sin(cubeRad));
            let cos = (this.endPos$.x - this.startPos$.x) / this.cubeLength$;
            let sin = (this.endPos$.y - this.startPos$.y) / this.cubeLength$;
            let centerPos = new Laya.Vector2((this.startPos$.x - sin * h - this.endPos$.x) * .5 + this.endPos$.x, (this.startPos$.y + cos * h - this.endPos$.y) * .5 + this.endPos$.y);
            let uv = this.createCnt$ * (this.modelId$ == GameSetting$.MODEL_ID.WOOD ? .25 : 1) * this.cubeLength$;
            let scaleZ = this.cubeLength$;
            let width = this.width$;
            let woodModel = Mode_GameKey_l3D.create(this.owner, this.modelId$, Laya.Handler.create(this, function(wood) {
                if (!this.owner || this.owner.destroyed) return;
                let material = this.getDrawMaterial$(wood.sprite.meshRenderer);
                material.tilingOffset = new Laya.Vector4(width, scaleZ, 0, uv);
                wood.setLocalPosition(0, centerPos.y, centerPos.x);
                wood.setLocalRotation(0, cubeAngle, 0);
                wood.setLocalScale(width, h, scaleZ);
            }));
            this.modelCtrs$.push(woodModel);
        }
        /**
     * 获取材质球
     * @param {*} meshRenderer 
     */        getDrawMaterial$(meshRenderer) {
            if (meshRenderer.materials) {
                let materials = meshRenderer.materials;
                let i = materials.length;
                let material;
                while (--i > -1) {
                    material = materials[i];
                    if (material.name == "lambert1(Instance)") {
                        //找到材质球
                        return material;
                    }
                }
            } else {
                return meshRenderer.material;
            }
        }
        /**
     * 刷新创建方块数据
     */        refreshCreateCubeData$() {
            //左点连线圆心与X夹角
            let lastEndAngle = Math.atan2(this.endPos$.y - this.centerPos$.y, this.endPos$.x - this.centerPos$.x) * 180 / Math.PI;
            this.createNeedDeltaAngle$ = lastEndAngle - this.lastCreateAngle$;
            if (Math.abs(this.createNeedDeltaAngle$) > 360) {
                this.createNeedDeltaAngle$ %= 360;
            }
            if (this.createNeedDeltaAngle$ < 0) {
                this.createNeedDeltaAngle$ += 360;
            }
            this.r$ = Math.sqrt(Math.pow(this.endPos$.x - this.centerPos$.x, 2) + Math.pow(this.endPos$.y - this.centerPos$.y, 2));
        }
        /**
     * 增加向上移动速度
     * @param {*} addSpeed 
     */        addUpSpeed$(addSpeed) {
            this.lastLinearV$ = this.rigidbody$.linearVelocity;
            this.lastLinearV$.y += addSpeed;
            this.rigidbody$.linearVelocity = this.lastLinearV$;
        }
        /**
     * 创建跟随摄像机
     */        createFollowCamera$() {
            this.followCamera$ = this.owner.parent.addChild(new Laya.Camera(0, .1, curScene.cameraArea$ + 10));
            this.followCamera$.transform.position = curScene.camera$.transform.position.clone();
            this.followOffsetZ$ = this.followCamera$.transform.position.z - this.owner.transform.position.z;
            this.followOffsetX$ = this.followCamera$.transform.position.x - this.owner.transform.position.x;
            let euler = this.followCamera$.transform.rotationEuler;
            euler.z = 0;
            euler.y = -163;
            euler.x = -20.5;
            this.followCamera$.transform.rotationEuler = euler;
            let color = this.followCamera$.clearColor;
            color.x = 1;
            color.y = .913;
            color.z = .678;
            this.followCamera$.clearColor = color;
        }
        /**
     * 停止摄像机跟随
     */        stopFollowCamera$() {
            this.followCameraStop$ = true;
        }
        /**
     * 刷新跟随摄像机
     */        refreshFollowCamera$() {
            if (!this.owner) return;
            if (!this.followCamera$) return;
            if (this.followCameraStop$) return;
            let cameraPos = this.followCamera$.transform.position;
            cameraPos.x = this.owner.transform.position.x + this.followOffsetX$;
            cameraPos.z = this.owner.transform.position.z + this.followOffsetZ$;
            this.followCamera$.transform.position = cameraPos;
        }
        /**
     * 销毁跟随摄像机
     */        destroyFollowCamera$() {
            this.followCamera$ && this.followCamera$.destroy();
            this.followCamera$ = undefined;
        }
        /**
     * 释放模型清单
     */        disposeModels$() {
            if (!this.modelCtrs$) return;
            let i = this.modelCtrs$.length;
            while (--i > -1) {
                this.modelCtrs$[i].dispose();
            }
        }
        onDestroy() {
            Laya.timer.clearAll(this);
            this.disposeModels$();
            // this.destroyFollowCamera$();
                }
    }
    /**
   * 碰撞控制
   * 作者：陈雅智
   * 日期：2019/11/28
   */    class ColliderControl$ extends Laya.Script3D {
        constructor() {
            super();
            /** 回调 */            this.callback$ = undefined;
            /** 属性 */            this.prop$ = undefined;
        }
        /**
     * 遍历子对象添加碰撞管理
     * @param {function} callback 回调 {type, col}
     * @param {object} prop 属性
     * @param {Laya.Sprite3D} sp 3D对象 
     */        static create(callback, prop, sp) {
            let isAdd = false;
            let rigidbody = sp.getComponent(Laya.Rigidbody3D);
            if (rigidbody) {
                isAdd = true;
            } else {
                let collider = sp.getComponent(Laya.PhysicsCollider);
                if (collider) {
                    isAdd = true;
                }
            }
            let children = sp._children;
            let i = children.length;
            let cols = [];
            let vChildCols;
            while (--i > -1) {
                vChildCols = ColliderControl$.create(callback, prop, children[i]);
                if (vChildCols && vChildCols.length > 0) {
                    cols.pushAll$(vChildCols);
                }
            }
            let colCtr = undefined;
            if (isAdd) {
                colCtr = sp.addComponent(ColliderControl$);
                cols.push(colCtr);
                colCtr.setData(callback, prop, cols);
            }
            return cols;
        }
        /**
     * 设置数据
     * @param {function} callback 回调 (type, col)
     * @param {object} prop 属性
     * @param {array} childCols 子碰撞器清单，包含自身在最后一个
     */        setData(callback, prop, childCols) {
            this.callback$ = callback;
            this.prop$ = prop;
            this.childCols = childCols;
        }
        onStart() {
            this.refreshPropValue$();
        }
        /**
     * 刷新属性
     * @param {*} vProp 
     */        refreshProp$(vProp) {
            this.prop$ = vProp;
            this.refreshPropValue$();
        }
        /**
     * 刷新属性值
     */        refreshPropValue$() {
            if (!this.prop$) return;
            let target = undefined;
            let rigidbody = this.owner.getComponent(Laya.Rigidbody3D);
            if (rigidbody) {
                target = rigidbody;
            } else {
                let collider = this.owner.getComponent(Laya.PhysicsCollider);
                if (collider) {
                    target = collider;
                }
            }
            if (!target) return;
            for (let key in this.prop$) {
                target[key] = this.prop$[key];
            }
        }
        /**
     * 当碰撞
     * @param {*} col 碰撞信息
     */        onCollisionEnter(col) {
            this.callback$ && this.callback$(SSEV_GameKey_ENT.COLLIDER_ENTER, col);
        }
        /**
     * 当碰撞中
     * @param {*} col 碰撞信息
     */        onCollisionStay(col) {
            this.callback$ && this.callback$(SSEV_GameKey_ENT.COLLIDER_STAY, col);
        }
        /**
     * 当碰撞结束
     * @param {*} col 碰撞信息
     */        onCollisionExit(col) {
            this.callback$ && this.callback$(SSEV_GameKey_ENT.COLLIDER_EXIT, col);
        }
        /**
     * 触发器刚触发
     * @param {*} col 
     */        onTriggerEnter(col) {
            this.callback$ && this.callback$(SSEV_GameKey_ENT.TRIGGER_ENTER, col);
        }
        /**
     * 触发器持续触发
     * @param {*} col 
     */        onTriggerStay(col) {
            this.callback$ && this.callback$(SSEV_GameKey_ENT.TRIGGER_STAY, col);
        }
        /**
     * 触发器触发停止
     * @param {*} col 
     */        onTriggerExit(col) {
            this.callback$ && this.callback$(SSEV_GameKey_ENT.TRIGGER_EXIT, col);
        }
    }
    /**
   * 原料控制
   * created by cyz 20200219
   */    class RawControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 是否被铲中 */
            this.isHiting$ = false;
            /** 是否挖掘中 */            this.isDiging$ = false;
            /** 模型控制清单 */            this.models$ = [];
            /** 上次滚动Z坐标 */            this.lastScrollPosZ$ = undefined;
            /** 是否激活碰撞 */            this.isActiveCol$ = false;
            /** 初始挖的位置Z */            this.startDigerZ$ = 0;
        }
        static create$(parent, pos, angle, scale, itemCnt, rollParent, diger, fillModelId, shellModelId, itemLength, fillCubeH, fillCubeW) {
            let row = parent.addChild(new Laya.Sprite3D());
            row.transform.localPosition = pos.clone();
            row.transform.localRotationEuler = angle.clone();
            row.transform.localScale = scale.clone();
            let rowCtr = row.addComponent(RawControl$);
            rowCtr.refreshData$(itemCnt, rollParent, diger, fillModelId, shellModelId, itemLength, fillCubeH, fillCubeW);
            return row;
        }
        /**
     * 刷新数据
     */        refreshData$(itemCnt, rollParent, diger, fillModelId, shellModelId, itemLength, fillCubeH, fillCubeW) {
            /** 填充模型id */
            this.fillModelId$ = fillModelId || 1;
            /** 壳子模型id */            this.shellModelId$ = shellModelId || 2;
            /** 物品数量 */            this.itemCnt$ = itemCnt || 1;
            /** 卷尺父级 */            this.rollParent$ = rollParent;
            /** 铲子引用 */            this.diger$ = diger;
            /** 单个原料长度 */            this.itemLength$ = itemLength || 12;
            /** 总原料长度 */            this.rawLength$ = this.itemCnt$ * this.itemLength$;
            /** 填充方块高度 */            this.fillCubeH$ = fillCubeH || 1.2;
            /** 填充方块长度 */            this.fillCubeL$ = this.itemCnt$ * this.itemLength$;
            /** 填充方块宽度 */            this.fillCubeW$ = fillCubeW || 1;
        }
        onStart() {
            /** 移动矩阵引用 */
            this.transform$ = this.owner.transform;
            this.createRowModels$();
            this.createFillCubes$();
            this.monitorEvents$();
        }
        /**
     * 监听事件
     */        monitorEvents$() {
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.DIG_START, this, this.onStartDig$);
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.DIG_END, this, this.onEndDig$);
        }
        /**
     * 取消事件
     */        cancleEvents$() {
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.DIG_START, this, this.onStartDig$);
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.DIG_END, this, this.onEndDig$);
        }
        /**
     * 创建原材料模型清单
     */        createRowModels$() {
            let i = this.itemCnt$;
            let rowModel;
            while (--i > -1) {
                rowModel = Mode_GameKey_l3D.create(this.owner, this.shellModelId$, Laya.Handler.create(this, this.onRowModelLoaded$));
                rowModel.setLocalPosition(0, 0, i * this.itemLength$);
                this.models$.push(rowModel);
            }
        }
        /**
     * 当原料模型加载完成
     * @param {*} modelCtr 
     */        onRowModelLoaded$(modelCtr) {
            if (this.owner.destroyed) return;
            if (!this.colliders$) this.colliders$ = [];
            let colliders$ = ColliderControl$.create(null, {
                enabled: this.isActiveCol$,
                friction: .5,
                restitution: 0
            }, modelCtr.sprite);
            if (!colliders$ || colliders$.length == 0) return;
            let i = colliders$.length;
            while (--i > -1) {
                this.colliders$.push(colliders$[i]);
            }
        }
        /**
     * 创建填充方块
     */        createFillCubes$() {
            this.startCube$ = Mode_GameKey_l3D.create(this.owner, this.fillModelId$, Laya.Handler.create(this, this.initFillCube$));
            this.centerCube$ = Mode_GameKey_l3D.create(this.owner, this.fillModelId$, Laya.Handler.create(this, this.initFillCube$));
            this.endCube$ = Mode_GameKey_l3D.create(this.owner, this.fillModelId$, Laya.Handler.create(this, this.initFillCube$));
        }
        /**
     * 更新
     */        onUpdate() {
            this.checkIsHit$();
            this.checkActiveCol$();
        }
        /**
     * 检查激活碰撞
     */        checkActiveCol$() {
            if (!this.isActiveCol$ && curScene.isActiveCol$(this.owner.transform.position.z)) {
                this.isActiveCol$ = true;
                if (!this.colliders$) return;
                let i = this.colliders$.length;
                while (--i > -1) {
                    this.colliders$[i].refreshProp$({
                        enabled: true
                    });
                }
            }
        }
        /**
     * 当开始铲
     */        onStartDig$(e) {
            this.isDiging$ = true;
            this.digX$ = e.data;
            this.startDigerZ$ = this.diger$.transform.position.z;
        }
        /**
     * 当结束铲
     */        onEndDig$(e) {
            if (this.isDiging$) this.hitOver$();
            this.isDiging$ = false;
        }
        /** 
     * 检测是否被铲
     */        checkIsHit$() {
            if (!this.isDiging$) return;
            if (this.digX$ != this.transform$.position.x) return;
            if (this.transform$.position.z + this.rawLength$ < this.diger$.transform.position.z) {
                //被铲结束
                if (this.isHiting$) {
                    this.hitOver$();
                }
            } else if (this.transform$.position.z <= this.diger$.transform.position.z) {
                //开始被铲
                if (!this.isHiting$) {
                    this.hitStart$();
                } else {
                    this.refreshHit$();
                }
            }
        }
        /**
     * 获取是否铲中状态
     */        getIsHiting$() {
            return this.isHiting$;
        }
        /**
     * 开始铲
     */        hitStart$() {
            this.isHiting$ = true;
            this.roll$ = RollControl$.create$(this.rollParent$, this.fillModelId$, this.fillCubeW$, this.fillCubeH$);
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.BE_DIG, this);
        }
        /**
     * 刷新被铲表现
     */        refreshHit$() {
            if (!this.isHiting$ || !this.roll$) return;
            let digerZ = this.diger$.transform.position.z;
            if (this.lastScrollPosZ$ == void 0) this.lastScrollPosZ$ = digerZ;
            this.roll$.rollCtr.scroll$(digerZ - this.lastScrollPosZ$, this.diger$.transform.position);
            this.lastScrollPosZ$ = digerZ;
            // if(this.lastScrollPosZ$ == void 0)this.lastScrollPosZ$ = this.transform$.position.z;
            // this.roll$.rollCtr.scroll$(this.lastScrollPosZ$ - this.transform$.position.z,  this.diger$.transform.position);
            // this.lastScrollPosZ$ = this.transform$.position.z;
                        this.refreshFillCube$();
        }
        /**
     * 初始化填充方块表现
     */        initFillCube$() {
            if (!this.startCube$.loaded) return;
            if (!this.endCube$.loaded) return;
            if (!this.centerCube$.loaded) return;
            this.startCube$.setActive(false);
            this.centerCube$.setActive(false);
            this.endCube$.setLocalPosition(0, -this.fillCubeH$ * .5, this.fillCubeL$ * .5);
            this.endCube$.setLocalScale(this.fillCubeW$, this.fillCubeH$, this.fillCubeL$);
            if (this.fillModelId$ == GameSetting$.MODEL_ID.FINISH_RAW) {
                this.endCube$.setLocalRotation(0, 0, 180);
                this.startCube$.setLocalRotation(0, 0, 180);
            }
            /** 开始方块材质球 */            this.startCubeMaterial$ = this.getDrawMaterial$(this.startCube$.sprite.meshRenderer);
            /** 中间方块材质球 */            this.centerCubeMaterial$ = this.getDrawMaterial$(this.centerCube$.sprite.meshRenderer);
            /** 结束方块材质球 */            this.endCubeMaterial$ = this.getDrawMaterial$(this.endCube$.sprite.meshRenderer);
            this.endCubeMaterial$.tilingOffset = new Laya.Vector4(this.fillCubeW$, this.fillCubeL$, 0, -.5 * (this.fillCubeL$ % 2));
        }
        /**
     * 获取材质球
     * @param {*} meshRenderer 
     */        getDrawMaterial$(meshRenderer) {
            if (meshRenderer.materials) {
                let materials = meshRenderer.materials;
                let i = materials.length;
                let material;
                while (--i > -1) {
                    material = materials[i];
                    if (material.name == "lambert1(Instance)") {
                        //找到材质球
                        return material;
                    }
                }
            } else {
                return meshRenderer.material;
            }
        }
        /**
     * 刷新填充的方块
     */        refreshFillCube$() {
            if (!this.startCube$.loaded || !this.endCube$.loaded || !this.centerCube$.loaded) return;
            if (this.transform$.position.z > this.diger$.transform.position.z) {
                //没有被铲范围，开始方块隐藏
                this.initFillCube$();
            } else {
                // //方块底部靠齐
                let rollH = this.getRollCubeH$();
                let rollL = this.diger$.transform.position.z - this.transform$.position.z;
                /** 初始方块处理 */                let startL = this.startDigerZ$ - this.transform$.position.z;
                if (startL <= .1) {
                    this.startCube$.setActive(false);
                } else {
                    this.startCube$.setActive(true);
                    this.startCube$.setLocalScale(this.fillCubeW$, this.fillCubeH$, startL);
                    this.startCube$.setLocalPosition(0, -this.fillCubeH$ * .5, startL * .5);
                    this.startCubeMaterial$.tilingOffset = new Laya.Vector4(this.fillCubeW$, startL, 0, -.5 * (startL % 2));
                }
                /** 中间方块处理 */                this.centerCube$.setActive(true);
                this.centerCube$.setLocalScale(this.fillCubeW$, this.fillCubeH$ - rollH, rollL);
                this.centerCube$.setLocalPosition(0, -(this.fillCubeH$ + rollH) * .5, rollL * .5);
                this.centerCubeMaterial$.tilingOffset = new Laya.Vector4(this.fillCubeW$, rollL, 0, -.5 * (rollL % 2));
                /** 尾部方块处理 */                this.endCube$.setLocalPosition(0, -this.fillCubeH$ * .5, (this.fillCubeL$ + rollL) * .5);
                this.endCube$.setLocalScale(this.fillCubeW$, this.fillCubeH$, this.fillCubeL$ - rollL);
                this.endCubeMaterial$.tilingOffset = new Laya.Vector4(this.fillCubeW$, this.fillCubeL$ - rollL, 0, 1 - .25 * (this.fillCubeL$ - rollL));
            }
        }
        /**
     * 获取卷尺底下方块高度
     */        getRollCubeH$() {
            return this.roll$.rollCtr.getCubeH$();
        }
        /**
     * 获取深度Y值
     */        getDeepY$() {
            return 0 - this.roll$.rollCtr.getCubeH$();
        }
        /**
     * 铲表现结束
     */        hitOver$() {
            if (!this.isHiting$ || !this.roll$) return;
            this.isHiting$ = false;
            this.roll$.rollCtr.shoot$();
            // this.roll$ = undefined;
                }
        /**
     * 释放模型清单
     */        disposeModels$() {
            if (!this.models$) return;
            let i = this.models$.length;
            while (--i > -1) {
                this.models$[i].dispose();
            }
        }
        onDestroy() {
            this.cancleEvents$();
            this.disposeModels$();
        }
    }
    /**
   * 时间管理
   * 作者：陈雅智
   * 日期：2019/10/12
   */    
  class TimeManager$ {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
            /** 帧时间差 s */            this._deltaTime$ = 0;
            /** 最大帧间隔时间 ms */            this._maxDeltaTime$ = Laya.Scene3D.physicsSettings.fixedTimeStep * 1e3;
        }
        /**
     * 获取单例
     * @return {TimeManager$}
     */        static getInstance$() {
            if (TimeManager$.instance == null) {
                TimeManager$.instance = new TimeManager$();
            }
            return TimeManager$.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 获取帧率时间差 s
     */        get deltaTime$() {
            // if(this._lastSetDeltaFrame$ != Laya.physicsTimer.currFrame){
            this._deltaTime$ = Laya.physicsTimer.delta;
            //Math.min(Laya.timer.delta, this._maxDeltaTime$);
            //     this._lastSetDeltaFrame$ = Laya.physicsTimer.currFrame;
            // }
                        return this._deltaTime$;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            this.init_GameKey_Complete();
        }
        /**
     * 初始化完成
     */        init_GameKey_Complete() {
            this.inited = true;
            this.initedCB && this.initedCB();
        }
    }
    /** 私有单例 */    TimeManager$.instance = undefined;
    /**
   * 铲子控制
   * created by cyz 20200219
   */    class DigerControl$ extends Laya.Script3D {
        constructor() {
            super();
        }
        /**
     * 创建铲子
     * @param {*} scene 
     */        static create$(scene) {
            let diger = scene.addChild(new Laya.Sprite3D());
            //控制节点
                        diger.addComponent(DigerControl$);
            return diger;
        }
        onStart() {
            this.initData$();
            this.createModel$();
            this.initPos$();
            this.monitorEvents$();
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 模型id */
            this.modelId$ = 3;
            /** 木屑id */            this.dustId$ = 10;
            /** 手指是否按下 */            this.inputMouseDown$ = false;
            /** 挖掘状态 0无,1预备挖掘，2挖掘中，3结束挖掘 */            this.digState$ = 0;
            /** 移动状态 0无,1移动中 */            this.moveState$ = 0;
            /** 移动矩阵引用 */            this.transform$ = this.owner.transform;
            /** 预备挖延迟时长 ms */            this.preDigDelayDefaulT$ = 100;
            /** 预备挖掘倒计时 ms */            this.preDigCountT$ = 0;
            /** 预备挖掘移动速度 m/ms */            this.preDigMoveSpeed$ = .005;
            /** 收尾挖掘移动速度 m/ms */            this.endDigMoveSpeed$ = .01;
            /** X轴移动速度 m/ms */            this.moveXSpeed$ = .03;
            /** x移动间隔 */            this.xSpacing$ = GameSetting$.LAY_X_SPACING;
            /** 铲子默认位置 */            this.digerStartPos$ = new Laya.Vector3(0, 1.2, 0);
            /** 目标移动位置 */            this.targetPos$ = this.digerStartPos$.clone();
            /** 上次鼠标坐标X */            this.lastMouseX$ = undefined;
            /** 改变方向最小X差值 */            this.moveMouseMinDeltaX = Laya.stage.width * .2;
            /** 旋转率 */            this.rotateRate$ = 50;
            /** 震动间隔 ms */            this.scrollShakeSpacing$ = 500;
            /** 震动倒计时 ms */            this.scrollShakeCountT$ = 0;
            /** 复活保护总时长 ms */            this.reliveProtectAllT$ = 3e3;
            /** 复活透明度动画间隔 ms */            this.reliveProtectAlphaAnimSpacing$ = 800;
            /** 复活透明度动画最小透明值 */            this.reliveProtectAlphaAnimMinAlpha$ = .8;
            /** 复活透明度动画最小透明值 */            this.reliveProtectAlphaAnimMaxAlpha$ = 1.5;
        }
        /**
     * 初始化位置
     */        initPos$() {
            let pos = this.transform$.position;
            pos.x = this.digerStartPos$.x;
            pos.y = this.digerStartPos$.y;
            pos.z = this.digerStartPos$.z;
            this.transform$.position = pos;
            let euler = this.transform$.rotationEuler;
            euler.x = 10;
            this.transform$.rotationEuler = euler;
        }
        /**
     * 创建模型
     */        createModel$() {
            /** 模型控制 */
            this.modelCtr$ = Mode_GameKey_l3D.create(this.owner, this.modelId$, Laya.Handler.create(this, this.onModelLoaded$));
            this.woodDustLeft$ = Mode_GameKey_l3D.create(this.owner, this.dustId$, Laya.Handler.create(this, this.onWoodDustLoaded$));
            this.woodDustLeft$.setLocalRotation(100, 0, 0);
            this.woodDustRight$ = Mode_GameKey_l3D.create(this.owner, this.dustId$, Laya.Handler.create(this, this.onWoodDustLoaded$));
            this.woodDustRight$.setLocalRotation(-100, 0, 0);
        }
        /**
     * 当模型创建好
     * @param {*} modelCtr 
     */        onModelLoaded$(modelCtr) {
            if (this.owner.destroyed) return;
            // //添加刚体
            // let rigidbody = this.modelCtr$.sprite.getComponent(Laya.Rigidbody3D);
            // rigidbody.mass = 0;
            // rigidbody.overrideGravity = true;
            // rigidbody.gravity = new Laya.Vector3();
            // rigidbody.isTrigger = true;
            // rigidbody.isKinematic = true;
            // rigidbody.colliderShape = new Laya.CompoundColliderShape();
                        ColliderControl$.create(this.onChildCollider$.bind(this), {
                isDiger: true
            }, modelCtr.sprite);
            this.materials$ = this.modelCtr$.getMaterials$();
            /** 默认透明度 */            this.defaultalbedoIntensity$ = this.materials$[0].albedoIntensity;
            // rigidbody.isKinematic = false;
            // Mode_GameKey_lUtils.refreshRigidbodysColliderShape(this.owner);
                }
        onWoodDustLoaded$(effect) {
            effect.pauseEmission();
        }
        /**
     * 监听事件
     */        monitorEvents$() {
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.INPUT_MOUSE_DOWN, this, this.onInputMouseDown$);
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.INPUT_MOUSE_MOVE, this, this.onInputMouseMove$);
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.INPUT_MOUSE_UP, this, this.onInputMouseUp$);
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.BE_DIG, this, this.onDigRow$);
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.RELIVE$, this, this.onRelive$);
        }
        /**
     * 取消事件
     */        cancleEvents$() {
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.INPUT_MOUSE_DOWN, this, this.onInputMouseDown$);
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.INPUT_MOUSE_MOVE, this, this.onInputMouseMove$);
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.INPUT_MOUSE_UP, this, this.onInputMouseUp$);
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.BE_DIG, this, this.onDigRow$);
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.RELIVE$, this, this.onRelive$);
        }
        /**
     * 发生碰撞
     * @param {*} col 
     */        onChildCollider$(type, col) {
            if (this.isReliveProtect$) return;
            //复活保护中
                        if (curScene.fight_state$ == 0) return;
            if (curScene.fight_state$ == 2) return;
            if (type == SSEV_GameKey_ENT.TRIGGER_ENTER) {
                if (col.isKiller$ && !col.isHited$) {
                    //是伤害物体且状态未被摧毁
                    /** 是否死亡 */
                    this.isDead$ = true;
                    Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.FIGHT_FAIL);
                }
            }
        }
        /**
     * 当输入区域按下
     */        onInputMouseDown$() {
            if (curScene.fight_state$ != 1 && curScene.fight_state$ != 5 && curScene.fight_state$ != 4) {
                //不是战斗中
                return;
            }
            if (this.inputMouseDown$) return;
            this.inputMouseDown$ = true;
            this.onStartDig$();
            this.lastMouseX$ = Laya.stage.mouseX;
        }
        /**
     * 当输入区域移动
     */        onInputMouseMove$() {
            if (!this.inputMouseDown$) return;
            this.onStartMove$();
        }
        /**
     * 当输入区域抬起
     */        onInputMouseUp$() {
            if (!this.inputMouseDown$) return;
            this.inputMouseDown$ = false;
            this.onStopDig$();
        }
        /**
     * 当挖到原材料
     */        onDigRow$(e) {
            this.scrollShakeCountT$ = 0;
            /** 挖到的原材料 */            this.digRowCtr$ = e.data;
            if (this.digRowCtr$.fillModelId$ != GameSetting$.MODEL_ID.FINISH_RAW) {
                this.woodDustLeft$.resumeEmission();
                this.woodDustRight$.resumeEmission();
            }
        }
        /**
     * 开始挖掘
     */        onStartDig$() {
            this.digState$ = 1;
            this.preDigCountT$ = this.preDigDelayDefaulT$;
        }
        /**
     * 停止挖掘
     */        onStopDig$() {
            this.woodDustLeft$.pauseEmission();
            this.woodDustRight$.pauseEmission();
            if (this.digState$ != 1 && this.digState$ != 2) return;
            this.digState$ = 3;
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.DIG_END, this.digRowCtr$);
            this.digRowCtr$ = undefined;
            //取消原材料引用
                }
        /**
     * 开始移动
     */        onStartMove$() {
            if (this.moveState$ === 1) return;
            //移动中
                        let deltaX = Laya.stage.mouseX - this.lastMouseX$;
            if (Math.abs(deltaX) < this.moveMouseMinDeltaX) return;
            if (deltaX > 0 && this.targetPos$.x === -this.xSpacing$) return;
            //最右边无法向右移动
                        if (deltaX < 0 && this.targetPos$.x === this.xSpacing$) return;
            //最左边无法向左移动
                        this.lastMouseX$ = Laya.stage.mouseX;
            this.moveState$ = 1;
            this.onStopDig$();
            this.targetPos$.x += deltaX > 0 ? -this.xSpacing$ : this.xSpacing$;
        }
        /**
     * 当复活
     */        onRelive$() {
            this.isDead$ = false;
            /** 是否复活保护中 */            this.isReliveProtect$ = true;
            /** 复活已保护时长 ms*/            this.reliveProtectT$ = 0;
        }
        onUpdate() {
            if (this.isDead$) return;
            this.refreshAnim$();
            this.refreshReliveProtectCountT$();
        }
        /**
     * 刷新动画
     */        refreshAnim$() {
            if (this.digState$ === 1) {
                this.refreshDigPreAnim$();
            } else if (this.digState$ === 2) {
                this.refreshDigingAnim$();
            } else if (this.digState$ === 3) {
                this.refreshDigEndAnim$();
            }
            // this.refreshMoveAnim$();
                }
        /**
     * 刷新复活保护倒计时
     */        refreshReliveProtectCountT$() {
            if (!this.isReliveProtect$) return;
            this.reliveProtectT$ += TimeManager$.getInstance$().deltaTime$;
            if (this.reliveProtectT$ >= this.reliveProtectAllT$) {
                //倒计时结束
                this.isReliveProtect$ = false;
                this.setModelAlpha$(this.defaultalbedoIntensity$);
            } else {
                let changeAlpha = (this.reliveProtectAlphaAnimMaxAlpha$ - this.reliveProtectAlphaAnimMinAlpha$) * (this.reliveProtectT$ % this.reliveProtectAlphaAnimSpacing$) / this.reliveProtectAlphaAnimSpacing$;
                this.setModelAlpha$(Math.floor(this.reliveProtectT$ / this.reliveProtectAlphaAnimSpacing$) % 2 == 0 ? this.reliveProtectAlphaAnimMinAlpha$ + changeAlpha : this.reliveProtectAlphaAnimMaxAlpha$ - changeAlpha);
            }
        }
        /**
     * 设置模型alpha值
     * @param {*} alpha 
     */        setModelAlpha$(alpha) {
            if (!this.modelCtr$.loaded) return;
            // Mode_GameKey_l3D.chan_GameKey_geMaterialColor(this.modelCtr$.sprite, alpha, alpha, alpha, 1);
                        let i = this.materials$.length;
            while (--i > -1) {
                this.materials$[i].albedoIntensity = alpha;
            }
        }
        /**
     * 刷新挖掘准备动画
     */        refreshDigPreAnim$() {
            if (this.preDigCountT$ > 0) {
                //倒计时中
                this.preDigCountT$ -= TimeManager$.getInstance$().deltaTime$;
            }
            if (this.preDigCountT$ > 0) return;
            //下降到原料高度，暂时为0
                        let pos = this.transform$.position;
            if (pos.y > 0) {
                pos.y -= TimeManager$.getInstance$().deltaTime$ * this.preDigMoveSpeed$;
            }
            if (pos.y <= 0) {
                this.onDigPreAnimComplete$();
            } else {
                this.transform$.position = pos;
            }
        }
        /**
     * 刷新挖掘动画
     */        refreshDigingAnim$() {
            if (!this.digRowCtr$) return;
            //没有原材料
                        if (!this.digRowCtr$.getIsHiting$()) {
                this.onStopDig$();
                return;
                //没有挖掘中
                        }
            //下降到原料被挖深度
                        let pos = this.transform$.position;
            pos.y = this.digRowCtr$.getDeepY$();
            this.transform$.position = pos;
            let euler = this.transform$.rotationEuler;
            euler.x = Math.min(10 - pos.y * this.rotateRate$, 15);
            this.transform$.rotationEuler = euler;
            this.refreshPhoneShake$();
        }
        /**
     * 刷新手机震动
     */        
    refreshPhoneShake$() {
            if (curScene.fight_state$ == 0) return;
            if (curScene.fight_state$ == 2) return;
            this.scrollShakeCountT$ -= TimeManager$.getInstance$().deltaTime$;
            if (this.scrollShakeCountT$ <= 0) {
                this.scrollShakeCountT$ = this.scrollShakeSpacing$;
            }
        }
        /**
     * 刷新复活动画
     */        refreshReliveAnim$() {}
        /**
     * 刷新挖掘收尾动画
     */        refreshDigEndAnim$() {
            //下降到原料高度，暂时为0
            let pos = this.transform$.position;
            if (pos.y < this.digerStartPos$.y) {
                pos.y += TimeManager$.getInstance$().deltaTime$ * this.endDigMoveSpeed$;
            }
            if (pos.y >= this.digerStartPos$.y) {
                this.onDigEndAnimComplete$();
            } else {
                this.transform$.position = pos;
                let euler = this.transform$.rotationEuler;
                if (pos.y < 0) {
                    euler.x = Math.max(10 - pos.y * this.rotateRate$, 15);
                } else {
                    euler.x = 10;
                }
                this.transform$.rotationEuler = euler;
            }
        }
        /**
     * 刷新移动动画
     */        refreshMoveAnim$() {
            if (!this.moveState$) return;
            let xDis = TimeManager$.getInstance$().deltaTime$ * this.moveXSpeed$;
            let pos = this.transform$.position;
            let deltaX = this.targetPos$.x - pos.x;
            if (deltaX > 0) {
                pos.x += xDis;
                if (deltaX - xDis <= 0) {
                    pos.x = this.targetPos$.x;
                    this.moveState$ = 0;
                }
            } else if (deltaX < 0) {
                pos.x -= xDis;
                if (deltaX + xDis >= 0) {
                    pos.x = this.targetPos$.x;
                    this.moveState$ = 0;
                }
            } else {
                pos.x = this.targetPos$.x;
                this.moveState$ = 0;
            }
        }
        /**
     * 当挖掘预备动画结束
     */        onDigPreAnimComplete$() {
            let pos = this.transform$.position;
            pos.y = 0;
            this.transform$.position = pos;
            this.digState$ = 2;
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.DIG_START, pos.x);
        }
        /**
     * 当挖掘结束动画结束
     */        onDigEndAnimComplete$() {
            let pos = this.transform$.position;
            pos.y = this.digerStartPos$.y;
            this.transform$.position = pos;
            this.digState$ = 0;
        }
        onDestroy() {
            this.cancleEvents$();
            this.modelCtr$ && this.modelCtr$.dispose();
            this.modelCtr$ = undefined;
            this.woodDustLeft$ && this.woodDustLeft$.dispose();
            this.woodDustLeft$ = undefined;
            this.woodDustRight$ && this.woodDustRight$.dispose();
            this.woodDustRight$ = undefined;
        }
    }
    /**
   * 摆放组件配置
   * created by cyz 20200220
   */    class LayConfig$ {
        constructor() {
            /** 组合摆件配置字典 <组合id, [config]> */
            this.groupConfigDic = {};
            /** 难度配置字典 <难度值, [组合id]> */            this.hardGroupDic = {};
            /** 最大难度 */            this.maxHard = 0;
            this.initConfig$();
        }
        /**
     * 初始化数据
     */        initConfig$() {
            let key, config, hardGroupIds, groupConfigs;
            for (key in D.Lay) {
                config = D.Lay[key];
                if (config.hard > this.maxHard) {
                    this.maxHard = config.hard;
                }
                //难度字典
                                hardGroupIds = this.hardGroupDic[config.hard];
                if (hardGroupIds == void 0) {
                    this.hardGroupDic[config.hard] = hardGroupIds = [];
                }
                hardGroupIds.push(config.group);
                //组件字典
                                groupConfigs = this.groupConfigDic[config.group];
                if (groupConfigs == void 0) {
                    this.groupConfigDic[config.group] = groupConfigs = [];
                }
                groupConfigs.push(config);
            }
        }
        /**
     * 获取 单个组合 随机配置清单
     * @param {*} hard 
     */        getSingleGroupRandomConfigs$(hard) {
            hard = Math.min(hard, this.maxHard);
            let groupIds = this.hardGroupDic[hard];
            if (!groupIds || groupIds.length == 0) return;
            return this.getGroupConfigs$(groupIds[Math.floor(Math.random() * groupIds.length)]);
        }
        /**
     * 获取组合配置清单
     * @param {*} groupId 
     */        getGroupConfigs$(groupId) {
            return this.groupConfigDic[groupId];
        }
    }
    /**
   * 关卡配置
   * created by cyz 20200227
   */    class CustomConfig$ {
        constructor() {
            /** 最大关卡等级 */
            this.maxLevel$ = 0;
            this.initConfig$();
        }
        /**
     * 初始化配置
     */        initConfig$() {
            let key, config, level;
            for (key in D.custom) {
                config = D.custom[key];
                level = Number(config.level);
                if (level > this.maxLevel$) this.maxLevel$ = level;
            }
        }
        /**
     * 获取配置数据
     * @param {*} level 
     */        getConfig$(level) {
            return D.custom[Math.min(this.maxLevel$, level)];
        }
    }
    /**
   * 道具配置
   * created by cyz 20200228
   */    class PropsConfig$ {
        constructor() {
            /** 道具字典 <id, [config]> */
            this.propsDic$ = {};
            this.initConfig$();
        }
        /**
     * 初始化配置
     */        initConfig$() {
            let key, config, configs;
            for (key in D.props) {
                config = D.props[key];
                configs = this.propsDic$[config.propsId];
                if (!configs) {
                    configs = this.propsDic$[config.propsId] = [];
                }
                configs.push(config);
            }
        }
        /**
     * 获取配置清单
     * @param {*} propsId 
     */        getConfigs$(propsId) {
            return this.propsDic$[propsId];
        }
    }
    /**
   * 配置管理者
   * 作者：陈雅智
   * 日期：2019/10/11
   */    class Conf_GameKey_igManager {
        constructor() {
            /** 是否初始化管理 */
            this.inited = false;
            /** 初始化完成回调 */            this.initedCB = undefined;
        }
        /**
     * 获取单例
     * @return {Conf_GameKey_igManager}
     */        static getInstance$() {
            if (Conf_GameKey_igManager.instance == null) {
                Conf_GameKey_igManager.instance = new Conf_GameKey_igManager();
            }
            return Conf_GameKey_igManager.instance;
        }
        /**
     * 是否初始化
     */        get isIn_GameKey_ited() {
            return this.inited;
        }
        /**
     * 初始化
     */        init(callback) {
            this.initedCB = callback;
            this.load_GameKey_AllConfig();
        }
        /**
     * 加载所有配置
     */        load_GameKey_AllConfig() {
            /** 加载摆件配置 */
            this.layConfig$ = new LayConfig$();
            /** 关卡配置 */            this.customConfig$ = new CustomConfig$();
            /** 关卡配置 */            this.propsConfig$ = new PropsConfig$();
            this.load_GameKey_AllConfigComplete();
        }
        /**
     * 加载配置完成
     */        load_GameKey_AllConfigComplete() {
            this.inited = true;
            this.initedCB && this.initedCB();
        }
    }
    /** 私有单例 */    Conf_GameKey_igManager.instance = undefined;
    /**
   * 锯子
   * created by cyz 20200222
   */    class SawControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 锯子移动速度 m/ms */
            this.moveSpeed$ = .004;
            /** 坐标引用 */            this.pos$ = undefined;
            /** 移动方向 1向左，-1向右 */            this.moveForward$ = 1;
            /** 上次时间戳 */            this.lastT$ = undefined;
            /** 击中力 */            this.hitForce$ = new Laya.Vector3(0, 0, 50);
            /** 增加得分s */            this.addScore$ = 50;
            /** 是否激活碰撞 */            this.isActiveCol$ = false;
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} angle 
     * @param {*} scale 
     * @param {*} leftX 
     * @param {*} rightX 
     */        static create$(parent, pos, angle, scale, minX, maxX) {
            let sawObj = parent.addChild(new Laya.Sprite3D());
            sawObj.transform.localPosition = pos.clone();
            sawObj.transform.localRotationEuler = angle.clone();
            sawObj.transform.localScale = scale.clone();
            let sawCtr = sawObj.addComponent(SawControl$);
            sawCtr.setData$(minX, maxX);
            return sawObj;
        }
        /**
     * 设置数据
     * @param {*} minX 
     * @param {*} rightX 
     */        setData$(minX, maxX) {
            /** 最小X */
            this.minX$ = minX;
            /** 最大X */            this.maxX$ = maxX;
        }
        onStart() {
            this.transform$ = this.owner.transform;
            this.createSModel$();
        }
        /**
     * 创建原材料模型清单
     */        createSModel$() {
            this.modelCtr$ = Mode_GameKey_l3D.create(this.owner, 4, Laya.Handler.create(this, this.onModelLoaded$));
        }
        /**
     * 当模型加载好
     */        onModelLoaded$(modelCtr) {
            if (this.owner.destroyed) return;
            let childs = this.modelCtr$.sprite._children;
            let i = childs != void 0 ? childs.length : 0;
            let vChild, rigidbody;
            while (--i > -1) {
                vChild = childs[i];
                //加刚体
                                rigidbody = vChild.addComponent(Laya.Rigidbody3D);
                rigidbody.mass = .1;
                rigidbody.isKinematic = true;
                rigidbody.isKiller$ = true;
                rigidbody.restitution = 0;
                //组合碰撞
                                Mode_GameKey_lUtils.refreshRigidbodysColliderShape(vChild);
            }
            this.colliders$ = ColliderControl$.create(this.onChildCollisionEnter$.bind(this), {
                enabled: this.isActiveCol$,
                restitution: 0,
                collisionGroup: GameSetting$.COLLIDER_GROUP$.SAW$,
                canCollideWith: GameSetting$.COLLIDER_GROUP$.NOR$
            }, modelCtr.sprite);
        }
        onUpdate() {
            this.move$();
            this.checkActiveCol$();
        }
        /**
     * 检查激活碰撞
     */        checkActiveCol$() {
            if (!this.isActiveCol$ && curScene.isActiveCol$(this.owner.transform.position.z)) {
                this.isActiveCol$ = true;
                if (!this.colliders$) return;
                let i = this.colliders$.length;
                while (--i > -1) {
                    this.colliders$[i].refreshProp$({
                        enabled: true
                    });
                }
            }
        }
        /**
     * 移动
     */        move$() {
            if (this.isHited$) return;
            if (this.lastT$ == void 0) this.lastT$ = Laya.physicsTimer.currTimer;
            this.pos$ = this.transform$.localPosition;
            if (this.moveX$ == void 0) this.moveX$ = this.pos$.x;
            this.moveX$ += this.moveForward$ * this.moveSpeed$ * (Laya.physicsTimer.currTimer - this.lastT$);
            if (this.moveX$ <= this.minX$) {
                this.moveX$ = this.minX$;
                this.moveForward$ = 1;
            } else if (this.moveX$ >= this.maxX$) {
                this.moveX$ = this.maxX$;
                this.moveForward$ = -1;
            }
            this.pos$.x = Laya.Ease.sineInOut(this.moveX$ - this.minX$, this.minX$, this.maxX$ - this.minX$, this.maxX$ - this.minX$);
            this.transform$.localPosition = this.pos$;
            this.lastT$ = Laya.physicsTimer.currTimer;
        }
        /**
     * 被卷尺击中
     */        onHit$(pos) {
            if (this.isHited$) return;
            this.isHited$ = true;
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ADD_SCORE$, {
                score: this.addScore$,
                pos: pos
            });
            let childs = this.modelCtr$.sprite._children;
            let i = childs != void 0 ? childs.length : 0;
            let rigidbody;
            while (--i > -1) {
                //加刚体
                rigidbody = childs[i].getComponent(Laya.Rigidbody3D);
                rigidbody.isKinematic = false;
                rigidbody.isHited$ = true;
                rigidbody.applyForce(this.hitForce$);
            }
        }
        /**
     * 当子物体被碰撞
     * @param {*} type
     * @param {*} col
     */        onChildCollisionEnter$(type, col) {
            if (curScene.fight_state$ == 0) return;
            if (type == SSEV_GameKey_ENT.COLLIDER_ENTER) {
                //发生碰撞
                if (col.other.owner.rollCtr && col.other.owner.rollCtr.r$ > .5) {
                    //卷尺碰到
                    this.onHit$(col.contacts[0].positionOnA);
                }
            }
        }
        onDestroy() {
            this.modelCtr$ && this.modelCtr$.dispose();
            this.modelCtr$ = undefined;
        }
    }
    /**
   * 墙控制
   * created by cyz 20200223
   */    class WallControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 砖块质量 */
            this.mass$ = .1;
            /** 增加得分 */            this.singleAddScore$ = 3100;
            /** 是否激活碰撞 */            this.isActiveCol$ = false;
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} angle 
     * @param {*} scale 
     */        static create$(modelId, parent, pos, angle, scale, hightCnt) {
            let wallObj = parent.addChild(new Laya.Sprite3D());
            wallObj.transform.localPosition = pos.clone();
            wallObj.transform.localRotationEuler = angle.clone();
            wallObj.transform.localScale = scale.clone();
            let wallCtr = wallObj.addComponent(WallControl$);
            wallCtr.setData$(modelId, hightCnt);
            return wallObj;
        }
        /**
     * 设置数据
     * @param {*} modelId 
     * @param {*} hightCnt 
     */        setData$(modelId, hightCnt) {
            /** 模型id */
            this.modelId$ = modelId;
            /** 高度模型数量 */            this.hightCnt$ = hightCnt;
        }
        onStart() {
            this.cteateModels$();
        }
        /**
     * 创建模型
     */        cteateModels$() {
            /** 模型控制清单 */
            this.modelCtrs$ = [];
            let i = this.hightCnt$;
            let wallModelCtr;
            while (--i > -1) {
                wallModelCtr = Mode_GameKey_l3D.create(this.owner, this.modelId$, Laya.Handler.create(this, this.onModelLoaded$));
                wallModelCtr.setLocalPosition(0, 3.2 * i, 0);
                this.modelCtrs$.push(wallModelCtr);
            }
        }
        /**
     * 模型加载完成回调
     * @param {*} modelCtr 
     */        onModelLoaded$(modelCtr) {
            if (this.owner.destroyed) return;
            //设置刚体
                        let childs = modelCtr.sprite._children;
            let i = childs != void 0 ? childs.length : 0;
            let vChild, rigidbody;
            while (--i > -1) {
                vChild = childs[i];
                //加刚体
                                rigidbody = vChild.addComponent(Laya.Rigidbody3D);
                rigidbody.mass = this.mass$;
                rigidbody.isKinematic = true;
                rigidbody.isTrigger = true;
                rigidbody.isKiller$ = true;
                rigidbody.restitution = 0;
                //组合碰撞
                                Mode_GameKey_lUtils.refreshRigidbodysColliderShape(vChild);
            }
            if (!this.colliders$) this.colliders$ = [];
            //设置碰撞回调
                        let colliders$ = ColliderControl$.create(this.onChildColliderCallback$.bind(this), {
                enabled: this.isActiveCol$,
                restitution: 0,
                collisionGroup: GameSetting$.COLLIDER_GROUP$.WALL$,
                canCollideWith: GameSetting$.COLLIDER_GROUP$.NOR$
            }, modelCtr.sprite);
            if (!colliders$ || colliders$.length == 0) return;
            i = colliders$.length;
            while (--i > -1) {
                this.colliders$.push(colliders$[i]);
            }
        }
        /**
     * 被卷尺击中
     */        onHit$(col) {
            if (this.isHited$) return;
            this.isHited$ = true;
            if (!this.modelCtrs$) return;
            let j = this.modelCtrs$.length;
            let i, childs, modelCtr, vChild;
            let forwardV3 = new Laya.Vector3();
            let colPos = col.owner.transform.position;
            let addPower = col.owner.rollCtr ? Util_GameKey_s.getV3Length$(col.linearVelocity) * .1 : 1;
            while (--j > -1) {
                modelCtr = this.modelCtrs$[j];
                modelCtr.changeParent(curScene.baseScene$);
                childs = modelCtr.sprite._children;
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ADD_SCORE$, {
                    score: this.singleAddScore$,
                    pos: modelCtr.sprite.transform.position
                });
                i = childs != void 0 ? childs.length : 0;
                while (--i > -1) {
                    vChild = childs[i];
                    //加刚体
                                        let rigidbody = vChild.getComponent(Laya.Rigidbody3D);
                    if (!rigidbody) continue;
                    rigidbody.isKinematic = false;
                    rigidbody.isTrigger = false;
                    rigidbody.collisionGroup = GameSetting$.COLLIDER_GROUP$.NOR$;
                    rigidbody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER;
                    //加速度
                                        let linearVelocity = rigidbody.linearVelocity;
                    col.owner.rollCtr ? forwardV3 = col.linearVelocity.clone() : Laya.Vector3.subtract(vChild.transform.position, colPos, forwardV3);
                    Laya.Vector3.normalize(forwardV3, forwardV3);
                    linearVelocity.x += forwardV3.x * addPower;
                    linearVelocity.y += forwardV3.y * addPower;
                    linearVelocity.z += forwardV3.z * addPower;
                    rigidbody.linearVelocity = linearVelocity;
                    Laya.timer.callLater(this, function() {
                        //状态延迟修改
                        rigidbody.isHited$ = true;
                    });
                }
            }
            curScene.shakeCamera$();
        }
        /**
     * 子物体碰撞回调
     * @param {*} type 
     * @param {*} col 
     */        onChildColliderCallback$(type, col) {
            if (curScene.fight_state$ == 0) return;
            // if(type == SSEV_GameKey_ENT.TRIGGER_ENTER || type == SSEV_GameKey_ENT.TRIGGER_STAY || type == SSEV_GameKey_ENT.TRIGGER_EXIT){//发生碰撞
                        let target = type == SSEV_GameKey_ENT.TRIGGER_ENTER || type == SSEV_GameKey_ENT.TRIGGER_STAY || type == SSEV_GameKey_ENT.TRIGGER_EXIT ? col : col.other;
            if (target.owner.rollCtr) {
                //大卷尺碰到
                if (target.owner.rollCtr.r$ > 1) {
                    this.onHit$(target);
                } else {
                    let v = target.linearVelocity;
                    v.z = v.z < 0 ? v.z : -v.z * .7;
                    target.linearVelocity = v;
                }
            } else if (target instanceof Laya.Rigidbody3D) {
                if (!target.isKinematic && target.mass >= this.mass$ && Util_GameKey_s.getV3Length$(target.linearVelocity) >= 1) {
                    this.onHit$(target);
                }
            }
            // }
                }
        onUpdate() {
            this.checkActiveCol$();
            this.checkWaterDownCollider$();
            this.checkRecoverBlock$();
        }
        /**
     * 检查激活碰撞
     */        checkActiveCol$() {
            if (!this.isActiveCol$ && curScene.isActiveCol$(this.owner.transform.position.z)) {
                this.isActiveCol$ = true;
                if (!this.colliders$) return;
                let i = this.colliders$.length;
                while (--i > -1) {
                    this.colliders$[i].refreshProp$({
                        enabled: true
                    });
                }
            }
        }
        /**
     * 检测水平下回收碰撞
     */        checkWaterDownCollider$() {
            if (!this.isHited$) return;
            if (!this.colliders$) return;
            let i = this.colliders$.length;
            let col;
            while (--i > -1) {
                col = this.colliders$[i];
                if (col.isRecoverCol) continue;
                if (col.owner.transform.position.y < 0) {
                    col.isRecoverCol = true;
                    col.refreshProp$({
                        canCollideWith: GameSetting$.COLLIDER_GROUP$.NONE$
                    });
                }
            }
        }
        /**
     * 检测回收砖块
     */        checkRecoverBlock$() {
            if (!this.isHited$) return;
            if (!this.colliders$) return;
            let i = this.colliders$.length;
            let col;
            while (--i > -1) {
                col = this.colliders$[i];
                if (col.owner.transform.position.y <= GameSetting$.RECOVER_Y$) {
                    col.owner.destroy();
                    this.colliders$.splice(i, 1);
                }
            }
        }
        /**
     * 销毁模型清单
     */        destroyModels$() {
            if (!this.modelCtrs$) return;
            let i = this.modelCtrs$.length;
            while (--i > -1) {
                this.modelCtrs$[i].dispose();
            }
            this.modelCtrs$ = undefined;
        }
        onDestroy() {
            this.destroyModels$();
        }
    }
    /**
   * 金币获取特效
   * created by cyz 20200227
   */    class CoinGetEffect$ extends Laya.Script3D {
        constructor() {
            super();
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     */        static create$(parent, pos) {
            let effectObj = parent.addChild(new Laya.Sprite3D());
            effectObj.transform.localPosition = pos.clone();
            effectObj.addComponent(CoinGetEffect$);
            return effectObj;
        }
        onStart() {
            this.createModel$();
            Laya.timer.once(2e3, this, this.destroy);
        }
        /**
     * 创建模型
     */        createModel$() {
            /** 模型 */
            this.modelCtr$ = Mode_GameKey_l3D.create(this.owner, 11);
        }
        /**
     * 销毁模型
     */        destroyModel$() {
            this.modelCtr$ && this.modelCtr$.dispose();
            this.modelCtr$ = undefined;
        }
        onDestroy() {
            this.destroyModel$();
        }
    }
    /**
   * 硬币控制
   * created by cyz 20200226
   */    class CoinControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 出初始化数据
     */        initData$() {
            /** 旋转速度 度/ms */
            this.rotateSpeed$ = .1;
            /** 飞行线性速度 m/ms */            this.flyLinearV$ = 10;
            /** 当前金币角度 */            this.curEuler$ = undefined;
            /** 模型id */            this.modelId$ = 9;
            /** 半径 */            this.r$ = .5;
            /** 宽度 */            this.w$ = .2;
            /** 是否激活碰撞器 */            this.isActiveCol$ = false;
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} angle 
     * @param {*} scale 
     * @param {*} canGet 
     * @param {*} v 
     */        static create$(parent, pos, angle, scale, canGet, v) {
            let coinObj = parent.addChild(new Laya.Sprite3D());
            coinObj.transform.localPosition = pos.clone();
            coinObj.transform.localRotationEuler = angle.clone();
            coinObj.transform.localScale = scale.clone();
            let coinCtr = coinObj.addComponent(CoinControl$);
            coinCtr.refreshData$(canGet, v);
            return coinObj;
        }
        /**
     * 刷新数据
     * @param {*} canGet 
     * @param {*} v
     */        refreshData$(canGet, v) {
            /** 可否被领取 不能领取会受重力影响 */
            this.canGet$ = canGet;
            /** 线性速度 */            this.linearV$ = v;
        }
        onStart() {
            this.createModel$();
        }
        /**
     * 创建模型
     */        createModel$() {
            this.modelCtr$ = Mode_GameKey_l3D.create(this.owner, this.modelId$, Laya.Handler.create(this, this.onModelLoaded$));
        }
        /**
     * 模型创建好
     */        onModelLoaded$(modelCtr) {
            if (this.canGet$) {
                //注册碰撞回调
                this.rigidbody$ = this.owner.addComponent(Laya.Rigidbody3D);
                this.rigidbody$.isKinematic = true;
                this.rigidbody$.isTrigger = true;
                // this.rigidbody$.colliderShape = new Laya.CylinderColliderShape(this.r$, this.w$, Laya.ColliderShape.SHAPEORIENTATION_UPZ);
                                this.rigidbody$.colliderShape = new Laya.CompoundColliderShape();
                this.rigidbody$.enabled = this.isActiveCol$;
                this.rigidbody$.collisionGroup = GameSetting$.COLLIDER_GROUP$.COOIN$;
                this.rigidbody$.canCollideWith = GameSetting$.COLLIDER_GROUP$.NOR$;
            } else {
                //创建刚体，施加力
                this.rigidbody$ = this.owner.addComponent(Laya.Rigidbody3D);
                this.rigidbody$.colliderShape = new Laya.CompoundColliderShape();
                // let randRad = Math.random() * Math.PI * 2
                // let v = new Laya.Vector3();
                // v.x = this.flyLinearV$ * Math.cos(randRad);
                // v.z = this.flyLinearV$ * Math.sin(randRad) - this.flyLinearV$;
                // this.rigidbody$.colliderShape = new Laya.CylinderColliderShape(this.r$, this.w$, Laya.ColliderShape.SHAPEORIENTATION_UPZ);
                                this.rigidbody$.angularDamping = .8;
                this.rigidbody$.linearVelocity = this.linearV$.clone();
                this.rigidbody$.enabled = this.isActiveCol$;
                this.rigidbody$.collisionGroup = Math.random() >= .5 ? GameSetting$.COLLIDER_GROUP$.COOIN$ : GameSetting$.COLLIDER_GROUP$.NOR$;
                this.rigidbody$.canCollideWith = GameSetting$.COLLIDER_GROUP$.NOR$;
            }
            Mode_GameKey_lUtils.refreshRigidbodysColliderShape(this.owner);
        }
        // /**
        //  * 子物体碰撞回调
        //  * @param {*} type 
        //  * @param {*} col 
        //  */
        // onChildColliderCallback$(type, col) {
        //     if(type == SSEV_GameKey_ENT.TRIGGER_ENTER){
        //         if(col.isDiger || col.owner.rollCtr){//被领取
        //             this.onGeted();
        //         }
        //     }
        // }
        onTriggerEnter(col) {
            if (curScene.fight_state$ == 0) return;
            if (!this.canGet$) return;
            if (col.isDiger || col.owner.rollCtr) {
                //被领取
                this.onGeted();
            }
        }
        /**
     * 当被领取
     */        onGeted() {
            if (this.geted$) return;
            this.geted$ = true;
            Data_GameKey_Manager.getInstance$().userData$.onGetCoin$(1);
            //发事件通知获得金币
                        Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.GETED_COIN, 1);
            let pos = this.owner.transform.localPosition;
            CoinGetEffect$.create$(this.owner.parent, new Laya.Vector3(pos.x, pos.y, pos.z + 2));
            this.destroy();
        }
        onUpdate() {
            this.refreshRotateAnim$();
            this.checkActiveCol$();
        }
        /**
     * 刷新旋转动画
     */        refreshRotateAnim$() {
            if (!this.canGet$) return;
            this.curEuler$ = this.owner.transform.rotationEuler;
            this.curEuler$.y += this.rotateSpeed$ * TimeManager$.getInstance$().deltaTime$;
            this.owner.transform.rotationEuler = this.curEuler$;
        }
        /**
     * 检查激活碰撞
     */        checkActiveCol$() {
            if (!this.isActiveCol$ && curScene.isActiveCol$(this.owner.transform.position.z)) {
                this.isActiveCol$ = true;
                if (!this.rigidbody$) return;
                this.rigidbody$.enabled = this.isActiveCol$;
            }
        }
        onDestroy() {
            this.modelCtr$ && this.modelCtr$.dispose();
            this.modelCtr$ = undefined;
        }
    }
    /**
   * 战利品奖励单位控制
   * created by cyz 20200227
   */    class LootBoxItemControl$ extends Laya.Script3D {
        constructor() {
            super();
            /** 上升移动速度 m/ms */            this.upSpeed$ = .02;
            /** 下降移动速度 m/ms */            this.downSpeed$ = .01;
            /** 增加向上移动速度 m/ms */            this.addUpSpeed$ = 10;
            /** 是否激活碰撞 */            this.isActiveCol$ = false;
        }
        /**
     * 创建
     * @param {*} owner 
     * @param {*} caller 
     * @param {*} upY 
     */        static create$(owner, caller, upY) {
            let itemCtr = owner.addComponent(LootBoxItemControl$);
            itemCtr.refreshData$(caller, upY);
        }
        /**
     * 刷新数据
     */        refreshData$(caller, upY) {
            /** 调用者 */
            this.caller$ = caller;
            /** 上升的高度 */            this.upY$ = upY;
        }
        onStart() {
            let lootText = this.owner._children[0].getChildByName("LootText");
            let coinStr = lootText._children[0].name.substr(3);
            if (coinStr == "Alot") {
                this.coinCnt$ = 100;
            } else if (coinStr == "Only5") {
                this.coinCnt$ = 5;
            } else {
                this.coinCnt$ = Number(coinStr);
            }
            this.colliders$ = ColliderControl$.create(this.onChildColliderCallback$.bind(this), {
                enabled: this.isActiveCol$,
                restitution: 0
            }, this.owner);
            this.monitorEvents$();
        }
        /**
     * 监听事件
     */        monitorEvents$() {
            Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.GETED_LOOTBOX, this, this.onGetedLootBox$);
        }
        /**
     * 取消事件监听
     */        cancleEvents$() {
            Even_GameKey_tManager.getInstance$().remo_GameKey_veEventListener(SSEV_GameKey_ENT.GETED_LOOTBOX, this, this.onGetedLootBox$);
        }
        /**
     * 当获得单个战利品盒子
     */        onGetedLootBox$(e) {
            if (e.data == this.caller$) {
                //同个父级
                /** 已被领取 */
                this.isGeted$ = true;
            }
        }
        /**
     * 子物体碰撞回调
     * @param {*} type 
     * @param {*} col 
     */        onChildColliderCallback$(type, col) {
            if (curScene.fight_state$ == 0) return;
                        if (type == SSEV_GameKey_ENT.COLLIDER_ENTER || type == SSEV_GameKey_ENT.COLLIDER_STAY || type == SSEV_GameKey_ENT.COLLIDER_EXIT) {
                //碰撞
                if (col.other.owner.rollCtr && !this.isGeted$) {
                    //大卷尺碰到
                    col.other.owner.rollCtr.addUpSpeed$(this.addUpSpeed$);
                    (curScene.fight_state$ == 6 || curScene.fight_state$ == 3) && col.other.owner.rollCtr.stopFollowCamera$();
                    this.isGeted$ = true;
                    this.onHit$();
                }
            }
        }
        /**
     * 当被击中
     */        onHit$() {
            this.createLihuas$();
            this.playUpAnim$();
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.GETED_LOOTBOX, this.caller$);
        }
        /**
     * 创建礼花特效
     */        createLihuas$() {
            /** 礼花特效清单 */
            this.lihuaEffects$ = [];
            let lihuaParents = Util_GameKey_s.getC_GameKey_hildArrayDeep(this.owner, "Confettis");
            let i = lihuaParents != void 0 ? lihuaParents.length : 0;
            while (--i > -1) {
                this.lihuaEffects$.push(Mode_GameKey_l3D.create(lihuaParents[i], 13));
            }
        }
        /**
         * 创建光
         */        
        createPointLight$() {
            if (this.pointLight$) return;
            let bodyCoolor = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "Frame").meshRenderer.material.albedoColor;
            let pointLightParent = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "Point Light");
            this.pointLight$ = pointLightParent.addChild(new Laya.PointLight());
            this.pointLight$.color.x = bodyCoolor.x;
            this.pointLight$.color.y = bodyCoolor.y;
            this.pointLight$.color.z = bodyCoolor.z;
            this.pointLight$.range = 5;
        }
        /**
     * 播放向上动画
     */        playUpAnim$() {
            this.createPointLight$();
            /** 是否刷新上升动画 */            this.isRefreshUpAnim$ = true;
        }
        /**
     * 播放向下动画
     */        playDownAnim$() {
            /** 是否刷新向下动画 */
            this.isRefreshDownAnim$ = true;
        }
        /**
     * 刷新向上动画
     */        refreshUpAnim$() {
            if (!this.isRefreshUpAnim$) return;
            let pos = this.owner.transform.localPosition;
            if (pos.y < this.upY$) {
                pos.y += this.upSpeed$ * TimeManager$.getInstance$().deltaTime$;
            }
            if (pos.y >= this.upY$) {
                pos.y = this.upY$;
                this.isRefreshUpAnim$ = false;
                Data_GameKey_Manager.getInstance$().userData$.onGetCoin$(this.coinCnt$);
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.GETED_COIN, this.coinCnt$);
                this.createCoins$();
                Laya.timer.once(2e3, this, this.playDownAnim$);
            }
            this.owner.transform.localPosition = pos;
        }
        /**
     * 刷新向下动画
     */        refreshDownAnim$() {
            if (!this.isRefreshDownAnim$) return;
            let pos = this.owner.transform.localPosition;
            if (pos.y > 0) {
                pos.y -= this.downSpeed$ * TimeManager$.getInstance$().deltaTime$;
            }
            if (pos.y <= 0) {
                pos.y = 0;
                this.isRefreshDownAnim$ = false;
                this.pointLight$ && this.pointLight$.destroy();
                this.pointLight$ = undefined;
            }
            this.owner.transform.localPosition = pos;
        }
        /**
     * 创建金币清单
     */        createCoins$() {
            /** 硬币清单 */
            this.coins$ = [];
            let i = Math.min(this.coinCnt$, 15);
            let coinParent = Util_GameKey_s.getC_GameKey_hildDeep(this.owner, "coinPos");
            let width = coinParent.transform.localScale.x;
            coinParent.transform.localScale = new Laya.Vector3(1, 1, 1);
            let pPos = coinParent.transform.position;
            while (--i > -1) {
                this.coins$.push(CoinControl$.create$(curScene.baseScene$, new Laya.Vector3((pPos.x + Math.random() - .5) * width, pPos.y, pPos.z), new Laya.Vector3(), new Laya.Vector3(1, 1, 1), false, new Laya.Vector3(0, 10, -5 * this.coinCnt$ / (10 * width))));
            }
        }
        onUpdate() {
            this.refreshUpAnim$();
            this.refreshDownAnim$();
            this.checkActiveCol$();
        }
        /**
     * 检查激活碰撞
     */        checkActiveCol$() {
            if (!this.isActiveCol$ && curScene.isActiveCol$(this.owner.transform.position.z)) {
                this.isActiveCol$ = true;
                if (!this.colliders$) return;
                let i = this.colliders$.length;
                while (--i > -1) {
                    this.colliders$[i].refreshProp$({
                        enabled: true
                    });
                }
            }
        }
        /**
     * 销毁礼花特效清单
     */        destroyLihuaEffects$() {
            if (!this.lihuaEffects$) return;
            let i = this.lihuaEffects$.length;
            while (--i > -1) {
                this.lihuaEffects$[i].dispose();
            }
            this.lihuaEffects$ = undefined;
        }
        /**
     * 销毁硬币
     */        destroyCoins$() {
            if (!this.coins$) return;
            if (curScene.baseScene$.destroyed) return;
            let i = this.coins$.length;
            while (--i > -1) {
                this.coins$[i].destroy();
            }
            this.coins$ = undefined;
        }
        onDestroy() {
            this.destroyLihuaEffects$();
            this.destroyCoins$();
            this.cancleEvents$();
        }
    }
    /**
   * 战利品盒子
   * created by cyz 20200225
   */    class LootBoxControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 模型id */
            this.modelId$ = 7;
            /** 模型控制 */            this.modelCtr$ = undefined;
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} id
     * @param {*} upY
     */        static create$(parent, pos, angle, scale, id, upY) {
            let lootBox = parent.addChild(new Laya.Sprite3D());
            lootBox.transform.localPosition = pos.clone();
            lootBox.transform.localRotationEuler = angle.clone();
            lootBox.transform.localScale = scale.clone();
            let lootBoxCtr = lootBox.addComponent(LootBoxControl$);
            lootBoxCtr.refreshData$(id, upY);
            return lootBox;
        }
        /**
     * 刷新数据
     * @param {*} id 
     * @param {*} upY 
     */        refreshData$(id, upY) {
            this.modelId$ = id;
            /** 上升的高度 */            this.upY$ = upY;
        }
        onStart() {
            this.createModel$();
        }
        /**
     * 创建模型
     */        createModel$() {
            this.modelCtr$ = Mode_GameKey_l3D.create(this.owner, this.modelId$, Laya.Handler.create(this, this.onModelLoaded$));
        }
        /**
     * 模型加载完成
     */        onModelLoaded$() {
            if (this.owner.destroyed) return;
            let items = Util_GameKey_s.getC_GameKey_hildArrayDeep(this.modelCtr$.sprite, "LootBoxRef");
            let i = items.length;
            while (--i > -1) {
                LootBoxItemControl$.create$(items[i], this, this.upY$);
            }
        }
        onDestroy() {
            this.modelCtr$ && this.modelCtr$.dispose();
            this.modelCtr$ = undefined;
        }
    }
    /**
   * 结束点控制
   * created by cyz 20200225
   */    class FinishControl$ extends Laya.Script3D {
        constructor() {
            super();
            /** 滚动区域长度 */            this.scrollDis$ = 42;
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} baseScene
     * @param {*} diger
     * @param {*} lootBoxId
     * @param {*} lootBoxDis
     * @param {*} upY
     */        static create$(parent, pos, baseScene, diger, lootBoxId, lootBoxDis, upY) {
            let finishObj = parent.addChild(new Laya.Sprite3D());
            let finishCtr = finishObj.addComponent(FinishControl$);
            finishObj.transform.localPosition = pos.clone();
            finishCtr.refreshData$(baseScene, diger, lootBoxId, lootBoxDis, upY);
            return finishObj;
        }
        /**
     * 刷新数据
     * @param {*} baseScene 
     */        refreshData$(baseScene, diger, lootBoxId, lootBoxDis, upY) {
            /** 基础场景 */
            this.baseScene$ = baseScene;
            /** 铲子 */            this.diger$ = diger;
            /** 战利品模型id */            this.lootBoxId$ = lootBoxId;
            /** 战利品模型长度 */            this.lootBoxDis$ = lootBoxDis;
            /** 上升的高度 */            this.upY$ = upY;
        }
        onStart() {
            this.createEndScroll$();
            this.createLootBoxs$();
        }
        /**
     * 创建结束滚动区域
     */        createEndScroll$() {
            RawControl$.create$(this.owner, new Laya.Vector3(), new Laya.Vector3(), new Laya.Vector3(1, 1, 1), 1, this.baseScene$, this.diger$, 6, 8, this.scrollDis$, 1, 5);
        }
        /**
     * 创建战利品清单
     */        createLootBoxs$() {
            let addDis = this.scrollDis$;
            LootBoxControl$.create$(this.owner, new Laya.Vector3(0, 0, addDis), new Laya.Vector3(0, 0, 0), new Laya.Vector3(1, 1, 1), this.lootBoxId$, this.upY$);
            this.allDis$ = addDis + this.lootBoxDis$;
        }
        onUpdate() {
            this.checkFightWin$();
        }
        /**
     * 检查战斗胜利
     */        checkFightWin$() {
            if (!this.diger$ || this.diger$.destroyed) return;
            if (this.isWin$) return;
            if (this.diger$.transform.position.z >= this.owner.transform.position.z + this.allDis$) {
                this.isWin$ = true;
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.FIGHT_WIN);
            }
        }
    }
    /**
   * 盘子控制
   * created by cyz 20200228
   */    class PlatControl$ extends Laya.Script3D {
        constructor() {
            super();
            this.initData$();
        }
        /**
     * 初始化数据
     */        initData$() {
            this.modelId$ = 14;
        }
        /**
     * 创建盘子
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} angle 
     * @param {*} scale 
     * @param {*} modelId$ 
     */        static create$(parent, pos, angle, scale, modelId$) {
            let platObj = parent.addChild(new Laya.Sprite3D());
            platObj.transform.localPosition = pos.clone();
            platObj.transform.localRotationEuler = angle.clone();
            platObj.transform.localScale = scale.clone();
            let platCtr = platObj.addComponent(PlatControl$);
            platCtr.refreshData$(modelId$);
            return platObj;
        }
        /**
     * 刷新数据
     * @param {*} modelId 
     */        refreshData$(modelId) {
            this.modelId$ = modelId || 14;
        }
        onStart() {
            this.createModel$();
        }
        /**
     * 创建模型
     */        createModel$() {
            /** 模型控制 */
            this.modelCtr$ = Mode_GameKey_l3D.create(this.owner, this.modelId$, Laya.Handler.create(this, this.onModelLoaded$));
        }
        /**
     * 模型加载完成
     * @param {*} modelCtr 
     */        onModelLoaded$(modelCtr) {
            if (this.owner.destroyed) return;
            let col = Util_GameKey_s.getC_GameKey_hildDeep(modelCtr.sprite, "col");
            if (col && !col.getComponent(Laya.PhysicsCollider)) {
                //创建碰撞器
                let physicCollider = col.addComponent(Laya.PhysicsCollider);
                physicCollider.colliderShape = new Laya.CylinderColliderShape(5, 1, Laya.ColliderShape.SHAPEORIENTATION_UPY);
                physicCollider.restitution = 0;
            }
        }
        onDestroy() {
            this.modelCtr$ && this.modelCtr$.dispose();
            this.modelCtr$ = undefined;
        }
    }
    /**
   * 道具控制
   * created by cyz 20200228
   */    class PropsControl$ extends Laya.Script3D {
        constructor() {
            super();
            /** 旋转速度 度/ms */            this.ratateSpeed$ = .05;
        }
        /**
     * 创建
     * @param {*} parent 
     * @param {*} pos 
     * @param {*} propsId 
     * @param {*} type 
     */        static create$(parent, pos, propsId, type) {
            let propsObj = parent.addChild(new Laya.Sprite3D());
            propsObj.transform.localPosition = pos.clone();
            let propsCtr = propsObj.addComponent(PropsControl$);
            propsCtr.refreshData$(propsId, type);
            return propsObj;
        }
        /**
     * 刷新数据
     * @param {*} propsId 
     * @param {*} type 
     */        refreshData$(propsId, type) {
            /** 道具id */
            this.propsId$ = propsId;
            /** 道具类型 */            this.type$ = type;
            /** 道具配置清单 */            this.propsConfigs = Conf_GameKey_igManager.getInstance$().propsConfig$.getConfigs$(this.propsId$);
        }
        onStart() {
            this.createModels$();
        }
        /**
     * 创建模型清单
     */        createModels$() {
            /** 模型清单 */
            this.modelCtrs$ = [];
            let i = this.propsConfigs.length;
            let config;
            while (--i > -1) {
                this.createSingleModel$(this.propsConfigs[i]);
            }
        }
        /**
     * 创建单个模型
     * @param {*} config 
     */        createSingleModel$(config) {
            if (config.modelId == GameSetting$.MODEL_ID.COIN) {
                CoinControl$.create$(this.owner, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), true);
            } else if (config.modelId == GameSetting$.MODEL_ID.WALL) {
                WallControl$.create$(config.modelId, this.owner, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), Number(config.para1));
            } else if (config.modelId == GameSetting$.MODEL_ID.PLAT) {
                PlatControl$.create$(this.owner, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), config.modelId);
            } else if (config.modelId == GameSetting$.MODEL_ID.PLAT2$) {
                PlatControl$.create$(this.owner, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), config.modelId);
            }
            // let modelCtr = Mode_GameKey_l3D.create(this.owner, config.modelId);
            // modelCtr.setLocalPosition(config.pos[0], config.pos[1], config.pos[2]);
            // modelCtr.setLocalScale(config.scale[0], config.scale[1], config.scale[2]);
            // modelCtr.setLocalRotation(-config.angle[1], config.angle[0], -config.angle[2]);
            // this.modelCtrs$.push(modelCtr);
                }
        onUpdate() {
            this.refreshRotateAnim$();
        }
        /**
     * 刷新旋转动画
     */        refreshRotateAnim$() {
            if (this.type$ != GameSetting$.LAY_OBJ.ROTATE_PROPS) return;
            let rotateAngle = this.owner.transform.localRotationEuler;
            rotateAngle.y += this.ratateSpeed$ * TimeManager$.getInstance$().deltaTime$;
            this.owner.transform.localRotationEuler = rotateAngle;
        }
    }
    /**
   * 战斗场景
   * cyz 20200218
   */    class BattleScene$ extends Base_GameKey_Scene {
        constructor() {
            super();
            window.curScene = this;
            this.init$();
        }
        /**
     * 初始化
     */        init$() {
            this.initData$();
            this.refreshData$();
            this.monitorEvents$();
            this.createScene$();
            this.createCamera$();
            this.createSea$();
            this.createDiger$();
            // Laya.timer.loop(50, this, this.update$);
                        Laya.timer.frameLoop(1, this, this.update$);
        }
        /**
     * 初始化数据
     */        initData$() {
            /** 摄像机视野范围 */
            this.cameraArea$ = 100;
            /** 摆件父级清单 */            this.layParents = [];
            /** 滚动速度 m/ms*/            this.scrollSpeed$ = .012;
            /** 销毁摆件最小Z值 */            this.destroyMinZ$ = -20;
            /** 战斗状态 0无，1战斗中，2失败，3胜利, 4结束点挑战, 5进入结束点, 6结束点挖掘结束, 7结束点开始挖*/            this.fight_state$ = 0;
            /** 挖掘总距离 */            this.digAllDis$ = 0;
            /** 挖掘结束距离 */            this.digFinishDis$ = 100;
            /** 结束点Z坐标 */            this.finishZ$ = undefined;
            /** 初始相机位置 */            this.startCameraPos$ = new Laya.Vector3(-6.8, 9.5, -22);
            /** 难度 */            this.hard$ = 0;
            /** 关卡等级 */            this.level$ = 1;
            /** 分数 */            this.score$ = 0;
            /** 滚轴清单 */            this.rolls$ = [];
        }
        /**
     * 刷新数据
     */        refreshData$() {
            this.level$ = Data_GameKey_Manager.getInstance$().customData$.level$;
            /** 关卡配置 */            let config = Conf_GameKey_igManager.getInstance$().customConfig$.getConfig$(this.level$);
            /** 摆放组件id清单 */            this.layGroupIds$ = config.groupIds;
            /** 是否随机出摆件 */            this.isRandGroup$ = config.isRand;
            this.scrollSpeed$ = .001 * (Math.random() * (config.speed[1] - config.speed[0]) + config.speed[0]);
            /** 原料索引 */            let rawIndex = Math.floor(Math.random() * config.rawIds.length);
            /** 原料id */            this.rawId$ = config.rawIds[rawIndex];
            /** 填充id */            this.fillId$ = config.fillIds[rawIndex];
            /** 上次摆件索引 */            this.lastGroupIndex$ = -1;
            /** 随机结束点战利品 */            let randomLootBoxIndex = Math.floor(Math.random() * config.lootBoxId.length);
            /** 结束战利品id */            this.lootBoxId$ = config.lootBoxId[randomLootBoxIndex];
            /** 结束战利品长度 */            this.lootBoxDis$ = config.lootBoxDis[randomLootBoxIndex];
            this.digFinishDis$ = config.rollDis;
        }
        /**
     * 开始战斗
     */        startFight$() {
            this.fight_state$ = 1;
        }
        /**
     * 重置战斗
     */        resetFight$() {
            this.lastLay$ = undefined;
            this.finishZ$ = undefined;
            this.rolls$ = [];
            this.digAllDis$ = 0;
            this.score$ = 0;
            this.hard$ = 0;
            this.refreshData$();
            /** 海平面贴图 */            this.seaTopMaterial$ = undefined;
            this.sea$ && this.sea$.dispose();
            this.sea$ = undefined;
            this.destroyAllLays$();
            this.baseScene$.destroy();
            this.baseScene$ = this.rootScene$.addChild(new Laya.Sprite3D());
            this.createCamera$();
            this.createSea$();
            this.createDiger$();
            this.fight_state$ = 0;
        }
        /**
     * 监听事件
     */        monitorEvents$() {
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.ON_START_GAME, this.startFight$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.BE_DIG, this.onRawBeDig$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.ROLL_DROP$, this.onRollDrop$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.FIGHT_FAIL, this.onGameFail$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.DIGING, this.onDig$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.FIGHT_WIN, this.fightWin$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.RELIVE$, this.onRelive$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.DIG_END, this.onDigEnd$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.REST_FIGHT, this.resetFight$);
            this.addE_GameKey_ventListener(SSEV_GameKey_ENT.ADD_SCORE$, this.onAddScore$);
        }
        /**
     * 当原料被挖掘
     * @param {*} e 
     */        onRawBeDig$(e) {
            this.rolls$.push(e.data.roll$);
            if (this.fight_state$ == 5) this.fight_state$ = 7;
        }
        /**
     * 滚轴掉落消失
     */        onRollDrop$(e) {
            let i = this.rolls$.indexOf(e.data);
            i > -1 && this.rolls$.splice(i, 1);
        }
        /**
     * 挖掘结束
     */        onDigEnd$(e) {
            if (this.fight_state$ != 7) return;
            if (!e.data.roll$) return;
            this.fight_state$ = 6;
            this.camera$.active = false;
            e.data.roll$.rollCtr.createFollowCamera$();
            Laya.timer.once(2e3, this, this.fightWin$);
        }
        /**
     * 增加得分
     * @param {*} e 
     */        onAddScore$(e) {
            this.score$ += e.data.score;
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.SCORE_CHANGE$, this.getScoreEventData$());
        }
        /**
     * 游戏失败处理
     */        onGameFail$() {
            if (this.fight_state$ != 1 && this.fight_state$ != 4) return;
            /** 失败前状态 */            this.last_fight_state$ = this.fight_state$;
            this.fight_state$ = 2;
            let score = this.getScore$();
            let battleUI = UIMa_GameKey_nager.getInstance$().getU_GameKey_I(BattleUI$);
            battleUI && battleUI.destroy();
            UIMa_GameKey_nager.getInstance$().open_GameKey_UI(BattleRestartUI$, undefined, score);
        }
        /**
     * 当复活
     */        onRelive$() {
            this.fight_state$ = this.last_fight_state$;
            UIMa_GameKey_nager.getInstance$().open_GameKey_UI(BattleUI$);
        }
        /**
     * 获取得分
     */        getScore$() {
            return this.score$;
        }
        /**
     * 创建场景
     */        createScene$() {
            /** 是否加载完场景 */
            this.isLo_GameKey_adedScene = false;
            /** 场景 */            this.rootScene$ = this.addChild(new Laya.Scene3D());
            /** 场景亮度 */            this.rootScene$.ambientColor = new Laya.Vector3(.5, .5, .5);
            //方向光
                        var directionLight = new Laya.DirectionLight();
            // directionLight.color = new Laya.Vector3(0.3, 0.3, 0.3);
                        directionLight.color = new Laya.Vector3(.5, .5, .5);
            this.directionLight = directionLight;
            //设置平行光的方向
                        var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(.7, -2, 1.8));
            // directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0.0));
                        directionLight.transform.worldMatrix = mat;
            // //可见阴影距离
                        directionLight.shadowDistance = 100;
            //生成阴影贴图尺寸
                        directionLight.shadowResolution = 512;
            //生成阴影贴图数量
                        directionLight.shadowPSSMCount = 1;
            //模糊等级,越大越高,更耗性能
                        directionLight.shadowPCFType = 0;
            this.rootScene$.addChild(directionLight);
            // this.rootScene$.fogColor = new Laya.Vector3(1, 0.913, 0.678);
            // this.rootScene$.fogStart = this.cameraArea$;
            // this.rootScene$.fogRange = 10;
            // this.rootScene$.enableFog = true;
                        this.baseScene$ = this.rootScene$.addChild(new Laya.Sprite3D());
        }
        /**
     * 创建摄像机
     */        createCamera$() {
            /** 摄像机 */
            this.camera$ = this.baseScene$.addChild(new Laya.Camera(0, .1, this.cameraArea$ + 10));
            this.camera$.transform.position = this.startCameraPos$.clone();
            let euler = this.camera$.transform.rotationEuler;
            euler.z = 0;
            euler.y = -163;
            euler.x = -20.5;
            this.camera$.transform.rotationEuler = euler;
            if (Laya.Browser.onPC) this.camera$.addComponent(CameraMoveScript);
            let color = this.camera$.clearColor;
            color.x = 1;
            color.y = .913;
            color.z = .678;
            this.camera$.clearColor = color;
        }
        /**
     * 创建海洋
     */        createSea$() {
            /** 海洋模型 */
            this.sea$ = Mode_GameKey_l3D.create(this.baseScene$, 25);
        }
        /**
     * 创建铲子
     */        createDiger$() {
            /** 铲子对象 */
            this.diger$ = DigerControl$.create$(this.baseScene$);
        }
        /**
     * 更新
     */        update$() {
            this.rootScene$.physicsSimulation.fixedTimeStep = Laya.timer.delta * .001;
            this.updateLays$();
            this.refreshShakeCameraAnim$();
        }
        /**
     * 晃动摄像机
     */        shakeCamera$() {
            if (this.isShakeCamera$) return;
            /** 是否晃动相机 */            this.isShakeCamera$ = true;
            /** 震动偏移值 */            this.shakeOffset$ = .1;
            /** 震动时长 ms */            this.shakeT$ = 0;
        }
        /**
     * 刷新晃动相机动画
     */        refreshShakeCameraAnim$() {
            if (!this.isShakeCamera$) return;
            this.shakeOffset$ -= this.shakeOffset$ * TimeManager$.getInstance$().deltaTime$ * .002;
            this.shakeT$ += TimeManager$.getInstance$().deltaTime$;
            if (this.shakeT$ > 100) {
                this.shakeT$ = 0;
                this.shakeOffset$ = -this.shakeOffset$;
            }
            if (Math.abs(this.shakeOffset$) < .001) {
                //晃动结束
                let cameraPos = this.camera$.transform.position;
                cameraPos.x = this.startCameraPos$.x;
                this.camera$.transform.position = cameraPos;
                this.isShakeCamera$ = false;
            } else {
                let cameraPos = this.camera$.transform.position;
                cameraPos.x = this.startCameraPos$.x + this.shakeOffset$;
                this.camera$.transform.position = cameraPos;
            }
        }
        /**
     * 能否滚动
     */        isCanScroll$() {
            return this.fight_state$ == 1 || this.fight_state$ == 4 || this.fight_state$ == 5 || this.fight_state$ == 7;
        }
        /**
     * 更新摆件们
     */        updateLays$() {
            if (this.isCanScroll$()) this.scrollScene$();
            if (this.fight_state$ == 0 || this.fight_state$ == 1) this.checkCreateLays$();
            if (this.isCanScroll$()) this.checkDestroyLays$();
        }
        /**
     * 检测是否创建摆件
     */        checkCreateLays$() {
            let lastZ;
            if (this.lastLay$ && !this.lastLay$.destroyed) {
                //有上个摆件
                lastZ = this.lastLay$.dis + this.lastLay$.transform.position.z;
            } else {
                lastZ = 0;
            }
            if (lastZ < this.diger$.transform.position.z + this.cameraArea$) this.createLays$(0, lastZ);
        }
        /**
     * 检测销毁摆件
     */        checkDestroyLays$() {
            let i = this.layParents.length;
            let layParent, pos;
            while (--i > -1) {
                layParent = this.layParents[i];
                if (layParent.transform.position.z + layParent.dis < this.diger$.transform.position.z + this.destroyMinZ$) {
                    this.layParents.splice(i, 1);
                    layParent.destroy();
                }
            }
        }
        /**
     * 创建摆件
     */        createLays$(x, z) {
            let layParent = this.baseScene$.addChild(new Laya.Sprite3D());
            let pos = layParent.transform.position;
            pos.x = x;
            pos.y = 0;
            pos.z = z;
            layParent.transform.position = pos;
            this.layParents.push(layParent);
            let groupIndex = this.isRandGroup$ ? Math.floor(Math.random() * this.layGroupIds$.length) : ++this.lastGroupIndex$ % this.layGroupIds$.length;
            let layConfigs = Conf_GameKey_igManager.getInstance$().layConfig$.getGroupConfigs$(this.layGroupIds$[groupIndex]);
            if (!layConfigs) return;
            let i = layConfigs.length;
            let config;
            let dis;
            while (--i > -1) {
                config = layConfigs[i];
                dis || (dis = config.dis);
                if (config.type == GameSetting$.LAY_OBJ.ROW) {
                    //原材料
                    RawControl$.create$(layParent, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), Number(config.param1), this.baseScene$, this.diger$, this.fillId$, this.rawId$, 12, 1.2, 1);
                } else if (config.type == GameSetting$.LAY_OBJ.SAW) {
                    //锯子
                    SawControl$.create$(layParent, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), Number(config.param1), Number(config.param2));
                } else if (config.type == GameSetting$.LAY_OBJ.WALL) {
                    //墙
                    WallControl$.create$(config.modelId, layParent, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), Number(config.param1));
                } else if (config.type == GameSetting$.LAY_OBJ.COIN) {
                    CoinControl$.create$(layParent, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), true);
                } else if (config.type == GameSetting$.LAY_OBJ.ROTATE_PROPS || config.type == GameSetting$.LAY_OBJ.NOR_PROPS) {
                    PropsControl$.create$(layParent, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), Number(config.param1), config.type);
                } else if (config.type == GameSetting$.LAY_OBJ.LOOT_BOX$) {
                    LootBoxControl$.create$(layParent, new Laya.Vector3(config.pos[0], config.pos[1], config.pos[2]), new Laya.Vector3(config.angle[0], config.angle[1], config.angle[2]), new Laya.Vector3(config.scale[0], config.scale[1], config.scale[2]), config.modelId, Number(config.param1));
                }
            }
            layParent.dis = dis;
            this.lastLay$ = layParent;
            this.checkCreateLays$();
        }
        /**
     * 是否激活
     * @param {*} z 
     */        isActiveCol$(z) {
            let minDis = 5;
            if (z - this.diger$.transform.position.z <= minDis) {
                return true;
            }
            let i = this.rolls$.length;
            while (--i > -1) {
                if (z - this.rolls$[i].transform.position.z <= minDis) {
                    return true;
                }
            }
        }
        /**
     * 滚动场景
     */        scrollScene$() {
            // let dis = Laya.timer.delta * this.scrollSpeed$;
            // let i = this.layParents.length;
            // let layParent, pos;
            // while(--i > -1) {
            //     layParent = this.layParents[i];
            //     pos = layParent.transform.position;
            //     pos.z -= dis;
            //     layParent.transform.position = pos;
            // }
            if (!this.diger$ || this.diger$.destroyed) return;
            if (this.lastScrollT$ == void 0) this.lastScrollT$ = Laya.timer.currTimer;
            let dis = Math.floor(TimeManager$.getInstance$().deltaTime$ * this.scrollSpeed$ * 100) * .01;
            this.lastScrollT$ = Laya.timer.currTimer;
            //铲子
                        let pos = this.diger$.transform.position;
            pos.z += dis;
            // let childPos;//强行调整模型位置
            // !!this.diger$._children && this.diger$._children.length > 0 && (childPos = this.diger$._children[0].transform.localPosition, childPos.z = 0, this.diger$._children[0].transform.localPosition = childPos);
                        this.diger$.transform.position = pos;
            //相机
                        let cameraPos = this.camera$.transform.position;
            cameraPos.z += dis;
            this.camera$.transform.position = cameraPos;
            //海洋
                        let seaPos = this.sea$._localPosition;
            this.sea$.setLocalPosition(seaPos.x, .5, seaPos.z + dis);
            if (this.sea$.loaded) {
                if (!this.seaTopMaterial$) {
                    let topSea = Util_GameKey_s.getC_GameKey_hildDeep(this.sea$.sprite, "top");
                    let bottomSea = Util_GameKey_s.getC_GameKey_hildDeep(this.sea$.sprite, "bottom");
                    this.seaTopMaterial$ = topSea.meshRenderer.material;
                    this.seaBottomMaterial$ = bottomSea.meshRenderer.material;
                    this.seaUVOffset = new Laya.Vector4(this.seaTopMaterial$.tilingOffset.x, this.seaTopMaterial$.tilingOffset.y, 0, 0);
                    this.seaUVOffset2 = new Laya.Vector4(this.seaBottomMaterial$.tilingOffset.x, this.seaBottomMaterial$.tilingOffset.y, 0, 0);
                }
                this.seaUVOffset.w -= TimeManager$.getInstance$().deltaTime$ * 1e-4;
                this.seaTopMaterial$.tilingOffset = this.seaUVOffset;
                this.seaUVOffset2.w -= TimeManager$.getInstance$().deltaTime$ * 1e-4;
                this.seaBottomMaterial$.tilingOffset = this.seaUVOffset2;
            }
            if (this.finishZ$ < pos.z && this.fight_state$ == 4) {
                this.fight_state$ = 5;
            }
        }
        /**
     * 当卷动原材料
     */        onDig$(e) {
            this.digAllDis$ += e.data;
            this.score$ += Math.floor(e.data * 50);
            if (this.digAllDis$ >= this.digFinishDis$) {
                this.createFinishPos$();
            }
            Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.SCORE_CHANGE$, this.getScoreEventData$());
        }
        /**
     * 获取得分事件数据
     */        getScoreEventData$() {
            if (!this.scoreEventData$) this.scoreEventData$ = {};
            this.scoreEventData$.score = this.getScore$();
            this.scoreEventData$.roll_progress = Math.min(1, this.digAllDis$ / this.digFinishDis$);
            return this.scoreEventData$;
        }
        /**
     * 创建结束点
     */        createFinishPos$() {
            if (this.fight_state$ != 1) return;
            this.fight_state$ = 4;
            let lastZ;
            if (this.lastLay$ && !this.lastLay$.destroyed) {
                //有上个摆件
                lastZ = this.lastLay$.dis + this.lastLay$.transform.position.z;
            } else {
                lastZ = 0;
            }
            this.finishZ$ = lastZ + 30;
            FinishControl$.create$(this.baseScene$, new Laya.Vector3(0, 0, this.finishZ$), this.baseScene$, this.diger$, this.lootBoxId$, this.lootBoxDis$, 5);
        }
        /**
     * 战斗胜利
     */        fightWin$() {
            if (this.fight_state$ == 2 || this.fight_state$ == 0 || this.fight_state$ == 3) return;
            this.fight_state$ = 3;
            let score = this.getScore$();
            Data_GameKey_Manager.getInstance$().customData$.levelPass$(score);
            let battleUI = UIMa_GameKey_nager.getInstance$().getU_GameKey_I(BattleUI$);
            battleUI && battleUI.destroy();
            UIMa_GameKey_nager.getInstance$().open_GameKey_UI(BattleWinUI$, undefined, score);
        }
        /**
     * 获取舞台坐标
     * @param {*} postion 
     * @param {*} viewPos 
     */        getStagePos$(postion, viewPos) {
            viewPos = viewPos || new Laya.Vector3();
            this.camera$.worldToViewportPoint(postion, viewPos);
            return viewPos;
        }
        /**
     * 销毁所有摆件
     */        destroyAllLays$() {
            let i = this.layParents.length;
            while (--i > -1) {
                this.layParents[i].destroy();
            }
            this.layParents = [];
        }
    }
    /** 场景路径 */    BattleScene$.url = "Scene/BattleScene.scene";
    /** 类名 */    BattleScene$.className = "BattleScene$";
    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
            reg("script/Module/Battle/View/BattleRestartUI.js", BattleRestartUI$);
            reg("script/Module/Battle/View/ScoreUpAnimUIControl.js", ScoreUpAnimUIControl$);
            reg("script/Module/Battle/View/BattleWinUI.js", BattleWinUI$);
            reg("script/Module/Loading/View/LoginLoadingUI.js", Logi_GameKey_nLoadingUI);
            reg("script/Module/Main/View/MainUI.js", MainUI$);
            reg("script/Module/Battle/Scene/BattleScene.js", BattleScene$);
            reg("script/Module/Battle/View/BattleUI.js", BattleUI$);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Prefab/Battle/RestartWindow.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();
    /**
   * @author CJW
   */    class UIMgr {
        constructor() {
            this._uis$ = [];
            Laya.uiMgr$ = this;
        }
        static init$() {
            if (!Laya.uiMgr$) {
                new UIMgr();
            }
        }
        onUIOpen$(ui) {
            if (this._uis$.indexOf(ui) === -1) {
                this._uis$.push(ui);
            }
        }
        onUIClose$(ui) {
            if (this._uis$.indexOf(ui) !== -1) {
                this._uis$.remove$(ui);
                this.restoreBanner$();
            }
        }
        restoreBanner$() {
            let lastUI = this._uis$[this._uis$.length - 1];
            lastUI && lastUI.restoreBanner$ && lastUI.restoreBanner$();
        }
    }
    /**
   * 游戏管理
   * 作者：陈雅智
   * 日期：2019/10/11
   */    class Game_GameKey_Manager {
        constructor() {
            /** 是否初始化 */
            this.inited = false;
        }
        /**
     * 获取单例
     * @return {Game_GameKey_Manager}
     */        static getInstance$() {
            if (Game_GameKey_Manager.instance == null) {
                window.gameManager = Game_GameKey_Manager.instance = new Game_GameKey_Manager();
            }
            return Game_GameKey_Manager.instance;
        }
        /**
         * 初始化 管理者们
         */ 
        init_GameKey_Manager() {
            if (this.inited) //初始化过了
            return;
            UIMgr.init$();
            //初始化事件管理
                        if (!Even_GameKey_tManager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                Even_GameKey_tManager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始静态数据管理
                        if (!Conf_GameKey_igManager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                Conf_GameKey_igManager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始化界面管理
                        if (!UIMa_GameKey_nager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                UIMa_GameKey_nager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始化SDK管理
                        if (!SdkManager$.getInstance$().isIn_GameKey_ited) {
                //未初始化
                SdkManager$.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始动态数据管理
                        if (!Data_GameKey_Manager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                Data_GameKey_Manager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始化时间管理
                        if (!TimeManager$.getInstance$().isIn_GameKey_ited) {
                //未初始化
                TimeManager$.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始化音频管理
                        if (!Audi_GameKey_oManager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                Audi_GameKey_oManager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //分包加载
                        if (!Game_GameKey_Manager.loadedPacks) {
                if (Laya.Browser.onMiniGame) {
                    UIMa_GameKey_nager.getInstance$().open_GameKey_UI(Logi_GameKey_nLoadingUI, null, function() {
                        Game_GameKey_Manager.loadedPacks = true;
                        this.init_GameKey_Manager();
                    }.bind(this));
                    return;
                }
            }
            //初始化场景管理
                        if (!Scen_GameKey_eManager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                Scen_GameKey_eManager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            //初始化网络管理
                        if (!Prot_GameKey_ocolManager.getInstance$().isIn_GameKey_ited) {
                //未初始化
                Prot_GameKey_ocolManager.getInstance$().init(this.init_GameKey_Manager.bind(this));
                return;
                //等待初始化完成 回调执行下一个初始化
                        }
            this.onIn_GameKey_itedGame();
        }
        /**
         * 当初始化成功
         */ 
        onIn_GameKey_itedGame() 
        {
            YYGSDK.on(YYG.Event.YYGSDK_INITIALIZED,this,()=>
            {
                UIMa_GameKey_nager.getInstance$().open_GameKey_UI(Laya.CyzClassMap["MainUI"]);
                Scen_GameKey_eManager.getInstance$().open_GameKey_Scene(BattleScene$);
            });
            let o = new YYG.Options();
            o.gameNameId = "Spiral-Roll";
            o.gamedistributionID = "e4bfb87b8a4d4dd5b28e8b49ba4b0cf6";
            YYGSDK.__init__(YYG.ChannelType.YAD,o);
            
        }
        /**
     * 监听事件
     */        moni_GameKey_torEvents() {
            // Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.ON_SHOW_GAME, this, this.onSh_GameKey_owGame);
            // Even_GameKey_tManager.getInstance$().addE_GameKey_ventListener(SSEV_GameKey_ENT.ON_EXIT_GAME, this, this.onEx_GameKey_itGame)
        }
        /**
     * 后台切回游戏
     */        onSh_GameKey_owGame() {
            // Offl_GameKey_ineManager.getInstance$().onSh_GameKey_owGame();
            // if(Offl_GameKey_ineManager.getInstance$().isNe_GameKey_edOpenOfflineUI()){
            //     this.open_GameKey_OfflineUI();
            // }else{
            //     this.chec_GameKey_kOpenSign();
            // }
        }
        /**
     * 离开游戏
     */        onEx_GameKey_itGame() {
            // Offl_GameKey_ineManager.getInstance$().onEx_GameKey_itGame();
        }
        /**
     * 打开主界面
     */        open_GameKey_MainUI(callback) {
            // UIMa_GameKey_nager.getInstance$().open_GameKey_UI(Main_GameKey_UI, callback);
        }
        /**
     * 打开离线界面
     */        open_GameKey_OfflineUI() {
            // UIMa_GameKey_nager.getInstance$().open_GameKey_UI(OffL_GameKey_ineRewardUI);
        }
        /**
    * 调用手机震动
    */        vibr_GameKey_ation() {
            if (!Data_GameKey_Manager.getInstance$().settingData$.getS_GameKey_hake()) return;
            //开关没开
            if (Laya.Browser.onMiniGame) 
            {
            } else if (window.navigator.vibrate) {
                window.navigator.vibrate(500);
            } else {
                return;
            }
        }
    }
    /** 单例 */    Game_GameKey_Manager.instance = undefined;
    class DataInputStream {
        constructor(arrayBuffer) {
            this.arrayBuffer = arrayBuffer;
            this.index = 0;
            this.dv = new DataView(this.arrayBuffer);
        }
        readByte() {
            return this.dv.getInt8(this.index++);
        }
        readShort() {
            var value = this.dv.getInt16(this.index);
            this.index += 2;
            return value;
        }
        readInt() {
            var value = this.dv.getInt32(this.index);
            this.index += 4;
            return value;
        }
        readUint() {
            var value = this.dv.getUint32(this.index);
            this.index += 4;
            return value;
        }
        readLong() {
            var value1 = this.readInt();
            var value2 = this.readUint();
            var value = value1 * Math.POW_2_32 + value2;
            return value;
        }
        readFloat() {
            var value = this.dv.getFloat32(this.index);
            this.index += 4;
            return value;
        }
        readUTF() {
            var num = this.readShort();
            return this.readText(num);
        }
        readText(length) {
            var buffer = this.arrayBuffer.slice(this.index, this.index + length);
            var array = new Uint8Array(buffer);
            var v = "", max = length, c = 0, c2 = 0, c3 = 0, f = String.fromCharCode, idx = 0;
            var u = array, i = 0;
            while (idx < max) {
                c = u[idx++];
                if (c < 128) {
                    if (c != 0) {
                        v += f(c);
                    }
                } else if (c < 224) {
                    v += f((c & 63) << 6 | u[idx++] & 127);
                } else if (c < 240) {
                    c2 = u[idx++];
                    v += f((c & 31) << 12 | (c2 & 127) << 6 | u[idx++] & 127);
                } else {
                    c2 = u[idx++];
                    c3 = u[idx++];
                    v += f((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | u[idx++] & 127);
                }
                i++;
            }
            this.index += length;
            return v;
        }
        readArrayBuffer(length) {
            var buffer = this.arrayBuffer.slice(this.index, this.index + length);
            this.index += length;
            return buffer;
        }
    }
    class DataWrap {
        static init_GameKey_Data() {
            if (GameSetting$.LOAD_DATA_JS) {
                // 用脚本方式读取
                function dataload() {
                    for (var tableName in D) {
                        if ("properties" == tableName) continue;
                        var data = D[tableName];
                        var properties = D.properties[tableName];
                        if (!properties) continue;
                        for (var id in data) {
                            var valueArray = data[id];
                            var entry = {};
                            entry[properties[0]] = id;
                            for (var i = 1, n = properties.length; i < n; i++) {
                                var value = valueArray[i - 1];
                                if (value !== undefined) {
                                    entry[properties[i]] = value;
                                }
                            }
                            data[id] = entry;
                        }
                    }
                    onDataCompleted();
                }
                dataload();
                // document.write("<script type=\"text/javascript\" src=\"script/data.js\" onload=\"dataload();\"></script>");
                        } else {
                // 用加载方式读取
                function dataload() {
                    var tmpData = {};
                    var _data = Laya.Loader.getRes("script/data.bin");
                    var dis = new DataInputStream(_data);
                    var tableName = dis.readUTF();
                    var colNum, columnNames = [], columnTypes = [], rowNum, value, rowData, table, arraySize, m;
                    while ("#" != tableName) {
                        table = tmpData[tableName] = {};
                        colNum = dis.readByte();
                        columnNames.length = 0;
                        columnTypes.length = 0;
                        for (var i = 0; i < colNum; i++) {
                            columnNames.push(dis.readUTF());
                            columnTypes.push(dis.readUTF());
                        }
                        rowNum = dis.readShort();
                        for (var j = 0; j < rowNum; j++) {
                            for (var n = 0; n < colNum; n++) {
                                switch (columnTypes[n]) {
                                  case "byte":
                                    value = dis.readByte();
                                    break;

                                  case "short":
                                    value = dis.readShort();
                                    break;

                                  case "int":
                                    value = dis.readInt();
                                    break;

                                  case "float":
                                    value = dis.readFloat();
                                    break;

                                  case "string":
                                    value = dis.readUTF();
                                    break;

                                  case "int[]":
                                    value = undefined;
                                    arraySize = dis.readShort();
                                    if (arraySize > 0) {
                                        value = [];
                                        for (m = 0; m < arraySize; m++) {
                                            value.push(dis.readInt());
                                        }
                                    }
                                    break;

                                  case "float[]":
                                    value = undefined;
                                    arraySize = dis.readShort();
                                    if (arraySize > 0) {
                                        value = [];
                                        for (m = 0; m < arraySize; m++) {
                                            value.push(dis.readFloat());
                                        }
                                    }
                                    break;

                                  default:
                                    debugger;
                                    console.error("法：" + columnTypes[n]);
                                    break;
                                }
                                if (n == 0) {
                                    rowData = table[value] = {};
                                }
                                rowData[columnNames[n]] = value;
                            }
                        }
                        tableName = dis.readUTF();
                    }
                    D = tmpData;
                    Laya.Loader.clearRes("script/data.bin", true);
                    //用完记得释放掉内存啊
                                        onDataCompleted();
                }
                Laya.loader.load("script/data.bin", Handler.create(this, dataload), null, Laya.Loader.BUFFER);
            }
            function onDataCompleted() {
                fullPrefabsPath();
                fullItem();
                D._inited = true;
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_DATA_LOAD);
            }
            function fullPrefabsPath() {
                var emptyArray = [];
                for (var key in D.PrefabsPath) {
                    var config = D.PrefabsPath[key];
                    if (!config.subModel) {
                        config.subModel = emptyArray;
                    } else {
                        config.subModel = config.subModel.split("#");
                    }
                    if (!config.actionInShop) {
                        config.actionInShop = emptyArray;
                    } else {
                        config.actionInShop = config.actionInShop.split("#");
                    }
                }
            }
            function fullItem() {
                var vItemConfig;
                for (var key in D.shop) {
                    var config = D.shop[key];
                    vItemConfig = D.Item[config.itemId];
                    if (vItemConfig) vItemConfig.shopId = key;
                }
            }
        }
    }
    /**
   * 请求协议接口
   * 作者：陈雅智
   * 日期：2019/10/12
   */    class ReqP_GameKey_rotocolHandler {
        constructor(mgr) {
            /** 主管引用 */
            this.ProtocolMgr = mgr;
        }
        // 发送请求
        _sen_GameKey_dLoginReq(data, isWait) {
            if (this.ProtocolMgr) {
                this.ProtocolMgr.reqLoginData(data, isWait);
            }
        }
        /**
     * 发送请求
     * @param data
     * @param isWait 是否等待返回, 如果没有返回消息的一定不能=true!!!
     * @param isKeyReq 是否关键请求。如果是关键请求，失败直接回到登录界面；否则无视。
     * @private
     */        _sen_GameKey_dServerReq(data, isWait, isKeyReq) {
            if (GameConfig.SWITCH.ONLINE) {
                if (this.ProtocolMgr) {
                    // console.log(data);
                    this.ProtocolMgr.reqServerData(data, isWait, isKeyReq);
                }
            } else {
                var localFunc = this["local" + data.className];
                localFunc && localFunc(data);
            }
        }
        /**------------------------处理-----------------------------*/
        /**
     * 请求登录
     * @param account               CP自有账号
     * @param password              CP自有密码
     * @param platform              平台
     * @param spId                  渠道ID    
     * @param platformUserId        平台用户ID
     * @param platformAccessToken   平台Token
     */        reqL_GameKey_oginAccount(account, password, platform, spId, platformUserId, platformAccessToken, exJsonParam) {
            var data = {
                className: "ReqLoginAccount",
                login: true,
                account: account,
                password: password,
                platform: platform,
                platformUserId: platformUserId,
                platformAccessToken: platformAccessToken,
                spId: spId,
                exJsonParam: exJsonParam,
                phoneVersion: phoneVersion
            };
            this._sen_GameKey_dLoginReq(data);
        }
        reqW_GameKey_xAccount(code) {
            var data = {
                className: "ReqWxAccount",
                login: true,
                code: code
            };
            this._sen_GameKey_dLoginReq(data);
        }
        reqL_GameKey_oginGame(shareParams) {
            var data = {
                className: "ReqLoginGame",
                serverId: Prot_GameKey_ocolManager.getInstance$().curS_GameKey_electServerId + 1,
                tokenId: Prot_GameKey_ocolManager.getInstance$().sess_GameKey_ionId,
                spuid: Prot_GameKey_ocolManager.getInstance$().SDK__GameKey_SP_UID ? Prot_GameKey_ocolManager.getInstance$().SDK__GameKey_SP_UID : "",
                shareParams: shareParams
            };
            this._sen_GameKey_dServerReq(data, false, true);
        }
        reqE_GameKey_nterGameFinish() {
            var data = {
                className: "ReqEnterGameFinish"
            };
            this._sen_GameKey_dServerReq(data);
        }
        req_GameKey_EnterGame() {
            var data = {
                className: "ReqEnterGame"
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        hear_GameKey_tbeat() {
            // 进入游戏后才开始心跳
            if (!Prot_GameKey_ocolManager.getInstance$().hasE_GameKey_nterGame) return;
            // 已断开服务器连接
                        if (!Prot_GameKey_ocolManager.getInstance$().runn_GameKey_ing) return;
            var data = {
                className: "ReqHeart",
                time: Math.floor(Prot_GameKey_ocolManager.getInstance$().currentTime + Prot_GameKey_ocolManager.getInstance$().serv_GameKey_erTimeDiff / 1e3)
            };
            this._sen_GameKey_dServerReq(data, false);
        }
        /**
     * 请求战斗开始
     * @param {地图id} mapId 
     */        req_GameKey_StartFight(mapId) {
            var data = {
                className: "ReqFight",
                opType: 1,
                mapId: mapId,
                score: 0,
                coin: 0
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        /**
     * 请求战斗结算
     * @param score 积分
     * @param coin 金币
     * @param mapId 地图id
     * @param num 击杀怪物数
     */        reqB_GameKey_attleBill(score, coin, mapId, num) {
            if (GameConfig.SWITCH.ONLINE) {
                var data = {
                    className: "ReqFight",
                    opType: 2,
                    score: score,
                    coin: coin,
                    mapId: mapId,
                    num: num
                };
                this._sen_GameKey_dServerReq(data, true);
            } else {
                Prot_GameKey_ocolManager.getInstance$().hand_GameKey_ler.handleRspBill({});
            }
        }
        /**
     * 请求钻石复活
     */        reqG_GameKey_oldRelife() {
            var data = {
                className: "ReqFight",
                opType: 3
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        // 离线返回
        loca_GameKey_lReqBattleBill(data) {
            var result = {
                className: "RspBill"
            };
            result.id = data.id;
            result.lotteryCoin = data.holdArea >= 500 ? utils.intRange(1e3, 9999) : 0;
            result.holdAreaCoin = 100;
            result.killCoin = 120;
            Laya.timer.once(1, Prot_GameKey_ocolManager.getInstance$(), Prot_GameKey_ocolManager.getInstance$()._pro_GameKey_cess, [ result ]);
        }
        reqF_GameKey_ightScene(opType, id, isWait) {
            var data = {
                className: "ReqFightScene",
                opType: opType,
                sceneId: id
            };
            this._sen_GameKey_dServerReq(data, isWait);
        }
        // 离线返回
        loca_GameKey_lReqFightScene(data) {
            if (data.opType == 5) {
                var result = {
                    className: "RspRelive"
                };
                result.code = 1e3;
                Laya.timer.once(1, Prot_GameKey_ocolManager.getInstance$(), Prot_GameKey_ocolManager.getInstance$()._pro_GameKey_cess, [ result ]);
            }
        }
        //根据操作类型，决定功能
        //opType操作类型，page商店配表页码，shopId商店id, num数量
        reqS_GameKey_hop(opType, page, shopId, num) {
            //发数据
            var data = {
                className: "ReqShop",
                opType: opType,
                page: page,
                shopId: shopId,
                num: num
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        reqS_GameKey_hopList(page) {
            //请求商店清单
            if (!GameConfig.SWITCH.ONLINE) {
                var shopArray = [];
                var key;
                var vConfig;
                for (key in D.shop) {
                    vConfig = D.shop[key];
                    if (vConfig.page == page) {
                        shopArray.push({
                            id: vConfig.id,
                            status: 0
                        });
                    }
                }
                Prot_GameKey_ocolManager.getInstance$().hand_GameKey_ler.handleRspShopList({
                    page: page,
                    shops: shopArray
                });
            } else this.reqS_GameKey_hop(ReqP_GameKey_rotocolHandler.SHOP_OPTYPE.GET_SHOP_LIST, page, 0, 0);
        }
        reqB_GameKey_uyShop(shopId, num) {
            //购买商品
            this.reqS_GameKey_hop(ReqP_GameKey_rotocolHandler.SHOP_OPTYPE.BUY_SHOP_ITEM, 0, shopId, num);
        }
        reqC_GameKey_hangeSkin(shopId) {
            //请求更换皮肤
            this.reqS_GameKey_hop(ReqP_GameKey_rotocolHandler.SHOP_OPTYPE.CHANGE_SKIN, 0, shopId, 1);
        }
        reqR_GameKey_ename(str) {
            var data = {
                className: "ReqRename",
                name: str
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        reqR_GameKey_echarge(id) {
            //充值
            var data = {
                className: "ReqRecharge",
                id: id
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        reqP_GameKey_ayOrder(platform, orderParams) {
            var data = {
                className: "ReqPayOrder",
                platform: platform,
                orderParams: orderParams
            };
            this._sen_GameKey_dLoginReq(data, false);
        }
        /** 1去除广告、2观看广告奖励*/        ReqA_GameKey_d(opType) {
            var data = {
                className: "ReqAd",
                opType: opType
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        /** 1在线奖励 */        ReqP_GameKey_rize(opType) {
            var data = {
                className: "ReqPrize",
                opType: opType
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        //请求排行数据
        ReqR_GameKey_ank(opType, timeType) {
            if (!GameConfig.SWITCH.ONLINE) {
                var rankList = [ {
                    rank: 1,
                    name: "一年级" + timeType,
                    value: 200
                }, {
                    rank: 2,
                    name: "二年级" + timeType,
                    value: 300
                } ];
                Prot_GameKey_ocolManager.getInstance$().hand_GameKey_ler.handleRspRank({
                    timeType: timeType,
                    list: rankList,
                    myRank: 100,
                    myValue: 100
                });
            } else {
                var data = {
                    className: "ReqRank",
                    opType: opType,
                    /** 操作类型：0获取排行列表 */
                    timeType: timeType
                };
                this._sen_GameKey_dServerReq(data, true);
            }
        }
        ReqO_GameKey_penTaskBox(idx) {
            //解锁或打开任务宝箱(先解锁后打开)
            var data = {
                className: "ReqTask",
                opType: 2,
                idx: idx + 1
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        ReqG_GameKey_oldOpenTaskBox(idx) {
            //钻石打开任务宝箱(先解锁后打开)
            var data = {
                className: "ReqTask",
                opType: 3,
                idx: idx + 1
            };
            this._sen_GameKey_dServerReq(data, true);
        }
        reqW_GameKey_x(nickname, head) {
            var data = {
                className: "ReqWx",
                name: nickname,
                head: head
            };
            this._sen_GameKey_dServerReq(data, false);
        }
        /**
     * 请求打开普通扭蛋
     */        reqO_GameKey_penNorEgg(id) {
            this.reqPrize(2, id);
        }
        /**
     * 请求打开魔法扭蛋
     */        reqO_GameKey_penMagicEgg(id) {
            this.reqPrize(3, id);
        }
        /**
     * 增加分享奖励次数
     */        reqS_GameKey_hareLink(shareParams) {
            var data = {
                className: "ReqShareLink",
                params: shareParams
            };
            this._sen_GameKey_dServerReq(data, false);
        }
        /**
     * 请求商店分享奖励
     * @param shopItemId 商品id
     */        reqS_GameKey_hopSharePrize(shopItemId) {
            this.reqPrize(4, shopItemId);
        }
        /**
     * 请求分享操作
     * @param type 1获取普通扭蛋分享列表,2魔法扭蛋分享列表 3获取商店分享列表
     * @param id 商品id
     */        reqS_GameKey_hare(type, id) {
            var data = {
                className: "ReqShare",
                type: type,
                id: id
            };
            this._sen_GameKey_dServerReq(data, false);
        }
        /**
     * 请求扭蛋分享id们
     */        reqE_GameKey_ggShareOpenIds() {
            this.reqS_GameKey_hare(1);
            this.reqS_GameKey_hare(2);
        }
        /**
     * 请求商品分享id们
     */        reqS_GameKey_hopShareOpenIds(id) {
            this.reqS_GameKey_hare(3, id);
        }
    }
    /** 商店操作类型 */    ReqP_GameKey_rotocolHandler.SHOP_OPTYPE = {};
    /** 获取商店清单 */    ReqP_GameKey_rotocolHandler.SHOP_OPTYPE.GET_SHOP_LIST = 0;
    /** 购买商店单位 */    ReqP_GameKey_rotocolHandler.SHOP_OPTYPE.BUY_SHOP_ITEM = 1;
    /** 改变皮肤和拖尾 */    ReqP_GameKey_rotocolHandler.SHOP_OPTYPE.CHANGE_SKIN = 2;
    /**
   * 监听游戏关闭
   */    window.onunload = function() {
        if (Prot_GameKey_ocolManager.getInstance$().sess_GameKey_ionId) {
            var data = {
                className: "ReqExit"
            };
            Prot_GameKey_ocolManager.getInstance$().getR_GameKey_eqHandle()._sendServerReq(data);
        }
    };
    /**
   * 接收协议接口
   */    class RspP_GameKey_rotocolhand_GameKey_ler {
        constructor() {}
        // 返回登录帐号结果
        hand_GameKey_leRspLoginAccount(data) {
            if ("success" == data.resultMsg) {
                Prot_GameKey_ocolManager.getInstance$().sess_GameKey_ionId = data.tokenId;
                Data_GameKey_Manager.getInstance$().roleData.user_GameKey_Id = data.userId;
                // 保存账号密码
                                if (G.DefaultAccount) {
                    dataManager.setLocalKey(G.LOCAL_KEY.ACCOUNT, G.DefaultAccount);
                    dataManager.setLocalKey(G.LOCAL_KEY.PASSWORD, G.DefaultPassword);
                }
                eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_REGISTER_FINISH);
                if (GameSDK) {
                    if (data.isNew) {
                        // GameSDK.reportRegister();
                    }
                    GameSDK.reportLogin();
                }
            } else {
                if (ss.GameSDK) {
                    utils.showWarnView(ss.GameSDK, "警告", data.resultMsg, "login", "确定");
                } else {
                    utils.prompt(data.resultMsg);
                    var loginUI = uiManager.getUI("ss.LoginUI");
                    loginUI && loginUI.showInputAccountUI && loginUI.showInputAccountUI();
                }
            }
        }
        hand_GameKey_leRspWxAccount(data) {
            eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.RSP_WX_ACCOUNT, data);
        }
        // 返回登录游戏结果
        hand_GameKey_leRspLoginGame(data) {
            G.serverTimeDiff = data.serverTime - Laya.Browser.now();
            //与服务器时间差
                        if ("success" == data.resultMsg) {
                eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_LOGINGAME_FINISH);
            } else {
                eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_NET_FAILD);
                //utils.prompt(data.resultMsg);
                                console.error(data.resultMsg);
            }
        }
        hand_GameKey_leRspHeart(data) {}
        // 返回角色信息
        hand_GameKey_leRspRoleInfo(data) {
            dataManager.setRoleInfo(data);
        }
        hand_GameKey_leRspCommon(data) {
            switch (data.rspType) {
              case -1:
                //观看广告的次数
                dataManager.adsData.setLeftAdsCoinTime(data.value);
                break;

              case -4:
                //下次在线奖励计时
                dataManager.setOnlinePrizeTime(data.value);
                eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.ONLINE_PRIZE_TIME);
                break;

              case -5:
                //当前皮肤
                dataManager.setRoleId(data.value);
                eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.CUR_SKIN_CHANGE);
                break;

              case -8:
                //分享复活时间间隔
                dataManager.setShareLifeCdTime(Number(data.value));
                break;

              case -9:
                //历史高分
                dataManager.setHighScore(data.value);
                break;

              case -10:
                //本周高分
                dataManager.setWeekScore(data.value);
                break;

              case -11:
                // 是否已减少在线奖励(0/1)
                dataManager.setIsOnlineCdReduce(data.value);
                break;

              case -12:
                // 剩余普通扭蛋次数
                dataManager.shareData.setNormalEggTimes(data.value);
                break;

              case -13:
                // 剩余魔法扭蛋次数
                dataManager.shareData.setMagicEggTimes(data.value);
                break;
            case -14:
                // 设置扭蛋猫粮标志
                dataManager.shareData.setEggFoodSign(data.value);

              default:
                break;
            }
        }
        hand_GameKey_leRspPrompt(data) {
            switch (data.code) {
              case 0:
                utils.prompt(data.msg);
                break;

              case -1:
                // 断线
                Prot_GameKey_ocolManager.getInstance$().reLo_GameKey_gin();
                return -1;

              case -3:
                // 外挂加速
                Prot_GameKey_ocolManager.getInstance$().show_GameKey_ReconnectWarning();
                break;

              case -4:
                //固定提示
                if (!dataManager.uiData.mainUIShowTipMsgList) {
                    dataManager.uiData.mainUIShowTipMsgList = [ data.msg ];
                } else {
                    dataManager.uiData.mainUIShowTipMsgList.push(data.msg);
                }
                uiManager.refreshMspTipShow();
                break;
            }
        }
        hand_GameKey_leRspBagItem(data) {
            var lastItemCnt = dataManager.getBagItemCnt(data.item.id);
            dataManager.updateBagItem(data.item);
            var deltaCnt = data.item.amount - lastItemCnt;
            if (deltaCnt > 0) {
                //获得物品
                var itemConfig = D.Item[data.item.id];
                if (itemConfig) {
                    if (data.way == G.GET_ITEM_WAY.TASK_DONE || data.way == G.GET_ITEM_WAY.TASK_UNLOCK) {//任务奖励
                        //不做表现
                    } else if (data.way == G.GET_ITEM_WAY.BATTLE_RESULT && data.item.id == G.ITEM_ID.COIN) {//结算获得且是金币
                        //不做表现
                    } else if (data.way == G.GET_ITEM_WAY.NOR_EGG) {//普通扭蛋
                        //不做表现
                    } else if (data.way == G.GET_ITEM_WAY.MAGIC_EGG) {//魔法扭蛋
                        //不做表现
                    } else {
                        //其它获得途径
                        uiManager.askShowSingleReward(itemConfig.name, deltaCnt);
                    }
                }
            }
        }
        /**
     * 收到计入战斗协议
     */        hand_GameKey_leRspFightStart(data) {
            dataManager.inFight = true;
            dataManager.fightData.recordBfData();
            dataManager.fightData.setData(data);
            eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_RSP_ENTER);
        }
        /**
     * 收到复活
     */        hand_GameKey_leRspRelive(data) {
            eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_RELIVE, {
                success: data.code == 1e3
            });
        }
        //返回战斗结算数据
        hand_GameKey_leRspBill(data) {
            dataManager.inFight = false;
            dataManager.pushTmpBattleResult(data);
            eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.RECIVE_BATTLE_RESULT);
        }
        //获得商店清单数据
        hand_GameKey_leRspShopList(data) {
            //收到的结构(page,shops)
            dataManager.shopData.shopListChange(data);
            //处理数据
                        eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.RECIVE_SHOP_LIST, data.page);
            //处理逻辑
                }
        hand_GameKey_leRspRank(data) {
            //收到排行数据
            dataManager.rankData.setData(data);
            eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.RECIVE_RANK_DATA);
        }
        /**
     * 获得新皮肤
     */        hand_GameKey_leRspSkin(data) {
            //获得新皮肤
            dataManager.shopData.onShopItemGot(data.id);
            eventDispatcher.disp_GameKey_atchEvent(SSEV_GameKey_ENT.GET_SHOP_ITEM, {
                id: data.id
            });
        }
    }
    /**
   * 跟随UI的3D模型
   * 作者：陈雅智
   * 日期：2019/11/14
   */    class UIMo_GameKey_de3D {
        constructor() {
            /** 当前模型位置 */
            this.curPos = new Laya.Vector3();
        }
        /**
     * 创建接口
     * @param {*} targetUI 目标UI
     * @param {*} modelId 模型id
     */        static create(targetUI, modelId, loadedHandler) {
            /** UI模型控制 */
            let uiModelCtr = new UIMo_GameKey_de3D();
            uiModelCtr.init(targetUI, modelId, loadedHandler);
            return uiModelCtr;
        }
        /**
     * 初始化
     * @param {*} targetUI 
     * @param {*} modelId 
     * @param {*} loadedHandler 
     */        init(targetUI, modelId, loadedHandler) {
            /** 目标UI */
            this.targetUI = targetUI;
            /** 模型Id */            this.modelId = modelId;
            /** 加载完回调 */            this.load_GameKey_edHandler = loadedHandler;
            /** UI数据 */            this.uiDa_GameKey_ta = Mode_GameKey_lUtils.getU_GameKey_IData(targetUI);
            /** 模型创建 */            this.modelCtr = Mode_GameKey_l3D.create(this.uiDa_GameKey_ta.scene, this.modelId, Laya.Handler.create(this, this.onMo_GameKey_delLoaded));
            /** 开始循环跟踪 */            Laya.timer.loop(1, this, this.upda_GameKey_tePos);
        }
        /**
     * 模型加载好
     */        onMo_GameKey_delLoaded() {
            this.load_GameKey_edHandler && this.load_GameKey_edHandler.runWith(this);
            this.load_GameKey_edHandler = undefined;
        }
        /**
     * 播放动画
     * @param {动画名字} animName 
     * @param {是否循环播放} isLoop 
     * @param {调用对象} caller 
     * @param {回调} callback 
     */        playAnim(animName, isLoop, caller, callback, speed) {
            this.modelCtr && this.modelCtr.playAnim(animName, isLoop, caller, callback, speed);
        }
        /**
     * 刷新模型位置
     */        upda_GameKey_tePos() {
            if (!this.modelCtr) return;
            Laya.Point.TEMP.setTo(0, 0);
            this.targetUI.localToGlobal(Laya.Point.TEMP);
            this.curPos = Mode_GameKey_lUtils.get3_GameKey_DUIPos(Laya.Point.TEMP.x, Laya.Point.TEMP.y, this.targetUI, this.curPos);
            this.modelCtr.setPosition(this.curPos.x, this.curPos.y, this.curPos.z);
        }
        /**
     * 释放
     */        dispose() {
            Laya.timer.clearAll(this);
            this.modelCtr && this.modelCtr.dispose();
            this.modelCtr = undefined;
            Mode_GameKey_lUtils.dest_GameKey_royUIModel(this.targetUI, this.modelId);
        }
    }
    /**
   * 类字典注册（类依赖解决}
   * 作者：陈雅智
   * 日期：2019/10/24
   */    class CyzClassMap {
        static init() {
            Laya.CyzClassMap = {};
            Laya.CyzClassMap["LocalData"] = LocalData$;
            Laya.CyzClassMap["BaseWindow"] = Base_GameKey_Window;
            Laya.CyzClassMap["ReqProtocolHandler"] = ReqP_GameKey_rotocolHandler;
            Laya.CyzClassMap["RspProtocolHandler"] = RspP_GameKey_rotocolhand_GameKey_ler;
            Laya.CyzClassMap["UIMode3D"] = UIMo_GameKey_de3D;
            Laya.CyzClassMap["MainUI"] = MainUI$;
        }
    }
    class Main {
        constructor() {
            //根据IDE设置初始化引擎		
            Laya3D.init(0, 0);
            //类注册
             CyzClassMap.init();
            // Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            //兼容微信不支持加载scene后缀场景
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
                        if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat) Laya.Stat.show();
            Laya.alertGlobalError = true;
            // Laya.loader.load("res.plf", Laya.Handler.create(this, this.onPlfLoaded));
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
            window.onunload = function(e) {
                Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.ON_EXIT_GAME);
                gameManager.onEx_GameKey_itGame();
                // OfflineManager.getInstance().onExitGame();
            };
        }
        onPlfLoaded() {
            //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            DataWrap.init_GameKey_Data();
            //初始化工具
            Mode_GameKey_lUtils.init();
            //初始化游戏管理
            Game_GameKey_Manager.getInstance$().init_GameKey_Manager();
        }
    }
    //配置覆盖
        GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.screenMode = Laya.Browser.onPC ? Laya.Stage.SCREEN_NONE : Laya.Stage.SCREEN_VERTICAL;
    GameConfig.alignV = Laya.Stage.ALIGN_CENTER;
    GameConfig.alignH = Laya.Stage.ALIGN_MIDDLE;
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    //激活启动类
        new Main();
    /*
   * 自适应算法
   */    function calcWH() {
        var maxWidth = 854;
        var minWidth = 720;
        var data = {};
        var clientWidth = Laya.Browser.clientWidth * Laya.Browser.pixelRatio;
        var clientHeight = Laya.Browser.clientHeight * Laya.Browser.pixelRatio;
        var rateMin = 1280 / maxWidth;
        var rateMax = 1280 / minWidth;
        var clientRate;
        // 如果玩家横屏玩，提示竖屏体验更好
                if (!Laya.Browser.onPC) {
            clientRate = clientHeight > clientWidth ? clientHeight / clientWidth : clientWidth / clientHeight;
        } else {
            clientRate = clientHeight / clientWidth;
        }
        var trueRate = clientRate;
        if (clientRate > rateMax) {
            //过细
            data["scaleMode"] = Laya.Stage.SCALE_FIXED_AUTO;
            data["height"] = 1280;
            data["width"] = minWidth;
            GameSetting.ratio = Laya.Browser.clientWidth / Laya.stage.width;
        } else if (clientRate < rateMin) {
            //过粗
            data["scaleMode"] = Laya.Stage.SCALE_SHOWALL;
            data["height"] = 1280;
            data["width"] = maxWidth;
            GameSetting.ratio = Laya.Browser.clientHeight / Laya.stage.height;
        } else {
            data["scaleMode"] = Laya.Stage.SCALE_FIXED_HEIGHT;
            data["height"] = 1280;
            GameSetting.ratio = Laya.Browser.clientWidth / Laya.stage.width;
        }
        data["trueRate"] = trueRate;
        return data;
    }
    //激活资源版本控制
    //Laya.ResourceVersion.enable("version.json?1", Handler.create(null, init_GameKey_Data), Laya.ResourceVersion.FILENAME_VERSION);
    //根据客户端屏幕分辨率做屏幕大小适配
        function resizeHandler() {
        Even_GameKey_tManager.getInstance$().disp_GameKey_atchEvent(SSEV_GameKey_ENT.SCREEN_SIZE_CHANGE);
    }
    Laya.stage.on(Laya.Event.RESIZE, null, resizeHandler);
    Laya.stage._setScreenSize = Laya.stage.setScreenSize;
    Laya.stage.setScreenSize = function(screenWidth, screenHeight, doNotCheck) {
        if (Laya.stage._isInputting()) return;
        //处于输入状态不进行尺寸调整，否则容易出现异常。
                var tem = calcWH();
        this._scaleMode = tem.scaleMode;
        this.designHeight = tem.height;
        this.designWidth = tem.width;
        this._setScreenSize(screenWidth, screenHeight);
        if (!doNotCheck) {
            //间隔2秒再次校验。修正微信旋转后显示BUG。
            Laya.timer.once(2e3, null, function() {
                Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio, true);
            });
        }
    };
    Laya.stage._changeCanvasSize();
})();