(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];return o(n || r);
                }, p, p.exports, r, e, n, t);
            }return n[i].exports;
        }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);return o;
    }return r;
})()({ 1: [function (require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
            return [];
        };

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
            return 0;
        };
    }, {}], 2: [function (require, module, exports) {
        (function () {
            //require
            // let BayesClassifier = require('bayes-classifier')
            let bm25 = require('wink-bm25-text-search');
            let nlp = require('wink-nlp-utils');
            let tokenizer = require('string-tokenizer');
            let SentenceTokenizer = require('sentence-tokenizer');
            let stringSimilarity = require('string-similarity');
            let sentTokenizer = new SentenceTokenizer('webBot');
            let chatArray = [];
            let online = true;
            let tags = {};
            let currentButtonContext = {};
            let deviceInfo = {
                display: {
                    width: window.screen.width,
                    height: window.screen.height,
                    availWidth: window.screen.availWidth,
                    availHeight: window.screen.availHeight,
                    colorDepth: window.screen.colorDepth,
                    pixelDepth: window.screen.pixelDepth
                },
                inputType: "text",
                // location:{},
                connectionType: {},
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            function getTime() {
                let d = new Date();
                let hours = d.getHours();
                let ampm = hours >= 12 ? 'pm' : 'am';
                if (hours > 12) {
                    hours = hours - 12;
                }
                let minutes = d.getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                return { hours: hours, minutes: minutes, ampm: ampm };
            }

            function utmExtractor(sender) {
                if (sender && sender.includes("-") && !tags.utmExtraction) {
                    let keyValues = sender.split("-");
                    keyValues.map(element => {
                        if (element && element.includes(".") && element.split(".").length == 2) {
                            tags[element.split(".")[0]] = element.split(".")[1];
                        }
                        return "invalid";
                    });
                    tags.utmExtraction = true;
                }
            }
            // if ('geolocation' in navigator) {
            //     navigator.geolocation.getCurrentPosition(function (location) {
            //         appendLocation(location, 'fetched');
            //     });
            //     navigator.geolocation.watchPosition(appendLocation);
            //     function appendLocation(location, verb) {
            //         // console.log("Location Fetched")
            //         deviceInfo.location=location
            //         deviceInfo.location.verbResponse = verb || 'updated';
            //     }
            // } 

            function getNavConnection() {
                return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection;
            }
            let info = getNavConnection();
            if (info) {
                info.addEventListener('change', updateNetworkInfo);
                updateNetworkInfo(info);
            }

            function updateNetworkInfo(info) {
                deviceInfo.connectionType = {
                    type: info.type,
                    effectiveType: info.effectiveType,
                    downlinkMax: info.downlinkMax
                };
            }

            let Crypt = function (passphrase) {
                let pass = passphrase;
                let CryptoJSAesJson = {
                    parse: function (jsonStr) {
                        let j = JSON.parse(jsonStr);
                        let cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
                        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
                        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
                        return cipherParams;
                    },
                    stringify: function (cipherParams) {
                        let j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
                        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
                        if (cipherParams.salt) j.s = cipherParams.salt.toString();
                        return JSON.stringify(j);
                    }
                };

                return {
                    decrypt: function (data) {
                        return JSON.parse(CryptoJS.AES.decrypt(data, pass, { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
                    },
                    encrypt: function (data) {
                        return CryptoJS.AES.encrypt(JSON.stringify(data), pass, { format: CryptoJSAesJson }).toString();
                    }
                };
            };
            //------start------
    //------CODE------
    let passphrase = '85b1320c-78b7-3cfc-9187-09689b7ff83b';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"99aa8c09e3de2b2672b665b8c18cea1c","s":"4ee38c4dc57a4c37"};
    let entities={"ct":"ZsqsxdS3CsPi1ao0uMmw7OvHmJM2ynShtDPpPBJu9MRqQ2nWVEv9Q4XiZBUvNoOM","iv":"f76ac46a5d7ddeacde380bda5ac9b5c2","s":"b2dc21b3c33c842f"};
    let flows={"ct":"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","iv":"9547cd528e6a7d47a81224355f211774","s":"400fe6ebc3389d87"};

    let checkUrl='https://parramato.com/check';
    let modal=window.jubiModal;
    window.jubiModal=null;

    let backendUrl='https://parramato.com'
    let backendPath='/socket'
    
    let middlewareUrl = 'https://development.jubi.ai'
    let middlewarePath = '/jubimoney/socket'
    let middlewareWebsocket = true
    let middlewareSecurity = false

    let uploadUrl = 'https://parramato.com'
    let uploadPath = '/upload/socket'

    let humanUrl = 'https://parramato.com'
    let humanPath = '/human/socket'

    let voiceUrl = 'https://parramato.com'
    let voicePath = '/voice/socket'

    let directMultiplier=1
    let fallbackMultiplier = 0.8

    let timeoutSeconds= 1200


    let strictlyFlow=false;
    let humanAssistSwitch=true;
    let voiceEnabled=true;
    let cookie=false;

    let speechGenderBackend='FEMALE'
    let speechLanguageCodeBackend='en-US'

    let projectId='JubiMoney_788585788275'
    let attachmentUrl='https://parramato.com/bot-view/images/attachment.png'
    let integrityPassPhrase='hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
    let localSavePassPhrase='8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIJubiMoney_788585788275'
    //------CODE------
    //------end------
            //Setup
            //global function and param changes

            if (strictlyFlow) {
                $("#jubi-textInput").hide();
            }
            let channel = "web";
            let crypter = Crypt(passphrase);
            let crypterTransit = Crypt(passphraseTransit);
            let crypterMiddleware = Crypt(window.passphraseMiddleware + integrityPassPhrase);
            let crypterLocal = Crypt(window.passphraseMiddleware + integrityPassPhrase + projectId);
            window.passphraseMiddleware = null;
            const intentDocs = JSON.parse(crypter.decrypt(JSON.stringify(intents)));
            const entityDocs = JSON.parse(crypter.decrypt(JSON.stringify(entities)));
            // const storedClassifier=JSON.parse(crypter.decrypt(JSON.stringify(classifierData)));
            const flowDocs = JSON.parse(crypter.decrypt(JSON.stringify(flows)));
            if (!cookie) {
                clearAllLocalStorageData();
            }
            let user = {};

            let webId = get("id");
            if (webId) {
                webId = webId + "-" + IDGenerator(8);
                utmExtractor(webId);
                clearAllLocalStorageData();
            }
            let readyState = false;
            let thresholdDirect = 0.5;
            let thresholdOptions = 0.2;
            let decorateBotResponse;
            let lastTimestamp;
            let updateWebId;
            function clearAllLocalStorageData() {
                if (window.localStorage) {
                    window.localStorage.setItem(localSavePassPhrase, undefined);
                    window.localStorage.setItem("t_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("user_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("tags_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("webId_" + localSavePassPhrase, undefined);
                }
            }
            function setLocalStorageData(key, value) {
                if (window.localStorage) {
                    window.localStorage.setItem(key, value);
                }
            }
            function getLocalStorageData(key) {
                return window.localStorage ? window.localStorage.getItem(key) : undefined;
            }
            window.subscriptionForWebId = {
                setCallback: function (callback) {
                    updateWebId = callback;
                },
                getWebId: function () {
                    return webId;
                },
                getState: function () {
                    return readyState;
                }
            };

            (function () {

                try {
                    // console.log("tags")
                    let encryptedTags = getLocalStorageData("tags_" + localSavePassPhrase);
                    tags = JSON.parse(crypterLocal.decrypt(encryptedTags));
                    // console.log(tags)
                } catch (e) {
                    // console.log(e)
                }
                try {
                    // console.log("tags")
                    let encryptedUser = getLocalStorageData("user_" + localSavePassPhrase);
                    user = JSON.parse(crypterLocal.decrypt(encryptedUser));
                    // console.log(tags)
                } catch (e) {
                    // console.log(e)
                }
                if (!webId) {
                    let webIdData = getLocalStorageData("webId_" + localSavePassPhrase);
                    if (webIdData) {
                        try {
                            webIdData = JSON.parse(crypterLocal.decrypt(webIdData));
                            if (webIdData && webIdData.id) {
                                webId = webIdData.id;
                            }
                        } catch (e) {}
                    }
                }
                if (!webId) {
                    webId = IDGenerator(20);
                }
                webId = webId.replace(/ +?/g, '');
                let depth = 0;
                let totalQueries = 0;
                let totalIntents = 0;
                for (let intent of Object.keys(intentDocs)) {
                    totalQueries += intentDocs[intent].length;
                    totalIntents += 1;
                }
                depth = totalQueries / totalIntents;
                thresholdDirect = (1 - Math.tanh(Math.log10(depth + 1) * 0.5)) * directMultiplier;
                thresholdDirect = thresholdDirect > 1 ? 1 : thresholdDirect;
                thresholdOptions = thresholdDirect * fallbackMultiplier;
                console.log("confidence direct:" + thresholdDirect);
                console.log("confidence fallback:" + thresholdOptions);
            })();

            let socketHuman;
            let socketUpload;
            let socketVoice;
            let socketBackend;
            let socketMiddleware;
            (() => {
                try {
                    socketHuman = io(humanUrl, {
                        transports: ['websocket'],
                        path: humanPath
                    });
                    socketHuman.on('disconnect', function () {
                        tags.blockBot = undefined;
                        //online=false;
                        // console.log("Going Offline")
                        //disconnectVoice();
                        // offFunction();
                    });
                    socketHuman.on('connect', function () {
                        //online=true;
                        //onFunction();
                    });
                } catch (e) {
                    socketHuman = { on: () => {}, emit: () => {} };
                }

                try {
                    socketUpload = io(uploadUrl, {
                        transports: ['websocket'],
                        path: uploadPath
                    });
                } catch (e) {
                    socketUpload = { on: () => {}, emit: () => {} };
                }

                try {
                    socketVoice = io(voiceUrl, {
                        transports: ['websocket'],
                        path: voicePath
                    });
                } catch (e) {

                    socketVoice = { on: () => {}, emit: () => {} };
                }

                try {
                    socketBackend = io(backendUrl, {
                        transports: ['websocket'],
                        path: backendPath
                    });

                    if (middlewareWebsocket) {
                        socketMiddleware = io(middlewareUrl, {
                            transports: ['websocket'],
                            path: middlewarePath
                        });
                    } else {
                        socketMiddleware = io(middlewareUrl, {
                            path: middlewarePath
                        });
                    }
                    // console.log("Separate Backend")
                    socketMiddleware.on('connect', function () {
                        window.socketId = socketMiddleware.id; //
                        online = true;
                        onFunction();
                    });
                } catch (e) {
                    socketBackend = { on: () => {}, emit: () => {} };
                    socketMiddleware = { on: () => {}, emit: () => {} };
                }
            })();

            String.prototype.replaceAll = function (search, replacement) {
                let target = this;
                return target.split(search).join(replacement);
            };
            Element.prototype.remove = function () {
                this.parentElement.removeChild(this);
            };
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
                for (let i = this.length - 1; i >= 0; i--) {
                    if (this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            };
            //Internet On/Off Functions
            function onFunction() {
                $("#offlinebx").hide();
                console.log("ON:::");
            }
            function offFunction() {
                if (document.getElementById("offlinebx")) {
                    $("#offlinebx").show();
                } else {
                    document.getElementById("pm-mainSec").innerHTML += '<div class="offlinebx" id="offlinebx">' + '<div class="innerofline">' + '<h3>No connection, please refresh or check internet</h3>' + '</div>' + '</div>';
                }
            }
            //Init
            function init() {
                $(document).ready(function () {
                    $("#jubi-chat-loader-app").html(window.mainpage);
                    $("#jubisecmain").html(window.leftpanel + window.rightpanel);
                    $("#jubichatbot").html(window.templateOpenView + window.loadPermissionView);
                    window.mainpage = window.leftpanel = window.rightpanel = window.templateOpenView = window.loadPermissionView = undefined;
                    middleware();
                    setTimeout(() => {
                        $("#jubisecmain").fadeIn(100);
                        $("#jubichatbot").fadeIn(100);
                    }, 500);
                });
            }

            window.jubiChatEventEmitter = data => {
                triggerEvent({
                    senderId: webId,
                    channel: channel,
                    webInformation: deviceInfo,
                    projectId: projectId,
                    data: data,
                    type: "external"
                });
            };

            let triggerCallCount = 0;
            setInterval(() => {
                triggerCallCount = 0;
            }, 1000);

            function rateLimiter(func) {
                if (triggerCallCount < 30) {
                    triggerCallCount++;
                    func();
                } else {
                    console.log("Too Many requests");
                }
            }

            //Trigger Events
            function triggerEvent(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        if (window.jubiChatEventListener) {
                            window.jubiChatEventListener(event);
                        }
                        // console.log("EVENT "+event.type)
                        // console.log({data:event,webId:webId,requestId:uid})
                        socketBackend.emit("web-event-register", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-" + webId + "-" + uid, () => {});
                    }
                });
            }

            function triggerEventError(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        console.log("EVENT ERROR " + event.type);
                        console.log({ data: event, webId: webId, requestId: uid });
                        socketBackend.emit("web-event-register-error", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-error-" + webId + "-" + uid, () => {});
                    }
                });
            }

            //Invalidate
            async function invalidate(callbackOption, onlyInvalidateFlag) {
                try {
                    if (!onlyInvalidateFlag) {
                        if (user && user.stages && user.stages.length > 1 && user.tracker < user.stages.length - 1) {
                            let reply = await transform({
                                text: "It has been a while. Cancelled the previous conversation.",
                                type: "text"
                            });
                            decorateBotResponse(reply);
                        }
                    }
                    user.tracker = 0;
                    let cancelFlow = flowDocs["selectemergency"] || flowDocs["selectEmergency"];
                    if (!cancelFlow) {
                        cancelFlow = {
                            stages: [{
                                text: ["Cancelling your current conversation."],
                                stage: "selectfallback",
                                type: "text"
                            }]
                        };
                    }
                    user.stages = cancelFlow.stages;
                    user.stuckCount = 0;
                    user.conversationId = undefined;
                    if (callbackOption) {
                        callbackOption();
                    }
                } catch (e) {
                    // console.log(e);
                    triggerEventError({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        type: "invalidate-1",
                        error: e
                    });
                }
            }

            function transform(response) {

                if (typeof response == "string") {
                    response = JSON.parse(response);
                }
                function replaceTags(text) {
                    let match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                    return text.replace(match, '');
                }
                function findMatch(str) {
                    let match = /\${(image|file|audio|video)::[^(${|})]+}/g.exec(str);
                    if (match && match.length > 0) {
                        return match;
                    } else {
                        return undefined;
                    }
                }
                function transformMediaOrText(text, i) {
                    if (findMatch(text)) {
                        let match = text.replace('${', '').replace('}', '').split('::');
                        return {
                            id: i,
                            type: match[0],
                            value: match[1]
                        };
                    } else {
                        return {
                            id: i,
                            type: 'text',
                            value: replaceTags(text)
                        };
                    }
                }

                return new Promise((resolve, reject) => {
                    try {
                        if (Array.isArray(response.text) && response.text.length == 1) {
                            response.text = response.text[0];
                        }
                        //extract media
                        let tempStr = response.text;
                        let match = findMatch(tempStr);
                        let mediaFlag = false;
                        let botMessage = [];
                        if (typeof response.text === 'string') {
                            while (match) {
                                response.text = response.text.replace(match[0], '\\n' + match[0] + '\\n');
                                tempStr = tempStr.replace(match[0], '');
                                match = findMatch(tempStr);
                                mediaFlag = true;
                            }
                            // new line
                            response.text = response.text.replaceAll('|break|', '\\n');
                            if (response.text && response.text.includes('\\n')) {
                                response.text = response.text.split('\\n');
                            } else if (response.text && response.text.length > 60 && !mediaFlag) {
                                sentTokenizer.setEntry(response.text);
                                response.text = sentTokenizer.getSentences();
                            }
                        }
                        if (typeof response.text === 'string') {
                            botMessage.push(transformMediaOrText(response.text, 0));
                        } else if (response.text instanceof Array) {
                            let textArray = response.text;
                            for (let i = 0; i < textArray.length; i++) {
                                botMessage.push(transformMediaOrText(textArray[i], i));
                            }
                        }
                        let options = [];
                        currentButtonContext = {};
                        switch (response.type) {
                            case 'button':
                                let sameButton = false;
                                for (let i = 0; i < response.next.data.length; i++) {
                                    options.push({ type: response.next.data[i].type, text: response.next.data[i].text, data: response.next.data[i].data });
                                    if (currentButtonContext[response.next.data[i].text.toLowerCase().trim()]) {
                                        sameButton = true;
                                        currentButtonContext = {};
                                    }
                                    if (!sameButton) {
                                        currentButtonContext[response.next.data[i].text.toLowerCase().trim()] = response.next.data[i].data.toLowerCase().trim();
                                    }
                                }
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'persist-option',
                                    options: options
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            case 'quickReply':
                                for (let i = 0; i < response.next.data.length; i++) {
                                    options.push({ type: response.next.data[i].type, text: response.next.data[i].text, data: response.next.data[i].data });
                                }
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'option',
                                    options: options
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            case 'generic':
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'generic',
                                    options: response.next.data
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            default:
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'text'
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").show(200);
                                }
                                break;
                        }
                    } catch (e) {
                        triggerEventError({
                            senderId: webId,
                            channel: channel,
                            projectId: projectId,
                            type: "transform-1",
                            error: e
                        });
                        // console.log(e);
                        return reject(e);
                    }
                });
            }

            //Chat Engine
            let ChatEngine = function (callbackOption) {

                let callback = function (data) {
                    // console.log("no callback")
                    // console.log(data)
                };

                if (callbackOption) {
                    callback = callbackOption;
                }

                async function runOnNotification(data) {
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) {}
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    // console.log(data)
                    // console.log("Web-External")
                    let reply = await transform({
                        text: data.text,
                        type: data.type,
                        next: data.next
                    });
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: {
                            text: data.text,
                            type: data.type,
                            next: data.next
                        },
                        type: "notification"
                    });
                    socketHuman.emit("preHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        type: "pre",
                        reply: {
                            text: data.text,
                            type: data.type,
                            next: data.next
                        }
                    });
                    callback(reply);
                }

                function pre(requestedStage) {
                    return new Promise(function (resolve, reject) {
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        requestedStage.webId = webId;
                        requestedStage.requestId = uid;
                        if (tags.blockBot) {
                            requestedStage.tags.blockBot = true;
                        }
                        requestedStage.tags = tags;
                        if (middlewareSecurity) {
                            socketMiddleware.emit("web-pre", crypterMiddleware.encrypt(JSON.stringify(requestedStage)));
                        } else {
                            socketMiddleware.emit("web-pre", JSON.stringify(requestedStage));
                        }

                        socketMiddleware.on("web-pre-" + webId + "-" + uid, receivedModel => {
                            try {
                                if (middlewareSecurity) {
                                    receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                }
                            } catch (e) {}
                            if (typeof receivedModel == "string") {
                                receivedModel = JSON.parse(receivedModel);
                            }
                            resolve(receivedModel);
                            triggerEvent({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                input: requestedStage,
                                output: receivedModel,
                                type: "pre"
                            });
                            return;
                        });
                    });
                }

                async function runOnHumanNotification(data) {

                    // data = JSON.parse(crypterMiddleware.decrypt(data))
                    // console.log("Web external")
                    // console.log(data)
                    // console.log("Web-External")

                    let currentStage = {
                        text: data.text,
                        type: data.type,
                        next: data.next
                    };
                    let flowName;

                    if (!tags.blockBot && typeof data.text == 'string' && data.text.trim().startsWith("#")) {
                        flowName = data.text.replace("#", "");
                        let flow = flowDocs[flowName];
                        if (flow) {
                            user.tracker = 0;
                            user.stages = flow.stages;
                            user.stuckCount = 0;
                            user.conversationId = flow.flowId;
                            currentStage = clone(user.stages[user.tracker]);
                            if (!currentStage.firstMessage) {
                                currentStage.firstMessage = "";
                            }
                            if (Array.isArray(currentStage.text)) {
                                for (let index in currentStage.text) {
                                    currentStage.text[index] = currentStage.firstMessage + "|break|" + currentStage.text[index];
                                }
                            } else {
                                currentStage.text = currentStage.firstMessage + "|break|" + currentStage.text;
                            }
                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                pre(currentStage).then(resolve).catch(e => {
                                    if (!online) {
                                        currentStage = {
                                            text: "Oh! I would require internet to help you here.",
                                            type: "text"
                                        };
                                    }
                                });
                            }
                        }
                    }

                    let reply = await transform(currentStage);
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        webInformation: deviceInfo,
                        projectId: projectId,
                        assistance: true,
                        input: {
                            user: user,
                            tags: tags
                        },
                        intentTrigger: flowName,
                        output: data,
                        blockBot: true,
                        flowDirection: "output",
                        type: "process"
                    });
                    socketHuman.emit("preHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        assistance: true,
                        type: "pre",
                        reply: currentStage
                    });
                    callback(reply);
                }

                socketMiddleware.on("web-external-" + webId.toString(), runOnNotification);
                socketMiddleware.on("web-timeout-" + webId.toString(), async function (data) {
                    invalidate(async () => {
                        callback((await transform(data)));
                    });
                });

                socketHuman.on("web-external-" + webId.toString(), runOnHumanNotification);
                socketHuman.on("start-bot-" + webId.toString(), function (data) {
                    tags.blockBot = undefined;
                    runOnHumanNotification(data);
                });
                socketHuman.on("pause-bot-" + webId.toString(), function () {
                    tags.blockBot = true;
                });

                this.processInput = async function (text) {
                    socketHuman.emit("postHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        intent: "",
                        type: "post",
                        reply: {
                            projectId: projectId,
                            data: {
                                text: text
                            },
                            sender: webId,
                            recipient: "jubiAiWeb"
                        },
                        time: new Date().getTime()
                    });
                    if (tags && !tags.blockBot) {
                        // console.log("PROCESS INPUT")
                        if (strictlyFlow) {
                            $("#jubi-textInput").hide(200);
                        }
                        try {
                            if (lastTimestamp === undefined) {
                                let encryptedLastTimestamp = getLocalStorageData("t_" + localSavePassPhrase);
                                if (encryptedLastTimestamp) {
                                    try {
                                        lastTimestamp = JSON.parse(crypterLocal.decrypt(encryptedLastTimestamp)).lastTimestamp;
                                    } catch (e) {}
                                }
                            }
                            if (lastTimestamp + parseInt(timeoutSeconds || 1200) * 1000 < new Date().getTime()) {
                                invalidate();
                            }
                            lastTimestamp = new Date().getTime();
                            setLocalStorageData("t_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({ lastTimestamp: lastTimestamp })));

                            let timestampstart = new Date().getTime();
                            let engineOut = await runEngine(text);
                            let stage = engineOut.stage;
                            let timestampend = new Date().getTime();
                            setLocalStorageData("user_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(user)));

                            if (humanAssistSwitch) {
                                if (engineOut.status.final == "cancelStuck" || engineOut.status.final == "" || engineOut.status.final == "nextInvalid" || engineOut.status.final == "nextFallback") {
                                    //engineOut.status.final=undefined
                                    socketHuman.emit("assignAgentBackend", {
                                        data: {
                                            senderId: webId,
                                            bot: projectId
                                        },
                                        senderId: webId,
                                        projectId: projectId
                                    });
                                }
                            }

                            triggerEvent({
                                senderId: webId,
                                channel: channel,
                                webInformation: deviceInfo,
                                projectId: projectId,
                                input: {
                                    text: text,
                                    user: user,
                                    tags: tags
                                },
                                requestAssistance: tags.blockBot,
                                apiTime: timestampend - timestampstart,
                                output: stage,
                                nlu: engineOut.nlu,
                                status: engineOut.status,
                                type: "process"
                            });
                            if (!tags.blockBot) {
                                socketHuman.emit("preHandler", {
                                    senderId: webId,
                                    type: "pre",
                                    projectId: projectId,
                                    tags: tags,
                                    text: text,
                                    reply: stage
                                });
                                let reply = await transform(replaceTagsFromStage(stage));
                                callback(reply);
                            }
                        } catch (e) {
                            triggerEventError({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                type: "processinput-1",
                                error: e
                            });
                            // console.log(e);
                        }
                    } else {
                        triggerEvent({
                            senderId: webId,
                            channel: channel,
                            webInformation: deviceInfo,
                            projectId: projectId,
                            input: {
                                text: text,
                                user: user,
                                tags: tags
                            },
                            blockBot: true,
                            flowDirection: "input",
                            type: "process"
                        });
                    }
                };
                function replaceTagsFromStage(stage) {
                    if (Array.isArray(stage.text)) {
                        for (let index in stage.text) {
                            stage.text[index] = replaceAllTags(stage.text[index]);
                        }
                    } else {
                        stage.text = replaceAllTags(stage.text);
                    }
                    if (stage.type == "button" || stage.type == "quickReply") {
                        for (let index in stage.next.data) {
                            stage.next.data[index].data = replaceAllTags(stage.next.data[index].data);
                            stage.next.data[index].text = replaceAllTags(stage.next.data[index].text);
                        }
                    }
                    return stage;
                }

                function replaceAllTags(text) {
                    let match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                    if (match) {
                        do {
                            // console.log(match[0])
                            let matchedTag = match[0].replace("${", "").replace("}", "");
                            if (tags[matchedTag]) {
                                text = text.replace(match[0], tags[matchedTag]);
                            } else {
                                text = text.replace(match[0], "");
                            }
                            match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                        } while (match);
                    }
                    return text;
                }

                function runEngine(text) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let timestamp1 = new Date().getTime();
                            tags["userSays"] = text;
                            let nluProcessedModel = await processNlu(cleanText(text));
                            // triggerEvent({
                            //     senderId:webId,
                            //     channel:channel,
                            //     projectId:projectId,
                            //     input:text,
                            //     output:nluProcessedModel,
                            //     type:"nlu"
                            // });
                            let timestamp2 = new Date().getTime();
                            let validatedModel = await processValidator(text, user, nluProcessedModel.entities);
                            let timestamp3 = new Date().getTime();
                            let prevStage = {};
                            if (user.stages) {
                                prevStage = user.stages[user.tracker];
                            }
                            if (user.previousOptions && user.previousQuery) {
                                let output = { intents: {}, entities: {}, top: []
                                    //entity extraction
                                };for (let option of user.previousOptions) {
                                    // let entityData=replaceAllEntities(option.query,output);
                                    // let textReplaced = entityData.text
                                    // console.log("MATCH::::::::::::")
                                    // console.log("TEXT REPLACED:::::::::::::"+textReplaced)
                                    // console.log("TEXT:::::::::::::"+text)
                                    // console.log("OQ:::::::::::::"+option.query)
                                    if (text == option.query) {
                                        // console.log("MATCHED::::::::::::")
                                        triggerEvent({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            query: user.previousQuery,
                                            similar: option,
                                            type: "match"
                                        });
                                    }
                                }
                            }
                            user.previousOptions = undefined;
                            user.previousQuery = undefined;
                            let expectation;
                            if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.expectation) {
                                expectation = user.stages[user.tracker].next.expectation;
                            }
                            if (expectation) {
                                let saveResponse = await saveInformation("pre", validatedModel, prevStage, {}, nluProcessedModel, text);
                                if (saveResponse && saveResponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-1",
                                        error: saveResponse.error
                                    });
                                    // console.log(saveResponse.error);
                                }
                                if (saveResponse.tags) {
                                    tags = saveResponse.tags;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(saveResponse.tags)));
                            } else {
                                saveInformation("pre", validatedModel, prevStage, {}, nluProcessedModel, text).then(response => {
                                    if (response && response.error) {
                                        triggerEventError({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            type: "runengine-2",
                                            error: response.error
                                        });
                                        // console.log(reponse.error);
                                    }
                                    if (response.tags) {
                                        if (tags.blockBot) {
                                            response.tags.blockBot = true;
                                        }
                                        tags = response.tags;
                                    }
                                    if (validatedModel && validatedModel.data && prevStage && prevStage.stage) {
                                        tags[prevStage.stage] = validatedModel.data;
                                    }
                                    setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                                }).catch(e => {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-3",
                                        error: e
                                    });
                                    // console.log(e)
                                });
                                if (validatedModel && validatedModel.data) {
                                    tags[prevStage.stage] = validatedModel.data;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }
                            // console.log(tags)
                            let timestamp4 = new Date().getTime();
                            let flowManagerData = await processFlowManager({ query: text, intents: nluProcessedModel.intents, topIntents: nluProcessedModel.top, validation: validatedModel });
                            let stageModel = flowManagerData.response;
                            let status = flowManagerData.status;
                            let timestamp5 = new Date().getTime();
                            // console.log(timestamp2-timestamp1)
                            // console.log(timestamp3-timestamp2)
                            // console.log(timestamp4-timestamp3)
                            // console.log(timestamp5-timestamp4)
                            saveInformation("post", validatedModel, prevStage, stageModel, nluProcessedModel, text).then(reponse => {
                                if (reponse && reponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-4",
                                        error: reponse.error
                                    });
                                    // console.log(reponse.error);
                                }
                                if (reponse.tags) {
                                    if (tags.blockBot) {
                                        reponse.tags.blockBot = true;
                                    }
                                    tags = reponse.tags;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }).catch(e => {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "runengine-5",
                                    error: e
                                });
                                // console.log(e)
                            });
                            return resolve({ stage: stageModel, nlu: nluProcessedModel, status: status });
                        } catch (e) {
                            if (!online) {
                                invalidate(async () => {
                                    callback((await transform({
                                        text: "Oh! I would require internet to help you here.",
                                        type: "text"
                                    })));
                                }, true);
                            }
                            triggerEventError({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                type: "runengine-6",
                                error: e
                            });
                            // console.log(e)
                            return reject(e);
                        }
                    });

                    function saveInformation(type, validatedModel, prevStage, stageModel, nluProcessedModel, text) {
                        return new Promise((resolve, reject) => {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let input = { type: type, validation: validatedModel, prevStage: prevStage, webId: webId, nlu: nluProcessedModel, text: text, stage: stageModel, requestId: uid };
                            if (middlewareSecurity) {
                                socketMiddleware.emit("web-save", crypterMiddleware.encrypt(JSON.stringify(input)));
                            } else {
                                socketMiddleware.emit("web-save", JSON.stringify(input));
                            }
                            socketMiddleware.on("web-save-" + webId + "-" + uid, receivedModel => {
                                if (middlewareSecurity) {
                                    receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                }
                                resolve(receivedModel);
                                triggerEvent({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    input: input,
                                    output: receivedModel,
                                    type: "save"
                                });
                            });
                        });
                    }

                    // function getTokenizedData(text){
                    //     return tokenizer()
                    //     .input(text)
                    //     .token('data', /[a-zA-Z0-9]+/)
                    //     .resolve()
                    //     .data||[]
                    // }
                    function cleanText(text) {
                        //text tokenizing and cleaning
                        let tokenizedData = tokenizer().input(text).token('data', /[^!^@^-^_^=^\[^&^\/^\^^#^,^+^(^)^$^~^%^.^'^"^:^*^?^<^>^{^}^\]^0^1^2^3^4^5^6^7^8^9^\s]+/).resolve().data;
                        let resp = "";
                        if (tokenizedData) {
                            if (Array.isArray(tokenizedData)) {
                                resp = tokenizedData.reduce((text, value) => {
                                    return text.toLowerCase() + " " + value.toLowerCase();
                                });
                            } else {
                                resp = tokenizedData.toLowerCase().trim();
                            }
                        }
                        // console.log(":::::::::::")
                        // console.log(resp)
                        return resp;
                    }

                    function opinionFromLR(data) {
                        return new Promise(async function (resolve, reject) {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let requestData = {
                                data: data,
                                webId: webId,
                                requestId: uid
                            };
                            socketBackend.emit("web-opinion-lr", crypterTransit.encrypt(JSON.stringify(requestData)));
                            socketBackend.on("web-opinion-lr-" + webId + "-" + uid, receivedModel => {
                                receivedModel = JSON.parse(crypterTransit.decrypt(receivedModel));
                                if (receivedModel.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "opinionfromlr-1",
                                        error: body.error
                                    });
                                    // console.log(body.error)
                                    return reject(err);
                                }
                                // console.log(receivedModel)
                                return resolve(receivedModel);
                            });
                        });
                    }
                    function replaceAllEntities(text, output) {
                        //entity extraction
                        let entitiesDetected = [];
                        let filteredEntities = [];
                        let entitiesToBeDeletedIndices = [];
                        for (let label in entityDocs) {
                            for (let value in entityDocs[label]) {
                                let flag = false;
                                for (let token of entityDocs[label][value]) {
                                    // for( let textToken of getTokenizedData(text)){
                                    // if(textToken==token&&token.trim()!=""&&textToken.trim()!=""){
                                    if ((text.startsWith(token + " ") || text.endsWith(" " + token) || text.trim() == token || text && text.includes(" " + token + " ")) && token.trim() != "") {
                                        if (entitiesDetected.length == 0) {
                                            entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                            flag = true;
                                        }
                                        for (let index in entitiesDetected) {
                                            if (entitiesDetected[index].token && entitiesDetected[index].token.includes(token)) {
                                                flag = true;
                                                break;
                                            } else if (token && token.includes(entitiesDetected[index].token)) {
                                                entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                                entitiesToBeDeletedIndices.push(index);
                                                flag = true;
                                                break;
                                            } else {
                                                entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                                flag = true;
                                            }
                                        }
                                    }
                                    if (flag) {
                                        break;
                                    }
                                    // }
                                    // }
                                }
                            }
                        }
                        for (let index in entitiesDetected) {
                            if (!entitiesToBeDeletedIndices || !entitiesToBeDeletedIndices.includes(index)) {
                                filteredEntities.push(entitiesDetected[index]);
                            }
                        }
                        output.entities = filteredEntities;

                        for (let element of filteredEntities) {
                            text = text.replaceAll(element.token, element.entity);
                        }
                        return { output: output, text: text };
                    }
                    function processNlu(text) {
                        return new Promise(async function (resolve, reject) {
                            try {

                                //output variable
                                let output = { intents: {}, entities: {}, top: [] };

                                let entityData = replaceAllEntities(text, output);
                                text = entityData.text;
                                output = entityData.output;

                                //exact match
                                let matchFlag = false;
                                let max = 0;
                                // console.log("QUERY")
                                // console.log(text)
                                let outputIntents = [];
                                for (let label in intentDocs) {
                                    for (let utterance of intentDocs[label]) {
                                        let score = 0;
                                        if (utterance.toLowerCase() == text.toLowerCase()) {
                                            score = 1;
                                            // console.log("MATCH MATCH")
                                        } else {
                                            score = stringSimilarity.compareTwoStrings(utterance, text);
                                        }

                                        // console.log(text+":::"+score+":::"+utterance)
                                        if (score > 0.95) {
                                            if (score > max) {
                                                output.intents = {
                                                    intent: label,
                                                    probability: score,
                                                    query: intentDocs[label][0]
                                                };
                                                max = score;
                                                matchFlag = true;
                                            } else if (max == score) {
                                                matchFlag = false;
                                            }
                                        }
                                        if (utterance == text) {
                                            outputIntents.push({
                                                intent: label,
                                                probability: 1,
                                                query: intentDocs[label][0]
                                            });
                                        }
                                    }
                                }
                                // console.log("OUTPUT INTENTS")
                                // console.log(outputIntents)
                                if (outputIntents.length > 1 || output.intents.probability && output.intents.probability < 0.97) {
                                    matchFlag = false;
                                } else if (outputIntents.length == 1) {
                                    matchFlag = true;
                                }
                                // console.log("INTENT DOCS")
                                // console.log(intentDocs)
                                // console.log("EXACT MATCH")
                                // console.log(matchFlag)
                                console.log("JUBI_REQUEST:" + text);

                                //ml based match
                                if (!matchFlag) {
                                    // //generate nb output
                                    // let classifier = new BayesClassifier()
                                    // for( let intent in intentDocs){
                                    //     classifier.addDocuments(intentDocs[intent], intent)
                                    // }

                                    // classifier.train();
                                    // let nbData=classifier.getClassifications(text).splice(0,5)
                                    // // let nbTotalScore=0
                                    // // for( let element of classifier.getClassifications(text)){
                                    // //     nbTotalScore+=element.value
                                    // // }
                                    // // let nbData=classifier.getClassifications(text).splice(0,5)
                                    // // let failoverData={
                                    // //     intents:{
                                    // //         intent:nbData[0].label,
                                    // //         probability:nbData[0].value/nbTotalScore,
                                    // //         query:intentDocs[nbData[0].label][0]
                                    // //     },
                                    // //     top:[]
                                    // // }
                                    // // for( let i in nbData){
                                    // //     failoverData.top.push({
                                    // //         intent:nbData[i].label,
                                    // //         probability:nbData[i].value/nbTotalScore,
                                    // //         query:intentDocs[nbData[i].label][0]
                                    // //     })
                                    // // }

                                    // // create shrinked data
                                    // // let shrinkedData=classifier.getClassifications(text)
                                    // console.log("NB DATA")
                                    // console.log(nbData)
                                    let shrinkedIndexedData = {};
                                    for (let element in intentDocs) {
                                        if (intentDocs[element].length > 0) {
                                            shrinkedIndexedData[element] = intentDocs[element];
                                        }
                                    }
                                    // console.log("TOTAL DATA")
                                    // console.log(shrinkedIndexedData)
                                    let results = [];
                                    try {
                                        //train bm25 on shrinked data
                                        let engine = bm25();
                                        engine.defineConfig({ fldWeights: { text: 1 } });
                                        engine.definePrepTasks([nlp.string.lowerCase, nlp.string.removeExtraSpaces, nlp.string.tokenize0, nlp.tokens.propagateNegations, nlp.tokens.stem]);
                                        for (let label in shrinkedIndexedData) {
                                            if (shrinkedIndexedData[label].length > 0) {
                                                let text = shrinkedIndexedData[label].reduce((text, value) => {
                                                    return text + " " + value;
                                                });
                                                engine.addDoc({ text: text }, label);
                                            }
                                        }
                                        engine.consolidate(4);
                                        //run query on shrinked data trained bm25
                                        results = engine.search(text, 5);
                                    } catch (e) {
                                        triggerEventError({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            type: "processnlu-1",
                                            error: e
                                        });
                                        // console.log(e);
                                    }

                                    // console.log("BM25")
                                    // console.log(results)


                                    if (results.length > 1) {
                                        let bm25TotalScore = 0;
                                        for (let element of results) {
                                            bm25TotalScore += Math.exp(element[1]);
                                        }
                                        let requestData = {
                                            data: {},
                                            query: text
                                        };
                                        for (let result of results) {
                                            requestData.data[result[0]] = shrinkedIndexedData[result[0]];
                                            requestData.projectId = "projectBrowser";
                                        }
                                        try {
                                            let response = await opinionFromLR(requestData);
                                            triggerEvent({
                                                senderId: webId,
                                                channel: channel,
                                                projectId: projectId,
                                                input: requestData,
                                                output: response,
                                                type: "lr"
                                            });
                                            output.intents = {
                                                intent: response.intents[0].name,
                                                probability: parseFloat(response.intents[0].confidence),
                                                query: intentDocs[response.intents[0].name][0]
                                            };
                                        } catch (e) {
                                            // console.log(e);
                                            output.intents = {
                                                intent: results[0][0],
                                                probability: Math.exp(results[0][1]) / bm25TotalScore,
                                                query: intentDocs[results[0][0]][0]
                                            };
                                        }

                                        output.top = [];
                                        for (let element of results) {
                                            if (intentDocs[element[0]].length > 0) {
                                                output.top.push({
                                                    intent: element[0],
                                                    probability: Math.exp(element[1]) / bm25TotalScore,
                                                    query: intentDocs[element[0]][0]
                                                });
                                            }
                                        }
                                    } else {
                                        output.intents = {
                                            intent: "",
                                            probability: 0,
                                            query: ""
                                        };
                                        output.top = [];
                                    }
                                    // console.log("LR")
                                    // console.log(output)
                                }
                                return resolve(output);
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processnlu-2",
                                    error: e
                                });
                                // console.log(e);
                                return reject(e);
                            }
                        });
                    }
                    function processValidator(text, user, entities) {
                        let validator = {
                            wordList: wordList,
                            regex: regex,
                            post: post
                        };
                        return new Promise(async function (resolve, reject) {
                            try {
                                let expectation;
                                let post;
                                if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.expectation) {
                                    expectation = user.stages[user.tracker].next.expectation;
                                } else if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.post && user.stages[user.tracker].next.post.length > 0) {
                                    post = user.stages[user.tracker].next.post[0];
                                }

                                if (expectation && expectation.type) {
                                    let runFunc = validator[expectation.type].bind({ entities: entities, expectation: expectation, user: user });
                                    resolve((await runFunc(text)));
                                } else if (post && post.url) {
                                    let runFunc = validator["post"].bind({ entities: entities, post: post });
                                    resolve((await runFunc(text)));
                                } else {
                                    resolve({
                                        data: text,
                                        validated: true
                                    });
                                }
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processvalidator-1",
                                    error: e
                                });
                                // console.log(e)
                                return reject(e);
                            }
                        });

                        function post(input) {
                            return new Promise(function (resolve, reject) {
                                try {
                                    if (!online) {
                                        return reject({ status: "offline" });
                                    }
                                    let model = {};
                                    let uid = IDGenerator(20);
                                    model.data = input;
                                    model.validated = true;
                                    model.webId = webId;
                                    model.requestId = uid;
                                    model.stage = user.stages[user.tracker];
                                    if (middlewareSecurity) {
                                        socketMiddleware.emit("web-post", crypterMiddleware.encrypt(JSON.stringify(model)));
                                    } else {
                                        socketMiddleware.emit("web-post", JSON.stringify(model));
                                    }
                                    socketMiddleware.on("web-post-" + webId + "-" + uid, receivedModel => {
                                        try {
                                            if (middlewareSecurity) {
                                                receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                            }
                                        } catch (e) {}
                                        if (typeof receivedModel == "string") {
                                            receivedModel = JSON.parse(receivedModel);
                                        }
                                        resolve(receivedModel);
                                        triggerEvent({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            input: input,
                                            output: receivedModel,
                                            type: "post"
                                        });
                                        return;
                                    });
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "post-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                        function wordList(input) {
                            let entities = this.entities;
                            let expectation = this.expectation;
                            let model = {};
                            return new Promise(function (resolve, reject) {
                                try {
                                    // console.log(expectation)
                                    // console.log(entities)
                                    // console.log(input)
                                    if (expectation.val) {
                                        let entityValues = Object.keys(expectation.val);
                                        for (let entity of entities) {
                                            let flag = false;
                                            for (let value of entityValues) {
                                                if (entity.synonymGroup && typeof entity.synonymGroup == "string" && value && typeof value == "string" && entity.synonymGroup.trim() == value.trim()) {
                                                    flag = true;
                                                }
                                            }
                                            if (flag) {
                                                if (expectation.val[entity.synonymGroup]) {
                                                    model.stage = expectation.val[entity.synonymGroup];
                                                }
                                                // console.log(model.stage)
                                                // console.log(entities)
                                                // console.log(expectation)
                                                // console.log(":::::::::::STAGE::::::::::::")
                                                model.data = entity.synonymGroup;
                                                model.validated = true;
                                                return resolve(model);
                                            }
                                        }
                                    }
                                    model.data = input;
                                    model.validated = false;
                                    return resolve(model);
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "wordlist-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                        function regex(inp) {
                            let entities = this.entities;
                            let expectation = this.expectation;
                            let model = {};
                            return new Promise(function (resolve, reject) {
                                try {
                                    if (expectation.val && expectation.val.trim()) {
                                        let reg = new RegExp(expectation.val.trim());
                                        if (expectation.val && inp.match(reg)) {
                                            model.data = inp.match(reg)[0];
                                            model.validated = true;
                                            return resolve(model);
                                        } else {
                                            model.validated = false;
                                            return resolve(model);
                                        }
                                    } else {
                                        model.validated = false;
                                        return resolve(model);
                                    }
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "regex-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                    function processFlowManager(data) {
                        return new Promise(async function (resolve, reject) {
                            try {
                                let status = {
                                    level: "fallback",
                                    prevConversation: "qna",
                                    nextInitConversation: "invalid",
                                    validation: data.validation.validated,
                                    final: "",
                                    previousStage: ""
                                };
                                let topIntents = [];
                                if (data && data.topIntents) {
                                    for (let element of data.topIntents) {
                                        if (!element.intent.startsWith("st_")) {
                                            topIntents.push(element);
                                        }
                                    }
                                    data.topIntents = topIntents;
                                }
                                // console.log(data.intents.probability)
                                let flow = flowDocs[data.intents.intent];
                                if (data.intents.probability >= thresholdDirect) {
                                    status.level = "direct";
                                } else if (data.intents.probability >= thresholdOptions) {
                                    status.level = "options";
                                }
                                if (user && user.stages && user.stages.length > 1 && user.tracker < user.stages.length - 1) {
                                    status.prevConversation = "flow";
                                }
                                if (flow) {
                                    if (flow.stages.length == 1) {
                                        status.nextInitConversation = "qna";
                                    } else if (flow.stages.length > 1) {
                                        status.nextInitConversation = "flow";
                                    }
                                }

                                if (user && user.stuckCount === undefined) {
                                    user.stuckCount = 0;
                                }
                                if (status.level === "direct" && flow && flow.flowId && flow.flowId.toLowerCase().trim() === "selectemergency") {
                                    status.final = "cancel";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && data.intents.intent.toLowerCase().trim() === "selectprevious" && user.tracker > 0) {
                                    status.final = "inFlowPrevious";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && !user.stages[user.tracker].skipGhost) {
                                    status.final = "inFlowNextGhost";
                                    status.previousStage = "";
                                }
                                // else if (status.prevConversation=="flow"&&status.nextInitConversation=="flow"&&status.level=="direct"&&flow&&user.conversationId!=flow.flowId){
                                //     status.final="nextStart"
                                // }
                                else if (status.prevConversation == "flow" && status.validation) {
                                        status.final = "inFlowNextValidated";
                                        status.previousStage = user.stages[user.tracker].stage;
                                    } else if (status.prevConversation == "flow" && !status.validation) {
                                        if (user.stuckCount < 3) {
                                            status.final = "inFlowNextInvalidated";
                                            status.previousStage = user.stages[user.tracker].stage;
                                        } else {
                                            status.final = "cancelStuck";
                                            status.previousStage = "";
                                        }
                                    } else if (status.prevConversation == "qna" && status.nextInitConversation == "invalid") {
                                        status.final = "nextInvalid";
                                        status.previousStage = "";
                                    } else if (status.prevConversation == "qna" && status.level == "direct") {
                                        status.final = "nextStart";
                                        status.previousStage = "";
                                    } else if (status.prevConversation == "qna" && status.level == "options") {
                                        if (topIntents.length > 0) {
                                            status.final = "nextOptions";
                                            status.previousStage = "";
                                        } else {
                                            status.final = "nextFallback";
                                            status.previousStage = "";
                                        }
                                    } else if (status.prevConversation == "qna" && status.level == "fallback") {
                                        status.final = "nextFallback";
                                        status.previousStage = "";
                                    }
                                return resolve({ response: await decideResponse(flow, data, status), status: status });
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processflowmanager-1",
                                    error: e
                                });
                                // console.log(e);
                                return reject(e);
                            }
                        });

                        function decideResponse(flow, data, status) {
                            return new Promise((resolve, reject) => {
                                try {
                                    // console.log(status) 
                                    let fallbackFlow = flowDocs["selectfallback"] || flowDocs["selectFallback"];
                                    let currentStage;
                                    switch (status.final) {
                                        case "cancel":
                                            user.tracker = 0;
                                            let cancelFlow = flowDocs["selectemergency"] || flowDocs["selectEmergency"];
                                            if (!cancelFlow) {
                                                cancelFlow = {
                                                    stages: [{
                                                        text: ["Cancelling your current conversation."],
                                                        stage: "selectfallback",
                                                        type: "text"
                                                    }]
                                                };
                                            }
                                            user.stages = cancelFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "cancelStuck":
                                            user.tracker = 0;
                                            user.stages = [{
                                                text: ["Cancelling, as it seems you are stuck somewhere."],
                                                stage: "selectfallback",
                                                type: "text"
                                            }];
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "inFlowPrevious":
                                            user.tracker = parseInt(user.tracker) - 1;
                                            user.stuckCount = 0;
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    resolve(receivedStage);
                                                }).catch(e => {

                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "inFlowNextGhost":
                                            let text = "";
                                            if (Array.isArray(flow.stages[0].text)) {
                                                text = flow.stages[0].text[getRandom(flow.stages[0].text.length)];
                                            } else {
                                                text = flow.stages[0].text;
                                            }
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = text + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = text + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = text + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = text + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "inFlowNextValidated":
                                            user.stuckCount = 0;
                                            currentStage = clone(user.stages[user.tracker]);
                                            let validText = "";
                                            if (currentStage && currentStage.next && currentStage.next.expectation && currentStage.next.expectation.validMessage) {
                                                validText = currentStage.next.expectation.validMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.post && currentStage.next.post[0].validMessage) {
                                                validText = currentStage.next.post[0].validMessage;
                                            }
                                            let stageFound = false;
                                            if (data.validation.stage) {
                                                for (let index in user.stages) {
                                                    let stage = user.stages[index];
                                                    // console.log(":::::::::::::::::::::::")
                                                    // console.log(stage.stage)
                                                    if (stage.stage == data.validation.stage) {
                                                        user.tracker = index;
                                                        stageFound = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!stageFound) {
                                                user.tracker = parseInt(user.tracker) + 1;
                                            }
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = validText + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = validText + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = validText + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = validText + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }

                                            break;
                                        case "inFlowNextInvalidated":
                                            user.stuckCount = user.stuckCount + 1;
                                            currentStage = clone(user.stages[user.tracker]);
                                            // console.log(currentStage)
                                            let invalidText = "";
                                            if (currentStage && currentStage.next && currentStage.next.expectation && currentStage.next.expectation.invalidMessage) {
                                                invalidText = currentStage.next.expectation.invalidMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.post && currentStage.next.post[0].invalidMessage) {
                                                invalidText = currentStage.next.post[0].invalidMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = invalidText + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = invalidText + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = invalidText + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = invalidText + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }

                                            break;
                                        case "nextStart":
                                            user.tracker = 0;
                                            user.stages = flow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = flow.flowId;
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (!currentStage.firstMessage) {
                                                currentStage.firstMessage = "";
                                            }
                                            if (Array.isArray(currentStage.text)) {
                                                for (let index in currentStage.text) {
                                                    currentStage.text[index] = currentStage.firstMessage + "|break|" + currentStage.text[index];
                                                }
                                            } else {
                                                currentStage.text = currentStage.firstMessage + "|break|" + currentStage.text;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(resolve).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "nextFallback":
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text"
                                                    }]
                                                };
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "nextInvalid":
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text",
                                                        override: true
                                                    }]
                                                };
                                            } else {
                                                fallbackFlow.stages[0].override = true;
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "nextOptions":
                                            user.tracker = 0;
                                            user.stages = [{
                                                text: ["We have got following answers to help you."],
                                                stage: "optionsfallback",
                                                type: "generic",
                                                next: {
                                                    data: []
                                                }
                                            }];
                                            let index = 0;
                                            user.previousQuery = data.query;
                                            user.previousOptions = data.topIntents;
                                            for (let element of data.topIntents) {
                                                let reply;
                                                index++;
                                                if (flowDocs[element.intent] && flowDocs[element.intent].stages && flowDocs[element.intent].stages.length > 0) {
                                                    if (Array.isArray(flowDocs[element.intent].stages[0].text)) {
                                                        reply = flowDocs[element.intent].stages[0].text[0];
                                                    } else {
                                                        reply = flowDocs[element.intent].stages[0].text;
                                                    }
                                                }
                                                if (element.query && reply) {

                                                    user.stages[0].next.data.push({
                                                        title: capFirstLetter(element.query.trim()),
                                                        text: reply,
                                                        buttons: [{ data: element.query, text: "Read More" }]
                                                    });
                                                }
                                                function capFirstLetter(textSent) {
                                                    try {
                                                        return textSent.charAt(0).toUpperCase() + textSent.slice(1);
                                                    } catch (e) {
                                                        return textSent;
                                                    }
                                                }
                                            }
                                            if (user.stages[0].next.data.length == 0) {
                                                if (!fallbackFlow) {
                                                    fallbackFlow = {
                                                        stages: [{
                                                            text: ["Could not understand your query."],
                                                            stage: "selectfallback",
                                                            type: "text",
                                                            override: true
                                                        }]
                                                    };
                                                } else {
                                                    fallbackFlow.stages[0].override = true;
                                                }
                                                user.stages = fallbackFlow.stages;
                                                if (humanAssistSwitch) {
                                                    tags.blockBot = true;
                                                }
                                                status.final = "nextFallback";
                                            } else {
                                                user.stages[0].next.data.push({
                                                    title: "Not relevant",
                                                    text: "Did not match my query",
                                                    buttons: [{ data: "not relevant", text: "Select" }]
                                                });
                                            }
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        default:
                                            status.final = "nextFallback";
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text",
                                                        override: true
                                                    }]
                                                };
                                            } else {
                                                fallbackFlow.stages[0].override = true;
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;

                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                    }
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "decideresponse-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                }
            };
            //Chat Middleware Js
            function middleware() {
                let backendResponse;
                if (!backendResponse) {
                    backendResponse = false;
                }
                let booleanHideShow;
                let delayMaster = 1000;
                let msgIndex = 0;
                let gender = null;
                let profile = undefined;
                let semaphoreForFirstChatLoad = true;
                let lastConversationSemaphore = true;
                let inputQuery = get("query");
                // let inputDefault=false;
                if (!inputQuery) {
                    // inputQuery = 'Get Started';
                    // inputDefault=true;
                }
                if (!voiceEnabled || !online) {
                    // console.log("no speech")
                    hideVoice();
                }

                // setTimeout(async()=>{
                //     let currentState=await doesConnectionExist();
                //     if(currentState!=online){
                //         online=currentState;
                //         if(online){
                //             console.log("Going Online")
                //         }
                //         else{
                //             console.log("Going Offline")
                //             disconnectVoice();
                //         }
                //     } 
                // },1000);
                socketMiddleware.on('disconnect', function () {
                    online = false;
                    console.log("Going Offline");
                    disconnectVoice();
                    offFunction();
                });

                let ce = new ChatEngine(postReply);
                decorateBotResponse = postReply;
                socketBackend.on("web-webview-" + webId.toString(), async function (data) {
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: data,
                        type: "webViewSubmit"
                    });
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) {}
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    ce.processInput(data.text);

                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 200);
                });
                socketMiddleware.on("web-webview-" + webId.toString(), async function (data) {

                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) {}
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: data,
                        type: "webViewSubmit"
                    });
                    ce.processInput(data.text);
                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 200);
                });
                String.prototype.replaceAll = function (search, replacement) {
                    let target = this;
                    return target.split(search).join(replacement);
                };
                function htmlInjectionPrevent(msg) {
                    if (msg) {
                        return msg.toString().replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
                    } else {
                        return msg;
                    }
                }
                function boot() {
                    try {
                        if (inputQuery && cookie) {
                            let encryptedData = getLocalStorageData(localSavePassPhrase);
                            if (encryptedData) {
                                let decryptedArray = JSON.parse(crypterLocal.decrypt(encryptedData));
                                // console.log("DECRYPTED ARRAY")
                                // console.log(decryptedArray)
                                let flagCookie = false;
                                for (let dataElement of decryptedArray) {
                                    if (dataElement.trim().startsWith("<div class='pm-bxRightchat'")) {
                                        flagCookie = true;
                                        break;
                                    }
                                }
                                if (decryptedArray.length > 1 && flagCookie) {
                                    let htmlToBeAdded = "";
                                    for (let element of decryptedArray) {
                                        htmlToBeAdded += element;
                                    }
                                    chatArray = decryptedArray;
                                    if (modal.cookie == "always") {
                                        if (updateWebId) {
                                            readyState = true;
                                            updateWebId(webId);
                                        }
                                        document.getElementById('pm-permission-view').style.display = "none";
                                        document.getElementById('pm-secIframe').style.display = "block";
                                        pushToChatStart(htmlToBeAdded);
                                        $(".bxCheckOPtion").remove();
                                        setTimeout(() => {
                                            try {
                                                console.log("called ");
                                                $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');
                                                scrollUp();
                                            } catch (e) {
                                                console.log(e);
                                            }
                                        }, 2000);

                                        if (tags && tags.blockBot && humanAssistSwitch) {
                                            socketHuman.emit("assignAgentBackend", {
                                                data: {
                                                    senderId: webId,
                                                    bot: projectId
                                                },
                                                senderId: webId,
                                                projectId: projectId
                                            });
                                        }
                                        scrollUp();
                                    } else {
                                        $('body').on("click", "#jubi-continue-storage", function (e) {
                                            if (updateWebId) {
                                                readyState = true;
                                                updateWebId(webId);
                                            }
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
                                            pushToChatStart(htmlToBeAdded);
                                            $(".bxCheckOPtion").remove();
                                            setTimeout(() => {
                                                scrollUp();
                                            }, chatArray.length * 20);
                                            if (tags && tags.blockBot && humanAssistSwitch) {
                                                socketHuman.emit("assignAgentBackend", {
                                                    data: {
                                                        senderId: webId,
                                                        bot: projectId
                                                    },
                                                    senderId: webId,
                                                    projectId: projectId
                                                });
                                            }
                                        });
                                        $('body').on("click", "#jubi-start-fresh", function (e) {
                                            if (updateWebId) {
                                                readyState = true;
                                                updateWebId(webId);
                                            }
                                            invalidate(() => {}, true);
                                            clearAllLocalStorageData();
                                            chatArray = [];
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
                                            console.log(inputQuery);
                                            console.log(":::::::::::::::>>>>>>>>>>>");
                                            let ans = prepareJSONRequest(inputQuery);
                                            sendMessage(ans);
                                            scrollUp();
                                        });
                                        document.getElementById('pm-permission-view').style.display = "block";
                                        document.getElementById('pm-secIframe').style.display = "none";
                                    }

                                    return;
                                }
                            }
                        }
                        throw new Error("Default start");
                    } catch (e) {
                        let startTheBot = () => {
                            if (updateWebId) {
                                readyState = true;
                                updateWebId(webId);
                            }
                            clearAllLocalStorageData();
                            chatArray = [];
                            document.getElementById('pm-permission-view').style.display = "none";
                            document.getElementById('pm-secIframe').style.display = "block";
                            console.log("Start Message");
                            console.log(inputQuery);
                            user.stages = undefined;
                            user.tracker = 0;
                            user.conversationId = undefined;
                            let ans = prepareJSONRequest(inputQuery);
                            sendMessage(ans);
                            scrollUp();
                        };
                        if (!window.runOnJubiStartEvent) {
                            console.log("Starting Bot now");
                            startTheBot();
                        } else {
                            console.log("Starting Bot later");
                            window.jubiStartEvent = startTheBot;
                        }
                    }
                }

                let run = window.askBot = function (answer, type) {
                    lastConversationSemaphore = true;
                    let str;
                    if (answer.startsWith("upload_file>")) {
                        str = showFile(answer);
                    } else {
                        str = showAnswer(answer);
                    }
                    if (str) {
                        pushToChat(str);
                    }
                    let ans = prepareJSONRequest(answer);
                    sendMessage(ans, type);
                    scrollUp();
                };

                //--voice-work
                // Stream Audio
                let bufferSize = 2048,
                    AudioContext,
                    context,
                    processor,
                    input,
                    globalStream,
                    recognizer,
                    wholeString,
                    lastActiveTimestamp,
                    recordSemaphore = false,
                    flush,
                    mute = false; //st

                try {
                    document.getElementById('jubi-muteVoice').style.display = "none"; //st
                    if (voiceEnabled) {
                        document.getElementById('jubi-unmuteVoice').style.display = "block"; //st
                    } else {
                        document.getElementById('jubi-muteVoice').style.display = "none";
                    }
                } catch (e) {}

                $("body").on('click', '#jubi-unmuteVoice', function (e) {
                    document.getElementById('jubi-unmuteVoice').style.display = "none";
                    document.getElementById('jubi-muteVoice').style.display = "block";
                    mute = true;
                    stopVoice();
                });
                $("body").on('click', '#jubi-muteVoice', function (e) {
                    document.getElementById('jubi-unmuteVoice').style.display = "block";
                    document.getElementById('jubi-muteVoice').style.display = "none";
                    mute = false;
                });

                let resultText = document.getElementById('jubi-result-text'),
                    removeLastSentence = true,
                    streamStreaming = false;

                const constraints = {
                    audio: true,
                    video: false
                };

                function clearSpeechText() {
                    wholeString = "";
                    while (resultText && resultText.firstChild) {
                        resultText.removeChild(resultText.firstChild);
                    }
                    document.getElementById('jubi-recording-text').style.display = "none";
                    document.getElementById("pm-buttonlock").style.paddingBottom = "0px";
                }
                //voice
                function hideVoice() {
                    try {
                        document.getElementById('pm-textInput').style.display = "block";
                        document.getElementById('jubi-textInput').style.display = "none";
                        document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
                        document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
                    } catch (e) {
                        // console.log(e);
                    }
                }

                //voice ui -----------
                if (voiceEnabled) {
                    addVoiceListeners();
                }

                async function disconnectVoice() {
                    $("#jubi-bxinput").fadeIn(100);
                    $("#button-send").fadeIn(100);
                    $("#keyboard-icon").hide();
                    $("#voice-buttons").hide();
                    $("#jubi-answerBottom").focus();
                    $("#button-stop-ws").hide();
                    $("#button-play-ws").show();
                    recordSemaphore = false;
                    wholeString = "";
                    clearSpeechText();
                    await stopAllRecordings();
                }

                function showVoice() {

                    $("#jubi-bxinput").hide();
                    $("#button-send").hide();
                    $("#keyboard-icon").fadeIn(50);
                    $("#voice-buttons").fadeIn(50);
                }

                function addVoiceListeners() {
                    $("#keyboard-icon").click(disconnectVoice);
                    $("#jubi-graySend").click(function () {
                        if (voiceEnabled && online) {
                            showVoice();
                        }
                    });
                    $("#jubi-redSend").click(function () {
                        if (voiceEnabled && online) {
                            showVoice();
                        }
                    });
                    $("#button-play-ws").click(() => {
                        recordSemaphore = true;
                        speechToText();
                    });
                    $("#button-stop-ws").click(async () => {
                        recordSemaphore = false;
                        if (wholeString) {
                            run(wholeString, "speech");
                        }
                        clearSpeechText();
                        await stopAllRecordings();
                    });
                }

                function hideStop() {
                    $("#button-stop-ws").hide();
                    $("#button-play-ws").show();
                }

                function hidePlay() {
                    stopVoice();
                    $("#button-play-ws").hide();
                    $("#button-stop-ws").show();
                }

                //voice ui -----------

                //stop recording----

                function stopAllRecordings() {
                    return new Promise((resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            if (recognizer) {
                                recognizer.stop();
                                hideStop();
                                return resolve();
                            } else if (globalStream) {
                                streamStreaming = false;
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                                let track = globalStream.getTracks()[0];
                                track.stop();
                                if (input) {
                                    input.disconnect(processor);
                                    processor.disconnect(context.destination);
                                    context.close().then(function () {
                                        input = null;
                                        processor = null;
                                        context = null;
                                        AudioContext = null;
                                        hideStop();
                                        return resolve();
                                    });
                                } else {
                                    hideStop();
                                    return resolve();
                                }
                            } else {
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                                hideStop();
                                return resolve();
                            }
                        } catch (e) {
                            hideStop();
                            return reject(e);
                        }
                    });
                }

                //stop recording----


                //voice record------------------


                async function speechToText() {
                    try {
                        lastActiveTimestamp = new Date().getTime();
                        let interval = setInterval(async () => {
                            if (new Date().getTime() - lastActiveTimestamp > 15000) {
                                await stopAllRecordings();
                                clearInterval(interval);
                            }
                        }, 1000);
                        try {
                            await startRecordingOnBrowser();
                        } catch (e) {
                            await startRecordingFromAPI();
                        }
                        hidePlay();
                    } catch (e) {
                        // console.log(e);
                    }
                }

                function capitalize(s) {
                    if (s.length < 1) {
                        return s;
                    }
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }

                function addTimeSettingsInterim(speechData) {
                    try {
                        wholeString = speechData.results[0].alternatives[0].transcript;
                    } catch (e) {
                        // console.log(e)
                        wholeString = speechData.results[0][0].transcript;
                    }

                    let nlpObject = window.nlp(wholeString).out('terms');

                    let words_without_time = [];

                    for (let i = 0; i < nlpObject.length; i++) {
                        //data
                        let word = nlpObject[i].text;
                        let tags = [];

                        //generate span
                        let newSpan = document.createElement('span');
                        newSpan.innerHTML = word;

                        //push all tags
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            tags.push(nlpObject[i].tags[j]);
                        }

                        //add all classes
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            let cleanClassName = tags[j];
                            // console.log(tags);
                            let className = `nl-${cleanClassName}`;
                            newSpan.classList.add(className);
                        }

                        words_without_time.push(newSpan);
                    }

                    finalWord = false;
                    // endButton.disabled = true;

                    return words_without_time;
                }

                function addTimeSettingsFinal(speechData) {
                    let words = [];
                    try {
                        wholeString = speechData.results[0].alternatives[0].transcript;
                        words = speechData.results[0].alternatives[0].words;
                    } catch (e) {
                        // console.log(e)
                        wholeString = speechData.results[0][0].transcript;
                    }
                    let nlpObject = window.nlp(wholeString).out('terms');

                    let words_n_time = [];

                    for (let i = 0; i < words.length; i++) {
                        //data
                        let word = words[i].word;
                        let startTime = `${words[i].startTime.seconds}.${words[i].startTime.nanos}`;
                        let endTime = `${words[i].endTime.seconds}.${words[i].endTime.nanos}`;
                        let tags = [];

                        //generate span
                        let newSpan = document.createElement('span');
                        newSpan.innerHTML = word;
                        newSpan.dataset.startTime = startTime;

                        //push all tags
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            tags.push(nlpObject[i].tags[j]);
                        }

                        //add all classes
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            let cleanClassName = nlpObject[i].tags[j];
                            // console.log(tags);
                            let className = `nl-${cleanClassName}`;
                            newSpan.classList.add(className);
                        }

                        words_n_time.push(newSpan);
                    }

                    return words_n_time;
                }

                function startRecordingOnBrowser() {
                    return new Promise(async (resolve, reject) => {
                        // return reject()
                        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
                        if (window.SpeechRecognition === null) {
                            return reject();
                        } else {
                            recognizer = new window.SpeechRecognition();
                            recognizer.continuous = false;
                            recognizer.interimResults = true;
                            recognizer.lang = "en-IN";
                            recognizer.onresult = getResults;
                            try {
                                recognizer.start();
                            } catch (ex) {
                                // console.log(ex)
                                await stopAllRecordings();
                            }
                            recognizer.onerror = async function (event) {
                                // console.log(event)
                                await stopAllRecordings();
                            };
                            return resolve();
                        }
                    });
                }

                socketVoice.on('speech-data', data => {
                    data = crypterTransit.decrypt(data);
                    getResults(data);
                });

                function startRecordingFromAPI() {
                    function microphoneProcess(e) {
                        let left = e.inputBuffer.getChannelData(0);
                        let left16 = downsampleBuffer(left, 44100, 16000);
                        if (online) {
                            socketVoice.emit('web-speech-to-text-binary-data', { c: left16 });
                        }
                        function downsampleBuffer(buffer, sampleRate, outSampleRate) {
                            if (outSampleRate == sampleRate) {
                                return buffer;
                            }
                            if (outSampleRate > sampleRate) {
                                throw "downsampling rate show be smaller than original sample rate";
                            }
                            let sampleRateRatio = sampleRate / outSampleRate;
                            let newLength = Math.round(buffer.length / sampleRateRatio);
                            let result = new Int16Array(newLength);
                            let offsetResult = 0;
                            let offsetBuffer = 0;
                            while (offsetResult < result.length) {
                                let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
                                let accum = 0,
                                    count = 0;
                                for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                                    accum += buffer[i];
                                    count++;
                                }

                                result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
                                offsetResult++;
                                offsetBuffer = nextOffsetBuffer;
                            }
                            return result.buffer;
                        }
                    }
                    window.onbeforeunload = function () {
                        if (streamStreaming && online) {
                            socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                        }
                    };
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            socketVoice.emit('web-speech-to-text-start', crypterTransit.encrypt({ webId: webId })); //init socket Google Speech Connection
                            streamStreaming = true;
                            AudioContext = window.AudioContext || window.webkitAudioContext;
                            context = new AudioContext();
                            processor = context.createScriptProcessor(bufferSize, 1, 1);
                            processor.connect(context.destination);
                            context.resume();
                            let handleSuccess = function (stream) {
                                globalStream = stream;
                                input = context.createMediaStreamSource(stream);
                                if (input) {
                                    input.connect(processor);
                                    processor.onaudioprocess = function (e) {
                                        microphoneProcess(e);
                                        return resolve();
                                    };
                                }
                            };
                            navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(e => {
                                // console.log(e);
                                return reject(e);
                            });
                        } catch (e) {
                            return reject(e);
                        }
                    });
                }

                async function getResults(data) {
                    // console.log("RESPONSE")
                    // console.log(data.results)
                    document.getElementById('jubi-recording-text').style.display = "block";
                    lastActiveTimestamp = new Date().getTime();
                    let dataFinal = undefined || data.results[0].isFinal;
                    if (dataFinal === false) {
                        if (removeLastSentence) {
                            resultText.lastElementChild.remove();
                        }
                        removeLastSentence = true;

                        //add empty span
                        let empty = document.createElement('span');
                        resultText.appendChild(empty);

                        //add children to empty span
                        let edit = addTimeSettingsInterim(data);

                        for (let i = 0; i < edit.length; i++) {
                            resultText.lastElementChild.appendChild(edit[i]);
                            resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                        }
                        let height = parseInt($("#jubi-recording-text").height()) + 10;
                        document.getElementById("pm-buttonlock").style.paddingBottom = height + "px";
                        scrollUp();
                    } else if (dataFinal === true) {
                        if (resultText.lastElementChild) {
                            resultText.lastElementChild.remove();
                        }
                        //add empty span
                        let empty = document.createElement('span');
                        resultText.appendChild(empty);

                        //add children to empty span
                        let edit = addTimeSettingsFinal(data);
                        for (let i = 0; i < edit.length; i++) {
                            if (i === 0) {
                                edit[i].innerText = capitalize(edit[i].innerText);
                            }
                            resultText.lastElementChild.appendChild(edit[i]);

                            if (i !== edit.length - 1) {
                                resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                            }
                        }
                        resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                        // console.log(wholeString);
                        // console.log("Google Speech sent 'final' Sentence.");

                        finalWord = true;
                        removeLastSentence = false;
                        run(wholeString, "speech");
                        clearSpeechText();
                        await stopAllRecordings();
                    }
                    // console.log("HEIGHT")
                    // console.log($("#jubi-recording-text").height())
                }

                //voice record------------------


                //speech out-------
                async function textToSpeech(text) {
                    try {
                        await stopAllRecordings();
                    } catch (e) {
                        // console.log(e);
                    }
                    try {
                        let postSpeech;
                        // try{
                        //     postSpeech=await convertAndPlaySpeechOnBrowser(text);
                        // }
                        // catch(e){
                        postSpeech = await convertAndPlaySpeechFromAPI(text);
                        // }
                        afterVoiceOut(postSpeech);
                    } catch (e) {
                        // console.log(e);
                    }
                }

                function afterVoiceOut(e) {
                    if (recordSemaphore) {
                        speechToText();
                        hidePlay();
                    }
                }

                function stopVoice() {
                    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
                    // if(window.SpeechRecognition != null&&responsiveVoice&&responsiveVoice.voiceSupport()){
                    //     responsiveVoice.cancel();
                    // }
                    if (flush && isPlaying(flush)) {
                        flush.pause();
                        flush.currentTime = 0;
                    }
                }
                $(document).on('click', 'body *', function () {
                    stopVoice();
                });
                $(document).on('keypress', "body *", function () {
                    stopVoice();
                });

                // function convertAndPlaySpeechOnBrowser(text){
                //     return new Promise(async(resolve,reject)=>{
                //         try{
                //             window.SpeechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition || null;
                //             if (window.SpeechRecognition === null) {
                //                 return reject()
                //             }
                // if(responsiveVoice.voiceSupport()){
                //     responsiveVoice.speak(text, window.speechOnBrowser||"Hindi Female", {onstart: ()=>{}, onend: (data)=>{
                //         return resolve(data)
                //     }});
                // }
                // else{
                //     return reject("no web support");
                // }
                //         }
                //         catch(e){
                //             // console.log(e);
                //             return reject(e);
                //         }
                //     });

                // }

                function isPlaying(audelem) {
                    return !audelem.paused;
                }

                function removeHTMLTags(text) {
                    var div = document.createElement("div");
                    div.innerHTML = text;
                    return div.innerText;
                }

                function convertAndPlaySpeechFromAPI(text) {

                    return new Promise((resolve, reject) => {
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        let requestData = {
                            data: { text: removeHTMLTags(text),
                                gender: speechGenderBackend || "FEMALE",
                                languageCode: speechLanguageCodeBackend || "en-US"
                            },
                            webId: webId,
                            requestId: uid
                        };
                        console.log("WEBSPEECH REQUEST")
                        socketVoice.emit("web-text-to-speech", crypterTransit.encrypt(requestData));
                        socketVoice.on("web-text-to-speech-" + webId + "-" + uid, data => {
                            console.log("WEBSPEECH RESPONSE")
                            data = crypterTransit.decrypt(data);
                            console.log(data)
                            playVoiceFromAPI(data);
                        });
                        function playVoiceFromAPI(speech) {
                            // speech = JSON.parse(crypterTransit.decrypt(speech))
                            if (speech.error) {
                                return reject(speech.error);
                            }
                            if (speech.status == "success") {
                                if (!flush || !isPlaying(flush)) {
                                    flush = new Audio(speech.url);
                                    flush.play();
                                    flush.onended = () => {
                                        return resolve(speech);
                                    };
                                } else {
                                    setTimeout(playVoiceFromAPI, 500, speech);
                                }
                            } else {
                                return reject(speech);
                            }
                        }
                    });
                }

                //speech out-------


                function getAllText(message) {
                    let str = "";
                    for (let element of message) {
                        if (element.type == "text") {
                            str += element.value;
                        }
                    }
                    str = str.replace(/\|br\|/g, "");
                    str = str.replace(/\|break\|/g, "");
                    return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, ' ');
                }

                function scrollUp() {
                    $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');

                    if ($("#pm-buttonlock").height() > $("#pm-data").height() && $("#pm-buttonlock").height() > 0) {
                        $("#pm-data").css("display", "block");
                    }
                }

                function postReply(res) {
                    //ENABLE TEXT, HIDE RIGHT LOADER
                    // $('#pm-Rightbxloadgif').remove();
                    $('.pm-Rightbxloadgif').hide();
                    document.getElementById('jubi-answerBottom').removeAttribute('disabled');
                    $(".inputfile").css("display", "block");
                    if (voiceEnabled && online && !mute) {
                        textToSpeech(getAllText(res.botMessage));
                    }
                    //console.log(JSON.stringify(res, null, 3))
                    $(".pm-bxCheckOPtion").remove();
                    $(".pm-bxCheckOPtionUrl").remove();
                    $(".answer").parent().parent().remove();
                    let answerType = res.answerType;
                    let count = res.botMessage.length;
                    gender = res.gender;
                    profile = res.profile;
                    let i = 0;
                    let incrementDelay = 0;
                    let totalDelay = 0;
                    let delayPop = delayMaster;
                    let sleepDelay = delayMaster * (3 / 4);
                    let delay = delayMaster * (1 / 10);
                    if (semaphoreForFirstChatLoad) {
                        semaphoreForFirstChatLoad = false;
                    } else {
                        if (!document.getElementById("pm-bxloadgif")) {
                            let loader = prepareChatBotLoader();
                            $(".pm-bxChat").append(loader);
                            scrollUp();
                        }
                    }
                    show_replies();
                    async function show_replies() {
                        if (!$("#pm-bxloadgif").is(":visible")) {
                            $("#pm-buttonlock").append(prepareChatBotLoader());
                        }
                        $("#pm-bxloadgif").fadeOut(100);
                        $("#pm-bxloadgif").fadeIn(500);
                        await waitForAwhile(delayMaster);

                        let chatBotReponse = "";
                        if (res.botMessage[i].value == "CLOSE_IFRAME_ASAP") {
                            $(".showEditIframe").fadeOut(600);
                            setTimeout(() => {
                                $(".showEditIframe").remove();
                            }, 200);
                            res.botMessage.splice(i, 1);
                        } else if (res.botMessage[i].type == "text" && res.botMessage[i].value !== "") {
                            let url = res.botMessage[i].value.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/);
                            if (url) {
                                res.botMessage[i].value = res.botMessage[i].value.replaceAll(url[0], "<a target='_blank' href='" + url[0] + "'>" + url[0] + "</a>");
                            }
                            // if (i == 0 && lastConversationSemaphore) {
                            //     chatBotReponse = prepareChatBotReply(res.botMessage[i].value);
                            //     if (backendResponse && booleanHideShow != true) {
                            //         backendResponse = parseInt(backendResponse) + 1;
                            //     }
                            // }
                            // // else 
                            if (i == 0) {
                                chatBotReponse = prepareChatBotFirstReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareChatBotReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "image") {
                            if (i == 0) {
                                chatBotReponse = prepareChatBotFirstImageReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareChatBotImageReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "video") {
                            // console.log(res.botMessage[i].type + res.botMessage[i].value + "****")
                            // console.log(lastConversationSemaphore);
                            if (i == 0) {
                                chatBotReponse = prepareFirstVideoReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareVideoReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "file" || res.botMessage[i].type == "audio") {
                            if (i == 0) {
                                chatBotReponse = prepareFirstFileReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareFileReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else {
                            res.botMessage.splice(i, 1);
                        }
                        if (chatBotReponse) {
                            pushToChat(chatBotReponse);
                            $(".pm-bxloadgif").remove();
                        }

                        // if(i>0){
                        //     await waitForAwhile(700);

                        // }
                        scrollUp();
                        if (i == res.botMessage.length) {
                            lastConversationSemaphore = false;
                            if (res.options) {
                                pushToChat(prepareUserInput(res.answerType, res.options));
                            }
                            // else {
                            //     showTextInput();
                            // }
                        } else {
                            // console.log("Show replies")
                            show_replies();
                        }
                    }
                    msgIndex++;
                }
                function waitForAwhile(time) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            return resolve();
                        }, time);
                    });
                }
                function prepareUserInput(questionType, options) {
                    if (questionType == 'option') {
                        let str = optionStart();
                        for (let i = 0; i < options.length; i++) {
                            str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                        }

                        str = str + optionEnd();
                        return str;
                    } else if (questionType == 'persist-option') {
                        let str = optionPersistStart();
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].type == "url") {
                                str = str + "<li><a href='" + htmlInjectionPrevent(options[i].data) + "' target='_blank' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].text) + "' class='question-options-persist-url'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            } else if (options[i].type == "webView") {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options-persist-webView'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            } else {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options-persist'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            }
                        }

                        str = str + optionEnd();
                        return str;
                    } else if (questionType = "generic") {
                        let str = buildGeneric(options);
                        // console.log(str)
                        setTimeout(function () {
                            slidebx();
                        }, 0);
                        return str;
                    }
                }
                function pushToChatStart(str) {
                    $(".pm-bxChat").append(str);
                    // $(".pm-bxLeftchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxRightchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxCheckOPtionPersist:last-child").hide();
                    // $(".pm-bxCheckOPtionPersist:last-child").animate({ "opacity": "show", bottom: "40" }, 800);
                }
                function pushToChat(str) {
                    $("#pm-bxloadgif").remove();
                    // $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
                    $(".pm-bxChat").append(str);
                    // $(".pm-bxLeftchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxRightchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxCheckOPtionPersist:last-child").hide();
                    // $(".pm-bxCheckOPtionPersist:last-child").animate({ "opacity": "show", bottom: "40" }, 800);
                    chatArray.push(str);
                    // console.log(chatArray);
                    setLocalStorageData(localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(chatArray)));
                    setLocalStorageData("webId_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({ id: webId })));
                }
                function pushToView(str) {
                    $("#pm-mainSec").append(str);
                }

                function prepareJSONRequest(answer) {
                    return {
                        text: answer
                    };
                }
                function genericStart() {
                    return '<div class="pm-owlsliderbx"><div class="slider-inner pm-slider-inner"><div  class="owl-carousel owl-theme">';
                }
                function replaceAll(str, find, replace) {
                    if (typeof str == "string") {
                        return str.replace(new RegExp(find, 'g'), replace);
                    }
                    return str;
                }
                function buildGeneric(data) {
                    let html = '';
                    if (data && data.length > 0 && data[0].buttons && data[0].buttons.length > 0) {
                        html = genericStart();
                        for (let i = 0; i < data.length; i++) {
                            html += '<div class="item">';
                            if (data[i].image) {
                                html += '<div class="pm-slideImage"><img src="' + data[i].image + '"></div>';
                            }
                            html += '<div class="pm-sliderContent">';
                            if (data[i].title) {
                                html += '<h5> ' + data[i].title + '</h5>';
                            }
                            if (data[i].text) {
                                // console.log(data[i].text)
                                html += '<p>' + data[i].text.replaceAll("|br|", "<br/>") + '</p>';
                            }
                            html += '</div><div class="pm-bxslidebtn">';
                            for (let j = 0; j < data[i].buttons.length; j++) {
                                let options = data[i].buttons[j];
                                options.text = replaceAll(options.text, "'", " ");
                                options.data = replaceAll(options.data, '"', " ");
                                if (options.type == "url") {
                                    html += "<a href='" + options.data + "' target='_blank' data-id='" + htmlInjectionPrevent(data[i].title) + "' inner-id='" + htmlInjectionPrevent(options.data) + "' class='question-options-url'>" + htmlInjectionPrevent(options.text) + "</a> ";
                                } else {
                                    html += "<a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(data[i].title) + "' inner-id='" + htmlInjectionPrevent(options.data) + "' class='question-options'>" + htmlInjectionPrevent(options.text) + "</a> ";
                                }
                            }
                            html += '</div>';
                            html += '</div>';
                        }

                        html += genericEnd();
                    }
                    return html;
                }
                function genericEnd() {
                    return '</div></div></div>';
                }
                function prepareChatBotReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput' >" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput' >" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime jubi-left_msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstVideoReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + ' <iframe   src="' + msg + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareVideoReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + ' <iframe   src="' + msg + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotLoader() {
                    let d = getTime();
                    return "<div id='pm-bxloadgif' class='pm-bxuser_question pm-bxloadgif ' style='visibility: visible;'><div class='pm-leftInputGif'><div class='pm-leftUserimg'><img src='" + modal.static.images.botIcon + "' class='img-responsive'></div><div class='pm-innerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div></div></div>";
                }
                function prepareChatBotUserLoader() {
                    return "<div class='pm-bxRightchat'>" + "<div id='pm-Rightbxloadgif' class='pm-bxuser_question pm-Rightbxloadgif'>" + "<div class='pm-leftInputGif'>" +
                    // // "<div class='pm-leftUserimg'>"+
                    // //     "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>"+
                    // // "</div>"+
                    // "<div class='pm-rightUserimg'><img src='./images/user.png'></div>"+
                    "<div class='pm-innerloadgif pm-Rightinnerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div>" + "</div>" + "</div>" + "</div>";
                }
                function showWebView(url) {
                    return '<div class="showEditIframe" id="iframeView">' + '<div class="closeIframeBtn"><img src="' + modal.static.images.closeWebView + '" class="img-responsive"></div>' + '<iframe src="' + url + '" frameborder="0" -webkit-overflow-scrolling:="" touch;="" allowfullscreen="" style="overflow:hidden;"></iframe>' + '</div>';
                }
                function showFile(answer) {

                    let arr = answer.split(">");
                    if (arr.length == 2) {
                        let isImage = checkForImage(arr[1]);
                        let imageUrl = htmlInjectionPrevent(arr[1]);
                        let d = getTime();
                        if (isImage) {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<div class='pm-postImg'>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + imageUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        } else {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        }
                    } else {
                        return;
                    }
                }
                function checkForImage(url) {
                    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
                }
                function showAnswer(answer) {
                    let d = getTime();
                    return "<div class='pm-bxRightchat' style='visibility: visible;'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function showMaleAnswer(answer) {
                    return "<div class='pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function showFemaleAnswer(answer) {

                    return "<div class='pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userFemaleIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function optionStart() {
                    return "<div class='pm-bxCheckOPtion' style='visibility: visible; '>" + "<ul >";
                }
                function optionPersistStart() {
                    return "<div class='pm-bxCheckOPtionPersist' style='visibility: visible; '>" + "<ul >";
                }
                function optionEnd() {
                    return "</ul></div>";
                }
                function showProfileAnswer(answer) {
                    return "<div class='pm-bxRightchat' style='visibility: visible;'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img style='border-radius: 100px;' src='" + profile + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function prepareTextInputProfileBox() {
                    return "<div class='pm-anwser-div pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<input class='form-control input-lg answer' data-id='" + msgIndex.toString() + "' autofocus='autofocus' type='text' placeholder='Type and hit enter'>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img style='border-radius: 100px;' src='" + profile + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function sendMessage(data, type) {
                    $(".pm-bxCheckOPtion").remove();
                    $(".pm-bxCheckOPtionUrl").remove();
                    $(".answer").parent().parent().remove();
                    $('.pm-Rightbxloadgif').hide();

                    document.getElementById('jubi-answerBottom').removeAttribute('disabled');
                    $(".inputfile").css("display", "block");
                    if (tags && !tags.blockBot) {
                        // console.log(JSON.stringify(data, null, 3))
                        deviceInfo.inputType = type || "text";
                        if (!document.getElementById("pm-bxloadgif")) {
                            let loader = prepareChatBotLoader();
                            $(".pm-bxChat").append(loader);
                        }
                        scrollUp();
                        setTimeout(_ => {
                            $("#pm-bxloadgif").remove();
                            $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
                        }, 5000);
                    }

                    setTimeout(() => {
                        data.text = currentButtonContext[data.text.toLowerCase().trim()] || data.text;
                        ce.processInput(data.text);
                    }, 100);
                }
                function slidebx() {
                    let count = 0;
                    $('.owl-carousel').each(function () {
                        $(this).attr('id', 'owl-demo' + count);
                        $('#owl-demo' + count).owlCarousel({
                            items: 2,
                            // singleItem:true,
                            // itemsDesktop: [1000, 1], 
                            // itemsDesktopSmall: [900, 1], 
                            // itemsTablet: [700, 1], 
                            // itemsMobile: [479, 1], 
                            navigation: true,
                            navigation: !0,
                            navigationText: ["&#8249", "&#8250"],
                            nav: true,
                            responsiveClass: true,
                            responsive: {
                                0: {
                                    items: 1
                                },
                                700: {
                                    items: 1
                                },
                                900: {
                                    items: 2
                                },
                                1300: {
                                    items: 2
                                }
                            }

                        });
                        count++;
                    });
                }

                $('body').on("change", ".jubi-file-upload", function (e) {
                    console.log("FILE UPLOAD");
                    $("#pm-buttonlock").append(prepareChatBotUserLoader());
                    scrollUp();
                    let timeoutVar = setTimeout(() => {
                        let str = showAnswer("Could not upload file. Please try a smaller file. Should be below 500kb ideally.");
                        scrollUp();
                        $('.pm-Rightbxloadgif').hide();
                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                        $(".inputfile").css("display", "none");
                        pushToChat(str);
                    }, 30000);
                    let input = e.target;
                    if (input.files && input.files[0]) {
                        let reader = new FileReader();
                        reader.readAsDataURL(input.files[0]);
                        reader.onloadend = function () {
                            let data = {
                                file: this.result,
                                webId: new Date().getTime()
                            };
                            if (online) {
                                socketUpload.emit('file', crypterTransit.encrypt(JSON.stringify(data)));
                                socketUpload.on('upload-complete-' + data.webId, function (data) {
                                    data = JSON.parse(crypterTransit.decrypt(data));
                                    // console.log(JSON.stringify(data))
                                    if (data.url) {
                                        clearInterval(timeoutVar);
                                        run("upload_file>" + data.url, "file");
                                        //RIGHT LOADER
                                        // $('#jubi-answerBottom').prop('disabled', true);
                                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                        $(".inputfile").css("display", "none");
                                    }
                                });
                            }
                        };
                    } else {
                        let files = !!this.files ? this.files : [];
                        if (!files.length || !window.FileReader) return;
                        if (/^image/.test(files[0].type)) {
                            let reader = new FileReader();
                            reader.readAsDataURL(files[0]);
                            reader.onloadend = function () {
                                let data = {
                                    file: this.result,
                                    webId: webId
                                };
                                if (online) {
                                    socketUpload.emit('file', crypterTransit.encrypt(JSON.stringify(data)));
                                    socketUpload.on('upload-complete-' + data.webId, function (data) {
                                        data = JSON.parse(crypterTransit.decrypt(data));
                                        if (data.url) {
                                            clearInterval(timeoutVar);
                                            // console.log(JSON.stringify(data))
                                            run("upload_file>" + data.url, "file");
                                            //RIGHT LOADER
                                            // $('#jubi-answerBottom').prop('disabled', true);
                                            document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                            $(".inputfile").css("display", "none");
                                        }
                                    });
                                }
                            };
                        }
                    }
                });

                $("body").on('click', '.question-options-persist-webView', function (e) {
                    let url = $(this).attr('inner-id');
                    let str = showWebView(url);
                    scrollUp();
                    pushToView(str);
                });
                $("body").on('click', ".closeIframeBtn", function (e) {
                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 1000);
                });
                $(".pm-menu_val").click(function (e) {
                    let answer = $(this).text();
                    if (answer.trim() != "") {
                        lastConversationSemaphore = true;
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('click', '.bxgetthefull', function (e) {
                    lastConversationSemaphore = true;
                    let inner = $(this).attr('inner-id');
                    let answer = $(this).attr('data-id');
                    $(".pm-bxCheckOPtion").remove();
                    $(".answer").parent().parent().remove();

                    let str = null;
                    if (profile) {
                        str = showProfileAnswer(answer);
                    } else if (gender && gender == "male") {
                        str = showMaleAnswer(answer);
                    } else if (gender && gender == "female") {
                        str = showFemaleAnswer(answer);
                    } else {
                        str = showAnswer(answer);
                    }
                    scrollUp();
                    pushToChat(str);
                    let ans1 = prepareJSONRequest(inner);
                    sendMessage(ans1);
                });
                $("body").on('click', '.question-options', function (e) {
                    if (e.originalEvent && e.originalEvent.isTrusted) {
                        lastConversationSemaphore = true;
                        let inner = $(this).attr('inner-id');
                        let answer = $(this).attr('data-id');
                        $(".bxCheckOPtion").remove();
                        $(".answer").parent().parent().remove();

                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(inner);
                        sendMessage(ans1);
                    }
                });
                $("body").on('click', '.question-options-persist', function (e) {
                    if (e.originalEvent && e.originalEvent.isTrusted) {
                        lastConversationSemaphore = true;
                        let inner = $(this).attr('inner-id');
                        let answer = $(this).attr('data-id');
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(inner);
                        sendMessage(ans1);
                    }
                });
                $('body').on('click', '#pm-bottomClick', function () {
                    let answer = $("#pm-answerBottom").val();

                    answer = answer.trim();
                    if (answer === "") {
                        $('#answerBottom').val('').empty();
                    }

                    if (answer != "") {
                        lastConversationSemaphore = true;
                        $("#pm-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        // $(".sec_slider").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('keypress', '#pm-answerBottom', function (e) {

                    let answer = $("#pm-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#pm-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $('body').on('click', '#jubi-bottomClick', function () {
                    let answer = $("#jubi-answerBottom").val();

                    answer = answer.trim();
                    if (answer === "") {
                        $('#answerBottom').val('').empty();
                    }

                    if (answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        // $(".sec_slider").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('keypress', '#jubi-answerBottom', function (e) {

                    let answer = $("#jubi-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });

                $("#jubi-answerBottom").keydown(function (e) {

                    let answer = $("#jubi-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("#pm-answerBottom").click(scrollUp);
                $("#jubi-answerBottom").click(scrollUp);
                $(".pm-showmenubx").css("display", "none");
                $(".pm-showMenu").click(function () {
                    $(".pm-showmenubx").toggle(400);
                });
                $("#pm-bottomClick").click(function () {
                    setTimeout(function () {
                        $('#pm-answerBottom').val('').empty();
                    }, 500);
                });
                $("#pm-answerBottom").on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        $('#pm-answerBottom').val('').empty();
                    }
                });
                $("#jubi-bottomClick").click(function () {
                    setTimeout(function () {
                        $('#jubi-answerBottom').val('').empty();
                    }, 500);
                });
                $("#jubi-answerBottom").on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        $('#jubi-answerBottom').val('').empty();
                    }
                });
                $(".pm-btnClose").click(function () {
                    $(".pm-secCloseMsg").hide(200);
                });
                $(".pm-iconMenu").click(function () {
                    $("#pm-secMenucontent").toggle();
                });
                $("#pm-secMenucontent").click(function () {
                    $("#pm-secMenucontent").hide();
                });
                $('.pm-bxform').click(function () {
                    $("#pm-secMenucontent").hide();
                });
                $(".pm-bxChat").animate({ scrollTop: $(document).height() }, "slow");
                $(".pm-btnClose").click(function () {
                    $(".pm-secCloseMsg").hide();
                });
                $("#pm-secCloseview").click(function () {
                    $('#pm-chatOpenClose').toggleClass('doChatOpenClose');
                });

                $(".pm-sec_closeview").click(function () {
                    $(".pm-sec_closeview").hide();
                    $(".pm-sec_calliframe").fadeIn(500);
                    $(".pm-secHideChat").show(500);
                    $(".pm-secCloseMsg").hide();
                    booleanHideShow = true;
                    backendResponse = '0';
                });
                $(".pm-secHideChat").click(function () {
                    $(".pm-sec_calliframe").hide(500);
                    $(".pm-sec_closeview").show(800);
                    $(".pm-secHideChat").hide(500);
                    $('#pm-chatOpenClose').removeClass('doChatOpenClose');
                    booleanHideShow = false;
                });
                $("#pm-sec_closeviewMobile").click(function () {
                    $("#pm-sec_closeviewMobile").hide(500);
                    $(".pm-sec_calliframe").fadeIn(500);
                });
                $("#pm-secHideMobileChat").click(function () {
                    $(".pm-sec_calliframe").hide(500);
                    $("#pm-sec_closeviewMobile").show(500);
                });
                boot();
            }
            //Helper Functions
            // Clones an Object
            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
            //Chooses random value
            function getRandom(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }
            //Fetch Get Params
            function get(name) {
                if (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(location.search)) {
                    return decodeURIComponent(name[1]);
                }
            }
            //Generates random id
            function IDGenerator(length) {
                let timestamp = +new Date();
                let _getRandomInt = function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };
                let ts = timestamp.toString();
                let parts = ts.split("").reverse();
                let id = "";

                for (let i = 0; i < length; ++i) {
                    let index = _getRandomInt(0, parts.length - 1);
                    id += parts[index];
                }
                return id;
            }
            // function doesConnectionExist() {
            //     return new Promise((resolve,reject)=>{
            //         let xhr = new XMLHttpRequest();
            //         let randomNum = Math.round(Math.random() * 10000);

            //         xhr.open('HEAD', window.location + "?rand=" + randomNum, true);
            //         xhr.send();

            //         xhr.addEventListener("readystatechange", processRequest, false);

            //         function processRequest(e) {
            //         if (xhr.readyState == 4) {
            //             if (xhr.status >= 200 && xhr.status < 304) {
            //                 return resolve(true);
            //             } else {
            //                 return resolve(false);
            //             }
            //         }
            //         }
            //     })
            // }
            //Invoking Chain of operations
            init();
        })();
    }, { "sentence-tokenizer": 8, "string-similarity": 12, "string-tokenizer": 14, "wink-bm25-text-search": 16, "wink-nlp-utils": 61 }], 3: [function (require, module, exports) {
        /*!
         * array-last <https://github.com/jonschlinkert/array-last>
         *
         * Copyright (c) 2014-2017, Jon Schlinkert.
         * Released under the MIT License.
         */

        var isNumber = require('is-number');

        module.exports = function last(arr, n) {
            if (!Array.isArray(arr)) {
                throw new Error('expected the first argument to be an array');
            }

            var len = arr.length;
            if (len === 0) {
                return null;
            }

            n = isNumber(n) ? +n : 1;
            if (n === 1) {
                return arr[len - 1];
            }

            var res = new Array(n);
            while (n--) {
                res[n] = arr[--len];
            }
            return res;
        };
    }, { "is-number": 4 }], 4: [function (require, module, exports) {
        /*!
         * is-number <https://github.com/jonschlinkert/is-number>
         *
         * Copyright (c) 2014-2017, Jon Schlinkert.
         * Released under the MIT License.
         */

        'use strict';

        module.exports = function isNumber(num) {
            var type = typeof num;

            if (type === 'string' || num instanceof String) {
                // an empty string would be coerced to true with the below logic
                if (!num.trim()) return false;
            } else if (type !== 'number' && !(num instanceof Number)) {
                return false;
            }

            return num - num + 1 >= 0;
        };
    }, {}], 5: [function (require, module, exports) {
        'use strict';

        // modified from https://github.com/es-shims/es5-shim

        var has = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var slice = Array.prototype.slice;
        var isArgs = require('./isArguments');
        var isEnumerable = Object.prototype.propertyIsEnumerable;
        var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
        var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
        var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
        var equalsConstructorPrototype = function (o) {
            var ctor = o.constructor;
            return ctor && ctor.prototype === o;
        };
        var excludedKeys = {
            $applicationCache: true,
            $console: true,
            $external: true,
            $frame: true,
            $frameElement: true,
            $frames: true,
            $innerHeight: true,
            $innerWidth: true,
            $outerHeight: true,
            $outerWidth: true,
            $pageXOffset: true,
            $pageYOffset: true,
            $parent: true,
            $scrollLeft: true,
            $scrollTop: true,
            $scrollX: true,
            $scrollY: true,
            $self: true,
            $webkitIndexedDB: true,
            $webkitStorageInfo: true,
            $window: true
        };
        var hasAutomationEqualityBug = function () {
            /* global window */
            if (typeof window === 'undefined') {
                return false;
            }
            for (var k in window) {
                try {
                    if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
                        try {
                            equalsConstructorPrototype(window[k]);
                        } catch (e) {
                            return true;
                        }
                    }
                } catch (e) {
                    return true;
                }
            }
            return false;
        }();
        var equalsConstructorPrototypeIfNotBuggy = function (o) {
            /* global window */
            if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
                return equalsConstructorPrototype(o);
            }
            try {
                return equalsConstructorPrototype(o);
            } catch (e) {
                return false;
            }
        };

        var keysShim = function keys(object) {
            var isObject = object !== null && typeof object === 'object';
            var isFunction = toStr.call(object) === '[object Function]';
            var isArguments = isArgs(object);
            var isString = isObject && toStr.call(object) === '[object String]';
            var theKeys = [];

            if (!isObject && !isFunction && !isArguments) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var skipProto = hasProtoEnumBug && isFunction;
            if (isString && object.length > 0 && !has.call(object, 0)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i));
                }
            }

            if (isArguments && object.length > 0) {
                for (var j = 0; j < object.length; ++j) {
                    theKeys.push(String(j));
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && has.call(object, name)) {
                        theKeys.push(String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

                for (var k = 0; k < dontEnums.length; ++k) {
                    if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
                        theKeys.push(dontEnums[k]);
                    }
                }
            }
            return theKeys;
        };

        keysShim.shim = function shimObjectKeys() {
            if (Object.keys) {
                var keysWorksWithArguments = function () {
                    // Safari 5.0 bug
                    return (Object.keys(arguments) || '').length === 2;
                }(1, 2);
                if (!keysWorksWithArguments) {
                    var originalKeys = Object.keys;
                    Object.keys = function keys(object) {
                        // eslint-disable-line func-name-matching
                        if (isArgs(object)) {
                            return originalKeys(slice.call(object));
                        } else {
                            return originalKeys(object);
                        }
                    };
                }
            } else {
                Object.keys = keysShim;
            }
            return Object.keys || keysShim;
        };

        module.exports = keysShim;
    }, { "./isArguments": 6 }], 6: [function (require, module, exports) {
        'use strict';

        var toStr = Object.prototype.toString;

        module.exports = function isArguments(value) {
            var str = toStr.call(value);
            var isArgs = str === '[object Arguments]';
            if (!isArgs) {
                isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
            }
            return isArgs;
        };
    }, {}], 7: [function (require, module, exports) {
        'use strict';

        module.exports = function (obj) {
            var keys = Object.keys(obj);
            var ret = [];

            for (var i = 0; i < keys.length; i++) {
                ret.push(obj[keys[i]]);
            }

            return ret;
        };
    }, {}], 8: [function (require, module, exports) {
        "use strict";

        // eslint-disable-next-line no-unused-vars

        var debug = require('debug')('tokenizer');

        function compact(str) {
            var res = str.trim();
            res = res.replace('  ', ' ');
            return res;
        }

        function Tokenizer(username, botname) {

            // // Maybe it is not useful
            // if (!(this instanceof Tokenizer)) {
            //   return new Tokenizer();
            // }

            this.username = username || 'Guy';
            this.entry = null;
            this.sentences = null;

            if (typeof botname == 'string') {
                this.botname = botname;
            } else {
                this.botname = 'ECTOR';
            }
        }

        Tokenizer.prototype = {
            setEntry: function (entry) {
                this.entry = compact(entry);
                this.sentences = null;
            },
            // Split the entry into sentences.
            getSentences: function () {
                // this.sentences = this.entry.split(/[\.!]\s/);
                if (!this.entry) return [];
                var words = this.entry.split(' ');
                var endingWords = words.filter(function (w) {
                    return w.endsWith('.') || w.endsWith('!') || w.endsWith('?');
                });

                var self = this;
                var botnameRegExp = new RegExp("\\W?" + self.botname.normalize() + "\\W?");
                var usernameRegExp = new RegExp("\\W?" + self.username.normalize() + "\\W?");
                var lastSentence = words[0];
                self.sentences = [];
                words.reduce(function (prev, cur) {
                    var curNormalized = cur.normalize();
                    var curReplaced = cur;
                    if (curNormalized.search(botnameRegExp) !== -1) {
                        curReplaced = cur.replace(self.botname, "{yourname}");
                    } else if (curNormalized.search(usernameRegExp) !== -1) {
                        curReplaced = cur.replace(self.username, "{myname}");
                    }

                    if (endingWords.indexOf(prev) != -1) {
                        self.sentences.push(compact(lastSentence));
                        lastSentence = "";
                    }
                    lastSentence = lastSentence + " " + curReplaced;
                    return cur;
                });
                self.sentences.push(compact(lastSentence));
                return this.sentences;
            },
            // Get the tokens of one sentence
            getTokens: function (sentenceIndex) {
                var s = 0;
                if (typeof sentenceIndex === 'number') s = sentenceIndex;
                return this.sentences[s].split(' ');
            }
        };

        module.exports = Tokenizer;
    }, { "debug": 9 }], 9: [function (require, module, exports) {
        (function (process) {
            /* eslint-env browser */

            /**
             * This is the web browser implementation of `debug()`.
             */

            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = localstorage();

            /**
             * Colors.
             */

            exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

            /**
             * Currently only WebKit-based Web Inspectors, Firefox >= v31,
             * and the Firebug extension (any Firefox version) are known
             * to support "%c" CSS customizations.
             *
             * TODO: add a `localStorage` variable to explicitly enable/disable colors
             */

            // eslint-disable-next-line complexity
            function useColors() {
                // NB: In an Electron preload script, document will be defined but not fully
                // initialized. Since we know we're in Chrome, we'll just detect this case
                // explicitly
                if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
                    return true;
                }

                // Internet Explorer and Edge do not support colors.
                if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
                    return false;
                }

                // Is webkit? http://stackoverflow.com/a/16459606/376773
                // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
                return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
                // Is firebug? http://stackoverflow.com/a/398120/376773
                typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
                // Is firefox >= v31?
                // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
                typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
                // Double check webkit in userAgent just in case we are in a worker
                typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
            }

            /**
             * Colorize log arguments if enabled.
             *
             * @api public
             */

            function formatArgs(args) {
                args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

                if (!this.useColors) {
                    return;
                }

                const c = 'color: ' + this.color;
                args.splice(1, 0, c, 'color: inherit');

                // The final "%c" is somewhat tricky, because there could be other
                // arguments passed either before or after the %c, so we need to
                // figure out the correct index to insert the CSS into
                let index = 0;
                let lastC = 0;
                args[0].replace(/%[a-zA-Z%]/g, match => {
                    if (match === '%%') {
                        return;
                    }
                    index++;
                    if (match === '%c') {
                        // We only are interested in the *last* %c
                        // (the user may have provided their own)
                        lastC = index;
                    }
                });

                args.splice(lastC, 0, c);
            }

            /**
             * Invokes `console.log()` when available.
             * No-op when `console.log` is not a "function".
             *
             * @api public
             */
            function log(...args) {
                // This hackery is required for IE8/9, where
                // the `console.log` function doesn't have 'apply'
                return typeof console === 'object' && console.log && console.log(...args);
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */
            function save(namespaces) {
                try {
                    if (namespaces) {
                        exports.storage.setItem('debug', namespaces);
                    } else {
                        exports.storage.removeItem('debug');
                    }
                } catch (error) {
                    // Swallow
                    // XXX (@Qix-) should we be logging these?
                }
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */
            function load() {
                let r;
                try {
                    r = exports.storage.getItem('debug');
                } catch (error) {}
                // Swallow
                // XXX (@Qix-) should we be logging these?


                // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
                if (!r && typeof process !== 'undefined' && 'env' in process) {
                    r = process.env.DEBUG;
                }

                return r;
            }

            /**
             * Localstorage attempts to return the localstorage.
             *
             * This is necessary because safari throws
             * when a user disables cookies/localstorage
             * and you attempt to access it.
             *
             * @return {LocalStorage}
             * @api private
             */

            function localstorage() {
                try {
                    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
                    // The Browser also has localStorage in the global context.
                    return localStorage;
                } catch (error) {
                    // Swallow
                    // XXX (@Qix-) should we be logging these?
                }
            }

            module.exports = require('./common')(exports);

            const { formatters } = module.exports;

            /**
             * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
             */

            formatters.j = function (v) {
                try {
                    return JSON.stringify(v);
                } catch (error) {
                    return '[UnexpectedJSONParseError]: ' + error.message;
                }
            };
        }).call(this, require('_process'));
    }, { "./common": 10, "_process": 1 }], 10: [function (require, module, exports) {

        /**
         * This is the common logic for both the Node.js and web browser
         * implementations of `debug()`.
         */

        function setup(env) {
            createDebug.debug = createDebug;
            createDebug.default = createDebug;
            createDebug.coerce = coerce;
            createDebug.disable = disable;
            createDebug.enable = enable;
            createDebug.enabled = enabled;
            createDebug.humanize = require('ms');

            Object.keys(env).forEach(key => {
                createDebug[key] = env[key];
            });

            /**
            * Active `debug` instances.
            */
            createDebug.instances = [];

            /**
            * The currently active debug mode names, and names to skip.
            */

            createDebug.names = [];
            createDebug.skips = [];

            /**
            * Map of special "%n" handling functions, for the debug "format" argument.
            *
            * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
            */
            createDebug.formatters = {};

            /**
            * Selects a color for a debug namespace
            * @param {String} namespace The namespace string for the for the debug instance to be colored
            * @return {Number|String} An ANSI color code for the given namespace
            * @api private
            */
            function selectColor(namespace) {
                let hash = 0;

                for (let i = 0; i < namespace.length; i++) {
                    hash = (hash << 5) - hash + namespace.charCodeAt(i);
                    hash |= 0; // Convert to 32bit integer
                }

                return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
            }
            createDebug.selectColor = selectColor;

            /**
            * Create a debugger with the given `namespace`.
            *
            * @param {String} namespace
            * @return {Function}
            * @api public
            */
            function createDebug(namespace) {
                let prevTime;

                function debug(...args) {
                    // Disabled?
                    if (!debug.enabled) {
                        return;
                    }

                    const self = debug;

                    // Set `diff` timestamp
                    const curr = Number(new Date());
                    const ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr;

                    args[0] = createDebug.coerce(args[0]);

                    if (typeof args[0] !== 'string') {
                        // Anything else let's inspect with %O
                        args.unshift('%O');
                    }

                    // Apply any `formatters` transformations
                    let index = 0;
                    args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
                        // If we encounter an escaped % then don't increase the array index
                        if (match === '%%') {
                            return match;
                        }
                        index++;
                        const formatter = createDebug.formatters[format];
                        if (typeof formatter === 'function') {
                            const val = args[index];
                            match = formatter.call(self, val);

                            // Now we need to remove `args[index]` since it's inlined in the `format`
                            args.splice(index, 1);
                            index--;
                        }
                        return match;
                    });

                    // Apply env-specific formatting (colors, etc.)
                    createDebug.formatArgs.call(self, args);

                    const logFn = self.log || createDebug.log;
                    logFn.apply(self, args);
                }

                debug.namespace = namespace;
                debug.enabled = createDebug.enabled(namespace);
                debug.useColors = createDebug.useColors();
                debug.color = selectColor(namespace);
                debug.destroy = destroy;
                debug.extend = extend;
                // Debug.formatArgs = formatArgs;
                // debug.rawLog = rawLog;

                // env-specific initialization logic for debug instances
                if (typeof createDebug.init === 'function') {
                    createDebug.init(debug);
                }

                createDebug.instances.push(debug);

                return debug;
            }

            function destroy() {
                const index = createDebug.instances.indexOf(this);
                if (index !== -1) {
                    createDebug.instances.splice(index, 1);
                    return true;
                }
                return false;
            }

            function extend(namespace, delimiter) {
                return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
            }

            /**
            * Enables a debug mode by namespaces. This can include modes
            * separated by a colon and wildcards.
            *
            * @param {String} namespaces
            * @api public
            */
            function enable(namespaces) {
                createDebug.save(namespaces);

                createDebug.names = [];
                createDebug.skips = [];

                let i;
                const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
                const len = split.length;

                for (i = 0; i < len; i++) {
                    if (!split[i]) {
                        // ignore empty strings
                        continue;
                    }

                    namespaces = split[i].replace(/\*/g, '.*?');

                    if (namespaces[0] === '-') {
                        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        createDebug.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }

                for (i = 0; i < createDebug.instances.length; i++) {
                    const instance = createDebug.instances[i];
                    instance.enabled = createDebug.enabled(instance.namespace);
                }
            }

            /**
            * Disable debug output.
            *
            * @return {String} namespaces
            * @api public
            */
            function disable() {
                const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
                createDebug.enable('');
                return namespaces;
            }

            /**
            * Returns true if the given mode name is enabled, false otherwise.
            *
            * @param {String} name
            * @return {Boolean}
            * @api public
            */
            function enabled(name) {
                if (name[name.length - 1] === '*') {
                    return true;
                }

                let i;
                let len;

                for (i = 0, len = createDebug.skips.length; i < len; i++) {
                    if (createDebug.skips[i].test(name)) {
                        return false;
                    }
                }

                for (i = 0, len = createDebug.names.length; i < len; i++) {
                    if (createDebug.names[i].test(name)) {
                        return true;
                    }
                }

                return false;
            }

            /**
            * Convert regexp to namespace
            *
            * @param {RegExp} regxep
            * @return {String} namespace
            * @api private
            */
            function toNamespace(regexp) {
                return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
            }

            /**
            * Coerce `val`.
            *
            * @param {Mixed} val
            * @return {Mixed}
            * @api private
            */
            function coerce(val) {
                if (val instanceof Error) {
                    return val.stack || val.message;
                }
                return val;
            }

            createDebug.enable(createDebug.load());

            return createDebug;
        }

        module.exports = setup;
    }, { "ms": 11 }], 11: [function (require, module, exports) {
        /**
         * Helpers.
         */

        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var w = d * 7;
        var y = d * 365.25;

        /**
         * Parse or format the given `val`.
         *
         * Options:
         *
         *  - `long` verbose formatting [false]
         *
         * @param {String|Number} val
         * @param {Object} [options]
         * @throws {Error} throw an error if val is not a non-empty string or a number
         * @return {String|Number}
         * @api public
         */

        module.exports = function (val, options) {
            options = options || {};
            var type = typeof val;
            if (type === 'string' && val.length > 0) {
                return parse(val);
            } else if (type === 'number' && isNaN(val) === false) {
                return options.long ? fmtLong(val) : fmtShort(val);
            }
            throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
        };

        /**
         * Parse the given `str` and return milliseconds.
         *
         * @param {String} str
         * @return {Number}
         * @api private
         */

        function parse(str) {
            str = String(str);
            if (str.length > 100) {
                return;
            }
            var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
            if (!match) {
                return;
            }
            var n = parseFloat(match[1]);
            var type = (match[2] || 'ms').toLowerCase();
            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;
                case 'weeks':
                case 'week':
                case 'w':
                    return n * w;
                case 'days':
                case 'day':
                case 'd':
                    return n * d;
                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;
                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;
                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s;
                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
                default:
                    return undefined;
            }
        }

        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtShort(ms) {
            var msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return Math.round(ms / d) + 'd';
            }
            if (msAbs >= h) {
                return Math.round(ms / h) + 'h';
            }
            if (msAbs >= m) {
                return Math.round(ms / m) + 'm';
            }
            if (msAbs >= s) {
                return Math.round(ms / s) + 's';
            }
            return ms + 'ms';
        }

        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtLong(ms) {
            var msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return plural(ms, msAbs, d, 'day');
            }
            if (msAbs >= h) {
                return plural(ms, msAbs, h, 'hour');
            }
            if (msAbs >= m) {
                return plural(ms, msAbs, m, 'minute');
            }
            if (msAbs >= s) {
                return plural(ms, msAbs, s, 'second');
            }
            return ms + ' ms';
        }

        /**
         * Pluralization helper.
         */

        function plural(ms, msAbs, n, name) {
            var isPlural = msAbs >= n * 1.5;
            return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
        }
    }, {}], 12: [function (require, module, exports) {
        module.exports = {
            compareTwoStrings,
            findBestMatch
        };

        function compareTwoStrings(str1, str2) {
            if (!str1.length && !str2.length) return 1; // if both are empty strings
            if (!str1.length || !str2.length) return 0; // if only one is empty string
            if (str1.toUpperCase() === str2.toUpperCase()) return 1; // identical
            if (str1.length === 1 && str2.length === 1) return 0; // both are 1-letter strings

            const pairs1 = wordLetterPairs(str1);
            const pairs2 = wordLetterPairs(str2);
            const union = pairs1.length + pairs2.length;
            let intersection = 0;
            pairs1.forEach(pair1 => {
                for (let i = 0, pair2; pair2 = pairs2[i]; i++) {
                    if (pair1 !== pair2) continue;
                    intersection++;
                    pairs2.splice(i, 1);
                    break;
                }
            });
            return intersection * 2 / union;
        }

        function findBestMatch(mainString, targetStrings) {
            if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
            const ratings = targetStrings.map(target => ({ target, rating: compareTwoStrings(mainString, target) }));
            const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
            return { ratings, bestMatch };
        }

        function flattenDeep(arr) {
            return Array.isArray(arr) ? arr.reduce((a, b) => a.concat(flattenDeep(b)), []) : [arr];
        }

        function areArgsValid(mainString, targetStrings) {
            if (typeof mainString !== 'string') return false;
            if (!Array.isArray(targetStrings)) return false;
            if (!targetStrings.length) return false;
            if (targetStrings.find(s => typeof s !== 'string')) return false;
            return true;
        }

        function letterPairs(str) {
            const pairs = [];
            for (let i = 0, max = str.length - 1; i < max; i++) pairs[i] = str.substring(i, i + 2);
            return pairs;
        }

        function wordLetterPairs(str) {
            const pairs = str.toUpperCase().split(' ').map(letterPairs);
            return flattenDeep(pairs);
        }
    }, {}], 13: [function (require, module, exports) {
        'use strict';

        function ToObject(val) {
            if (val == null) {
                throw new TypeError('Object.assign cannot be called with null or undefined');
            }

            return Object(val);
        }

        module.exports = Object.assign || function (target, source) {
            var from;
            var keys;
            var to = ToObject(target);

            for (var s = 1; s < arguments.length; s++) {
                from = arguments[s];
                keys = Object.keys(Object(from));

                for (var i = 0; i < keys.length; i++) {
                    to[keys[i]] = from[keys[i]];
                }
            }

            return to;
        };
    }, {}], 14: [function (require, module, exports) {
        var _ = {
            keys: require('object-keys'),
            values: require('object-values'),
            assign: require('object-assign'),
            uniq: require('uniq'),
            last: require('array-last'),
            compact: function (d) {
                return d.filter(function (d) {
                    return d;
                });
            }
        };

        module.exports = function (input) {
            var self = {},
                _tokens = {},
                _helpers = {},
                _input = input,
                _debug = false;

            self.input = function (input) {
                _input = input;
                return self;
            };

            self.token = function (token, pattern, helper) {
                var t = {};
                t[token] = pattern;
                addTokens(t);
                helper && self.helper(token, helper);
                return self;
            };

            self.helper = function (token, callback) {
                var m = {};
                m[token] = callback;
                addHelpers(m);
                return self;
            };

            self.debug = function () {
                return _debug = true, self;
            };

            self.tokens = addTokens;
            self.helpers = addHelpers;

            self.walk = walk;
            self.resolve = resolve;

            return self;

            function addTokens(token) {
                var names = _.keys(token),
                    expressions = _.values(token),
                    expression;

                expressions.forEach(function (d, i) {
                    expression = new RegExp('(' + getSource(d) + ')');
                    _tokens[expression.source] = names[i];
                });

                return self;

                function getSource(expression) {
                    if (is(expression, 'RegExp')) return expression.source;
                    return getSource(new RegExp(expression));
                }
            }

            function addHelpers(helpers) {
                for (var helper in helpers) _helpers[helper] = helpers[helper];
                return self;
            }

            function walk(onToken) {
                var cb = onToken || noop;

                var tokens = _.keys(_tokens) || [],
                    names = _.values(_tokens);

                if (tokens.length == 0) throw new Error('Define at least one token');

                runFrom(0);

                return self;

                //TODO: some house keeping needed ... ;)
                function runFrom(lastIndex, ignore) {

                    if (lastIndex > _input.length) return;

                    var expr,
                        _i = _input.substr(lastIndex),
                        idx = -1,
                        min = Infinity;

                    tokens.forEach(function (d, i) {
                        var _expr = new RegExp(d, 'g'),
                            _min;

                        _expr.lastIndex = lastIndex;
                        _min = ignore == i ? -1 : _i.search(_expr);

                        if (min > _min && _min > -1) {
                            expr = _expr;
                            min = _min;
                            idx = i;
                        }
                    });

                    if (idx == -1) return;

                    var part,
                        offset = (part = evalExpr()) && part.length > 0 ? part.lastIndex || part.index : -1,
                        match;

                    function evalExpr() {
                        var r = expr.exec(_input),
                            helper = _helpers[names[idx]];

                        if (helper && r) r.push(helper(r, _input, expr.source));
                        debug('tag %s, index %s, exec %s', names[idx], lastIndex, r);
                        return r;
                    }

                    match = part || [''];

                    offset += match[0].length;

                    var shouldSkip = cb(names[idx], topMatch(match), idx, lastIndex, _.uniq(_.compact(match)));
                    if (typeof shouldSkip != 'undefined' && !shouldSkip) return runFrom(offset - match[0].length, idx);

                    return runFrom(offset);
                }

                function topMatch(arr) {
                    return _.last(_.compact(arr));
                }
                function evaluateExpression(tokens) {
                    return new RegExp(tokens.join('|'), 'g');
                }
            }

            function resolve(postionInfo) {
                var r = {};

                walk(function (name, value, tokenIndex, position, rawExec) {
                    if (postionInfo) value = { value: value, position: position };

                    if (is(r[name], 'Array')) return r[name].push(value);
                    if (is(r[name], 'String')) return r[name] = [value].concat(r[name] || []).reverse();
                    if (is(r[name], 'Object')) return r[name] = _.assign(value, r[name]);

                    r[name] = r[name] || [];
                    r[name].push(value);
                });

                r._source = _input;

                return simplify(r);

                function simplify(r) {
                    for (var key in r) if (is(r[key], 'Array') && r[key].length == 1) r[key] = r[key][0];

                    return r;
                }
            }

            function noop() {}
            function is(expression, type) {
                return Object.prototype.toString.call(expression) == '[object ' + type + ']';
            }
            function debug() {
                if (_debug) console.log.apply(console, arguments);
            }
        };
    }, { "array-last": 3, "object-assign": 13, "object-keys": 5, "object-values": 7, "uniq": 15 }], 15: [function (require, module, exports) {
        "use strict";

        function unique_pred(list, compare) {
            var ptr = 1,
                len = list.length,
                a = list[0],
                b = list[0];
            for (var i = 1; i < len; ++i) {
                b = a;
                a = list[i];
                if (compare(a, b)) {
                    if (i === ptr) {
                        ptr++;
                        continue;
                    }
                    list[ptr++] = a;
                }
            }
            list.length = ptr;
            return list;
        }

        function unique_eq(list) {
            var ptr = 1,
                len = list.length,
                a = list[0],
                b = list[0];
            for (var i = 1; i < len; ++i, b = a) {
                b = a;
                a = list[i];
                if (a !== b) {
                    if (i === ptr) {
                        ptr++;
                        continue;
                    }
                    list[ptr++] = a;
                }
            }
            list.length = ptr;
            return list;
        }

        function unique(list, compare, sorted) {
            if (list.length === 0) {
                return list;
            }
            if (compare) {
                if (!sorted) {
                    list.sort(compare);
                }
                return unique_pred(list, compare);
            }
            if (!sorted) {
                list.sort();
            }
            return unique_eq(list);
        }

        module.exports = unique;
    }, {}], 16: [function (require, module, exports) {
        //     wink-bm25-text-search
        //     Fast Full Text Search based on BM25F
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-bm25-text-search”.
        //
        //     “wink-bm25-search” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-bm25-text-search” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-bm25-text-search”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = require('wink-helpers');

        /* eslint guard-for-in: 0 */
        /* eslint complexity: [ "error", 25 ] */

        // It is a BM25F In-memory Search engine for text and exposes following
        // methods:
        // 1. `definePrepTasks` allows to define field-wise (optional) pipeline of
        // functions that will be used to prepare each input prior to *search/predict*
        // and *addDoc/learn*.
        // 2. `defineConfig` sets up the configuration for *field-wise weights*,
        // *BM25F parameters*, and **field names whoes original value** needs to be retained.
        // 3. `addDoc/learn` adds a document using its unique id. The document is supplied
        // as an Javascript object, where each property is the field of the document
        // and its value is the text.
        // 4. `consolidate` learnings prior to search/predict.
        // 5. `search/predict` searches for the input text and returns the resultant
        // document ids, sorted by their relevance along with the score. The number of
        // results returned can be controlled via a limit argument that defaults to **10**.
        // The last optional argument is a filter function that must return a `boolean`
        // value, which is used to filter documents.
        // 6. `exportJSON` exports the learnings in JSON format.
        // 7. `importJSON` imports the learnings from JSON that may have been saved on disk.
        // 8. `reset` all the learnings except the preparatory tasks.
        var bm25fIMS = function () {
            // Preparatory tasks that are executed on the `addDoc` & `search` input.
            var pTasks = [];
            // And its count.
            var pTaskCount;
            // Field level prep tasks.
            var flds = Object.create(null);
            // Returned!
            var methods = Object.create(null);
            // Term Frequencies & length of each document.
            var documents = Object.create(null);
            // Inverted Index for faster search
            var invertedIdx = [];
            // IDF for each tokens, tokens are referenced via their numerical index.
            var idf = [];
            // Set true on first call to `addDoc/learn` to prevent changing config.
            var learned = false;
            // The `addDoc()predict()` function checks for this being true; set
            // in `consolidate()`.
            var consolidated = false;
            // Total documents added.
            var totalDocs = 0;
            // Total number of tokens across all documents added.
            var totalCorpusLength = 0;
            // Their average.
            var avgCorpusLength = 0;
            // BM25F Configuration; set up in `defineConfig()`.
            var config = null;
            // The `token: index` mapping; `index` is used everywhere instead
            // of the `token`
            var token2Index = Object.create(null);
            // Index's initial value, incremented with every new word.
            var currTokenIndex = 0;

            // ### Private functions

            // #### Perpare Input

            // Prepares the `input` by executing the pipeline of tasks defined in the
            // `field` specific `pTasks` set via `definePrepTasks()`.
            // If `field` is not specified then default `pTasks` are used.
            // If the `field` specific `pTasks` are not defined then it automatically
            // switches to default `pTasks`.
            var prepareInput = function (input, field) {
                var processedInput = input;
                var pt = flds[field] && flds[field].pTasks || pTasks;
                var ptc = flds[field] && flds[field].pTaskCount || pTaskCount;
                for (var i = 0; i < ptc; i += 1) {
                    processedInput = pt[i](processedInput);
                }
                return processedInput;
            }; // prepareInput()

            // #### Update Freq

            // Updates the `freq` of each term in the `text` after pre-processing it via
            // `prepareInput()`; while updating, it takes care of `field's` `weight`.
            var updateFreq = function (id, text, weight, freq, field) {
                // Tokenized `text`.
                var tkns = prepareInput(text, field);
                // Temp token holder.
                var t;
                for (var i = 0, imax = tkns.length; i < imax; i += 1) {
                    t = tkns[i];
                    // Build `token: index` mapping.
                    if (token2Index[t] === undefined) {
                        token2Index[t] = currTokenIndex;
                        currTokenIndex += 1;
                    }
                    t = token2Index[t];
                    if (freq[t] === undefined) {
                        freq[t] = weight;
                        invertedIdx[t] = invertedIdx[t] || [];
                        invertedIdx[t].push(id);
                    } else {
                        freq[t] += weight;
                    }
                }
                // Length can not be negative!
                return tkns.length * Math.abs(weight);
            }; // updateFreq()

            // ### Exposed Functions

            // #### Define Prep Tasks

            // Defines the `tasks` required to prepare the input for `addDoc` and `search()`
            // The `tasks` should be an array of functions; using these function a simple
            // pipeline is built to serially transform the input to the output.
            // It validates the `tasks` before updating the `pTasks`.
            // If validation fails it throws an appropriate error.
            // Tasks can be defined separately for each field. However if the field is not
            // specified (i.e. `null` or `undefined`), then the `tasks` become default.
            // Note, `field = 'search'` is reserved for prep tasks for search string; However
            // if the same is not specified, the default tasks are used for pre-processing.
            var definePrepTasks = function (tasks, field) {
                if (config === null) {
                    throw Error('winkBM25S: Config must be defined before defining prepTasks.');
                }
                if (!helpers.array.isArray(tasks)) {
                    throw Error('winkBM25S: Tasks should be an array, instead found: ' + JSON.stringify(tasks));
                }
                for (var i = 0, imax = tasks.length; i < imax; i += 1) {
                    if (typeof tasks[i] !== 'function') {
                        throw Error('winkBM25S: Tasks should contain function, instead found: ' + typeof tasks[i]);
                    }
                }
                var fldWeights = config.fldWeights;
                if (field === undefined || field === null) {
                    pTasks = tasks;
                    pTaskCount = tasks.length;
                } else {
                    if (!fldWeights[field] || typeof field !== 'string') {
                        throw Error('winkBM25S: Field name is missing or it is not a string: ' + JSON.stringify(field) + '/' + typeof field);
                    }
                    flds[field] = flds[field] || Object.create(null);
                    flds[field].pTasks = tasks;
                    flds[field].pTaskCount = tasks.length;
                }
                return tasks.length;
            }; // definePrepTasks()

            // #### Define Config

            // Defines the configuration for BM25F using `fldWeights` and `bm25Params`
            // properties of `cfg` object.</br>
            // The `fldWeights` defines the weight for each field of the document. This gives
            // a semantic nudge to search and are used as a mutiplier to the count
            // (frequency) of each token contained in that field of the document. It should
            // be a JS object containing `field-name/value` pairs. If a field's weight is
            // not defined, that field is **ignored**. The field weights must be defined before
            // attempting to add a document via `addDoc()`; they can only be defined once.
            // If any document's field is not defined here then that field is **ignored**.
            // </br>
            // The `k`, `b` and `k1` properties of `bm25Params` object define the smoothing
            // factor for IDF, degree of normalization for TF, and saturation control factor
            // respectively for the BM25F. Their default values are **1**, **0.75**, and
            // **1.2**.<br/>
            // The `ovFieldNames` is an array of field names whose original value needs to
            // be retained.
            var defineConfig = function (cfg) {
                if (learned) {
                    throw Error('winkBM25S: config must be defined before learning/addition starts!');
                }
                if (!helpers.object.isObject(cfg)) {
                    throw Error('winkBM25S: config must be a config object, instead found: ' + JSON.stringify(cfg));
                }
                // If `fldWeights` are absent throw error.
                if (!helpers.object.isObject(cfg.fldWeights)) {
                    throw Error('winkBM25S: fldWeights must be an object, instead found: ' + JSON.stringify(cfg.fldWeights));
                }
                // There should be at least one defined field!
                if (helpers.object.keys(cfg.fldWeights).length === 0) {
                    throw Error('winkBM25S: Field config has no field defined.');
                }
                // Setup configuration now.
                config = Object.create(null);
                // Field config for BM25**F**
                config.fldWeights = Object.create(null);
                config.bm25Params = Object.create(null);
                // **Controls TF part:**<br/>
                // `k1` controls saturation of token's frequency; higher value delays saturation
                // with increase in frequency.
                config.bm25Params.k1 = 1.2;
                // `b` controls the degree of normalization; **0** means no normalization and **1**
                // indicates complete normalization!
                config.bm25Params.b = 0.75;
                // **Controls IDF part:**<br/>
                // `k` controls impact of IDF; should be >= 0; a higher value means lower
                // the impact of IDF.
                config.bm25Params.k = 1;
                // Setup field weights.
                for (var field in cfg.fldWeights) {
                    // The `null` check is required as `isNaN( null )` returns `false`!!
                    // This first ensures non-`null/undefined/0` values before testing for NaN.
                    if (!cfg.fldWeights[field] || isNaN(cfg.fldWeights[field])) {
                        throw Error('winkBM25S: Field weight should be number >0, instead found: ' + JSON.stringify(cfg.fldWeights[field]));
                    }
                    // Update config parameters from `cfg`.
                    config.fldWeights[field] = +cfg.fldWeights[field];
                }
                // Setup BM25F params.
                // Create `bm25Params` if absent in `cfg`.
                if (!helpers.object.isObject(cfg.bm25Params)) cfg.bm25Params = Object.create(null);
                // Update config parameters from `cfg`.
                config.bm25Params.b = cfg.bm25Params.b === null || cfg.bm25Params.b === undefined || isNaN(cfg.bm25Params.b) || +cfg.bm25Params.b < 0 || +cfg.bm25Params.b > 1 ? 0.75 : +cfg.bm25Params.b;

                // Update config parameters from `cfg`.
                config.bm25Params.k1 = cfg.bm25Params.k1 === null || cfg.bm25Params.k1 === undefined || isNaN(cfg.bm25Params.k1) || +cfg.bm25Params.k1 < 0 ? 1.2 : +cfg.bm25Params.k1;

                // Update config parameters from `cfg`.
                config.bm25Params.k = cfg.bm25Params.k === null || cfg.bm25Params.k === undefined || isNaN(cfg.bm25Params.k) || +cfg.bm25Params.k < 0 ? 1 : +cfg.bm25Params.k;

                // Handle configuration for fields whose orginal values has to be retained
                // in the document.<br/>
                // Initialize the `ovFldNames` in the final `config` as an empty array
                config.ovFldNames = [];
                if (!cfg.ovFldNames) cfg.ovFldNames = [];
                if (!helpers.array.isArray(cfg.ovFldNames)) {
                    throw Error('winkBM25S: OV Field names should be an array, instead found: ' + JSON.stringify(typeof cfg.ovFldNames));
                }

                cfg.ovFldNames.forEach(function (f) {
                    if (typeof f !== 'string' || f.length === 0) {
                        throw Error('winkBM25S: OV Field name should be a non-empty string, instead found: ' + JSON.stringify(f));
                    }
                    config.ovFldNames.push(f);
                });
                return true;
            }; // defineConfig()


            // #### Add Doc

            // Adds a document to the model using `updateFreq()` function.
            var addDoc = function (doc, id) {
                if (config === null) {
                    throw Error('winkBM25S: Config must be defined before adding a document.');
                }
                var fldWeights = config.fldWeights;
                // No point in adding/learning further in absence of consolidated.
                if (consolidated) {
                    throw Error('winkBM25S: post consolidation adding/learning is not possible!');
                }
                // Set learning/addition started.
                learned = true;
                var length;
                if (documents[id] !== undefined) {
                    throw Error('winkBM25S: Duplicate document encountered: ' + JSON.stringify(id));
                }
                documents[id] = Object.create(null);
                documents[id].freq = Object.create(null);
                documents[id].fieldValues = Object.create(null);
                documents[id].length = 0;
                // Compute `freq` & `length` of the specified fields.
                for (var field in fldWeights) {
                    if (doc[field] === undefined) {
                        throw Error('winkBM25S: Missing field in the document: ' + JSON.stringify(field));
                    }
                    length = updateFreq(id, doc[field], fldWeights[field], documents[id].freq, field);
                    documents[id].length += length;
                    totalCorpusLength += length;
                }
                // Retain Original Field Values, if configured.
                config.ovFldNames.forEach(function (f) {
                    if (doc[f] === undefined) {
                        throw Error('winkBM25S: Missing field in the document: ' + JSON.stringify(f));
                    }
                    documents[id].fieldValues[f] = doc[f];
                });
                // Increment total documents indexed so far.
                totalDocs += 1;
                return totalDocs;
            }; // addDoc()

            // #### Consolidate

            // Consolidates the data structure of bm25 and computes the IDF. This must be
            // built before using the `search` function. The `fp` defines the precision at
            // which term frequency values are stored. The default value is **4**. In cause
            // of an invalid input, it default to 4. The maximum permitted value is 9; any
            // value larger than 9 is forced to 9.
            var consolidate = function (fp) {
                if (consolidated) {
                    throw Error('winkBM25S: consolidation can be carried out only once!');
                }
                if (totalDocs < 3) {
                    throw Error('winkBM25S: document collection is too small for consolidation; add more docs!');
                }
                var freqPrecision = parseInt(fp, 10);
                freqPrecision = isNaN(freqPrecision) ? 4 : freqPrecision < 4 ? 4 : freqPrecision > 9 ? 9 : freqPrecision;
                // Using the commonly used names but unfortunately they are very cryptic and
                // *short*. **Must not use these variable names elsewhere**.
                var b = config.bm25Params.b;
                var k1 = config.bm25Params.k1;
                var k = config.bm25Params.k;
                var freq, id, n, normalizationFactor, t;
                // Consolidate: compute idf; will multiply with freq to save multiplication
                // time during search. This happens in the next loop-block.
                for (var i = 0, imax = invertedIdx.length; i < imax; i += 1) {
                    n = invertedIdx[i].length;
                    idf[i] = Math.log((totalDocs - n + 0.5) / (n + 0.5) + k);
                    // To be uncommented to probe values!
                    // console.log( '%s, %d, %d, %d, %d', t, totalDocs, n, k, idf[ t ] );
                }
                avgCorpusLength = totalCorpusLength / totalDocs;
                // Consolidate: update document frequencies.
                for (id in documents) {
                    normalizationFactor = 1 - b + b * (documents[id].length / avgCorpusLength);
                    for (t in documents[id].freq) {
                        freq = documents[id].freq[t];
                        // Update frequency but ensure the sign is carefully preserved as the
                        // magnitude of `k1` can jeopardize the sign!
                        documents[id].freq[t] = Math.sign(freq) * (Math.abs(freq * (k1 + 1) / (k1 * normalizationFactor + freq)) * idf[t]).toFixed(freqPrecision);
                        // To be uncommented to probe values!
                        // console.log( '%s, %s, %d', id, t, documents[ id ].freq[ t ] );
                    }
                }
                // Set `consolidated` as `true`.
                consolidated = true;
                return true;
            }; // consolidate()

            // #### Search

            // Searches the `text` and return `limit` results. If `limit` is not sepcified
            // then it will return a maximum of **10** results. The `result` is an array of
            // containing `doc id` and `score` pairs array. If the `text` is not found, an
            // empty array is returned. The `text` must be a string. The argurment `filter`
            // is like `filter` of JS Array; it receive an object containing document's
            // retained field name/value pairs along with the `params` (which is passed as
            // the second argument). It is useful in limiting the search space or making the
            // search more focussed.
            var search = function (text, limit, filter, params) {
                // Predict/Search only if learnings have been consolidated!
                if (!consolidated) {
                    throw Error('winkBM25S: search is not possible unless learnings are consolidated!');
                }
                if (typeof text !== 'string') {
                    throw Error('winkBM25S: search text should be a string, instead found: ' + typeof text);
                }
                // Setup filter function
                var f = typeof filter === 'function' ? filter : function () {
                    return true;
                };
                // Tokenized `text`. Use search specific weights.
                var tkns = prepareInput(text, 'search')
                // Filter out tokens that do not exists in the vocabulary.
                .filter(function (t) {
                    return token2Index[t] !== undefined;
                })
                // Now map them to their respective indexes using `token2Index`.
                .map(function (t) {
                    return token2Index[t];
                });
                // Search results go here as doc id/score pairs.
                var results = Object.create(null);
                // Helper variables.
                var id, ids, t;
                var i, imax, j, jmax;
                // Iterate for every token in the preapred text.
                for (j = 0, jmax = tkns.length; j < jmax; j += 1) {
                    t = tkns[j];
                    // Use Inverted Idx to look up - accelerates search!<br/>
                    // Note, `ids` can never be `undefined` as **unknown** tokens have already
                    // been filtered.
                    ids = invertedIdx[t];
                    // Means the token exists in the vocabulary!
                    // Compute scores for every document.
                    for (i = 0, imax = ids.length; i < imax; i += 1) {
                        id = ids[i];
                        if (f(documents[id].fieldValues, params)) {
                            results[id] = documents[id].freq[t] + (results[id] || 0);
                        }
                        // To be uncommented to probe values!
                        /* console.log( '%s, %d, %d, %d', t, documents[ id ].freq[ t ], idf[ t ], results[ id ] ); */
                    }
                }
                // Convert to a table in `[ id, score ]` format; sort and slice required number
                // of resultant documents.
                return helpers.object.table(results).sort(helpers.array.descendingOnValue).slice(0, Math.max(limit || 10, 1));
            }; // search()

            // #### Reset

            // Resets the BM25F completely by re-initializing all the learning
            // related variables, except the preparatory tasks.
            var reset = function () {
                // Reset values of variables that are associated with learning; Therefore
                // `pTasks` & `pTaskCount` are not re-initialized.
                // Term Frequencies & length of each document.
                documents = Object.create(null);
                // Inverted Index for faster search
                invertedIdx = [];
                // IDF for each tokens
                idf = [];
                // Set true on first call to `addDoc/learn` to prevent changing config.
                learned = false;
                // The `addDoc()predict()` function checks for this being true; set
                // in `consolidate()`.
                consolidated = false;
                // Total documents added.
                totalDocs = 0;
                // Total number of tokens across all documents added.
                totalCorpusLength = 0;
                // Their average.
                avgCorpusLength = 0;
                // BM25F Configuration; set up in `defineConfig()`.
                config = null;
                // The `token: index` mapping; `index` is used everywhere instead
                // of the `token`
                token2Index = Object.create(null);
                // Index's initial value, incremented with every new word.
                currTokenIndex = 0;
                return true;
            }; // reset()

            // #### Export JSON

            // Returns the learnings, along with `consolidated` flag, in JSON format.
            var exportJSON = function () {
                var docStats = Object.create(null);
                docStats.totalCorpusLength = totalCorpusLength;
                docStats.totalDocs = totalDocs;
                docStats.consolidated = consolidated;
                return JSON.stringify([config, docStats, documents, invertedIdx, currTokenIndex, token2Index,
                // For future expansion but the import will have to have intelligence to
                // set the default values and still ensure nothing breaks! Hopefully!!
                {}, [], []]);
            }; // exportJSON()

            // #### Import JSON

            // Imports the `json` in to index after validating the format of input JSON.
            // If validation fails then throws error; otherwise on success import it
            // returns `true`. Note, importing leads to resetting the search engine.
            var importJSON = function (json) {
                if (!json) {
                    throw Error('winkBM25S: undefined or null JSON encountered, import failed!');
                }
                // Validate json format
                var isOK = [helpers.object.isObject, helpers.object.isObject, helpers.object.isObject, helpers.array.isArray, Number.isInteger, helpers.object.isObject, helpers.object.isObject, helpers.array.isArray, helpers.array.isArray];
                var parsedJSON = JSON.parse(json);
                if (!helpers.array.isArray(parsedJSON) || parsedJSON.length !== isOK.length) {
                    throw Error('winkBM25S: invalid JSON encountered, can not import.');
                }
                for (var i = 0; i < isOK.length; i += 1) {
                    if (!isOK[i](parsedJSON[i])) {
                        throw Error('winkBM25S: invalid JSON encountered, can not import.');
                    }
                }
                // All good, setup variable values.
                // First reset everything.
                reset();
                // To prevent config change.
                learned = true;
                // Load variable values.
                config = parsedJSON[0];
                totalCorpusLength = parsedJSON[1].totalCorpusLength;
                totalDocs = parsedJSON[1].totalDocs;
                consolidated = parsedJSON[1].consolidated;
                documents = parsedJSON[2];
                invertedIdx = parsedJSON[3];
                currTokenIndex = parsedJSON[4];
                token2Index = parsedJSON[5];
                // Return success.
                return true;
            }; // importJSON()

            methods.definePrepTasks = definePrepTasks;
            methods.defineConfig = defineConfig;
            methods.addDoc = addDoc;
            methods.consolidate = consolidate;
            methods.search = search;
            methods.exportJSON = exportJSON;
            methods.importJSON = importJSON;
            methods.reset = reset;
            // Aliases to keep APIs uniform across.
            methods.learn = addDoc;
            methods.predict = search;

            return methods;
        }; // bm25fIMS()

        module.exports = bm25fIMS;
    }, { "wink-helpers": 17 }], 17: [function (require, module, exports) {
        //     wink-helpers
        //     Low level helper functions for Javascript
        //     array, object, and string.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-helpers”.
        //
        //     “wink-helpers” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-helpers” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-helpers”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = Object.create(null);

        // ### Private Functions

        // #### Product Reducer (Callback)

        // Callback function used by `reduce` inside the `product()` function.
        // Follows the standard guidelines of `reduce()` callback function.
        var productReducer = function (prev, curr) {
            var c,
                cmax = curr.length;
            var p,
                pmax = prev.length;
            var result = [];

            for (p = 0; p < pmax; p += 1) {
                for (c = 0; c < cmax; c += 1) {
                    result.push(prev[p].concat(curr[c]));
                }
            }
            return result;
        }; // productReducer()

        // ### Public Function

        // ### Array Helpers

        helpers.array = Object.create(null);

        // #### is Array

        // Tests if argument `v` is a JS array; returns `true` if it is, otherwise returns `false`.
        helpers.array.isArray = function (v) {
            return v !== undefined && v !== null && Object.prototype.toString.call(v) === '[object Array]';
        }; // isArray()


        // #### sorting helpers

        // Set of helpers to sort either numbers or strings. For key/value pairs,
        // the format for each element must be `[ key, value ]`.
        // Sort helper to sort an array in ascending order.
        helpers.array.ascending = function (a, b) {
            return a > b ? 1 : a === b ? 0 : -1;
        }; // ascending()

        // Sort helper to sort an array in descending order.
        helpers.array.descending = function (a, b) {
            return b > a ? 1 : b === a ? 0 : -1;
        }; // descending()

        // Sort helper to sort an array of `[ key, value ]` in ascending order by **key**.
        helpers.array.ascendingOnKey = function (a, b) {
            return a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1;
        }; // ascendingOnKey()

        // Sort helper to sort an array of `[ key, value ]` in descending order by **key**.
        helpers.array.descendingOnKey = function (a, b) {
            return b[0] > a[0] ? 1 : b[0] === a[0] ? 0 : -1;
        }; // descendingOnKey()

        // Sort helper to sort an array of `[ key, value ]` in ascending order by **value**.
        helpers.array.ascendingOnValue = function (a, b) {
            return a[1] > b[1] ? 1 : a[1] === b[1] ? 0 : -1;
        }; // ascendingOnValue()

        // Sort helper to sort an array of `[ key, value ]` in descending order by **value**.
        helpers.array.descendingOnValue = function (a, b) {
            return b[1] > a[1] ? 1 : b[1] === a[1] ? 0 : -1;
        }; // descendingOnValue()

        // The following two functions generate a suitable function for sorting on a single
        // key or on a composite keys (max 2 only). Just a remider, the generated function
        // does not sort on two keys; instead it will sort on a key composed of the two
        // accessors.
        // Sorts in ascending order on `accessor1` & `accessor2` (optional).
        helpers.array.ascendingOn = function (accessor1, accessor2) {
            if (accessor2) {
                return function (a, b) {
                    return a[accessor1][accessor2] > b[accessor1][accessor2] ? 1 : a[accessor1][accessor2] === b[accessor1][accessor2] ? 0 : -1;
                };
            }
            return function (a, b) {
                return a[accessor1] > b[accessor1] ? 1 : a[accessor1] === b[accessor1] ? 0 : -1;
            };
        }; // ascendingOn()

        // Sorts in descending order on `accessor1` & `accessor2` (optional).
        helpers.array.descendingOn = function (accessor1, accessor2) {
            if (accessor2) {
                return function (a, b) {
                    return b[accessor1][accessor2] > a[accessor1][accessor2] ? 1 : b[accessor1][accessor2] === a[accessor1][accessor2] ? 0 : -1;
                };
            }
            return function (a, b) {
                return b[accessor1] > a[accessor1] ? 1 : b[accessor1] === a[accessor1] ? 0 : -1;
            };
        }; // descendingOn()

        // #### pluck

        // Plucks specified element from each element of an **array of array**, and
        // returns the resultant array. The element is specified by `i` (default `0`) and
        // number of elements to pluck are defined by `limit` (default `a.length`).
        helpers.array.pluck = function (a, key, limit) {
            var k, plucked;
            k = a.length;
            var i = key || 0;
            var lim = limit || k;
            if (lim > k) lim = k;
            plucked = new Array(lim);
            for (k = 0; k < lim; k += 1) plucked[k] = a[k][i];
            return plucked;
        }; // pluck()

        // #### product

        // Finds the Cartesian Product of arrays present inside the array `a`. Therefore
        // the array `a` must be an array of 1-dimensional arrays. For example,
        // `product( [ [ 9, 8 ], [ 1, 2 ] ] )`
        // will produce `[ [ 9, 1 ], [ 9, 2 ], [ 8, 1 ], [ 8, 2 ] ]`.
        helpers.array.product = function (a) {
            return a.reduce(productReducer, [[]]);
        };

        // #### shuffle

        // Randomly shuffles the elements of an array and returns the same.
        // Reference: Chapter on Random Numbers/Shuffling in Seminumerical algorithms.
        // The Art of Computer Programming Volume II by Donald E Kunth
        helpers.array.shuffle = function (array) {
            var a = array;
            var balance = a.length;
            var candidate;
            var temp;

            while (balance) {
                candidate = Math.floor(Math.random() * balance);
                balance -= 1;

                temp = a[balance];
                a[balance] = a[candidate];
                a[candidate] = temp;
            }

            return a;
        };

        // ### Object Helpers

        var objectKeys = Object.keys;
        var objectCreate = Object.create;

        helpers.object = Object.create(null);

        // #### is Object

        // Tests if argument `v` is a JS object; returns `true` if it is, otherwise returns `false`.
        helpers.object.isObject = function (v) {
            return v && Object.prototype.toString.call(v) === '[object Object]' ? true : false; // eslint-disable-line no-unneeded-ternary
        }; // isObject()

        // #### keys

        // Returns keys of the `obj` in an array.
        helpers.object.keys = function (obj) {
            return objectKeys(obj);
        }; // keys()

        // #### size

        // Returns the number of keys of the `obj`.
        helpers.object.size = function (obj) {
            return objectKeys(obj).length;
        }; // size()

        // #### values

        // Returns all values from each key/value pair of the `obj` in an array.
        helpers.object.values = function (obj) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var values = new Array(length);
            for (var i = 0; i < length; i += 1) {
                values[i] = obj[keys[i]];
            }
            return values;
        }; // values()

        // #### value Freq

        // Returns the frequency of each unique value present in the `obj`, where the
        // **key** is the *value* and **value** is the *frequency*.
        helpers.object.valueFreq = function (obj) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var val;
            var vf = objectCreate(null);
            for (var i = 0; i < length; i += 1) {
                val = obj[keys[i]];
                vf[val] = 1 + (vf[val] || 0);
            }
            return vf;
        }; // valueFreq()

        // #### table

        // Converts the `obj` in to an array of `[ key, value ]` pairs in form of a table.
        // Second argument - `f` is optional and it is a function, which is called with
        // each `value`.
        helpers.object.table = function (obj, f) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var pairs = new Array(length);
            var ak, av;
            for (var i = 0; i < length; i += 1) {
                ak = keys[i];
                av = obj[ak];
                if (typeof f === 'function') f(av);
                pairs[i] = [ak, av];
            }
            return pairs;
        }; // table()

        // ### Validation Helpers

        helpers.validate = Object.create(null);

        // Create aliases for isObject and isArray.
        helpers.validate.isObject = helpers.object.isObject;
        helpers.validate.isArray = helpers.array.isArray;

        // #### isFiniteInteger

        // Validates if `n` is a finite integer.
        helpers.validate.isFiniteInteger = function (n) {
            return typeof n === 'number' && !isNaN(n) && isFinite(n) && n === Math.round(n);
        }; // isFiniteInteger()

        // #### isFiniteNumber

        // Validates if `n` is a valid number.
        helpers.validate.isFiniteNumber = function (n) {
            return typeof n === 'number' && !isNaN(n) && isFinite(n);
        }; // isFiniteNumber()

        // ### cross validation
        /**
         *
         * Creates an instance of cross validator useful for machine learning tasks.
         *
         * @param {string[]} classLabels - array containing all the class labels.
         * @return {methods} object conatining set of API methods for tasks like evalutaion,
         * reset and metrics generation.
        */
        helpers.validate.cross = function (classLabels) {
            // wink's const for unknown predictions!
            const unknown = 'unknown';
            // To ensure that metrics is not computed prior to evaluation.
            var evaluated = false;
            // The confusion matrix.
            var cm;
            var precision;
            var recall;
            var fmeasure;

            // The class labels is assigned to this variable.
            var labels;
            // The length of `labels` array.
            var labelCount;
            var labelsObj = Object.create(null);

            // Returned!
            var methods = Object.create(null);

            /**
             *
             * Resets the current instance for another round of evaluation; the class
             * labels defined at instance creation time are not touched.
             *
             * @return {undefined} nothing!
            */
            var reset = function () {
                evaluated = false;
                cm = Object.create(null);
                precision = Object.create(null);
                recall = Object.create(null);
                fmeasure = Object.create(null);

                // Initialize confusion matrix and metrics.
                for (let i = 0; i < labelCount; i += 1) {
                    const row = labels[i];
                    labelsObj[row] = true;
                    cm[row] = Object.create(null);
                    precision[row] = 0;
                    recall[row] = 0;
                    fmeasure[row] = 0;
                    for (let j = 0; j < labelCount; j += 1) {
                        const col = labels[j];
                        cm[row][col] = 0;
                    }
                }
            }; // reset()

            /**
             *
             * Creates an instance of cross validator useful for machine learning tasks.
             *
             * @param {string} truth - the actual class label.
             * @param {string} guess - the predicted class label.
             * @return {boolean} returns true if the evaluation is successful. The evaluation
             * may fail if `truth` or `guess` is not in the array `classLabels` provided at
             * instance creation time; or if guess is equal to `unknown`.
            */
            var evaluate = function (truth, guess) {
                // If prediction failed then return false!
                if (guess === unknown || !labelsObj[truth] || !labelsObj[guess]) return false;
                // Update confusion matrix.
                if (guess === truth) {
                    cm[truth][guess] += 1;
                } else {
                    cm[guess][truth] += 1;
                }
                evaluated = true;
                return true;
            }; // evaluate()

            /**
             *
             * It computes a detailed metrics consisting of macro-averaged precision,
             * recall and f-measure along with their label-wise values and the confusion
             * matrix.
             *
             * @return {object} object containing macro-averaged `avgPrecision`, `avgRecall`,
             * `avgFMeasure` values along with other details such as label-wise values
             * and the confusion matrix. A value of `null` is returned if no evaluate()
             * has been called before.
            */
            var metrics = function () {
                if (!evaluated) return null;
                // Numerators for every label; they are same for precision & recall both.
                var n = Object.create(null);
                // Only denominators differs for precision & recall
                var pd = Object.create(null);
                var rd = Object.create(null);
                // `row` and `col` of confusion matrix.
                var col, row;
                var i, j;
                // Macro average values for metrics.
                var avgPrecision = 0;
                var avgRecall = 0;
                var avgFMeasure = 0;

                // Compute label-wise numerators & denominators!
                for (i = 0; i < labelCount; i += 1) {
                    row = labels[i];
                    for (j = 0; j < labelCount; j += 1) {
                        col = labels[j];
                        if (row === col) {
                            n[row] = cm[row][col];
                        }
                        pd[row] = cm[row][col] + (pd[row] || 0);
                        rd[row] = cm[col][row] + (rd[row] || 0);
                    }
                }
                // Ready to compute metrics.
                for (i = 0; i < labelCount; i += 1) {
                    row = labels[i];
                    precision[row] = +(n[row] / pd[row]).toFixed(4);
                    // NaN can occur if a label has not been encountered.
                    if (isNaN(precision[row])) precision[row] = 0;

                    recall[row] = +(n[row] / rd[row]).toFixed(4);
                    if (isNaN(recall[row])) recall[row] = 0;

                    fmeasure[row] = +(2 * precision[row] * recall[row] / (precision[row] + recall[row])).toFixed(4);
                    if (isNaN(fmeasure[row])) fmeasure[row] = 0;
                }
                // Compute thier averages, note they will be macro avegages.
                for (i = 0; i < labelCount; i += 1) {
                    avgPrecision += precision[labels[i]] / labelCount;
                    avgRecall += recall[labels[i]] / labelCount;
                    avgFMeasure += fmeasure[labels[i]] / labelCount;
                }
                // Return metrics.
                return {
                    // Macro-averaged metrics.
                    avgPrecision: +avgPrecision.toFixed(4),
                    avgRecall: +avgRecall.toFixed(4),
                    avgFMeasure: +avgFMeasure.toFixed(4),
                    details: {
                        // Confusion Matrix.
                        confusionMatrix: cm,
                        // Label wise metrics details, from those averages were computed.
                        precision: precision,
                        recall: recall,
                        fmeasure: fmeasure
                    }
                };
            }; // metrics()

            if (!helpers.validate.isArray(classLabels)) {
                throw Error('cross validate: class labels must be an array.');
            }
            if (classLabels.length < 2) {
                throw Error('cross validate: at least 2 class labels are required.');
            }
            labels = classLabels;
            labelCount = labels.length;

            reset();

            methods.reset = reset;
            methods.evaluate = evaluate;
            methods.metrics = metrics;

            return methods;
        }; // cross()

        // ### Object Helpers

        helpers.string = Object.create(null);

        // Regex for [diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) removal.
        var rgxDiacritical = /[\u0300-\u036f]/g;

        /**
         *
         * Normalizes the token's value by converting it to lower case and stripping
         * the diacritical marks (if any).
         *
         * @param {string} str — that needs to be normalized.
         * @return {string} the normalized value.
         * @example
         * normalize( 'Nestlé' );
         * // -> nestle
        */
        helpers.string.normalize = function (str) {
            return str.toLowerCase().normalize('NFD').replace(rgxDiacritical, '');
        }; // normalize()

        module.exports = helpers;
    }, {}], 18: [function (require, module, exports) {
        //     wink-tokenizer
        //     Multilingual tokenizer that automatically tags each token with its type.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-tokenizer”.
        //
        //     “wink-tokenizer” is free software: you can redistribute
        //     it and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-tokenizer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-tokenizer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        var contractions = Object.create(null);

        // Tag - word.
        var word = 'word';
        // Verbs.
        contractions['can\'t'] = [{ value: 'ca', tag: word }, { value: 'n\'t', tag: word }];
        contractions['CAN\'T'] = [{ value: 'CA', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Can\'t'] = [{ value: 'Ca', tag: word }, { value: 'n\'t', tag: word }];

        contractions['Couldn\'t'] = [{ value: 'could', tag: word }, { value: 'n\'t', tag: word }];
        contractions['COULDN\'T'] = [{ value: 'COULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Couldn\'t'] = [{ value: 'Could', tag: word }, { value: 'n\'t', tag: word }];

        contractions['don\'t'] = [{ value: 'do', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DON\'T'] = [{ value: 'DO', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Don\'t'] = [{ value: 'Do', tag: word }, { value: 'n\'t', tag: word }];

        contractions['doesn\'t'] = [{ value: 'does', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DOESN\'T'] = [{ value: 'DOES', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Doesn\'t'] = [{ value: 'Does', tag: word }, { value: 'n\'t', tag: word }];

        contractions['didn\'t'] = [{ value: 'did', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DIDN\'T'] = [{ value: 'DID', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Didn\'t'] = [{ value: 'Did', tag: word }, { value: 'n\'t', tag: word }];

        contractions['hadn\'t'] = [{ value: 'had', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HADN\'T'] = [{ value: 'HAD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Hadn\'t'] = [{ value: 'Had', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mayn\'t'] = [{ value: 'may', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MAYN\'T'] = [{ value: 'MAY', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mayn\'t'] = [{ value: 'May', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mightn\'t'] = [{ value: 'might', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MIGHTN\'T'] = [{ value: 'MIGHT', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mightn\'t'] = [{ value: 'Might', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mustn\'t'] = [{ value: 'must', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MUSTN\'T'] = [{ value: 'MUST', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mustn\'t'] = [{ value: 'Must', tag: word }, { value: 'n\'t', tag: word }];

        contractions['needn\'t'] = [{ value: 'need', tag: word }, { value: 'n\'t', tag: word }];
        contractions['NEEDN\'T'] = [{ value: 'NEED', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Needn\'t'] = [{ value: 'Need', tag: word }, { value: 'n\'t', tag: word }];

        contractions['oughtn\'t'] = [{ value: 'ought', tag: word }, { value: 'n\'t', tag: word }];
        contractions['OUGHTN\'T'] = [{ value: 'OUGHT', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Oughtn\'t'] = [{ value: 'Ought', tag: word }, { value: 'n\'t', tag: word }];

        contractions['shan\'t'] = [{ value: 'sha', tag: word }, { value: 'n\'t', tag: word }];
        contractions['SHAN\'T'] = [{ value: 'SHA', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Shan\'t'] = [{ value: 'Sha', tag: word }, { value: 'n\'t', tag: word }];

        contractions['shouldn\'t'] = [{ value: 'should', tag: word }, { value: 'n\'t', tag: word }];
        contractions['SHOULDN\'T'] = [{ value: 'SHOULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Shouldn\'t'] = [{ value: 'Should', tag: word }, { value: 'n\'t', tag: word }];

        contractions['won\'t'] = [{ value: 'wo', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WON\'T'] = [{ value: 'WO', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Won\'t'] = [{ value: 'Wo', tag: word }, { value: 'n\'t', tag: word }];

        contractions['wouldn\'t'] = [{ value: 'would', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WOULDN\'T'] = [{ value: 'WOULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Wouldn\'t'] = [{ value: 'Would', tag: word }, { value: 'n\'t', tag: word }];

        contractions['ain\'t'] = [{ value: 'ai', tag: word }, { value: 'n\'t', tag: word }];
        contractions['AIN\'T'] = [{ value: 'AI', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Ain\'t'] = [{ value: 'Ai', tag: word }, { value: 'n\'t', tag: word }];

        contractions['aren\'t'] = [{ value: 'are', tag: word }, { value: 'n\'t', tag: word }];
        contractions['AREN\'T'] = [{ value: 'ARE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Aren\'t'] = [{ value: 'Are', tag: word }, { value: 'n\'t', tag: word }];

        contractions['isn\'t'] = [{ value: 'is', tag: word }, { value: 'n\'t', tag: word }];
        contractions['ISN\'T'] = [{ value: 'IS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Isn\'t'] = [{ value: 'Is', tag: word }, { value: 'n\'t', tag: word }];

        contractions['wasn\'t'] = [{ value: 'was', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WASN\'T'] = [{ value: 'WAS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Wasn\'t'] = [{ value: 'Was', tag: word }, { value: 'n\'t', tag: word }];

        contractions['weren\'t'] = [{ value: 'were', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WEREN\'T'] = [{ value: 'WERE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Weren\'t'] = [{ value: 'Were', tag: word }, { value: 'n\'t', tag: word }];

        contractions['haven\'t'] = [{ value: 'have', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HAVEN\'T'] = [{ value: 'HAVE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Haven\'t'] = [{ value: 'Have', tag: word }, { value: 'n\'t', tag: word }];

        contractions['hasn\'t'] = [{ value: 'has', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HASN\'T'] = [{ value: 'HAS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Hasn\'t'] = [{ value: 'Has', tag: word }, { value: 'n\'t', tag: word }];

        contractions['daren\'t'] = [{ value: 'dare', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DAREN\'T'] = [{ value: 'DARE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Daren\'t'] = [{ value: 'Dare', tag: word }, { value: 'n\'t', tag: word }];

        // Pronouns like I, you, they, we, she, and he.
        contractions['i\'m'] = [{ value: 'i', tag: word }, { value: '\'m', tag: word }];
        contractions['I\'M'] = [{ value: 'I', tag: word }, { value: '\'M', tag: word }];
        contractions['I\'m'] = [{ value: 'I', tag: word }, { value: '\'m', tag: word }];

        contractions['i\'ve'] = [{ value: 'i', tag: word }, { value: '\'ve', tag: word }];
        contractions['I\'VE'] = [{ value: 'I', tag: word }, { value: '\'VE', tag: word }];
        contractions['I\'ve'] = [{ value: 'I', tag: word }, { value: '\'ve', tag: word }];

        contractions['i\'d'] = [{ value: 'i', tag: word }, { value: '\'d', tag: word }];
        contractions['I\'D'] = [{ value: 'I', tag: word }, { value: '\'D', tag: word }];
        contractions['I\'d'] = [{ value: 'I', tag: word }, { value: '\'d', tag: word }];

        contractions['i\'ll'] = [{ value: 'i', tag: word }, { value: '\'ll', tag: word }];
        contractions['I\'LL'] = [{ value: 'I', tag: word }, { value: '\'LL', tag: word }];
        contractions['I\'ll'] = [{ value: 'I', tag: word }, { value: '\'ll', tag: word }];

        contractions['you\'ve'] = [{ value: 'you', tag: word }, { value: '\'ve', tag: word }];
        contractions['YOU\'VE'] = [{ value: 'YOU', tag: word }, { value: '\'VE', tag: word }];
        contractions['You\'ve'] = [{ value: 'You', tag: word }, { value: '\'ve', tag: word }];

        contractions['you\'d'] = [{ value: 'you', tag: word }, { value: '\'d', tag: word }];
        contractions['YOU\'D'] = [{ value: 'YOU', tag: word }, { value: '\'D', tag: word }];
        contractions['You\'d'] = [{ value: 'You', tag: word }, { value: '\'d', tag: word }];

        contractions['you\'ll'] = [{ value: 'you', tag: word }, { value: '\'ll', tag: word }];
        contractions['YOU\'LL'] = [{ value: 'YOU', tag: word }, { value: '\'LL', tag: word }];
        contractions['You\'ll'] = [{ value: 'You', tag: word }, { value: '\'ll', tag: word }];

        // they - 've, 'd, 'll, 're
        contractions['they\'ve'] = [{ value: 'they', tag: word }, { value: '\'ve', tag: word }];
        contractions['THEY\'VE'] = [{ value: 'THEY', tag: word }, { value: '\'VE', tag: word }];
        contractions['They\'ve'] = [{ value: 'They', tag: word }, { value: '\'ve', tag: word }];

        contractions['they\'d'] = [{ value: 'they', tag: word }, { value: '\'d', tag: word }];
        contractions['THEY\'D'] = [{ value: 'THEY', tag: word }, { value: '\'D', tag: word }];
        contractions['They\'d'] = [{ value: 'They', tag: word }, { value: '\'d', tag: word }];

        contractions['they\'ll'] = [{ value: 'they', tag: word }, { value: '\'ll', tag: word }];
        contractions['THEY\'LL'] = [{ value: 'THEY', tag: word }, { value: '\'LL', tag: word }];
        contractions['They\'ll'] = [{ value: 'They', tag: word }, { value: '\'ll', tag: word }];

        contractions['they\'re'] = [{ value: 'they', tag: word }, { value: '\'re', tag: word }];
        contractions['THEY\'RE'] = [{ value: 'THEY', tag: word }, { value: '\'RE', tag: word }];
        contractions['They\'re'] = [{ value: 'They', tag: word }, { value: '\'re', tag: word }];

        contractions['we\'ve'] = [{ value: 'we', tag: word }, { value: '\'ve', tag: word }];
        contractions['WE\'VE'] = [{ value: 'WE', tag: word }, { value: '\'VE', tag: word }];
        contractions['We\'ve'] = [{ value: 'We', tag: word }, { value: '\'ve', tag: word }];

        contractions['we\'d'] = [{ value: 'we', tag: word }, { value: '\'d', tag: word }];
        contractions['WE\'D'] = [{ value: 'WE', tag: word }, { value: '\'D', tag: word }];
        contractions['We\'d'] = [{ value: 'We', tag: word }, { value: '\'d', tag: word }];

        contractions['we\'ll'] = [{ value: 'we', tag: word }, { value: '\'ll', tag: word }];
        contractions['WE\'LL'] = [{ value: 'WE', tag: word }, { value: '\'LL', tag: word }];
        contractions['We\'ll'] = [{ value: 'We', tag: word }, { value: '\'ll', tag: word }];

        contractions['we\'re'] = [{ value: 'we', tag: word }, { value: '\'re', tag: word }];
        contractions['WE\'RE'] = [{ value: 'WE', tag: word }, { value: '\'RE', tag: word }];
        contractions['We\'re'] = [{ value: 'We', tag: word }, { value: '\'re', tag: word }];

        contractions['she\'d'] = [{ value: 'she', tag: word }, { value: '\'d', tag: word }];
        contractions['SHE\'D'] = [{ value: 'SHE', tag: word }, { value: '\'D', tag: word }];
        contractions['She\'d'] = [{ value: 'She', tag: word }, { value: '\'d', tag: word }];

        contractions['she\'ll'] = [{ value: 'she', tag: word }, { value: '\'ll', tag: word }];
        contractions['SHE\'LL'] = [{ value: 'SHE', tag: word }, { value: '\'LL', tag: word }];
        contractions['She\'ll'] = [{ value: 'She', tag: word }, { value: '\'ll', tag: word }];

        contractions['she\'s'] = [{ value: 'she', tag: word }, { value: '\'s', tag: word }];
        contractions['SHE\'S'] = [{ value: 'SHE', tag: word }, { value: '\'S', tag: word }];
        contractions['She\'s'] = [{ value: 'She', tag: word }, { value: '\'s', tag: word }];

        contractions['he\'d'] = [{ value: 'he', tag: word }, { value: '\'d', tag: word }];
        contractions['HE\'D'] = [{ value: 'HE', tag: word }, { value: '\'D', tag: word }];
        contractions['He\'d'] = [{ value: 'He', tag: word }, { value: '\'d', tag: word }];

        contractions['he\'ll'] = [{ value: 'he', tag: word }, { value: '\'ll', tag: word }];
        contractions['HE\'LL'] = [{ value: 'HE', tag: word }, { value: '\'LL', tag: word }];
        contractions['He\'ll'] = [{ value: 'He', tag: word }, { value: '\'ll', tag: word }];

        contractions['he\'s'] = [{ value: 'he', tag: word }, { value: '\'s', tag: word }];
        contractions['HE\'S'] = [{ value: 'HE', tag: word }, { value: '\'S', tag: word }];
        contractions['He\'s'] = [{ value: 'He', tag: word }, { value: '\'s', tag: word }];

        contractions['it\'d'] = [{ value: 'it', tag: word }, { value: '\'d', tag: word }];
        contractions['IT\'D'] = [{ value: 'IT', tag: word }, { value: '\'D', tag: word }];
        contractions['It\'d'] = [{ value: 'It', tag: word }, { value: '\'d', tag: word }];

        contractions['it\'ll'] = [{ value: 'it', tag: word }, { value: '\'ll', tag: word }];
        contractions['IT\'LL'] = [{ value: 'IT', tag: word }, { value: '\'LL', tag: word }];
        contractions['It\'ll'] = [{ value: 'It', tag: word }, { value: '\'ll', tag: word }];

        contractions['it\'s'] = [{ value: 'it', tag: word }, { value: '\'s', tag: word }];
        contractions['IT\'S'] = [{ value: 'IT', tag: word }, { value: '\'S', tag: word }];
        contractions['It\'s'] = [{ value: 'It', tag: word }, { value: '\'s', tag: word }];

        // Wh Pronouns - what, who, when, where, why, how, there, that
        contractions['what\'ve'] = [{ value: 'what', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHAT\'VE'] = [{ value: 'WHAT', tag: word }, { value: '\'VE', tag: word }];
        contractions['What\'ve'] = [{ value: 'What', tag: word }, { value: '\'ve', tag: word }];

        contractions['what\'d'] = [{ value: 'what', tag: word }, { value: '\'d', tag: word }];
        contractions['WHAT\'D'] = [{ value: 'WHAT', tag: word }, { value: '\'D', tag: word }];
        contractions['What\'d'] = [{ value: 'What', tag: word }, { value: '\'d', tag: word }];

        contractions['what\'ll'] = [{ value: 'what', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHAT\'LL'] = [{ value: 'WHAT', tag: word }, { value: '\'LL', tag: word }];
        contractions['What\'ll'] = [{ value: 'What', tag: word }, { value: '\'ll', tag: word }];

        contractions['what\'re'] = [{ value: 'what', tag: word }, { value: '\'re', tag: word }];
        contractions['WHAT\'RE'] = [{ value: 'WHAT', tag: word }, { value: '\'RE', tag: word }];
        contractions['What\'re'] = [{ value: 'What', tag: word }, { value: '\'re', tag: word }];

        contractions['who\'ve'] = [{ value: 'who', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHO\'VE'] = [{ value: 'WHO', tag: word }, { value: '\'VE', tag: word }];
        contractions['Who\'ve'] = [{ value: 'Who', tag: word }, { value: '\'ve', tag: word }];

        contractions['who\'d'] = [{ value: 'who', tag: word }, { value: '\'d', tag: word }];
        contractions['WHO\'D'] = [{ value: 'WHO', tag: word }, { value: '\'D', tag: word }];
        contractions['Who\'d'] = [{ value: 'Who', tag: word }, { value: '\'d', tag: word }];

        contractions['who\'ll'] = [{ value: 'who', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHO\'LL'] = [{ value: 'WHO', tag: word }, { value: '\'LL', tag: word }];
        contractions['Who\'ll'] = [{ value: 'Who', tag: word }, { value: '\'ll', tag: word }];

        contractions['who\'re'] = [{ value: 'who', tag: word }, { value: '\'re', tag: word }];
        contractions['WHO\'RE'] = [{ value: 'WHO', tag: word }, { value: '\'RE', tag: word }];
        contractions['Who\'re'] = [{ value: 'Who', tag: word }, { value: '\'re', tag: word }];

        contractions['when\'ve'] = [{ value: 'when', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHEN\'VE'] = [{ value: 'WHEN', tag: word }, { value: '\'VE', tag: word }];
        contractions['When\'ve'] = [{ value: 'When', tag: word }, { value: '\'ve', tag: word }];

        contractions['when\'d'] = [{ value: 'when', tag: word }, { value: '\'d', tag: word }];
        contractions['WHEN\'D'] = [{ value: 'WHEN', tag: word }, { value: '\'D', tag: word }];
        contractions['When\'d'] = [{ value: 'When', tag: word }, { value: '\'d', tag: word }];

        contractions['when\'ll'] = [{ value: 'when', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHEN\'LL'] = [{ value: 'WHEN', tag: word }, { value: '\'LL', tag: word }];
        contractions['When\'ll'] = [{ value: 'When', tag: word }, { value: '\'ll', tag: word }];

        contractions['when\'re'] = [{ value: 'when', tag: word }, { value: '\'re', tag: word }];
        contractions['WHEN\'RE'] = [{ value: 'WHEN', tag: word }, { value: '\'RE', tag: word }];
        contractions['When\'re'] = [{ value: 'When', tag: word }, { value: '\'re', tag: word }];

        contractions['where\'ve'] = [{ value: 'where', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHERE\'VE'] = [{ value: 'WHERE', tag: word }, { value: '\'VE', tag: word }];
        contractions['Where\'ve'] = [{ value: 'Where', tag: word }, { value: '\'ve', tag: word }];

        contractions['where\'d'] = [{ value: 'where', tag: word }, { value: '\'d', tag: word }];
        contractions['WHERE\'D'] = [{ value: 'WHERE', tag: word }, { value: '\'D', tag: word }];
        contractions['Where\'d'] = [{ value: 'Where', tag: word }, { value: '\'d', tag: word }];

        contractions['where\'ll'] = [{ value: 'where', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHERE\'LL'] = [{ value: 'WHERE', tag: word }, { value: '\'LL', tag: word }];
        contractions['Where\'ll'] = [{ value: 'Where', tag: word }, { value: '\'ll', tag: word }];

        contractions['where\'re'] = [{ value: 'where', tag: word }, { value: '\'re', tag: word }];
        contractions['WHERE\'RE'] = [{ value: 'WHERE', tag: word }, { value: '\'RE', tag: word }];
        contractions['Where\'re'] = [{ value: 'Where', tag: word }, { value: '\'re', tag: word }];

        contractions['why\'ve'] = [{ value: 'why', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHY\'VE'] = [{ value: 'WHY', tag: word }, { value: '\'VE', tag: word }];
        contractions['Why\'ve'] = [{ value: 'Why', tag: word }, { value: '\'ve', tag: word }];

        contractions['why\'d'] = [{ value: 'why', tag: word }, { value: '\'d', tag: word }];
        contractions['WHY\'D'] = [{ value: 'WHY', tag: word }, { value: '\'D', tag: word }];
        contractions['Why\'d'] = [{ value: 'Why', tag: word }, { value: '\'d', tag: word }];

        contractions['why\'ll'] = [{ value: 'why', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHY\'LL'] = [{ value: 'WHY', tag: word }, { value: '\'LL', tag: word }];
        contractions['Why\'ll'] = [{ value: 'Why', tag: word }, { value: '\'ll', tag: word }];

        contractions['why\'re'] = [{ value: 'why', tag: word }, { value: '\'re', tag: word }];
        contractions['WHY\'RE'] = [{ value: 'WHY', tag: word }, { value: '\'RE', tag: word }];
        contractions['Why\'re'] = [{ value: 'Why', tag: word }, { value: '\'re', tag: word }];

        contractions['how\'ve'] = [{ value: 'how', tag: word }, { value: '\'ve', tag: word }];
        contractions['HOW\'VE'] = [{ value: 'HOW', tag: word }, { value: '\'VE', tag: word }];
        contractions['How\'ve'] = [{ value: 'How', tag: word }, { value: '\'ve', tag: word }];

        contractions['how\'d'] = [{ value: 'how', tag: word }, { value: '\'d', tag: word }];
        contractions['HOW\'D'] = [{ value: 'HOW', tag: word }, { value: '\'D', tag: word }];
        contractions['How\'d'] = [{ value: 'How', tag: word }, { value: '\'d', tag: word }];

        contractions['how\'ll'] = [{ value: 'how', tag: word }, { value: '\'ll', tag: word }];
        contractions['HOW\'LL'] = [{ value: 'HOW', tag: word }, { value: '\'LL', tag: word }];
        contractions['How\'ll'] = [{ value: 'How', tag: word }, { value: '\'ll', tag: word }];

        contractions['how\'re'] = [{ value: 'how', tag: word }, { value: '\'re', tag: word }];
        contractions['HOW\'RE'] = [{ value: 'HOW', tag: word }, { value: '\'RE', tag: word }];
        contractions['How\'re'] = [{ value: 'How', tag: word }, { value: '\'re', tag: word }];

        contractions['there\'ve'] = [{ value: 'there', tag: word }, { value: '\'ve', tag: word }];
        contractions['THERE\'VE'] = [{ value: 'THERE', tag: word }, { value: '\'VE', tag: word }];
        contractions['There\'ve'] = [{ value: 'There', tag: word }, { value: '\'ve', tag: word }];

        contractions['there\'d'] = [{ value: 'there', tag: word }, { value: '\'d', tag: word }];
        contractions['THERE\'D'] = [{ value: 'THERE', tag: word }, { value: '\'D', tag: word }];
        contractions['There\'d'] = [{ value: 'There', tag: word }, { value: '\'d', tag: word }];

        contractions['there\'ll'] = [{ value: 'there', tag: word }, { value: '\'ll', tag: word }];
        contractions['THERE\'LL'] = [{ value: 'THERE', tag: word }, { value: '\'LL', tag: word }];
        contractions['There\'ll'] = [{ value: 'There', tag: word }, { value: '\'ll', tag: word }];

        contractions['there\'re'] = [{ value: 'there', tag: word }, { value: '\'re', tag: word }];
        contractions['THERE\'RE'] = [{ value: 'THERE', tag: word }, { value: '\'RE', tag: word }];
        contractions['There\'re'] = [{ value: 'There', tag: word }, { value: '\'re', tag: word }];

        contractions['that\'ve'] = [{ value: 'that', tag: word }, { value: '\'ve', tag: word }];
        contractions['THAT\'VE'] = [{ value: 'THAT', tag: word }, { value: '\'VE', tag: word }];
        contractions['That\'ve'] = [{ value: 'That', tag: word }, { value: '\'ve', tag: word }];

        contractions['that\'d'] = [{ value: 'that', tag: word }, { value: '\'d', tag: word }];
        contractions['THAT\'D'] = [{ value: 'THAT', tag: word }, { value: '\'D', tag: word }];
        contractions['That\'d'] = [{ value: 'That', tag: word }, { value: '\'d', tag: word }];

        contractions['that\'ll'] = [{ value: 'that', tag: word }, { value: '\'ll', tag: word }];
        contractions['THAT\'LL'] = [{ value: 'THAT', tag: word }, { value: '\'LL', tag: word }];
        contractions['That\'ll'] = [{ value: 'That', tag: word }, { value: '\'ll', tag: word }];

        contractions['that\'re'] = [{ value: 'that', tag: word }, { value: '\'re', tag: word }];
        contractions['THAT\'RE'] = [{ value: 'THAT', tag: word }, { value: '\'RE', tag: word }];
        contractions['That\'re'] = [{ value: 'That', tag: word }, { value: '\'re', tag: word }];

        // Let us!
        contractions['let\'s'] = [{ value: 'let', tag: word }, { value: '\'s', tag: word }];
        contractions['LET\'S'] = [{ value: 'THAT', tag: word }, { value: '\'S', tag: word }];
        contractions['Let\'s'] = [{ value: 'Let', tag: word }, { value: '\'s', lemma: 'us' }];

        module.exports = contractions;
    }, {}], 19: [function (require, module, exports) {
        //     wink-tokenizer
        //     Multilingual tokenizer that automatically tags each token with its type.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-tokenizer”.
        //
        //     “wink-tokenizer” is free software: you can redistribute
        //     it and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-tokenizer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-tokenizer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var contractions = require('./eng-contractions.js');
        var rgxSpaces = /\s+/g;
        // Ordinals only for Latin like 1st, 2nd or 12th or 33rd.
        var rgxOrdinalL1 = /1\dth|[04-9]th|1st|2nd|3rd|[02-9]1st|[02-9]2nd|[02-9]3rd|[02-9][04-9]th|\d+\d[04-9]th|\d+\d1st|\d+\d2nd|\d+\d3rd/g;
        // Apart from detecting pure integers or decimals, also detect numbers containing
        // `. - / ,` so that dates, ip address, fractions and things like codes or part
        // numbers are also detected as numbers only. These regex will therefore detected
        // 8.8.8.8 or 12-12-1924 or 1,1,1,1.00 or 1/4 or 1/4/66/777 as numbers.
        // Latin-1 Numbers.
        var rgxNumberL1 = /\d+\/\d+|\d(?:[\.\,\-\/]?\d)*(?:\.\d+)?/g;
        // Devanagari Numbers.
        var rgxNumberDV = /[\u0966-\u096F]+\/[\u0966-\u096F]+|[\u0966-\u096F](?:[\.\,\-\/]?[\u0966-\u096F])*(?:\.[\u0966-\u096F]+)?/g;
        var rgxMention = /\@\w+/g;
        // Latin-1 Hashtags.
        var rgxHashtagL1 = /\#[a-z][a-z0-9]*/gi;
        // Devanagari Hashtags; include Latin-1 as well.
        var rgxHashtagDV = /\#[\u0900-\u0963\u0970-\u097F][\u0900-\u0963\u0970-\u097F\u0966-\u096F0-9]*/gi;
        // EMail is EN character set.
        var rgxEmail = /[-!#$%&'*+\/=?^\w{|}~](?:\.?[-!#$%&'*+\/=?^\w`{|}~])*@[a-z0-9](?:-?\.?[a-z0-9])*(?:\.[a-z](?:-?[a-z0-9])*)+/gi;
        // Bitcoin, Ruble, Indian Rupee, Other Rupee, Dollar, Pound, Yen, Euro, Wong.
        var rgxCurrency = /[\₿\₽\₹\₨\$\£\¥\€\₩]/g;
        // These include both the punctuations: Latin-1 & Devanagari.
        var rgxPunctuation = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:\u0964\u0965]/g;
        var rgxQuotedPhrase = /\"[^\"]*\"/g;
        // NOTE: URL will support only EN character set for now.
        var rgxURL = /(?:https?:\/\/)(?:[\da-z\.-]+)\.(?:[a-z\.]{2,6})(?:[\/\w\.\-\?#=]*)*\/?/gi;
        var rgxEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF]/g;
        var rgxEmoticon = /:-?[dps\*\/\[\]\{\}\(\)]|;-?[/(/)d]|<3/gi;
        var rgxTime = /(?:\d|[01]\d|2[0-3]):?(?:[0-5][0-9])?\s?(?:[ap]\.?m\.?|hours|hrs)/gi;
        // Inlcude [Latin-1 Supplement Unicode Block](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block))
        var rgxWordL1 = /[a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF][a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\']*/gi;
        // Define [Devanagari Unicode Block](https://unicode.org/charts/PDF/U0900.pdf)
        var rgxWordDV = /[\u0900-\u094F\u0951-\u0963\u0970-\u097F]+/gi;
        // Symbols go here; including Om.
        var rgxSymbol = /[\u0950\~\@\#\%\^\+\=\*\|<>&]/g;
        // For detecting if the word is a potential contraction.
        var rgxContraction = /\'/;
        // Singular & Plural possessive
        var rgxPosSingular = /([a-z]+)(\'s)$/i;
        var rgxPosPlural = /([a-z]+s)(\')$/i;
        // Regexes and their categories; used for tokenizing via match/split. The
        // sequence is *critical* for correct tokenization.
        var rgxsMaster = [{ regex: rgxQuotedPhrase, category: 'quoted_phrase' }, { regex: rgxURL, category: 'url' }, { regex: rgxEmail, category: 'email' }, { regex: rgxMention, category: 'mention' }, { regex: rgxHashtagL1, category: 'hashtag' }, { regex: rgxHashtagDV, category: 'hashtag' }, { regex: rgxEmoji, category: 'emoji' }, { regex: rgxEmoticon, category: 'emoticon' }, { regex: rgxTime, category: 'time' }, { regex: rgxOrdinalL1, category: 'ordinal' }, { regex: rgxNumberL1, category: 'number' }, { regex: rgxNumberDV, category: 'number' }, { regex: rgxCurrency, category: 'currency' }, { regex: rgxWordL1, category: 'word' }, { regex: rgxWordDV, category: 'word' }, { regex: rgxPunctuation, category: 'punctuation' }, { regex: rgxSymbol, category: 'symbol' }];

        // Used to generate finger print from the tokens.
        // NOTE: this variable is being reset in `defineConfig()`.
        var fingerPrintCodes = {
            emoticon: 'c',
            email: 'e',
            emoji: 'j',
            hashtag: 'h',
            mention: 'm',
            number: 'n',
            ordinal: 'o',
            quoted_phrase: 'q', // eslint-disable-line camelcase
            currency: 'r',
            // symbol: 's',
            time: 't',
            url: 'u',
            word: 'w',
            alien: 'z'
        };

        // ### tokenizer
        /**
         *
         * Creates an instance of **`wink-tokenizer`**.
         *
         * @return {methods} object conatining set of API methods for tokenizing a sentence
         * and defining configuration, plugin etc.
         * @example
         * // Load wink tokenizer.
         * var tokenizer = require( 'wink-tokenizer' );
         * // Create your instance of wink tokenizer.
         * var myTokenizer = tokenizer();
        */
        var tokenizer = function () {
            // Default configuration: most comprehensive tokenization. Make deep copy!
            var rgxs = rgxsMaster.slice(0);
            // The result of last call to `tokenize()` is retained here.
            var finalTokens = [];
            // Returned!
            var methods = Object.create(null);

            // ### manageContraction
            /**
             *
             * Splits a contractions into words by first trying a lookup in strandard
             * `contractions`; if the lookup fails, it checks for possessive in `'s` or
             * `s'` forms and separates the possesive part from the word. Otherwise the
             * contraction is treated as a normal word and no splitting occurs.
             *
             * @param {string} word — that could be a potential conraction.
             * @param {object[]} tokens — where the outcome is pushed.
             * @return {object[]} updated tokens according to the `word.`
             * @private
            */
            var manageContraction = function (word, tokens) {
                var ct = contractions[word];
                var matches;
                if (ct === undefined) {
                    // Try possesive of sigular & plural forms
                    matches = word.match(rgxPosSingular);
                    if (matches) {
                        tokens.push({ value: matches[1], tag: 'word' });
                        tokens.push({ value: matches[2], tag: 'word' });
                    } else {
                        matches = word.match(rgxPosPlural);
                        if (matches) {
                            tokens.push({ value: matches[1], tag: 'word' });
                            tokens.push({ value: matches[2], tag: 'word' });
                        } else tokens.push({ value: word, tag: 'word' });
                    }
                } else {
                    // Manage via lookup; ensure cloning!
                    tokens.push(Object.assign({}, ct[0]));
                    tokens.push(Object.assign({}, ct[1]));
                }
                return tokens;
            }; // manageContraction()

            // ### tokenizeTextUnit
            /**
             *
             * Attempts to tokenize the input `text` using the `rgxSplit`. The tokenization
             * is carried out by combining the regex matches and splits in the right sequence.
             * The matches are the *real tokens*, whereas splits are text units that are
             * tokenized in later rounds! The real tokens (i.e. matches) are pushed as
             * `object` and splits as `string`.
             *
             * @param {string} text — unit that is to be tokenized.
             * @param {object} rgxSplit — object containing the regex and it's category.
             * @return {array} of tokens.
             * @private
            */
            var tokenizeTextUnit = function (text, rgxSplit) {
                // Regex matches go here; note each match is a token and has the same tag
                // as of regex's category.
                var matches = text.match(rgxSplit.regex);
                // Balance is "what needs to be tokenized".
                var balance = text.split(rgxSplit.regex);
                // The result, in form of combination of tokens & matches, is captured here.
                var tokens = [];
                // The tag;
                var tag = rgxSplit.category;
                // Helper variables.
                var aword,
                    i,
                    imax,
                    k = 0,
                    t;

                // Combine tokens & matches in the following pattern [ b0 m0 b1 m1 ... ]
                matches = matches ? matches : [];
                for (i = 0, imax = balance.length; i < imax; i += 1) {
                    t = balance[i];
                    t = t.trim();
                    if (t) tokens.push(t);
                    if (k < matches.length) {
                        if (tag === 'word') {
                            // Tag type `word` token may have a contraction.
                            aword = matches[k];
                            if (rgxContraction.test(aword)) {
                                tokens = manageContraction(aword, tokens);
                            } else {
                                // Means there is no contraction.
                                tokens.push({ value: aword, tag: tag });
                            }
                        } else tokens.push({ value: matches[k], tag: tag });
                    }
                    k += 1;
                }

                return tokens;
            }; // tokenizeTextUnit()

            // ### tokenizeTextRecursively
            /**
             *
             * Tokenizes the input text recursively using the array of `regexes` and then
             * the `tokenizeTextUnit()` function. If (or whenever) the `regexes` becomes
             * empty, it simply splits the text on non-word characters instead of using
             * the `tokenizeTextUnit()` function.
             *
             * @param {string} text — unit that is to be tokenized.
             * @param {object} regexes — object containing the regex and it's category.
             * @return {undefined} nothing!
             * @private
            */
            var tokenizeTextRecursively = function (text, regexes) {
                var sentence = text.trim();
                var tokens = [];
                var i, imax;

                if (!regexes.length) {
                    // No regex left, split on `spaces` and tag every token as **alien**.
                    text.split(rgxSpaces).forEach(function (tkn) {
                        finalTokens.push({ value: tkn.trim(), tag: 'alien' });
                    });
                    return;
                }

                var rgx = regexes[0];
                tokens = tokenizeTextUnit(sentence, rgx);

                for (i = 0, imax = tokens.length; i < imax; i += 1) {
                    if (typeof tokens[i] === 'string') {
                        // Strings become candidates for further tokenization.
                        tokenizeTextRecursively(tokens[i], regexes.slice(1));
                    } else {
                        finalTokens.push(tokens[i]);
                    }
                }
            }; // tokenizeTextRecursively()

            // ### defineConfig
            /**
             *
             * Defines the configuration in terms of the types of token that will be
             * extracted by [`tokenize()`](#tokenize) method. Note by default, all types
             * of tokens will be detected and tagged automatically.
             *
             * @param {object} config — It defines 0 or more properties from the list of
             * **14** properties. A true value for a property ensures tokenization
             * for that type of text; whereas false value will mean that the tokenization of that
             * type of text will not be attempted. It also **resets** the effect of any previous
             * call(s) to the [`addRegex()`](#addregex) API.
             *
             * *An empty config object is equivalent to splitting on spaces. Whatever tokens
             * are created like this are tagged as **alien** and **`z`** is the
             * [finger print](#gettokensfp) code of this token type.*
             *
             * The table below gives the name of each property and it's description including
             * examples. The character with in paranthesis is the [finger print](#gettokensfp) code for the
             * token of that type.
             * @param {boolean} [config.currency=true] such as **$** or **£** symbols (**`r`**)
             * @param {boolean} [config.email=true] for example **john@acme.com** or **superman1@gmail.com** (**`e`**)
             * @param {boolean} [config.emoji=true] any standard unicode emojis e.g. 😊 or 😂 or 🎉 (**`j`**)
             * @param {boolean} [config.emoticon=true] common emoticons such as **`:-)`** or **`:D`** (**`c`**)
             * @param {boolean} [config.hashtag=true] hash tags such as **`#happy`** or **`#followme`** (**`h`**)
             * @param {boolean} [config.number=true] any integer, decimal number, fractions such as **19**, **2.718**
             * or **1/4** and numerals containing "**`, - / .`**", for example 12-12-1924 (**`n`**)
             * @param {boolean} [config.ordinal=true] ordinals like **1st**, **2nd**, **3rd**, **4th** or **12th** or **91st** (**`o`**)
             * @param {boolean} [config.punctuation=true] common punctuation such as **`?`** or **`,`**
             * ( token becomes fingerprint )
             * @param {boolean} [config.quoted_phrase=true] any **"quoted text"** in the sentence. (**`q`**)
             * @param {boolean} [config.symbol=true] for example **`~`** or **`+`** or **`&`** or **`%`** ( token becomes fingerprint )
             * @param {boolean} [config.time=true] common representation of time such as **4pm** or **16:00 hours** (**`t`**)
             * @param {boolean} [config.mention=true] **@mention**  as in github or twitter (**`m`**)
             * @param {boolean} [config.url=true] URL such as **https://github.com** (**`u`**)
             * @param {boolean} [config.word=true] word such as **faster** or **résumé** or **prévenir** (**`w`**)
             * @return {number} number of properties set to true from the list of above 13.
             * @example
             * // Do not tokenize & tag @mentions.
             * var myTokenizer.defineConfig( { mention: false } );
             * // -> 13
             * // Only tokenize words as defined above.
             * var myTokenizer.defineConfig( {} );
             * // -> 0
            */
            var defineConfig = function (config) {
                if (typeof config === 'object' && Object.keys(config).length) {
                    rgxs = rgxsMaster.filter(function (rgx) {
                        // Config for the Category of `rgx`.
                        var cc = config[rgx.category];
                        // Means `undefined` & `null` values are taken as true; otherwise
                        // standard **truthy** and **falsy** interpretation applies!!
                        return cc === undefined || cc === null || !!cc;
                    });
                } else rgxs = [];
                // Count normalized length i.e. ignore multi-script entries.
                const uniqueCats = Object.create(null);
                rgxs.forEach(function (rgx) {
                    uniqueCats[rgx.category] = true;
                });
                // Reset the `fingerPrintCodes` variable.
                fingerPrintCodes = {
                    emoticon: 'c',
                    email: 'e',
                    emoji: 'j',
                    hashtag: 'h',
                    mention: 'm',
                    number: 'n',
                    ordinal: 'o',
                    quoted_phrase: 'q', // eslint-disable-line camelcase
                    currency: 'r',
                    // symbol: 's',
                    time: 't',
                    url: 'u',
                    word: 'w',
                    alien: 'z'
                };
                return Object.keys(uniqueCats).length;
            }; // defineConfig()

            // ### tokenize
            /**
             *
             * Tokenizes the input `sentence` using the configuration specified via
             * [`defineConfig()`](#defineconfig).
             * Common contractions and possessive nouns are split into 2 separate tokens;
             * for example **I'll** splits as `'I'` and `'\'ll'` or **won't** splits as
             * `'wo'` and `'n\'t'`.
             *
             * @param {string} sentence — the input sentence.
             * @return {object[]} of tokens; each one of them is an object with 2-keys viz.
             * `value` and its `tag` identifying the type of the token.
             * @example
             * var s = 'For detailed API docs, check out http://winkjs.org/wink-regression-tree/ URL!';
             * myTokenizer.tokenize( s );
             * // -> [ { value: 'For', tag: 'word' },
             * //      { value: 'detailed', tag: 'word' },
             * //      { value: 'API', tag: 'word' },
             * //      { value: 'docs', tag: 'word' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'check', tag: 'word' },
             * //      { value: 'out', tag: 'word' },
             * //      { value: 'http://winkjs.org/wink-regression-tree/', tag: 'url' },
             * //      { value: 'URL', tag: 'word' },
             * //      { value: '!', tag: 'punctuation' } ]
            */
            var tokenize = function (sentence) {
                finalTokens = [];
                tokenizeTextRecursively(sentence, rgxs);
                return finalTokens;
            }; // tokenize()

            // ### getTokensFP
            /**
             *
             * Returns the finger print of the tokens generated by the last call to
             * [`tokenize()`](#tokenize). A finger print is a string created by sequentially
             * joining the unique code of each token's type. Refer to table given under
             * [`defineConfig()`](#defineconfig) for values of these codes.
             *
             * A finger print is extremely useful in spotting patterns present in the sentence
             * using `regexes`, which is otherwise a complex and time consuming task.
             *
             * @return {string} finger print of tokens generated by the last call to `tokenize()`.
             * @example
             * // Generate finger print of sentence given in the previous example
             * // under tokenize().
             * myTokenizer.getTokensFP();
             * // -> 'wwww,wwuw!'
            */
            var getTokensFP = function () {
                var fp = [];
                finalTokens.forEach(function (t) {
                    fp.push(fingerPrintCodes[t.tag] ? fingerPrintCodes[t.tag] : t.value);
                });
                return fp.join('');
            }; // getFingerprint()

            // ### addTag
            var addTag = function (name, fingerprintCode) {
                if (fingerPrintCodes[name]) {
                    throw new Error('Tag ' + name + ' already exists');
                }

                fingerPrintCodes[name] = fingerprintCode;
            }; // addTag()

            // ### addRegex
            /**
             * Adds a regex for parsing a new type of token. This regex can either be mapped
             * to an existing tag or it allows creation of a new tag along with its finger print.
             * The uniqueness of the [finger prints](#defineconfig) have to ensured by the user.
             *
             * *The added regex(s) will supersede the internal parsing.*
             *
             * @param {RegExp} regex — the new regular expression.
             * @param {string} tag — tokens matching the `regex` will be assigned this tag.
             * @param {string} [fingerprintCode=undefined] — required if adding a new
             * tag; ignored if using an existing tag.
             * @return {void} nothing!
             * @example
             * // Adding a regex for an existing tag
             * myTokenizer.addRegex( /\(oo\)/gi, 'emoticon' );
             * myTokenizer.tokenize( '(oo) Hi!' )
             * // -> [ { value: '(oo)', tag: 'emoticon' },
             * //      { value: 'Hi', tag: 'word' },
             * //      { value: '!', tag: 'punctuation' } ]
             *
             * // Adding a regex to parse a new token type
             * myTokenizer.addRegex( /hello/gi, 'greeting', 'g' );
             * myTokenizer.tokenize( 'hello, how are you?' );
             * // -> [ { value: 'hello', tag: 'greeting' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'how', tag: 'word' },
             * //      { value: 'are', tag: 'word' },
             * //      { value: 'you', tag: 'word' },
             * //      { value: '?', tag: 'punctuation' } ]
             * // Notice how "hello" is now tagged as "greeting" and not as "word".
             *
             * // Using definConfig will reset the above!
             * myTokenizer.defineConfig( { word: true } );
             * myTokenizer.tokenize( 'hello, how are you?' );
             * // -> [ { value: 'hello', tag: 'word' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'how', tag: 'word' },
             * //      { value: 'are', tag: 'word' },
             * //      { value: 'you', tag: 'word' },
             * //      { value: '?', tag: 'punctuation' } ]
            */

            var addRegex = function (regex, tag, fingerprintCode) {
                if (!fingerPrintCodes[tag] && !fingerprintCode) {
                    throw new Error('Tag ' + tag + ' doesn\'t exist; Provide a \'fingerprintCode\' to add it as a tag.');
                } else if (!fingerPrintCodes[tag]) {
                    addTag(tag, fingerprintCode);
                }

                rgxs.unshift({ regex: regex, category: tag });
            }; // addRegex()

            methods.defineConfig = defineConfig;
            methods.tokenize = tokenize;
            methods.getTokensFP = getTokensFP;
            methods.addTag = addTag;
            methods.addRegex = addRegex;
            return methods;
        };

        module.exports = tokenizer;
    }, { "./eng-contractions.js": 18 }], 20: [function (require, module, exports) {
        module.exports = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "would", "should", "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "only", "own", "same", "so", "than", "too", "very"];
    }, {}], 21: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnIndexer

        /**
         *
         * Returns an Indexer object that contains two functions. The first function `build()`
         * incrementally builds an index for each `element` using `itsIndex` — both passed as
         * parameters to it. The second function — `result()` allows accessing the index anytime.
         *
         * It is typically used with [string.soc](#stringsoc), [string.bong](#stringbong),
         * [string.song](#stringsong), and [tokens.sow](#tokenssow).
         *
         * @name helper.returnIndexer
         * @return {indexer} used to build and access the index.
         * @example
         * var indexer = returnIndexer();
         * // -> { build: [function], result: [function] }
         */
        var returnIndexer = function () {
            var theIndex = Object.create(null);
            var methods = Object.create(null);

            // Builds index by adding the `element` and `itsIndex`. The `itsIndex` should
            // be a valid JS array index; no validation checks are performed while building
            // index.
            var build = function (element, itsIndex) {
                theIndex[element] = theIndex[element] || [];
                theIndex[element].push(itsIndex);
                return true;
            }; // build()

            // Returns the index built so far.
            var result = function () {
                return theIndex;
            }; // result()

            methods.build = build;
            methods.result = result;

            return methods;
        }; // index()

        module.exports = returnIndexer;
    }, {}], 22: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnQuotedTextExtractor

        /**
         *
         * Returns a function that extracts all occurrences of every quoted text
         * between the `lq` and the `rq` characters from its argument. This argument
         * must be of type string.
         *
         * @name helper.returnQuotedTextExtractor
         * @param {string} [lq='"'] — the left quote character.
         * @param {string} [rq='"'] — the right quote character.
         * @return {function} that will accept an input string argument and return an
         * array of all substrings that are quoted between `lq` and `rq`.
         * @example
         * var extractQuotedText = returnQuotedTextExtractor();
         * extractQuotedText( 'Raise 2 issues - "fix a bug" & "run tests"' );
         * // -> [ 'fix a bug', 'run tests' ]
         */
        var returnQuotedTextExtractor = function (lq, rq) {
            var // Index variable for *for-loop*
            i,

            // Set defaults for left quote, if required.
            lq1 = lq && typeof lq === 'string' ? lq : '"',

            // Extracts its length
            lqLen = lq1.length,

            // The regular expression is created here.
            regex = null,

            // The string containing the regular expression builds here.
            rgxStr = '',

            // Set defaults for right quote, if required.
            rq1 = rq && typeof rq === 'string' ? rq : lq1,

            // Extract its length.
            rqLen = rq1.length;

            // Build `rgxStr`
            for (i = 0; i < lqLen; i += 1) rgxStr += '\\' + lq1.charAt(i);
            rgxStr += '.*?';
            for (i = 0; i < rqLen; i += 1) rgxStr += '\\' + rq1.charAt(i);
            // Create regular expression.
            regex = new RegExp(rgxStr, 'g');
            // Return the extractor function.
            return function (s) {
                if (!s || typeof s !== 'string') return null;
                var // Extracted elements are captured here.
                elements = [],

                // Extract matches with quotes
                matches = s.match(regex);
                if (!matches || matches.length === 0) return null;
                // Collect elements after removing the quotes.
                for (var k = 0, kmax = matches.length; k < kmax; k += 1) {
                    elements.push(matches[k].substr(lqLen, matches[k].length - (rqLen + lqLen)));
                }
                return elements;
            };
        }; // returnQuotedTextExtractor()

        module.exports = returnQuotedTextExtractor;
    }, {}], 23: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnWordsFilter

        /**
         *
         * Returns an object containing the following functions: (a) `set()`, which returns
         * a set of mapped words given in the input array `words`. (b) `exclude()` that
         * is suitable for array filtering operations.
         *
         * If the second argument `mappers` is provided as an array of maping functions
         * then these are applied on the input array before converting into a set. A
         * mapper function must accept a string as argument and return a string as the result.
         * Examples of mapper functions are typically **string** functionss of **`wink-nlp-utils`**
         * such as `string.lowerCase()`, `string.stem()` and
         * `string.soundex()`.
         *
         * @name helper.returnWordsFilter
         * @param {string[]} words — that can be filtered using the returned wordsFilter.
         * @param {function[]} [mappers=undefined] — optionally used to map each word before creating
         * the wordsFilter.
         * @return {wordsFilter} object containg `set()` and `exclude()` functions for `words`.
         * @example
         * var stopWords = [ 'This', 'That', 'Are', 'Is', 'Was', 'Will', 'a' ];
         * var myFilter = returnWordsFilter( stopWords, [ string.lowerCase ] );
         * [ 'this', 'is', 'a', 'cat' ].filter( myFilter.exclude );
         * // -> [ 'cat' ]
         */
        var returnWordsFilter = function (words, mappers) {
            var mappedWords = words;
            var givenMappers = mappers || [];
            givenMappers.forEach(function (m) {
                mappedWords = mappedWords.map(m);
            });

            mappedWords = new Set(mappedWords);

            var exclude = function (t) {
                return !mappedWords.has(t);
            }; // exclude()

            var set = function () {
                return mappedWords;
            }; // set()

            return {
                set: set,
                exclude: exclude
            };
        }; // returnWordsFilter()

        module.exports = returnWordsFilter;
    }, {}], 24: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var degrees = [/\bm\.?\s*a\b/i, /\bb\.?\s*a\b/i, /\bb\.?\s*tech\b/i, /\bm\.?\s*tech\b/i, /\bb\.?\s*des\b/i, /\bm\.?\s*des\b/i, /\bm\.?\s*b\.?\s*a\b/i, /\bm\.?\s*c\.?\s*a\b/i, /\bb\.?\s*c\.?\s*a\b/i, /\bl\.?\s*l\.?\s*b\b/i, /\bl\.?\s*l\.?\s*m\b/i, /\bm\.?\s*b\.?\s*b\.?\s*s\b/i, /\bm\.?\s*d\b/i, /\bd\.?\s*m\b/i, /\bm\.?\s*s\b/i, /\bd\.?\s*n\.?\s*b\b/i, /\bd\.?\s*g\.?\s*o\b/i, /\bd\.?\s*l\.?\s*o\b/i, /\bb\.?\s*d\.?\s*s\b/i, /\bb\.?\s*h\.?\s*m\.?\s*s\b/i, /\bb\.?\s*a\.?\s*m\.?\s*s\b/i, /\bf\.?\s*i\.?\s*c\.?\s*s\b/i, /\bm\.?\s*n\.?\s*a\.?\s*m\.?\s*s\b/i, /\bb\.?\s*e\.?\s*m\.?\s*s\b/i, /\bd\.?\s*c\.?\s*h\b/i, /\bm\.?\s*c\.?\s*h\b/i, /\bf\.?\s*r\.?\s*c\.?\s*s\b/i, /\bm\.?\s*r\.?\s*c\.?\s*p\b/i, /\bf\.?\s*i\.?\s*a\.?\s*c\.?\s*m\b/i, /\bf\.?\s*i\.?\s*m\.?\s*s\.?\s*a\b/i, /\bp\.?\s*h\.?\s*d\b/i];

        var titleNames = ['mr', 'mrs', 'miss', 'ms', 'master', 'er', 'dr', 'shri', 'shrimati', 'sir'];

        var titles = new RegExp('^(?:' + titleNames.join('|') + ')$', 'i');

        module.exports = {
            degrees: degrees,
            titles: titles
        };
    }, {}], 25: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        /* eslint no-underscore-dangle: "off" */
        var rgx = Object.create(null);
        // Remove repeating characters.
        rgx.repeatingChars = /([^c])\1/g;
        // Drop first character from character pairs, if found in the beginning.
        rgx.kngnPairs = /^(kn|gn|pn|ae|wr)/;
        // Drop vowels that are not found in the beginning.
        rgx.__vowels = /(?!^)[aeiou]/g;
        // Replaces `ough` in the end by 'f'
        rgx.ough = /ough$/;
        // Replace following 3 instances of `dg` by `j`.
        rgx.dge = /dge/g;
        rgx.dgi = /dgi/g;
        rgx.dgy = /dgy/g;
        // Replace `sch` by `sk`.
        rgx.sch = /sch/g;
        // Drop `c` in `sci, sce, scy`.
        rgx.sci = /sci/g;
        rgx.sce = /sce/g;
        rgx.scy = /scy/g;
        // Make 'sh' out of `tio & tia`.
        rgx.tio = /tio/g;
        rgx.tia = /tia/g;
        // `t` is silent in `tch`.
        rgx.tch = /tch/g;
        // Drop `b` in the end if preceeded by `m`.
        rgx.mb_ = /mb$/;
        // These are pronounced as `k`.
        rgx.cq = /cq/g;
        rgx.ck = /ck/g;
        // Here `c` sounds like `s`
        rgx.ce = /ce/g;
        rgx.ci = /ci/g;
        rgx.cy = /cy/g;
        // And this `f`.
        rgx.ph = /ph/g;
        // The `sh` finally replaced by `x`.
        rgx.sh = /sh|sio|sia/g;
        // This is open rgx - TODO: need to finalize.
        rgx.vrnotvy = /([aeiou])(r)([^aeiouy])/g;
        // `th` sounds like theta - make it 0.
        rgx.th = /th/g;
        // `c` sounds like `k` except when it is followed by `h`.
        rgx.cnoth = /(c)([^h])/g;
        // Even `q` sounds like `k`.
        rgx.q = /q/g;
        // The first `x` sounds like `s`.
        rgx._x = /^x/;
        // Otherwise `x` is more like `ks`.
        rgx.x = /x/g;
        // Drop `y` if not followed by a vowel or appears in the end.
        rgx.ynotv = /(y)([^aeiou])/g;
        rgx.y_ = /y$/;
        // `z` is `s`.
        rgx.z = /z/g;

        // Export rgx.
        module.exports = rgx;
    }, {}], 26: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### amplifyNotElision
        /**
         *
         * Amplifies the not elision by converting it into not; for example `isn't`
         * becomes `is not`.
         *
         * @name string.amplifyNotElision
         * @param {string} str — the input string.
         * @return {string} input string after not elision amplification.
         * @example
         * amplifyNotElision( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is not it?"
         */
        var amplifyNotElision = function (str) {
            return str.replace(rgx.notElision, '$1 not');
        }; // amplifyNotElision()

        module.exports = amplifyNotElision;
    }, { "./util_regexes.js": 60 }], 27: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bong
        /**
         *
         * Generates the bag of ngrams of `size` from the input string. The
         * default size is 2, which means it will generate bag of bigrams by default. It
         * also has an alias **`bong()`**.
         *
         * @name string.bagOfNGrams
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram size.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of ngram** of `str`; and it receives the ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {object} bag of ngrams of `size` from `str`.
         * @example
         * bagOfNGrams( 'mama' );
         * // -> { ma: 2, am: 1 }
         * bong( 'mamma' );
         * // -> { ma: 2, am: 1, mm: 1 }
         */
        var bong = function (str, size, ifn, idx) {
            var ng = size || 2,
                ngBOW = Object.create(null),
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) {
                    // Call `ifn` iff its defined and `tg` is appearing for the first time;
                    // this avoids multiple calls to `ifn`. Strategy applies to `song()`,
                    // and `bow()`.
                    if (typeof ifn === 'function' && !ngBOW[tg]) {
                        ifn(tg, idx);
                    }
                    // Now define, if required and then update counts.
                    ngBOW[tg] = 1 + (ngBOW[tg] || 0);
                }
            }
            return ngBOW;
        }; // bong()

        module.exports = bong;
    }, {}], 28: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = require('wink-helpers');
        var returnQuotedTextExtractor = require('./helper-return-quoted-text-extractor.js');
        var extractQuotedText = returnQuotedTextExtractor('[', ']');
        // ## string

        // ### composeCorpus
        /**
         *
         * Generates all possible sentences from the input argument string.
         * The string s must follow a special syntax as illustrated in the
         * example below:<br/>
         * `'[I] [am having|have] [a] [problem|question]'`<br/>
         *
         * Each phrase must be quoted between `[ ]` and each possible option of phrases
         * (if any) must be separated by a `|` character. The corpus is composed by
         * computing the cartesian product of all the phrases.
         *
         * @name string.composeCorpus
         * @param {string} str — the input string.
         * @return {string[]} of all possible sentences.
         * @example
         * composeCorpus( '[I] [am having|have] [a] [problem|question]' );
         * // -> [ 'I am having a problem',
         * //      'I am having a question',
         * //      'I have a problem',
         * //      'I have a question' ]
         */
        var composeCorpus = function (str) {
            if (!str || typeof str !== 'string') return [];

            var quotedTextElems = extractQuotedText(str);
            var corpus = [];
            var finalCorpus = [];

            if (!quotedTextElems) return [];
            quotedTextElems.forEach(function (e) {
                corpus.push(e.split('|'));
            });

            helpers.array.product(corpus).forEach(function (e) {
                finalCorpus.push(e.join(' '));
            });
            return finalCorpus;
        }; // composeCorpus()

        module.exports = composeCorpus;
    }, { "./helper-return-quoted-text-extractor.js": 22, "wink-helpers": 17 }], 29: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### edgeNGrams
        /**
         *
         * Generates the edge ngrams from the input string.
         *
         * @name string.edgeNGrams
         * @param {string} str — the input string.
         * @param {number} [min=2] — size of ngram generated.
         * @param {number} [max=8] — size of ngram is generated.
         * @param {number} [delta=2] — edge ngrams are generated in increments of this value.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every edge ngram of `str`; and it receives the edge ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {string[]} of edge ngrams.
         * @example
         * edgeNGrams( 'decisively' );
         * // -> [ 'de', 'deci', 'decisi', 'decisive' ]
         * edgeNGrams( 'decisively', 8, 10, 1 );
         * // -> [ 'decisive', 'decisivel', 'decisively' ]
         */
        var edgeNGrams = function (str, min, max, delta, ifn, idx) {
            var dlta = delta || 2,
                eg,
                egs = [],
                imax = Math.min(max || 8, str.length) + 1,
                start = min || 2;

            // Generate edge ngrams
            for (var i = start; i < imax; i += dlta) {
                eg = str.slice(0, i);
                egs.push(eg);
                if (typeof ifn === 'function') {
                    ifn(eg, idx);
                }
            }
            return egs;
        }; // edgeNGrams()

        module.exports = edgeNGrams;
    }, {}], 30: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');
        var ncrgx = require('./name_cleaner_regexes.js');

        // ## string

        // ### extractPersonsName
        /**
         *
         * Attempts to extract person's name from input string.
         * It assmues the following name format:<br/>
         * `[<salutations>] <name part as FN [MN] [LN]> [<degrees>]`<br/>
         * Entities in square brackets are optional.
         *
         * @name string.extractPersonsName
         * @param {string} str — the input string.
         * @return {string} extracted name.
         * @example
         * extractPersonsName( 'Dr. Sarah Connor M. Tech., PhD. - AI' );
         * // -> 'Sarah Connor'
         */
        var extractPersonsName = function (str) {
            // Remove Degrees by making the list of indexes of each degree and subsequently
            // finding the minimum and slicing from there!
            var indexes = ncrgx.degrees.map(function (r) {
                var m = r.exec(str);
                return m ? m.index : 999999;
            });
            var sp = Math.min.apply(null, indexes);

            // Generate an Array of Every Elelemnt of Name (e.g. title, first name,
            // sir name, honours, etc)
            var aeen = str.slice(0, sp).replace(rgx.notAlpha, ' ').replace(rgx.spaces, ' ').trim().split(' ');
            // Remove titles from the beginning.
            while (aeen.length && ncrgx.titles.test(aeen[0])) aeen.shift();
            return aeen.join(' ');
        }; // extractPersonsName()

        module.exports = extractPersonsName;
    }, { "./name_cleaner_regexes.js": 24, "./util_regexes.js": 60 }], 31: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');
        var trim = require('./string-trim.js');
        // ## string

        // ### extractRunOfCapitalWords
        /**
         *
         * Extracts the array of text appearing as Title Case or in ALL CAPS from the
         * input string.
         *
         * @name string.extractRunOfCapitalWords
         * @param {string} str — the input string.
         * @return {string[]} of text appearing in Title Case or in ALL CAPS; if no such
         * text is found then `null` is returned.
         * @example
         * extractRunOfCapitalWords( 'In The Terminator, Sarah Connor is in Los Angeles' );
         * // -> [ 'In The Terminator', 'Sarah Connor', 'Los Angeles' ]
         */
        var extractRunOfCapitalWords = function (str) {
            var m = str.match(rgx.rocWords);
            return m ? m.map(trim) : m;
        }; // extractRunOfCapitalWords()

        module.exports = extractRunOfCapitalWords;
    }, { "./string-trim.js": 49, "./util_regexes.js": 60 }], 32: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### lowerCase
        /**
         *
         * Converts the input string to lower case.
         *
         * @name string.lowerCase
         * @param {string} str — the input string.
         * @return {string} input string in lower case.
         * @example
         * lowerCase( 'Lower Case' );
         * // -> 'lower case'
         */
        var lowerCase = function (str) {
            return str.toLowerCase();
        }; // lowerCase()

        module.exports = lowerCase;
    }, {}], 33: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### marker
        /**
         *
         * Generates `marker` of the input string; it is defined as 1-gram, sorted
         * and joined back as a string again. Marker is a quick and aggressive way
         * to detect similarity between short strings. Its aggression may lead to more
         * false positives such as `Meter` and `Metre` or `no melon` and `no lemon`.
         *
         * @name string.marker
         * @param {string} str — the input string.
         * @return {string} the marker.
         * @example
         * marker( 'the quick brown fox jumps over the lazy dog' );
         * // -> ' abcdefghijklmnopqrstuvwxyz'
         */
        var marker = function (str) {
            var uniqChars = Object.create(null);
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                uniqChars[str[i]] = true;
            }
            return Object.keys(uniqChars).sort().join('');
        }; // marker()

        module.exports = marker;
    }, {}], 34: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### ngram
        /**
         *
         * Generates an array of ngrams of a specified size from the input string. The
         * default size is 2, which means it will generate bigrams by default.
         *
         * @name string.ngram
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram's size.
         * @return {string[]} ngrams of `size` from `str`.
         * @example
         * ngram( 'FRANCE' );
         * // -> [ 'FR', 'RA', 'AN', 'NC', 'CE' ]
         * ngram( 'FRENCH' );
         * // -> [ 'FR', 'RE', 'EN', 'NC', 'CH' ]
         * ngram( 'FRANCE', 3 );
         * // -> [ 'FRA', 'RAN', 'ANC', 'NCE' ]
         */
        var ngram = function (str, size) {
            var ng = size || 2,
                ngramz = [],
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) ngramz.push(tg);
            }
            return ngramz;
        }; // ngram()

        module.exports = ngram;
    }, {}], 35: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var phnrgx = require('./phonetize_regexes.js');
        /* eslint no-underscore-dangle: "off" */

        // ## string

        // ### phonetize
        /**
         *
         * Phonetizes the input string using an algorithmic adaptation of Metaphone; It
         * is not an exact implementation of Metaphone.
         *
         * @name string.phonetize
         * @param {string} word — the input word.
         * @return {string} phonetic code of `word`.
         * @example
         * phonetize( 'perspective' );
         * // -> 'prspktv'
         * phonetize( 'phenomenon' );
         * // -> 'fnmnn'
         */
        var phonetize = function (word) {
            var p = word.toLowerCase();
            // Remove repeating letters.
            p = p.replace(phnrgx.repeatingChars, '$1');
            // Drop first character of `kgknPairs`.
            if (phnrgx.kngnPairs.test(p)) {
                p = p.substr(1, p.length - 1);
            }
            // Run Regex Express now!
            p = p
            // Change `ough` in the end as `f`,
            .replace(phnrgx.ough, 'f')
            // Change `dg` to `j`, in `dge, dgi, dgy`.
            .replace(phnrgx.dge, 'je').replace(phnrgx.dgi, 'ji').replace(phnrgx.dgy, 'jy')
            // Change `c` to `k` in `sch`
            .replace(phnrgx.sch, 'sk')
            // Drop `c` in `sci, sce, scy`.
            .replace(phnrgx.sci, 'si').replace(phnrgx.sce, 'se').replace(phnrgx.scy, 'sy')
            // Drop `t` if it appears as `tch`.
            .replace(phnrgx.tch, 'ch')
            // Replace `tio & tia` by `sh`.
            .replace(phnrgx.tio, 'sh').replace(phnrgx.tia, 'sh')
            // Drop `b` if it appears as `mb` in the end.
            .replace(phnrgx.mb_, 'm')
            // Drop `r` if it preceeds a vowel and not followed by a vowel or `y`
            // .replace( rgx.vrnotvy, '$1$3' )
            // Replace `c` by `s` in `ce, ci, cy`.
            .replace(phnrgx.ce, 'se').replace(phnrgx.ci, 'si').replace(phnrgx.cy, 'sy')
            // Replace `cq` by `q`.
            .replace(phnrgx.cq, 'q')
            // Replace `ck` by `k`.
            .replace(phnrgx.ck, 'k')
            // Replace `ph` by `f`.
            .replace(phnrgx.ph, 'f')
            // Replace `th` by `0` (theta look alike!).
            .replace(phnrgx.th, '0')
            // Replace `c` by `k` if it is not followed by `h`.
            .replace(phnrgx.cnoth, 'k$2')
            // Replace `q` by `k`.
            .replace(phnrgx.q, 'k')
            // Replace `x` by `s` if it appears in the beginning.
            .replace(phnrgx._x, 's')
            // Other wise replace `x` by `ks`.
            .replace(phnrgx.x, 'ks')
            // Replace `sh, sia, sio` by `x`. Needs to be done post `x` processing!
            .replace(phnrgx.sh, 'x')
            // Drop `y` if it is now followed by a **vowel**.
            .replace(phnrgx.ynotv, '$2').replace(phnrgx.y_, '')
            // Replace `z` by `s`.
            .replace(phnrgx.z, 's')
            // Drop all **vowels** excluding the first one.
            .replace(phnrgx.__vowels, '');

            return p;
        }; // phonetize()

        module.exports = phonetize;
    }, { "./phonetize_regexes.js": 25 }], 36: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeElisions
        /**
         *
         * Removes basic elisions found in the input string. Typical example of elisions
         * are `it's, let's, where's, I'd, I'm, I'll, I've, and Isn't` etc. Note it retains
         * apostrophe used to indicate possession.
         *
         * @name string.removeElisions
         * @param {string} str — the input string.
         * @return {string} input string after removal of elisions.
         * @example
         * removeElisions( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is it?"
         */
        var removeElisions = function (str) {
            return str.replace(rgx.elisionsSpl, '$2').replace(rgx.elisions1, '$1').replace(rgx.elisions2, '$1');
        }; // removeElisions()

        module.exports = removeElisions;
    }, { "./util_regexes.js": 60 }], 37: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeExtraSpaces
        /**
         *
         * Removes leading, trailing and any extra in-between whitespaces from the input
         * string.
         *
         * @name string.removeExtraSpaces
         * @param {string} str — the input string.
         * @return {string} input string after removal of leading, trailing and extra
         * whitespaces.
         * @example
         * removeExtraSpaces( '   Padded   Text    ' );
         * // -> 'Padded Text'
         */
        var removeExtraSpaces = function (str) {
            return str.trim().replace(rgx.spaces, ' ');
        }; // removeExtraSpaces()

        module.exports = removeExtraSpaces;
    }, { "./util_regexes.js": 60 }], 38: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeHTMLTags
        /**
         *
         * Removes each HTML tag by replacing it with a whitespace.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removeHTMLTags
         * @param {string} str — the input string.
         * @return {string} input string after removal of HTML tags.
         * @example
         * removeHTMLTags( '<p>Vive la France&nbsp;&#160;!</p>' );
         * // -> ' Vive la France  ! '
         */
        var removeHTMLTags = function (str) {
            return str.replace(rgx.htmlTags, ' ').replace(rgx.htmlEscSeq1, ' ').replace(rgx.htmlEscSeq2, ' ');
        }; // removeHTMLTags()

        module.exports = removeHTMLTags;
    }, { "./util_regexes.js": 60 }], 39: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removePunctuations
        /**
         *
         * Removes each punctuation mark by replacing it with a whitespace. It looks for
         * the following punctuations — `.,;!?:"!'... - () [] {}`.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removePunctuations
         * @param {string} str — the input string.
         * @return {string} input string after removal of punctuations.
         * @example
         * removePunctuations( 'Punctuations like "\'\',;!?:"!... are removed' );
         * // -> 'Punctuations like               are removed'
         */
        var removePunctuations = function (str) {
            return str.replace(rgx.punctuations, ' ');
        }; // removePunctuations()

        module.exports = removePunctuations;
    }, { "./util_regexes.js": 60 }], 40: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeSplChars
        /**
         *
         * Removes each special character by replacing it with a whitespace. It looks for
         * the following special characters — `~@#%^*+=`.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removeSplChars
         * @param {string} str — the input string.
         * @return {string} input string after removal of special characters.
         * @example
         * removeSplChars( '4 + 4*2 = 12' );
         * // -> '4   4 2   12'
         */
        var removeSplChars = function (str) {
            return str.replace(rgx.splChars, ' ');
        }; // removeSplChars()

        module.exports = removeSplChars;
    }, { "./util_regexes.js": 60 }], 41: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### retainAlphaNums
        /**
         *
         * Retains only apha, numerals, and removes all other characters from
         * the input string, including leading, trailing and extra in-between
         * whitespaces.
         *
         * @name string.retainAlphaNums
         * @param {string} str — the input string.
         * @return {string} input string after removal of non-alphanumeric characters,
         * leading, trailing and extra whitespaces.
         * @example
         * retainAlphaNums( ' This, text here, has  (other) chars_! ' );
         * // -> 'This text here has other chars'
         */
        var retainAlphaNums = function (str) {
            return str.replace(rgx.notAlphaNumeric, ' ').replace(rgx.spaces, ' ').trim();
        }; // retainAlphaNums()

        module.exports = retainAlphaNums;
    }, { "./util_regexes.js": 60 }], 42: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        // Abbreviations with `.` but are never are EOS.
        const abbrvNoEOS = Object.create(null);
        abbrvNoEOS['mr.'] = true;
        abbrvNoEOS['mrs.'] = true;
        abbrvNoEOS['ms.'] = true;
        abbrvNoEOS['er.'] = true;
        abbrvNoEOS['dr.'] = true;
        abbrvNoEOS['miss.'] = true;
        abbrvNoEOS['shri.'] = true;
        abbrvNoEOS['smt.'] = true;
        abbrvNoEOS['i.e.'] = true;
        abbrvNoEOS['ie.'] = true;
        abbrvNoEOS['e.g.'] = true;
        abbrvNoEOS['eg.'] = true;
        abbrvNoEOS['viz.'] = true;
        abbrvNoEOS['pvt.'] = true;
        // et al.
        abbrvNoEOS['et.'] = true;
        abbrvNoEOS['al.'] = true;
        // Mount Kailash!
        abbrvNoEOS['mt.'] = true;
        // Pages!
        abbrvNoEOS['pp.'] = true;

        const abbrvMayBeEOS = Object.create(null);
        abbrvMayBeEOS['inc.'] = true;
        abbrvMayBeEOS['ltd.'] = true;
        abbrvMayBeEOS['al.'] = true;
        // Regex to test potential End-Of-Sentence.
        const rgxPotentialEOS = /\.$|\!$|\?$/;
        // Regex to test special cases of "I" at eos.
        const rgxSplI = /i\?$|i\!$/;
        // Regex to test first char as alpha only
        const rgxAlphaAt0 = /^[^a-z]/i;

        // ## string

        // ### sentences
        /**
         *
         * Detects the sentence boundaries in the input `paragraph` and splits it into
         * an array of sentence(s).
         *
         * @name string.sentences
         * @param {string} paragraph — the input string.
         * @return {string[]} of sentences.
         * @example
         * sentences( 'AI Inc. is focussing on AI. I work for AI Inc. My mail is r2d2@yahoo.com' );
         * // -> [ 'AI Inc. is focussing on AI.',
         * //      'I work for AI Inc.',
         * //      'My mail is r2d2@yahoo.com' ]
         *
         * sentences( 'U.S.A is my birth place. I was born on 06.12.1924. I climbed Mt. Everest.' );
         * // -> [ 'U.S.A is my birth place.',
         * //      'I was born on 06.12.1924.',
         * //      'I climbed Mt. Everest.' ]
         */
        var punkt = function (paragraph) {
            // The basic idea is to split the paragraph on `spaces` and thereafter
            // examine each word ending with an EOS punctuation for a possible EOS.

            // Split on **space** to obtain all the `tokens` in the `para`.
            const paraTokens = paragraph.split(' ');
            var sentenceTokens = [];
            var sentences = [];

            for (let k = 0; k < paraTokens.length; k += 1) {
                // A para token.
                const pt = paraTokens[k];
                // A lower cased para token.
                const lcpt = pt.toLowerCase();
                if (rgxPotentialEOS.test(pt) && !abbrvNoEOS[lcpt] && (pt.length !== 2 || rgxAlphaAt0.test(pt) || rgxSplI.test(lcpt))) {
                    // Next para token that is non-blank.
                    let nextpt;
                    // Append this token to the current sentence tokens.
                    sentenceTokens.push(pt);
                    // If the current token is one of the abbreviations that may also mean EOS.
                    if (abbrvMayBeEOS[lcpt]) {
                        for (let j = k + 1; j < paraTokens.length && !nextpt; j += 1) {
                            nextpt = paraTokens[j];
                        }
                    }
                    // If no next para token or if present then starts from a Cap Letter then
                    // only complete sentence and start a new one!
                    if (nextpt === undefined || /^[A-Z]/.test(nextpt)) {
                        sentences.push(sentenceTokens.join(' '));
                        sentenceTokens = [];
                    }
                } else sentenceTokens.push(pt);
            }

            if (sentenceTokens.length > 0) sentences.push(sentenceTokens.join(' '));

            return sentences;
        }; // punkt()

        module.exports = punkt;
    }, {}], 43: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### soc
        /**
         *
         * Creates a set of chars from the input string `s`. This is useful
         * in even more aggressive string matching using Jaccard or Tversky compared to
         * `marker()`. It also has an alias **`soc()`**.
         *
         * @name string.setOfChars
         * @param {string} str — the input string.
         * @param {function} [ifn=undefined] — a function to build index; it receives the first
         * character of `str` and the `idx` as input arguments. The `build()` function of
         * [helper.returnIndexer](#helperreturnindexer) may be used as `ifn`. If `undefined`
         * then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {string} the soc.
         * @example
         * setOfChars( 'the quick brown fox jumps over the lazy dog' );
         * // -> ' abcdefghijklmnopqrstuvwxyz'
         */
        var soc = function (str, ifn, idx) {
            var cset = new Set(str);
            if (typeof ifn === 'function') {
                ifn(str[0], idx);
            }
            return cset;
        }; // soc()

        module.exports = soc;
    }, {}], 44: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### song
        /**
         *
         * Generates the set of ngrams of `size` from the input string. The
         * default size is 2, which means it will generate set of bigrams by default.
         * It also has an alias **`song()`**.
         *
         * @name string.setOfNGrams
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram size.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of ngram** of `str`; and it receives the ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {set} of ngrams of `size` of `str`.
         * @example
         * setOfNGrams( 'mama' );
         * // -> Set { 'ma', 'am' }
         * song( 'mamma' );
         * // -> Set { 'ma', 'am', 'mm' }
         */
        var song = function (str, size, ifn, idx) {
            var ng = size || 2,
                ngSet = new Set(),
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) {
                    if (typeof ifn === 'function' && !ngSet.has(tg)) {
                        ifn(tg, idx);
                    }
                    ngSet.add(tg);
                }
            }
            return ngSet;
        }; // song()

        module.exports = song;
    }, {}], 45: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        // Soundex Code for alphabets.
        /* eslint-disable object-property-newline */
        var soundexMap = {
            A: 0, E: 0, I: 0, O: 0, U: 0, Y: 0,
            B: 1, F: 1, P: 1, V: 1,
            C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2,
            D: 3, T: 3,
            L: 4,
            M: 5, N: 5,
            R: 6
        };

        // ## string

        // ### soundex
        /**
         *
         * Produces the soundex code from the input `word`.
         *
         * @name string.soundex
         * @param {string} word — the input word.
         * @param {number} [maxLength=4] — of soundex code to be returned.
         * @return {string} soundex code of `word`.
         * @example
         * soundex( 'Burroughs' );
         * // -> 'B620'
         * soundex( 'Burrows' );
         * // -> 'B620'
         */
        var soundex = function (word, maxLength) {
            // Upper case right in the begining.
            var s = word.length ? word.toUpperCase() : '?';
            var i,
                imax = s.length;
            // Soundex code builds here.
            var sound = [];
            // Helpers - `ch` is a char from `s` and `code/prevCode` are sondex codes
            // for consonants.
            var ch,
                code,
                prevCode = 9;
            // Use default of 4.
            var maxLen = maxLength || 4;
            // Iterate through every character.
            for (i = 0; i < imax; i += 1) {
                ch = s[i];
                code = soundexMap[ch];
                if (i) {
                    // Means i is > 0.
                    // `code` is either (a) `undefined` if an unknown character is
                    // encountered including `h & w`, or (b) `0` if it is vowel, or
                    // (c) the soundex code for a consonant.
                    if (code && code !== prevCode) {
                        // Consonant and not adjecant duplicates!
                        sound.push(code);
                    } else if (code !== 0) {
                        // Means `h or w` or an unknown character: ensure `prevCode` is
                        // remembered so that adjecant duplicates can be handled!
                        code = prevCode;
                    }
                } else {
                    // Retain the first letter
                    sound.push(ch);
                }
                prevCode = code;
            }
            s = sound.join('');
            // Always ensure minimum length of 4 characters for maxLength > 4.
            if (s.length < 4) s += '000';
            // Return the required length.
            return s.substr(0, maxLen);
        }; // soundex()

        module.exports = soundex;
    }, {}], 46: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### splitElisions
        /**
         *
         * Splits basic elisions found in the input string. Typical example of elisions
         * are `it's, let's, where's, I'd, I'm, I'll, I've, and Isn't` etc. Note it does
         * not touch apostrophe used to indicate possession.
         *
         * @name string.splitElisions
         * @param {string} str — the input string.
         * @return {string} input string after splitting of elisions.
         * @example
         * splitElisions( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is n't it?"
         */
        var splitElisions = function (str) {
            return str.replace(rgx.elisionsSpl, '$2 $3').replace(rgx.elisions1, '$1 $2').replace(rgx.elisions2, '$1 $2');
        }; // splitElisions()

        module.exports = splitElisions;
    }, { "./util_regexes.js": 60 }], 47: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var winkTokenize = require('wink-tokenizer')().tokenize;

        // ## string

        // ### tokenize
        /**
         *
         * Tokenizes the input `sentence` according to the value of `detailed` flag.
         * Any occurance of `...` in the `sentence` is
         * converted to ellipses. In `detailed = true` mode, it
         * tags every token with its type; the supported tags are currency, email,
         * emoji, emoticon, hashtag, number, ordinal, punctuation, quoted_phrase, symbol,
         * time, mention, url, and word.
         *
         * @name string.tokenize
         * @param {string} sentence — the input string.
         * @param {boolean} [detailed=false] — if true, each token is a object cotaining
         * `value` and `tag` of each token; otherwise each token is a string. It's default
         * value of **false** ensures compatibility with previous version.
         * @return {(string[]|object[])} an array of strings if `detailed` is false otherwise
         * an array of objects.
         * @example
         * tokenize( "someone's wallet, isn't it? I'll return!" );
         * // -> [ 'someone', '\'s', 'wallet', ',', 'is', 'n\'t', 'it', '?',
         * //      'I', '\'ll', 'return', '!' ]
         *
         * tokenize( 'For details on wink, check out http://winkjs.org/ URL!', true );
         * // -> [ { value: 'For', tag: 'word' },
         * //      { value: 'details', tag: 'word' },
         * //      { value: 'on', tag: 'word' },
         * //      { value: 'wink', tag: 'word' },
         * //      { value: ',', tag: 'punctuation' },
         * //      { value: 'check', tag: 'word' },
         * //      { value: 'out', tag: 'word' },
         * //      { value: 'http://winkjs.org/', tag: 'url' },
         * //      { value: 'URL', tag: 'word' },
         * //      { value: '!', tag: 'punctuation' } ]
         */
        var tokenize = function (sentence, detailed) {
            var tokens = winkTokenize(sentence.replace('...', '…'));
            var i;
            if (!detailed) {
                for (i = 0; i < tokens.length; i += 1) tokens[i] = tokens[i].value;
            }

            return tokens;
        }; // tokenize()

        module.exports = tokenize;
    }, { "wink-tokenizer": 19 }], 48: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var removeElisions = require('./string-remove-elisions.js');
        var amplifyNotElision = require('./string-amplify-not-elision.js');
        var rgx = require('./util_regexes.js');

        // ## string

        // ### tokenize0
        /**
         *
         * Tokenizes by splitting the input string on **non-words**. This means tokens would
         * consists of only alphas, numerals and underscores; all other characters will
         * be stripped as they are treated as separators. It also removes all elisions;
         * however negations are retained and amplified.
         *
         * @name string.tokenize0
         * @param {string} str — the input string.
         * @return {string[]} of tokens.
         * @example
         * tokenize0( "someone's wallet, isn't it?" );
         * // -> [ 'someone', 's', 'wallet', 'is', 'not', 'it' ]
         */
        var tokenize0 = function (str) {
            var tokens = removeElisions(amplifyNotElision(str)).replace(rgx.cannot, '$1 $2').split(rgx.nonWords);
            // Check the 0th and last element of array for empty string because if
            // fisrt/last characters are non-words then these will be empty stings!
            if (tokens[0] === '') tokens.shift();
            if (tokens[tokens.length - 1] === '') tokens.pop();
            return tokens;
        }; // tokenize0()

        module.exports = tokenize0;
    }, { "./string-amplify-not-elision.js": 26, "./string-remove-elisions.js": 36, "./util_regexes.js": 60 }], 49: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### trim
        /**
         *
         * Trims leading and trailing whitespaces from the input string.
         *
         * @name string.trim
         * @param {string} str — the input string.
         * @return {string} input string with leading & trailing whitespaces removed.
         * @example
         * trim( '  Padded   ' );
         * // -> 'Padded'
         */
        var trim = function (str) {
            return str.trim();
        }; // trim()

        module.exports = trim;
    }, {}], 50: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### upperCase
        /**
         *
         * Converts the input string to upper case.
         *
         * @name string.upperCase
         * @param {string} str — the input string.
         * @return {string} input string in upper case.
         * @example
         * upperCase( 'Upper Case' );
         * // -> 'UPPER CASE'
         */
        var upperCase = function (str) {
            return str.toUpperCase();
        }; // upperCase()

        module.exports = upperCase;
    }, {}], 51: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE SyappendBigramss Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## tokens

        // ### appendBigrams
        /**
         *
         * Generates bigrams from the input tokens and appends them to the input tokens.
         *
         * @name tokens.appendBigrams
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} the input tokens appended with their bigrams.
         * @example
         * appendBigrams( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'he',
         * //      'acted',
         * //      'decisively',
         * //      'today',
         * //      'he_acted',
         * //      'acted_decisively',
         * //      'decisively_today' ]
         */
        var appendBigrams = function (tokens) {
            var i, imax;
            for (i = 0, imax = tokens.length - 1; i < imax; i += 1) {
                tokens.push(tokens[i] + '_' + tokens[i + 1]);
            }
            return tokens;
        }; // appendBigrams()

        module.exports = appendBigrams;
    }, {}], 52: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Sybigramss Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## tokens

        // ### bigrams
        /**
         *
         * Generates bigrams from the input tokens.
         *
         * @name tokens.bigrams
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} the bigrams.
         * @example
         * bigrams( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ [ 'he', 'acted' ],
         * //      [ 'acted', 'decisively' ],
         * //      [ 'decisively', 'today' ] ]
         */
        var bigrams = function (tokens) {
            // Bigrams will be stored here.
            var bgs = [];
            // Helper variables.
            var i, imax;
            // Create bigrams.
            for (i = 0, imax = tokens.length - 1; i < imax; i += 1) {
                bgs.push([tokens[i], tokens[i + 1]]);
            }
            return bgs;
        }; // bigrams()

        module.exports = bigrams;
    }, {}], 53: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bow
        /**
         *
         * Generates the bag of words from the input string. By default it
         * uses `word count` as it's frequency; but if `logCounts` parameter is set to true then
         * it will use `log2( word counts + 1 )` as it's frequency. It also has an alias **`bow()`**.
         *
         * @name tokens.bagOfWords
         * @param {string[]} tokens — the input tokens.
         * @param {number} [logCounts=false] — a true value flags the use of `log2( word count + 1 )`
         * instead of just `word count` as frequency.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of word** in `tokens`; and it receives the word and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {object} bag of words from tokens.
         * @example
         * bagOfWords( [ 'rain', 'rain', 'go', 'away' ] );
         * // -> { rain: 2, go: 1, away: 1 }
         * bow( [ 'rain', 'rain', 'go', 'away' ], true );
         * // -> { rain: 1.584962500721156, go: 1, away: 1 }
         */
        var bow = function (tokens, logCounts, ifn, idx) {
            var bow1 = Object.create(null),
                i,
                imax,
                token,
                words;
            for (i = 0, imax = tokens.length; i < imax; i += 1) {
                token = tokens[i];
                if (typeof ifn === 'function' && !bow1[token]) {
                    ifn(token, idx);
                }
                bow1[token] = 1 + (bow1[token] || 0);
            }
            if (!logCounts) return bow1;
            words = Object.keys(bow1);
            for (i = 0, imax = words.length; i < imax; i += 1) {
                // Add `1` to ensure non-zero count! (Note: log2(1) is 0)
                bow1[words[i]] = Math.log2(bow1[words[i]] + 1);
            }
            return bow1;
        }; // bow()

        module.exports = bow;
    }, {}], 54: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var stringPhonetize = require('./string-phonetize.js');

        // ## tokens

        // ### phonetize
        /**
         *
         * Phonetizes input tokens using using an algorithmic adaptation of Metaphone.
         *
         * @name tokens.phonetize
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} phonetized tokens.
         * @example
         * phonetize( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'h', 'aktd', 'dssvl', 'td' ]
         */
        var phonetize = function (tokens) {
            return tokens.map(stringPhonetize);
        }; // phonetize()

        module.exports = phonetize;
    }, { "./string-phonetize.js": 35 }], 55: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### propagateNegations
        /**
         *
         * It looks for negation tokens in the input array of tokens and propagates
         * negation to subsequent `upto` tokens by prefixing them by a `!`. It is useful
         * in handling text containing negations during tasks like similarity detection,
         * classification or search.
         *
         * @name tokens.propagateNegations
         * @param {string[]} tokens — the input tokens.
         * @param {number} [upto=2] — number of tokens to be negated after the negation
         * token. Note, tokens are only negated either `upto` tokens or up to the token
         * preceeding the **`, . ; : ! ?`** punctuations.
         * @return {string[]} tokens with negation propagated.
         * @example
         * propagateNegations( [ 'mary', 'is', 'not', 'feeling', 'good', 'today' ] );
         * // -> [ 'mary', 'is', 'not', '!feeling', '!good', 'today' ]
         */
        var propagateNegations = function (tokens, upto) {
            var i, imax, j, jmax;
            var tkns = tokens;
            var limit = upto || 2;
            for (i = 0, imax = tkns.length; i < imax; i += 1) {
                if (rgx.negations.test(tkns[i])) {
                    for (j = i + 1, jmax = Math.min(imax, i + limit + 1); j < jmax; j += 1) {
                        // Hit a punctuation mark, break out of the loop otherwise go *upto the limit*.
                        // > TODO: promote to utilities regex, after test cases have been added.
                        if (/[\,\.\;\:\!\?]/.test(tkns[j])) break;
                        // Propoage negation: invert the token by prefixing a `!` to it.
                        tkns[j] = '!' + tkns[j];
                    }
                    i = j;
                }
            }
            return tkns;
        }; // propagateNegations()

        module.exports = propagateNegations;
    }, { "./util_regexes.js": 60 }], 56: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        var defaultStopWords = require('./dictionaries/stop_words.json');
        var words = require('./helper-return-words-filter.js');
        defaultStopWords = words(defaultStopWords);

        // ## tokens

        // ### removeWords
        /**
         *
         * Removes the stop words from the input array of tokens.
         *
         * @name tokens.removeWords
         * @param {string[]} tokens — the input tokens.
         * @param {wordsFilter} [stopWords=defaultStopWords] — default stop words are
         * loaded from `stop_words.json` located under the `src/dictionaries/` directory.
         * Custom stop words can be created using [helper.returnWordsFilter ](#helperreturnwordsfilter).
         * @return {string[]} balance tokens.
         * @example
         * removeWords( [ 'this', 'is', 'a', 'cat' ] );
         * // -> [ 'cat' ]
         */
        var removeWords = function (tokens, stopWords) {
            var givenStopWords = stopWords || defaultStopWords;
            return tokens.filter(givenStopWords.exclude);
        }; // removeWords()

        module.exports = removeWords;
    }, { "./dictionaries/stop_words.json": 20, "./helper-return-words-filter.js": 23 }], 57: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var stringSoundex = require('./string-soundex.js');

        // ## tokens

        // ### soundex
        /**
         *
         * Generates the soundex coded tokens from the input tokens.
         *
         * @name tokens.soundex
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} soundex coded tokens.
         * @example
         * soundex( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'H000', 'A233', 'D221', 'T300' ]
         */
        var soundex = function (tokens) {
            // Need to send `maxLength` as `undefined`.
            return tokens.map(t => stringSoundex(t));
        }; // soundex()

        module.exports = soundex;
    }, { "./string-soundex.js": 45 }], 58: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bow
        /**
         *
         * Generates the set of words from the input string. It also has an alias **`setOfWords()`**.
         *
         * @name tokens.setOfWords
         * @param {string[]} tokens — the input tokens.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **member word of the set **; and it receives the word and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {set} of words from tokens.
         * @example
         * setOfWords( [ 'rain', 'rain', 'go', 'away' ] );
         * // -> Set { 'rain', 'go', 'away' }
         */
        var sow = function (tokens, ifn, idx) {
            var tset = new Set(tokens);
            if (typeof ifn === 'function') {
                tset.forEach(function (m) {
                    ifn(m, idx);
                });
            }
            return tset;
        }; // bow()

        module.exports = sow;
    }, {}], 59: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var porter2Stemmer = require('wink-porter2-stemmer');

        // ## tokens

        // ### stem
        /**
         *
         * Stems input tokens using Porter Stemming Algorithm Version 2.
         *
         * @name tokens.stem
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} stemmed tokens.
         * @example
         * stem( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'he', 'act', 'decis', 'today' ]
         */
        var stem = function (tokens) {
            return tokens.map(porter2Stemmer);
        }; // stem()

        module.exports = stem;
    }, { "wink-porter2-stemmer": 62 }], 60: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = Object.create(null);

        // Matches standard english punctuations in a text.
        rgx.punctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:]/ig;
        // End Of Sentence Punctuations - useful for splitting text into sentences.
        rgx.eosPunctuations = /([\.\?\!])\s*(?=[a-z]|\s+\d)/gi;

        // Matches special characters: `* + % # @ ^ = ~ | \` in a text.
        rgx.splChars = /[\*\+\%\#\@\^\=\~\|\\]/ig;

        // Matches common english elisions including n't.
        // These are special ones as 's otherwise may be apostrophe!
        rgx.elisionsSpl = /(\b)(it|let|that|who|what|here|there|when|where|why|how)(\'s)\b/gi;
        // Single (1) character elisions.
        rgx.elisions1 = /([a-z])(\'d|\'m)\b/gi;
        // Two (2) character elisions.
        rgx.elisions2 = /([a-z])(\'ll|\'ve|\'re|n\'t)\b/gi;
        // Sperate not elision 'nt.
        rgx.notElision = /([a-z])(n\'t)\b/gi;
        // Specially handle cannot
        rgx.cannot = /\b(can)(not)\b/gi;

        // Matches space, tab, or new line characters in text.
        rgx.spaces = /\s+/ig;
        // Matches anything other than space, tab, or new line characters.
        rgx.notSpace = /\S/g;
        // Matches alpha and space characters in a text.
        rgx.alphaSpace = /[a-z\s]/ig;
        // Matches alphanumerals and space characters in a text.
        rgx.alphaNumericSpace = /[a-z0-9\s]/ig;
        // Matches non alpha characters in a text.
        rgx.notAlpha = /[^a-z]/ig;
        // Matches non alphanumerals in a text.
        rgx.notAlphaNumeric = /[^a-z0-9]/ig;
        // Matches one or more non-words characters.
        rgx.nonWords = /\W+/ig;
        // Matches complete negation token
        rgx.negations = /^(never|none|not|no)$/ig;

        // Matches run of capital words in a text.
        rgx.rocWords = /(?:\b[A-Z][A-Za-z]*\s*){2,}/g;

        // Matches integer, decimal, JS floating point numbers in a text.
        rgx.number = /[0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+/ig;

        // Matches time in 12 hour am/pm format in a text.
        rgx.timeIn12HrAMPM = /(?:[0-9]|0[0-9]|1[0-2])((:?:[0-5][0-9])){0,1}\s?(?:[aApP][mM])/ig;

        // Matches HTML tags - in fact any thing enclosed in angular brackets including
        // the brackets.
        rgx.htmlTags = /(?:<[^>]*>)/g;
        // Matches the HTML Esc Sequences
        // Esc Seq of type `&lt;` or `&nbsp;`
        rgx.htmlEscSeq1 = /(?:&[a-z]{2,6};)/gi;
        // Esc Seq of type `&#32;`
        rgx.htmlEscSeq2 = /(?:&#[0-9]{2,4};)/gi;

        // Tests if a given string is possibly in the Indian mobile telephone number format.
        rgx.mobileIndian = /^(0|\+91)?[789]\d{9}$/;
        // Tests if a given string is in the valid email format.
        rgx.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Extracts any number and text from a <number><text> format text.
        // Useful in extracting value and UoM from strings like `2.7 Kgs`.
        rgx.separateNumAndText = /([0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+)[\s]*(.*)/i;

        // Crude date parser for a string containg date in a valid format.
        // > TODO: Need to improve this one!
        rgx.date = /(\d+)/ig;

        // Following 3 regexes are specially coded for `tokenize()` in prepare_text.
        // Matches punctuations that are not a part of a number.
        rgx.nonNumPunctuations = /[\.\,\-](?=\D)/gi;
        rgx.otherPunctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\!\;\?\/\:]/ig;
        // > TODO: Add more currency symbols here.
        rgx.currency = /[\$\£\¥\€]/ig;

        //
        module.exports = rgx;
    }, {}], 61: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var porter2Stemmer = require('wink-porter2-stemmer');

        // ### Prepare Name Space

        // Create prepare name space.
        var prepare = Object.create(null);

        // ### Prepare.Helper name space

        // Create prepare.helper name space.
        prepare.helper = Object.create(null);

        // Words
        prepare.helper.words = require('./helper-return-words-filter.js');
        // Make better **alias** name for the `word()` function.
        prepare.helper.returnWordsFilter = prepare.helper.words;
        // Index
        prepare.helper.index = require('./helper-return-indexer.js');
        // Make better **alias** name for the `index()` function.
        prepare.helper.returnIndexer = prepare.helper.index;

        // Return Quoted Text Extractor
        prepare.helper.returnQuotedTextExtractor = require('./helper-return-quoted-text-extractor.js');

        // ### Prepare.String Name Space

        // Create prepare.string name space.
        prepare.string = Object.create(null);

        // Lower Case
        prepare.string.lowerCase = require('./string-lower-case.js');
        // Upper Case
        prepare.string.upperCase = require('./string-upper-case.js');
        // Trim
        prepare.string.trim = require('./string-trim.js');
        // Remove Extra Spaces
        prepare.string.removeExtraSpaces = require('./string-remove-extra-spaces.js');
        // Retain Alpha-numerics
        prepare.string.retainAlphaNums = require('./string-retain-alpha-nums.js');
        // Extract Person's Name
        prepare.string.extractPersonsName = require('./string-extract-persons-name.js');
        // Extract Run of Capital Words
        prepare.string.extractRunOfCapitalWords = require('./string-extract-run-of-capital-words.js');
        // Remove Punctuations
        prepare.string.removePunctuations = require('./string-remove-punctuations.js');
        // Remove Special Chars
        prepare.string.removeSplChars = require('./string-remove-spl-chars.js');
        // Remove HTML Tags
        prepare.string.removeHTMLTags = require('./string-remove-html-tags.js');
        // Remove Elisions
        prepare.string.removeElisions = require('./string-remove-elisions.js');
        // Split Elisions
        prepare.string.splitElisions = require('./string-split-elisions.js');
        // Amplify Not Elision
        prepare.string.amplifyNotElision = require('./string-amplify-not-elision');
        // Marker
        prepare.string.marker = require('./string-marker.js');
        // SOC
        prepare.string.soc = require('./string-soc.js');
        prepare.string.setOfChars = require('./string-soc.js');
        // NGrams
        prepare.string.ngrams = require('./string-ngram.js');
        // Edge NGrams
        prepare.string.edgeNGrams = require('./string-edge-ngrams.js');
        // BONG
        prepare.string.bong = require('./string-bong.js');
        prepare.string.bagOfNGrams = require('./string-bong.js');
        // SONG
        prepare.string.song = require('./string-song.js');
        prepare.string.setOfNGrams = require('./string-song.js');
        // Sentences
        prepare.string.sentences = require('./string-sentences.js');
        // Compose Corpus
        prepare.string.composeCorpus = require('./string-compose-corpus.js');
        // Tokenize0
        prepare.string.tokenize0 = require('./string-tokenize0.js');
        // Tokenize
        prepare.string.tokenize = require('./string-tokenize.js');
        // #### Stem
        prepare.string.stem = porter2Stemmer;
        // Phonetize
        prepare.string.phonetize = require('./string-phonetize.js');
        // Soundex
        prepare.string.soundex = require('./string-soundex.js');

        // ### Prepare.Tokens Name Space

        // Create prepare.tokens name space.
        prepare.tokens = Object.create(null);

        // Stem
        prepare.tokens.stem = require('./tokens-stem.js');
        // Phonetize
        prepare.tokens.phonetize = require('./tokens-phonetize.js');
        // Soundex
        prepare.tokens.soundex = require('./tokens-soundex.js');
        // Remove Words
        prepare.tokens.removeWords = require('./tokens-remove-words.js');
        // BOW
        prepare.tokens.bow = require('./tokens-bow.js');
        prepare.tokens.bagOfWords = require('./tokens-bow.js');
        // SOW
        prepare.tokens.sow = require('./tokens-sow.js');
        prepare.tokens.setOfWords = require('./tokens-sow.js');
        // Propagate Negations
        prepare.tokens.propagateNegations = require('./tokens-propagate-negations.js');
        // Bigrams
        prepare.tokens.bigrams = require('./tokens-bigrams.js');
        // Append Bigrams
        prepare.tokens.appendBigrams = require('./tokens-append-bigrams.js');

        // Export prepare.
        module.exports = prepare;
    }, { "./helper-return-indexer.js": 21, "./helper-return-quoted-text-extractor.js": 22, "./helper-return-words-filter.js": 23, "./string-amplify-not-elision": 26, "./string-bong.js": 27, "./string-compose-corpus.js": 28, "./string-edge-ngrams.js": 29, "./string-extract-persons-name.js": 30, "./string-extract-run-of-capital-words.js": 31, "./string-lower-case.js": 32, "./string-marker.js": 33, "./string-ngram.js": 34, "./string-phonetize.js": 35, "./string-remove-elisions.js": 36, "./string-remove-extra-spaces.js": 37, "./string-remove-html-tags.js": 38, "./string-remove-punctuations.js": 39, "./string-remove-spl-chars.js": 40, "./string-retain-alpha-nums.js": 41, "./string-sentences.js": 42, "./string-soc.js": 43, "./string-song.js": 44, "./string-soundex.js": 45, "./string-split-elisions.js": 46, "./string-tokenize.js": 47, "./string-tokenize0.js": 48, "./string-trim.js": 49, "./string-upper-case.js": 50, "./tokens-append-bigrams.js": 51, "./tokens-bigrams.js": 52, "./tokens-bow.js": 53, "./tokens-phonetize.js": 54, "./tokens-propagate-negations.js": 55, "./tokens-remove-words.js": 56, "./tokens-soundex.js": 57, "./tokens-sow.js": 58, "./tokens-stem.js": 59, "wink-porter2-stemmer": 62 }], 62: [function (require, module, exports) {
        //     wink-porter2-stemmer
        //     Implementation of Porter Stemmer Algorithm V2 by Dr Martin F Porter
        //
        //     Copyright (C) 2017  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-porter2-stemmer”.
        //
        //     “wink-porter2-stemmer” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-porter2-stemmer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-porter2-stemmer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        // Implements the Porter Stemmer Algorithm V2 by Dr Martin F Porter.
        // Reference: https://snowballstem.org/algorithms/english/stemmer.html

        // ## Regex Definitions

        // Regex definition of `double`.
        var rgxDouble = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/;
        // Definition for Step Ia suffixes.
        var rgxSFXsses = /(.+)(sses)$/;
        var rgxSFXiedORies2 = /(.{2,})(ied|ies)$/;
        var rgxSFXiedORies1 = /(.{1})(ied|ies)$/;
        var rgxSFXusORss = /(.+)(us|ss)$/;
        var rgxSFXs = /(.+)(s)$/;
        // Definition for Step Ib suffixes.
        var rgxSFXeedlyOReed = /(.*)(eedly|eed)$/;
        var rgxSFXedORedlyORinglyORing = /([aeiouy].*)(ed|edly|ingly|ing)$/;
        var rgxSFXatORblORiz = /(at|bl|iz)$/;
        // Definition for Step Ic suffixes.
        var rgxSFXyOR3 = /(.+[^aeiouy])([y3])$/;
        // Definition for Step II suffixes; note we have spot the longest suffix.
        var rgxSFXstep2 = /(ization|ational|fulness|ousness|iveness|tional|biliti|lessli|entli|ation|alism|aliti|ousli|iviti|fulli|enci|anci|abli|izer|ator|alli|bli|ogi|li)$/;
        var rgxSFXstep2WithReplacements = [
        // Length 7.
        { rgx: /ational$/, replacement: 'ate' }, { rgx: /ization$/, replacement: 'ize' }, { rgx: /fulness$/, replacement: 'ful' }, { rgx: /ousness$/, replacement: 'ous' }, { rgx: /iveness$/, replacement: 'ive' },
        // Length 6.
        { rgx: /tional$/, replacement: 'tion' }, { rgx: /biliti$/, replacement: 'ble' }, { rgx: /lessli$/, replacement: 'less' },
        // Length 5.
        { rgx: /iviti$/, replacement: 'ive' }, { rgx: /ousli$/, replacement: 'ous' }, { rgx: /ation$/, replacement: 'ate' }, { rgx: /entli$/, replacement: 'ent' }, { rgx: /(.*)(alism|aliti)$/, replacement: '$1al' }, { rgx: /fulli$/, replacement: 'ful' },
        // Length 4.
        { rgx: /alli$/, replacement: 'al' }, { rgx: /ator$/, replacement: 'ate' }, { rgx: /izer$/, replacement: 'ize' }, { rgx: /enci$/, replacement: 'ence' }, { rgx: /anci$/, replacement: 'ance' }, { rgx: /abli$/, replacement: 'able' },
        // Length 3.
        { rgx: /bli$/, replacement: 'ble' }, { rgx: /(.*)(l)(ogi)$/, replacement: '$1$2og' },
        // Length 2.
        { rgx: /(.*)([cdeghkmnrt])(li)$/, replacement: '$1$2' }];
        // Definition for Step III suffixes; once again spot the longest one first!
        var rgxSFXstep3 = /(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/;
        var rgxSFXstep3WithReplacements = [{ rgx: /ational$/, replacement: 'ate' }, { rgx: /tional$/, replacement: 'tion' }, { rgx: /alize$/, replacement: 'al' }, { rgx: /(.*)(icate|iciti|ical)$/, replacement: '$1ic' }, { rgx: /(ness|ful)$/, replacement: '' }];
        // Definition for Step IV suffixes.
        var rgxSFXstep4 = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|al|er|ic)$/;
        var rgxSFXstep4Full = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|ion|al|er|ic)$/;
        var rgxSFXstep4ion = /(.*)(s|t)(ion)$/;
        // Exceptions Set I.
        var exceptions1 = {
            // Mapped!
            'skis': 'ski',
            'skies': 'sky',
            'dying': 'die',
            'lying': 'lie',
            'tying': 'tie',
            'idly': 'idl',
            'gently': 'gentl',
            'ugly': 'ugli',
            'early': 'earli',
            'only': 'onli',
            'singly': 'singl',
            // Invariants!
            'sky': 'sky',
            'news': 'news',
            'atlas': 'atlas',
            'cosmos': 'cosmos',
            'bias': 'bias',
            'andes': 'andes'
        };
        // Exceptions Set II.
        // Note, these are to be treated as full words.
        var rgxException2 = /^(inning|outing|canning|herring|proceed|exceed|succeed|earring)$/;

        // ## Private functions

        // ### prelude
        /**
         * Performs initial pre-processing by transforming the input string `s` as
         * per the replacements.
         *
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var prelude = function (s) {
            return s
            // Handle `y`'s.
            .replace(/^y/, '3').replace(/([aeiou])y/, '$13')
            // Handle apostrophe.
            .replace(/\’s$|\'s$/, '').replace(/s\’$|s\'$/, '').replace(/[\’\']$/, '');
        }; // prelude()

        // ### isShort
        /**
         * @param {String} s Input string
         * @return {Boolean} `true` if `s` is a short syllable, `false` otherwise
         * @private
         */
        var isShort = function (s) {
            // (a) a vowel followed by a non-vowel other than w, x or 3 and
            // preceded by a non-vowel, **or** (b) a vowel at the beginning of the word
            // followed by a non-vowel.
            return (/[^aeiouy][aeiouy][^aeiouywx3]$/.test(s) || /^[aeiouy][^aeiouy]{0,1}$/.test(s) // Removed this new changed??

            );
        }; // isShort()

        // ### markRegions
        /**
         * @param {String} s Input string
         * @return {Object} the `R1` and `R2` regions as an object from the input string `s`.
         * @private
         */
        var markRegions = function (s) {
            // Matches of `R1` and `R2`.
            var m1, m2;
            // To detect regions i.e. `R1` and `R2`.
            var rgxRegions = /[aeiouy]+([^aeiouy]{1}.+)/;
            m1 = rgxRegions.exec(s);
            if (!m1) return { r1: '', r2: '' };
            m1 = m1[1].slice(1);
            // Handle exceptions here to prevent over stemming.
            m1 = /^(gener|commun|arsen)/.test(s) ? s.replace(/^(gener|commun|arsen)(.*)/, '$2') : m1;
            m2 = rgxRegions.exec(m1);
            if (!m2) return { r1: m1, r2: '' };
            m2 = m2[1].slice(1);
            return { r1: m1, r2: m2 };
        }; // markRegions()

        // ### step1a
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1a = function (s) {
            var wordPart;
            if (rgxSFXsses.test(s)) return s.replace(rgxSFXsses, '$1ss');
            if (rgxSFXiedORies2.test(s)) return s.replace(rgxSFXiedORies2, '$1i');
            if (rgxSFXiedORies1.test(s)) return s.replace(rgxSFXiedORies1, '$1ie');
            if (rgxSFXusORss.test(s)) return s;
            wordPart = s.replace(rgxSFXs, '$1');
            if (/[aeiuouy](.+)$/.test(wordPart)) return s.replace(rgxSFXs, '$1');
            return s;
        }; // step1a()

        // ### step1b
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1b = function (s) {
            var rgn = markRegions(s),
                sd;
            // Search for the longest among the `eedly|eed` suffixes.
            if (rgxSFXeedlyOReed.test(s))
                // Replace by ee if in R1.
                return rgxSFXeedlyOReed.test(rgn.r1) ? s.replace(rgxSFXeedlyOReed, '$1ee') : s;
            // Delete `ed|edly|ingly|ing` if the preceding word part contains a vowel.
            if (rgxSFXedORedlyORinglyORing.test(s)) {
                sd = s.replace(rgxSFXedORedlyORinglyORing, '$1');
                rgn = markRegions(sd);
                // And after deletion, return either
                return rgxSFXatORblORiz.test(sd) ? sd + 'e' :
                // or
                rgxDouble.test(sd) ? sd.replace(/.$/, '') :
                // or
                isShort(sd) && rgn.r1 === '' ? sd + 'e' :
                // or
                sd;
            }
            return s;
        }; // step1b()

        // ### step1c
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1c = function (s) {
            return s.replace(rgxSFXyOR3, '$1i');
        }; // step1c()

        // ### step2
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step2 = function (s) {
            var i,
                imax,
                rgn = markRegions(s),
                us; // updated s.
            var match = s.match(rgxSFXstep2);
            match = match === null ? '$$$$$' : match[1];
            if (rgn.r1.indexOf(match) !== -1) {
                for (i = 0, imax = rgxSFXstep2WithReplacements.length; i < imax; i += 1) {
                    us = s.replace(rgxSFXstep2WithReplacements[i].rgx, rgxSFXstep2WithReplacements[i].replacement);
                    if (s !== us) return us;
                }
            }
            return s;
        }; // step2()

        // ### step3
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step3 = function (s) {
            var i,
                imax,
                rgn = markRegions(s),
                us; // updated s.
            var match = s.match(rgxSFXstep3);
            match = match === null ? '$$$$$' : match[1];

            if (rgn.r1.indexOf(match) !== -1) {
                for (i = 0, imax = rgxSFXstep3WithReplacements.length; i < imax; i += 1) {
                    us = s.replace(rgxSFXstep3WithReplacements[i].rgx, rgxSFXstep3WithReplacements[i].replacement);
                    if (s !== us) return us;
                }
                if (/ative/.test(rgn.r2)) return s.replace(/ative$/, '');
            }
            return s;
        }; // step3()

        // ### step4
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step4 = function (s) {
            var rgn = markRegions(s);
            var match = s.match(rgxSFXstep4Full);
            match = match === null ? '$$$$$' : match[1];
            if (rgxSFXstep4Full.test(s) && rgn.r2.indexOf(match) !== -1) {
                return rgxSFXstep4.test(s) ? s.replace(rgxSFXstep4, '') : rgxSFXstep4ion.test(s) ? s.replace(rgxSFXstep4ion, '$1$2') : s;
            }
            return s;
        }; // step4()

        // ### step5
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step5 = function (s) {
            var preceding, rgn;
            // Search for the `e` suffixes.
            rgn = markRegions(s);
            if (/e$/i.test(s)) {
                preceding = s.replace(/e$/, '');
                return (
                    // Found: delete if in R2, or in R1 and not preceded by a short syllable
                    /e/.test(rgn.r2) || /e/.test(rgn.r1) && !isShort(preceding) ? preceding : s
                );
            }
            // Search for the `l` suffixes.
            if (/l$/.test(s)) {
                rgn = markRegions(s);
                // Found: delete if in R2
                return rgn.r2 && /l$/.test(rgn.r2) ? s.replace(/ll$/, 'l') : s;
            }
            // If nothing happens, must return the string!
            return s;
        }; // step5()

        // ## Public functions
        // ### stem
        /**
         *
         * Stems an inflected `word` using Porter2 stemming algorithm.
         *
         * @param {string} word — word to be stemmed.
         * @return {string} — the stemmed word.
         *
         * @example
         * stem( 'consisting' );
         * // -> consist
         */
        var stem = function (word) {
            var str = word.toLowerCase();
            if (str.length < 3) return str;
            if (exceptions1[str]) return exceptions1[str];
            str = prelude(str);
            str = step1a(str);

            if (!rgxException2.test(str)) {
                str = step1b(str);
                str = step1c(str);
                str = step2(str);
                str = step3(str);
                str = step4(str);
                str = step5(str);
            }

            str = str.replace(/3/g, 'y');
            return str;
        }; // stem()

        // Export stem function.
        module.exports = stem;
    }, {}] }, {}, [2]);
