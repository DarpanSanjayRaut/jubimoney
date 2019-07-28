(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a;
                } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r]; return o(n || r);
                }, p, p.exports, r, e, n, t);
            } return n[i].exports;
        } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]); return o;
    } return r;
})()({
    1: [function (require, module, exports) {
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

        function noop() { }

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
            let passphrase = 'eb8f5aea-a2e7-300a-b9df-62721352d579';
            let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
            let intents = { "ct": "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", "iv": "06f8bca67d7a7302c6f1c2c385615995", "s": "b57d63964b215004" };
            let entities = { "ct": "icbEoR6RjWszQ/xHte5JcvZDUI1hs0UrLou3QFLXGB634/U1rF5CQOsc6lF5SfHb", "iv": "03cd1b24313f1fe3e0614fed7cafae99", "s": "c2891bea57229ce4" };
            let flows = { "ct": "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", "iv": "300c6158399cb40fc8453f0ca7213909", "s": "afa59b5cb091c165" };

            let checkUrl = 'https://parramato.com/check';
            let modal = window.jubiModal;
            window.jubiModal = null;

            let backendUrl = 'https://parramato.com'
            let backendPath = '/socket'

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

            let directMultiplier = 1
            let fallbackMultiplier = 0.8

            let timeoutSeconds = 1200


            let strictlyFlow = false;
            let humanAssistSwitch = true;
            let voiceEnabled = true;
            let cookie = false;

            let speechGenderBackend = 'FEMALE'
            let speechLanguageCodeBackend = 'en-US'

            let projectId = 'JubiMoney_788585788275'
            let attachmentUrl = 'https://parramato.com/bot-view/images/attachment.png'
            let integrityPassPhrase = 'hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
            let localSavePassPhrase = '8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIJubiMoney_788585788275'
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
                        } catch (e) { }
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
                    socketHuman = { on: () => { }, emit: () => { } };
                }

                try {
                    socketUpload = io(uploadUrl, {
                        transports: ['websocket'],
                        path: uploadPath
                    });
                } catch (e) {
                    socketUpload = { on: () => { }, emit: () => { } };
                }

                try {
                    socketVoice = io(voiceUrl, {
                        transports: ['websocket'],
                        path: voicePath
                    });
                } catch (e) {

                    socketVoice = { on: () => { }, emit: () => { } };
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
                    socketBackend = { on: () => { }, emit: () => { } };
                    socketMiddleware = { on: () => { }, emit: () => { } };
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
                        socketBackend.on("web-event-register-" + webId + "-" + uid, () => { });
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
                        socketBackend.on("web-event-register-error-" + webId + "-" + uid, () => { });
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
                    } catch (e) { }
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
                            } catch (e) { }
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
                                    } catch (e) { }
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
                                let output = {
                                    intents: {}, entities: {}, top: []
                                    //entity extraction
                                }; for (let option of user.previousOptions) {
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
                                        } catch (e) { }
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
                let delayMaster = 500;
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
                    } catch (e) { }
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
                    } catch (e) { }
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
                                            invalidate(() => { }, true);
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
                } catch (e) { }

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
                            data: {
                                text: removeHTMLTags(text),
                                gender: speechGenderBackend || "FEMALE",
                                languageCode: speechLanguageCodeBackend || "en-US"
                            },
                            webId: webId,
                            requestId: uid
                        };
                        socketVoice.emit("web-text-to-speech", crypterTransit.encrypt(requestData));
                        socketVoice.on("web-text-to-speech-" + webId + "-" + uid, data => {
                            // console.log(data)
                            data = crypterTransit.decrypt(data);
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
                    // $("#pm-bxloadgif").remove();
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
        var hasProtoEnumBug = isEnumerable.call(function () { }, 'prototype');
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
                } catch (error) { }
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

            function noop() { }
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
    }, {}]
}, {}, [2]);
