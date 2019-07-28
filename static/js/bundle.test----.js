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
            
    let passphrase = 'cda8cf0d-bd1b-3d7c-ab1b-d51f385878d5';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"vOkkP0oH2yOVyPYqRC7FplUU/5NbHHa5dFQBG297P70Ym0GVU6vdeyrr/x5HuosXbZSGEEOHFKwP6aG4zl1vwGPMYJLIFYB7s0ZrYk2I1dqRjdUE7YCpu1XIEadkpMjUXqM4GK6Fixpr3LubB4GBAJ90UFQkAQa6C0vR3UMf/UMwcvlU+Bso/4ulB/UQhIutQ5MCU+UB4bku9rp234CtjTPiKXJiqm4rJRwuHLEVuz5w2f/UGIBvqQotezyxOjkZotNR7sAOLAmN8iFcgWdXSJs//TbZuu8lnL3pCxByJJc2rEu4u79EI0SC6LCR/XZ89fsQIXqGUg+osTf8bvqSdh5clR5IwGtwW/BzUpgcepkbicuN3rtfnCBpZGdR9LQZdeIxtL1odR3PuwSuoWCEIxth3DTKQlPnMBBSuGeeeTqjffOSft5XAoe3DuzZjTW6h7GfE7XshdkBzHhh7q4jsKW97lArRwlzeA6QYoExF/ip1S02EIUiu/8cnMJYVpJZw7nx/94gS3djPB2nZNEwBpdWDilsL/L5zuvQdq9so52iB+nPJJlxlYenqcHiwKoGwihHBhRMlv++WaHX3dug5VFvcfNxHbiS+ESDzM03ge+8Cw2/t3cpRZnAfZ3pE5KE2AiAiQCsDjiq4SFXuwytOk4LMGGr4yCmdJPoyPDD6OK8+g+R3nlOBjNHJZpBLvCD23SIBqH/WqZ/YUYDejyGCeNSqAACHYRFqvAut6bRSAzoGvHm0A1MbxzBFnS22SOScu9akC6K2B22yJD/fUdPPc4XcQ/CT1Kwz3bFfbPcVeaxc7zjzB5m1tKYC1jamC36MR55BA33pztQJ+KH6JHaAF4Xz1Ylyz14K6rDmsU0VLHup4KMqQoYHqcvzWwHf+bghngQicTWwcuUBqq+j5XVx1lpk+ahp0iWbhzf0l6i+kn1z7+ZFBF1AcaLhfjK7B4jAvHpMmL6h+n415P/4oI74d5E7/MBmWiVeV1B8ug4nnAWa0Ka665VfV+encljHDljPEmOD7yerNg4psePDv0wu7zypRnxAQxC2POfesxEhN0FYXhkVC9BUVLOw2Pf5ReUZl5vgFDAbEqkRmgJfvUi05I/8e/rEaprSQujh5gnl1bOHPR/2RvccB51+uI7YKN7lnQgSVmNU+wkHCpw8MFRZWgS5qVyzq7pORJodGqXAKBesQb4YXf1l5QzD1jj8mTvIVGAnyzc3R5Pq7Q9H+Q3Epy8yKCg4fzYbYPSL/9fDja9FNxI4JnnayFXSNNEzQbjzMNoGDstwsiQy9dfeCDO/AXNHgAWILxmyLL0c6M069U1Ps3owLbvFV+znXdWXvwW7PN2hORNVvoXmMtOY4oLX8CxH0BHlSemQ5cled496v0KKf4dVhFispLdKk6R12isGc0+CRCd+M1XyZbNHIVUHcvHN1U/rRp4lZjMtZyztZ8XcVAZnDr2pC1zZloYI8knhcCw6LNDOcQuV/hBUoqcEU80jJScn7iJ41RVLoJsGz3iSVzz4HG7hwT4m94qwPyv0W5E38xpsKG5sEqfkborZyBXmHIBVv+YQYnWAeFiShyWi62rnpzkn2CshaNZab3XeOr1YtOHrBxuNfD2+1xOTGcA/Eineyzq8KFLcvOa9GUOMq58Flu8+HuigiIMfKARh8L2RTzzCFZ0HJQJauonaq4ePm3g0NO0k26iqoc/+mUQH65ORL99mrE2EjsitLZYjKCfaVFcLyKiofvh5XwLNshN5Jc7+lZ+307+odLP5HwsBqcrzeQsnAJJ367ZLS1K8dcL1z20R9cRbwBnbQjatUXYsh6gmp27OiNW+OTAJ57Chz7Hnzy7LE2PhuXwk+TeKd2xhss34fRBs6SvvyroD8hsrJUvtva1nq2YTKMNz9iRjK0ZsfR9N5E17uFNOAagzh7nVoDTrNTpAqYIl5KbB+f3zzESiSuzILhGop4uQwOtl/7xKKRRpL55zC0DZGcv8AMFgbup0e2JQ+yEbrocrlwS9EaDouoqi2nvqTvRG0s6qeq3gcEThV1oz8EEEwJiocooMfi+373iIq2FtEg8km4gJQE1dtgkPhX3vwkc9Pi1SzUOaXOxtX7AI6VAEirCX7WSzF9/4VmyWiMBtOYmm9kIZCid2KZowJG46ly2Jkn6rhHKbsSS9AECEYwf17cqof62W2ABnmFZLhjQUxxNbP8fS0CKGAmxqlh5hQWMeK+LS6NrNaWf0C7Sm2dG2CsWt7k4o8P0uTGv5OwIiYmd2zyPGnUgoykAErX0qcmbu+mNgzILLqTBFE/bc3QkL0z0IcS8oTNsZOgXNf9R1td91YHVcfqFMAwtOYCoK9ICb+sy1KzoUPYyhBpqDDzaw6OyxOnj5cCIDzvSOC7TykTsHiWSdqcUedg++FKfQwidc3aq2dR9Bj0U8Y5np1AIEdnWBTm8mx/zjDlRb31mMetA/fXbbt1VZVg10cFGjTRHcZbkqtQzRjtftClsJhBgtFmcbrgZurBl+a8hwcJobSztJACXAB8ICowy4FZ8KGlbw4q/i5Sk2oumMD8lz+HLrGoINJC0bUt7Z+ztC6QIc+HnEHAmqcqqWhn6GUaCJLDePZ+Obr3Yjb3msWCFyAYkhhqkXrh/OUDz6ppXpiZ5a4hULAP9n8n0VMHYiAs2ogsOsXBY2+I/t9EDkD2JCTitNXyt/dAxRFITd5QJ7l2OrGw2DgT5p+uORSSR2K6/2Es578sJLqxopTFmyyO94w8vSsvM8wLF4FM9WKGKi06pyr4H8bYKNjDG51CV7kzzxD+90MsgJRRWZuemk3a50JHhV6wNvs1dMhzvRpBiXfDTP+Z9vJ/gopT5e4FHpxwhodUZ3vFXJn6+Y7FDaZJ6Q2IiqwZVlMKOutfvjt7at3wVaJNFn0RdF9U/OeEMZuQX71pSlwTjZqTa0Xnwi5+nv3MGGwr7YEDhi+rQ8SK/uYGw6KR4sd8h8VJGe47fyOYwJdprre9IUCDnLZYDlX3JDY7z7i/AujNJPjVdf5ZiUuQB7dq4h34kb0++bvNn2bVLxvs2eYG0xVAWdKDlRTDH+Egkx8+vgVW7BseVFEsRg7xr3w96sszYpr4MdqeK2gKtqhDIaf4rfmj00nTiEUKzd+dxwPtXCbKWRgRObjWmfOTUeQafjnZPJw8dC8cwePqhhev2AK531QK/rgsclIFfz2kipjs+ps9/TkbRPTuE8RgFh0fVj6SrOx5CA52bMkR/z3Ca6BveMT7g2Vy1En/a2s/QhAFT9Wh981WpM3GyJVsmDCEqyFXIfEVbonDv1bPdp9yjBtvww49v389keEJazwV1dfG+MoCf2AXHH5ER8pI/5hq/MRflrRRdCcr9iUZdhakdppK/xB7RDIuILV8EpWaOFVhOd8aIyZqKE+hYv6Kghr8+3KsUh8GVmzzvfMUWFLpLkLBrOYn4TzsGVTwUg9i7AxXqBb9wt3Qx8Aj8w55yCTS9ck5Fo1BaQeDkPQC4mrIF/tESVjIePh2JynvQBQP2nQgM2Nl9NgVY94Qu9DkuBBy6wNTd/sIh5VxnaJGDwZwAWO+1i0io4zXejQdfOcCzuFb3YglpwFls5Q3EKLBQJrXB72/KySdZRP82jgGKJl6CTSRdWh4Jl4SAR6Zw1Q0I3cVEN3vczetSkMfwowtElAoSXzcRVvpBknqADjVhgsdJk14H1zMNdPgjnUX338yeNS/O/jOteIAvIA4FyB/gWzftd6xqkm4L+hxYC0jsIfDJi0mRNKl5+QNoae1diu5PhdlSbFUZ7sAsmX6aB1QYwftqBGXqTo0eu/78fQeAZDSn6fZgZg0OH0s/GH5WpGqj/S39q2VEHne6IQo9s8p0TwUfbA2VfX48rzC5F4oCywfPml89kKe8Rvd+AUvepC6rS+Q7U3DIqqw1lZEZR0UjmJaSxVYZjTNqvXbGvNVMwIDL3iJRkfzWZ+P8HtCoYfp0dxaRxAFeVwwaryqAIcTIAjMFsUSUYuYCzbnG6eUugLYinotJaUobldekDkDRAudUBBYXcA9dY15sXfwcj2L8EttubLy+6EnJtU2O0UlhzFcmuWTQKWqnaTF8uqy1euSnGepk9Ley/CI7cSy+VNVTPo2ltKtw0LYz7e6pDFF1l1gKlQ5EaBF4SeOMLAjDzyehRIPqahLPw8LD4ku6LxGbcHshcCLExBNf/8I4DggkAaMb/xQv+4GwrRVcXVzxqMEW3qbdARkt2Ee296O7wx7uLFNIVrFr563bYC9eGIP3RQwgxANkiyISHO7mBNxdjbFS2SvCSf0zyG+lMUOBOJmBUOShqs693dp/uEseb/a9L/tPBMvXyuPr9ULjPQAI+uKHTRKPiosS16znsM4yfTx2fLPph1Zr5QSlRKbukJFK102Kb5cZLDAyqzz2BeZseAsACiNSWDZF27VgY9KsHngPY3yQxSRc31vnQZfmdGp+bzcbauElkVlpeb205s+IEWaXWiOMS0gQG3xKP0bSG56EJWrTKg2UU7GWQNoQjE8ASbRjXw9qw2apmT6ZGiXS8izTqxFamU3Bffh9pAaQbNreTPs+tAfMgpIr6Kp8cDC4XFobRib83xwNMZyLRv5W5ef85THdNkokNdjQmPNpAiuDAIWyovjcku+VgEFKHbKA7zSMN0HCMXd2OzqRmdL6/WmFY7+CUCZUAcvohKviHcy0syHAaZH5abMfs0vKqKkLdMa6ClYTYpq/kTmT3cBQ4fXLqqleYCwZuWtSLx3d1CYJEOXRPsQLy1qaHEwVg0dHNyXlDL33St0iDHWYWW9CmIeJdD1SBbEYjoEBbsha0dhPzoVOnoKJ/RThAYfwEP/XP+6FhjEUJfgvRwrqrsKmJXyt0z0RgunVC3OosI04pOgRy+lE/0L6/uqfPkhCBe6LPIb0Eg583YcLv2Fqlau2q0CGZRF+lK53tw8WtUEX9crYwW3ltrdpBuUQfh06FS1Y2XL/8ncA6Qt2cMmybIgSRSjXuF/jDxKdRt68AtI4mRxLTH+0QM3z9n/od1LqOC9NRffXTRq8JlIl2/hjN62B8shl+tvmNmnTwrqgQls5bbOxLSCZFjMccJP8iUW5ZEKR94+pyTz7Ug4QoN8eBTu5zcEaTtoTrrLnj9TRceyFFLbHcm8fVnx0ZT2Hh1CTP+HkvoU27MJh6eKfbS5gwvGzamjIbFt6AE7rQOCwmW8zciIjFpeVOEB5hfsYZ3fWcLtKiMZXT6LVHpbG8l/E1JHb5cGQ5BbRrNuw9FHMpBcMn+qfCgOIIkRJsXkv3ScJnMEfnLsh/LioF2Nig3rbO8cB48xglO5Vsj0rcs7NTz82T538UQtnLZn379FB9v2rdUhVAmRYD82zTsf0xEzckJDOgJF52dnrPAgP8h5iOHuK+KHAogSiLs3sWoolKF0xsHKhWM4c7dcChUJ+aIPUShdes4DRI98RxOC8lmsXv5nDvNe1xlc5h3orN67Jzk7embxtoigWzNv9qls0r8ZfGHnKw6BBQcbnEiPahplsAxC+emPtmcqcXnGxF2+zElFKfCkFj/Cl5Wyki9hKIz5UspObynhC7GtaX0YnZ4QkJCCumj8q7VUkeg5nsFSW9bOD8DYNhrfvKoXHB/KCd5xeVBq9gexbPFGrYJd+pmFwaUulOvdiDAYr+2UBdQYiKQetNqp7yBtR7iAwCrdqpP9T9KOfBjEoj3+Gw0MEwAmienNXxbuTpyGt6vcQPZadHjfw5olcZV3g+rt4HcXhJxbf5WZFlbNFcv9kYzoM9yP1AFPhYmz3YhFpbh1zPx/fUwT9BKKDEcMrhL2m6uJtgEx3Ngk8lwBgk0l6NNfPg78mWP6/dFbtceBLUojqgPvEp0+4RUzuN4sS1fVTd5xZ/Xunh3T+T7p1lQRgOKd+FwL8qLVsxRBhqSSss8B1qQcXas+c5vpuSL7/1JcnwmkDYFcFdqEs+AHFHqSgEEigvnxZyXB/r9yhqZeHBybbF95h6eSa9syeTL6v5n7togHh2wG4b65zjQkWovFFbF7JML48YRKqae8m3M0lBGpGLikhg1i/bOb99MgquGoSBOke6tNvzzGZY1L85Qw3ZaPi+HpY1tdiLz2FP8OgFt3xkFxIpOLDtpN/VHfiQ08ww4qXeGy9GigFbxljSQUyaMUqFgSgCZUBsB5+ziBcMnsiUNW4bN5dUImvwGf37Y5yQrL+UjxCwLEeQ9Z/uL9B/mEhjVz6+3XbxocPHrClqpQEK0NzqHGVXFzmPf/0AZV+2TvuWZByR5nc/K0jKqH4EoPtiG2ixhPpkVb99Ql7kgeAstMiJH9LKMQt0WxEBbu/g+1P5XdgfM7F+/AGfQJ0sim6u1Rkp98L9hFa6KzqCiWDGcKz8+8JRMvn8/u182LQQeZQ7Uv//NAGgcoImwoQLZ8WhB4Uopw2PQ++LH2//AywjLc14/xaLRBkd7c5as1LKAKBbImvD8gvCgBj1jvDxQnGHxP5kDxcdEfd0DplHHwy/d0k6RAHWUMJwWZAPvrEECrsuIBsPfAY9IsV56qwp6M2TxhEWsKTyh8uwkgHDRtRI6TB8HcWlwLaVzwvorCq5W0ekBme1xUiGGmMeUVJA4LeczokhFmQA08wdLK1osgOGl63+0Zpd5ftFaGeXy6IRQjGPi0PfZuxD1U94Kea5Bz5+hDT63C5HHZLMHOptvCVxAnwcHkInFzYtA3GwKzYTGIrJ0t1deJpeiy6xrRA/Z3K0YbfFBTqsXy4HAL2iAk/+LcfJkRGK/rXrHMV2Ay0h5mXtDwiA7PySGH7VOvpuH/p+MDIkJHspO1mFWIr4CCbCorko+HUU/XvTtKqlQwrIryQIS22U1reENfzPLvB+M32tH02zYkc2jUS730u5TSWAnYVYk4uiDboAe1DedEHFbgZr+sAszI+DL1nx/Gfl8WorYVHodnVz5SkD29rLvp8f+9sjf3zABOAXrQffyuHak7rFi/2n2HPxDJeohZbHoQfSrHhuzp5tSll4peq+WUfN2qcjOuWzvHgvtvVX3DLXIWWJgCB8zOpy4FOe7qXuhe62EZaposlK1yRsBYSKzf/1tvz/ryu+gHOXnAB2yX+ktwRYcDkk9MwKczvL04fAyqLNJBo6xXcwDcMpYYY746Tk8wppyRy+0Rqf+JlMOS/tI+RcsW7W7KRgzDopYmdRGVyzlYWSu0CiN8/w2qxxuNVuacG3vMhhIxxGuFHZt2p1mmXTl/5nU36zdp8smBngemtFMRDSVtc7Mee61iPCnYH5bCzmqlbyUjBd3F16z9TEmLrzoQDW+bp7qoywki2RjoUVgtrCMqtvuoUx/MZ4eafpZfpTGoYf9WphTMjPJJcFIez0aFDhuJpY2k+6vIjthg7IrwH0lN+O5GdeNej09W/SGUE+hQs2l5zf9k5kne//x5y2BQQR9X/0RfVKeCJRh2Ys3t4qFsb923TYOiYZU04wQUTulyl+15gM3RZpD06zxVxKSB1EUxcS9Qwxzx7A5vkJHM+0U3Ny+9fU3C4vDguE3GSKcjXJ8/7EyV3L5+lwV9qaK80reINJkGoRDxnRa+KlyF29yLDktJzL27ZYNvp4IQ6HHXe0c7OTcW2vlfNf8O/C4g1p4a7QnMdCoMreTV05naiwx4aO+r4XP/gosAdRXKT+9Lc3gd48i7cVHFJnZiZ52eW+xkbVjfMuGV/KRAe/FLXJSglbzoaX+Ng1NXJa+Y+/9SqG+7eb3EIan2zSPrS8i8tRrW8dkM+n5ag4NFEL5e+4nsjUnaoN2yHtVn8N81W/llKBo1jmjor185Fs1kqVKnNzeLG0s3A+R3jfaKGPlPcCHtO4O/dchizYdJyyvezXBgyCYuwR0+gjm+x/2lS/89FVm0GSszS20utrI/oA/Ti+7QkXslOGyTkwKipH35HHYYArh4IHzpiivev6pUyX9QvcIv2nDbM1Q2Q/0LosndPkhHKAco++I1K0O24M96P/HNQ1H217m+FCJZUJYxU6E8e9YQNtZituyb9WojuMpp59NfDn5cyMzFz1RSoGulFQEZhOvHug6c/v9tszEEXqvPXj/I/EwZToxp24zCO1gpBZ2w/xA1mcbP80A1Xso5MVkpqzlT1+PDIPlF8+sVKvtCPsNtDHUwjvIZG41qP13c2bm7zwIkHuS0tAeYPSmNLFNRdcwFwA08CayrdCy1Z3sP6t/p02+rzu5ChntQ72z4pboFWtN04JXpDpQWnZ8C2HeH7tb1DISFzqXn/Ph6vYhPbs47hTt21V6GsFLmL4X+JSbzr9OTkwDwHF9bP+QQkA/FgmrORpQaSjSEva91QUAYNk4RR7Xs6yg84+FrOHNWtl5DTYNhhh0b/3gMipwsxXqKERXqYJT7kpr4BsM5rYzf5brL/EwPWpWFrzEojUcp/Qi3XfxHBN/Z3catyJy+6zNQeii/uUMPGVt149+wzEi+t6lY4HkfbpbJALpDzjwya7JPvQ0uP0TNN5dWMVa6nliN5dcIhxxE8ZrDzrmteuf1f6dchxaVMs2tWk2kyT2vkZP9Fmef0DRdOEpL0JSupCygYXFcRNxA0gImmEYGn8wBWh59gACmfBESCp7b2klSp1641cZvqFlvYPnBpELZVXmtKyszEkpPdWwHgChKhxeSK5U50R41AkS5PL+oMfkxTWk2ZIfWsjCLEXR/ol/nxc3f/lw00IVH6xdHs0B1To4MfGzgKa53gZ2pI4rKXLFTpApy2oqyAbioUGWy+pKZ5pOyolProRY4gT0NxlJV8ewJwhzs+F3eyTpsyyPJF0MJWoxNM8GQDDgjzhkGvT16zLdttLXU6GLi3b+FXYzkQIOx5iArua7RB8ZSZjPbzdra7D6hMcoTCoYITV8WwvcHw587Z8Do/3HEiastRIg6d4QjYhfgpIGD8kiQsXc8oYA+bemOTO+NFEMNNrqqkR2Lj1cgbNNEZn/fCve2FAFM3Kngu0zkDm4v/JysMKnKVqhojAWcPNA8cOd7dIITNngoFtrBS3dhdNgqDgg8yDFg2UiVO0TFKuwbbXI4C6RXjSzPJFcouQgUSpZqycORM7l+RukDsazqHlwTf4QxhYPRJXXfLmtFnSl1FMVTtGn9na8k/xH9TJyo5wQ3EJmX23lynMSI8vOS06msU46Imp4JKIs9b5Utr8K+9zM3AibjnwJ8i4Nfgjo76WeXVeu8sTZTkVSaLkIhyPzQGzUjKhYKkfBlZHYJsmVOUBG7qiGxLnIQFcvlmrGm8Y6jeJEr41OxeH0xbHaiv2wlvLoXATrkDCP0IPM9IzgFDj17K67bDxDJNeKXaM/8D6dR2jprU4CKmD3Q4sCfp+3Qd7DGVirHmZohUuQ6ANQj+/2/f1pqnfNC8g3jFUEnT060T71EYLdGIqAc3aupZhYyySmF+pYJbNyZQ5FMLKbNd9OH75tpgCeYxZyKUX5d53k2aLAwUk1F4+exU1NzwOh2/YknhSnW2DK5Ns57k/VSkkMLcqoQhKLo01ZilYUsUc+8z7OcqV1twGW7fO6rc7MV709+1YgalcS486PpaQVMzqsZ1WsrBre0L/dWPjArW1CyTX0nxDXh7rsrA8huzmQs9IWv1MRMJcGSc9P0RZ8bxcVE85eO8vLPs8zDLIojMz+JMX9piAX6uRLF3md9MXTDqBjtl4RtDcniH9PGYMPv6+yiI3+wEjcwKDGf8guDrWczUcg0arnaopTJigdmc/wGgOIdcS+4GV48PEaV/8ztLFBJ+6ULW035DgdDGU1DuDniZNw4gjleMPDd52NiuYcEzVLkM1sP7fiu4DwMj7Z5RxQzzzskAskghLvEG9NEyDKr5lk9CdTjiEgDjc01lq7d/zXvv4l7l6Gz6G7QPeCZktrpC8cr8apVxWkcfkCO+/ipDuxNzYXXdF/Pi6H1RYE5obP9KL/yfZ72zunRQoU1nvPgRdsmmnizIJRxnkwsmx1GygrPXXva5RwQdoLMX7YP3/7RXgNMzXjjsN0oKCICb3P9uqsiH8Jz/CylKMW5CJNXTk21qMDqBYz9vGfPk6IWogVo7WQnNEAhJfRI7Z65IVt8uuYimyrsi5uFhlspIhSL98GREk2DHrgKtyT276diYhkAESxQMUJ2IONsgVrqfEuE94YW1iBR2UkEXuv+gp1UXY54ajKZTVX8zGZGHFM2HTc444vbN9DChVsPOFZ8wdlv5gaRPnS/RJ2+fUFA/Pu0itSMqVUTCPn9Q2vvlRwEcCPHoPMTw/cjHJOsXFtjcgQzZeZN/GR5uxZyGLKSxbqepqp47FCawK55A4PlRjNvqgPLc8+5omUhjN6I6RwqVbt8jvUvZEu+3yiy/yCHBjF13lcRmcGzK/++pT+sXMbgFHPGIVVQnCOD1Dwoyyz1DRGvWr1aI+dR1hCQbbIS3KDytkkAZ1+S+x2FUPXqE5XGv3Cs4jQQVTZmO2NRAgRA56sEojMnWx9kJFSH6vDezTJZayq5dLWBcktVjdrZ2FWYPYl0M/d4n2Pa7rO7C+TXtSmqp9WLa4sv7TA+HHyosFOc4L+M391a4TcYqae8//uk++OPwrkydt97ESLjOJIuDKGF3L5dNp/xawRvUofXQrgktdDOfpOEoA/+SW4ypQaLXBcacAmXp6HZM9TmvkkWzsQSwDOc04VQGgO5DgMynv2LQNGuH4xK/Y6tQPSIauOM78Hc3qbPsRfib03z1TW/jH7zFF7N8mOB3TmuuiO26vaZc6Nsc2Mb08Q4tnXIThcxXUYD2XmsfkJzBDP9NqkQrV4G50qh+B8vedPyjTcxtj+s3dHaIl91BcnJbPP+v979eUhYJnYih8RB37Ekk0D8qxcS4q9Mpp80qibCvUz5eYOhX3bZ3w1YWtCZK3SLtdHBnfhaNMbLyiovWTRktkPynEu+TI7oK0/lJgSvhYg8TUuVK4h4aZ9yGxmxKt18fQRCRwE6uJB6sUiQHPke1cwPZyd5FOMJCqNEbZBP1y2XIR1XkC82qA88JOwJ5l9mwieZ83E0k046ABdW1WPaUjWQ7KhQkz+MeszCJsCqO1JgyeMZBvoV/knM3LqvYFr+Wspb0Rbd33f51hnigugPcUNByT+eERt7/zxPS3mJahfDi95q9khqNxfd7rEo77f3muWCZj0LaJ2Fp5WJnLCp7jpt+KN983NWvCbFyGvWHhqfUsopHcWRZzi+Nhaw5V4T5rzdTxUFmWUh1GjFw+XasXUlhr9KpLqnTkGpmYCMGMSKUTeG1t96BoxN4Ox3vrdgY0I6Y+8+rttbscVkGCFwyboF3SajjY8/ZNChK8tkn6gEqcKM+1UBNTTLdcqZYxpF+eABgItr7DQUqi908MVO6JqlUR0dEBXnVn3tda0eZJsufqSQ7Rjb3PLL/aTjcnpEzLQFSuGfHFozXondWKz5KM0W1NryoUpfnU3UUQ0zidlN5EUSzZWdGAHNz5WSCkwtxf73QHzetw/x2tYyPdhCC7iFRRGGLOSV21RJxOokpY7zDqYUU4qPJoIzfHjMNZqtNdsYCGMlyMAwb186dqskKMnc4DkNfD9XfQSD+QSZ81w7gy9fy/4D9/CyhYq+JB7PD3a6CXNsAl9kEanMZiOCQfCsWFDxGM3JacY9EB2jTlx5VAkBOrjrW1xkD+SjtxrXhPk+yzi3T36wTyWPHOfXK6Ry9WKyHxGDAiniowO1SskAeCzGlF+ND1LgvpLpZ6s7OIAn78saredQosGOA/Gr5Q5XWROhzWLO6RgkKzhu3NwHujP/sfdzbeYlPe6+B3f16JC+Xfo/wKC9AhlX6nSXOIrEIoqxmkqN+DtZUWoW7iYc5AD/FDmUn7I+6fC4HPhkezPc7YC/1Va7unvjVg8ZghesnnOV5a4R8v7XKgJYV7H/Ml/u56vhZ8Fo0WbyBzINcSSLsUAcCQ0Jk+d/aPyyzMlJaXEyxWri6T2IQzOAHLMG11EY/kMBjBRM2Gt4uc8DZTlDjqMLrUh9Z0fIWaIXewKAUJhRvRIWshhn3tdKKiawfMkuqFcl56pn4zB7hWTVIelvJh8W+PHISol2PM33lQGxRBIZMQHoQQpeUpDOnpJQSxu1hYjLQX+Y/jG5Q3tOWqNryEO5va8x2qhD0mKJlQJu1A4XT9qnxlLDsDP5wjjM/8GxmD3NTD/eGeD7uTf5pkKnpyC9Yym0GU4wPV2mPBEa4l4HWuRv997lJ/i2H8eVcH7+Gc7+2sW+8nZuFeHJ6wlleUhUlLTP8j6E6kmTeslls+38zQMupIhvjtS4JrUbH4ooHKWqycSXaYfg0CFFno4jqcjzYwCAYbPh3IJ358gLjpWZ1UUo8OkkAxaOhR1tRxKau8GRb3MXQzZCe/JUUdEdu49ZuMTGqX9RtVruGIa78/LbPnzYmt1/N0Kb/uMNH7aZf+Ug2ogdAUdEE+X3EG2fcZkYdp+PT6TUcWDRYubGRKESy5ur/zkyYNPi+qeIkaj6CAqPWdwxk8XU8rekDjuPLRUpEA2ZjfHgpPAKVSKNQwM/bIOtx7BSnJ9gsjS9xJLmb+57llDc0iGTTn1ngMI1lW6Wev90O60yNZvJltM/X2ZxBFe9Cxm8aeNpONeySyRm/D8XALiYSADg5aSroqks4VGAnFWgmQYRYTLszf/KzLuQzGdB3hizXbGWMXbYa64t43eShnQ5nlWOnT14e4Ctwh2OuNntDNZ7gzMU/4a5dWMQ4PcgztX3wvVEtqYFi1O+3SeJtLAUmM37lhAB/Md9Rv4tl1yrVxMX/64ODagDMQc+piHZYJN5hM9JBNEhboyLs+6kEHlE2TBE4y9z/e6jr9T+oCx3G87ifnk9i++bYHRAiLgBDq8j8YHYL9CaroNs7l9ezxjJZwSgwX0wgWIo0DILuF5XxcBKJiLmU3w/eYoGmF//9nM5Fa5yF1c0yCi49/eubxbxbLvUUhyyQNfEUwYa92jXTSqlfFzcKmYKzxUtjX/KYVDKnbSDsbtqx3EEZaG4XuAOQRcwsLXWxCel5JcH4cB2TO6vsc/CRspJL36lrAyV10nLs/EhyimFGIfcaFOEJCZxaUyYCXuuXs5vkzQ9sknLNs1FOxd0ueNBHFsPhAQ6RjQ2YLsFWVPM1JBTVLiy7/YTGaPP2wsz1CXH96NVf/J8Ugszye4mvR4/tIWSkfVowuaE+5xu48djj5hbWMggxTXBMNruK/9L5VnaHVpy/g2aLdqjlA7xR7M2JKy6r1DLCvlbEwlP51Q0Amxpw40vYIVl+NhDZ1igJlReHF7CeNQLpOfE+8+AjVJ91rHMxUXoHxGoWsKmF+hiq4m78ED8kKkY3kqsYXaUroghdh/xH3IwwH3gutj1XdHIq0foL2m4Oh884TjfhQkrXTSqpyiLtYnF+kWUIvMoEsn3lrT3O+gTJP3lI362HjmXxx5+0cDaz7xQK331UDTQufAoIgOS7hSEr0rnVF15twk+smrZTxOpMzN6vKJqUZ9gVjpGk8pPuJQARkqNwoamk/GQu3OkB9dry4qn6AxylOitZkK7OAc5IP3z/f7nLBJHMsAPJGmyCqAy85QVkYLCrHIC31/Eyc+DqvX/GxgLlwku9N/Q0jP2yd917Q0F2yv+QZAN9JztQ+OVh00L0nHcx3q3mY9cESlp2myisiO3DabgreavCKBwwVAp0qhej37s3xtPdUdboM3/MSbxExdQd9KL2MCykXjF2irkViwadpV0pdRdkvojY3Wirp+vCLBndwWeOJCssE7LFTXbrWlqTP9ghfzHCu9kLcfJR4usMT7pPJc/+0yuY7jrtD79ELySFwhs4WfXl70yRGVIt/LSO9VD7hZ2WITb0p+HDDdHjqcORO+ETKAtk4u+f3eNiqYQfHMMa8XfuCnq0Um9+tK4u1BkBcMNoFPeWfHBoTOS9ZPtLHqk11ay/wcmASQWibATvl/mXExXL548t41gg14wx1oMgLZPh/ZR0Q3NUNTBgyuM4TJ+IHd2zs0jU16OG12G6CjIZ79zn59Of/gHt4bSaS8D6aTBpI9/FDLjNgS4QamRQG6vT7ShcKFObKQPeIF7xUP9lcBzCfuireUCSxfbI5UFzSAUtRi3sbLpxu0HzJ2qQI5zZYs5K+2l6DgZbCAH9QSKMfwX0g7z6JWuto6QRSyd/8ww/p0+KWvw9v9cSP+IihHOWnl+6vhBocJdq2gxJXEREEhgA4uCNAjaMwmBFTvy2oPVl7Fo+hkOzQIPEeft0kDUuvff63isqJNFryk3muQTgBeHfsgICnGdcRXqIyfz1vvKPd2vnUz2j0A3aku8Ji/d4VPGxZNTMlVC6fULNyqaeRfWliXs+JUZLyxPUjhp/RctxvuJpy37cMNo59nvxELLY7N4wi8ESkVZ+Fh9Ik6yToXreDZWUouqEhxmQZf4SIIEQdz1EcDx3ocDI58klas3nerO0PeTO13u54RfPKbRFmlkwNFga7gxu9p4gKe7HM1isILno/6pvNbvl9DxIstip9d+7e4U1GOlHejjarIDD5N/nCygtHDOxqCNAnr7XVa76yaebqL0RGNlwvwt0hEvhxzFcA0HQyDBhlwjFimFowRTad+qaTAE6FkecMyqbxXla+/vntjS4fhnbS4fynEUrMv0cMw6k+4b9tZIm94c6xXQfhKMo2oO6lghOaO1KJDVeZ6YvWkeX1UYn/jAe4HMtNvxItvBgbheyIlBVXISpXg/sQxy1DypyVkFOmn73QNQzJS6ICMhZZKdFo7CC2hQeMgdj7oSMLNCEOnv4MLV1139RiCrRDj5mXixFfBSom1A4BPywfP9u0hwu8H+P4pYgk/dZ+6l6cVJCki7uCaTstr+minWtJi8qTKyzJvWtKP7T7EMB/sjnbVXf4xO6i0mVpyN9pfkVUM5X26Kjd9a9r0VI6Ljo67olZwVT1RStA1pJ2Bu1en7R0h0O3DZnq6Mhw/ASvn0Y5bzyKidKqs6MSC/9lLiJzbdtjfuVGp9oruLjfGu0Mwm8JEvKLqH6GiKxG+3t8TiwAbGUF2gOw/Liuzpdd1fYE5YonFtsauYjRamLqnT0X2du+Nte5q1pfc9Avz32S3tsnimTkpS/LLO3WZKjwUptV/ceO3urB8+612hMPe7lRitg2VX4zL29v9gh4nJ5FF0zhPgKU1QWndlc8yfPLNitMG4YORj68AG7HAW1kY3ZvlUssSO8wuAX3/hfyJUPZufvnCT/oL1pwzj7MBUYBlYkTBhMv+PEUWZqfPg6QWYp1gs/1XDnXmRvVOq2WbG1Vq7imLJVFywuU9zL6NAhb4/ScXeqsqegw4XKpOoDfFSZWZx6CpM6qpAGXWDcBiqz7x9dVheFj5TnFCqS1bzEv/5abTHxexy9j0JRXWDhQopMFxRqho8jyBVJyO4UdI8u7BV2OIFeONDvzGoZelOS3E6dAyahnYx63d/XZY7T0do+MtEa6+5oeofw2hruoNUKpMrTWxL0G9ndq7mBwLccaL0zsC/Lv0kg8KLPvU3xLHVYVhEa+y353cyYfUSILl/uhq3fdQ4WTba7jOfsuM5Hz8EHtzHAC8F5W64c3zoeV+iXqKc9BCTZm/dXarZNOAzh04trelWHJpl27WTAPm7m5BxPLza4t2OAYiXT+QwOaxBE9eYAauORwJgHNs3OlxZHbgstXEPn+eIuz/w53/E45IW3+k5wMXrSGSB+SSSbZZmGLXCVozmhfDDBncBsRb47Xu5tCeU5A3nVRG9fdy84L5FLSc1hP2aiUZ/NRrY7L+ATgMqirJ82DlM6U3SvUW8MxPGKY7irVehLMtZHB2D68w0QOVm7ELpPagkZqxwB7Eetx3jFNpJ8VM0focjZJPbO51Qm/tq/Arq1SVNQFo5/ZU9ny6mCQPvQ4FA92I3tH5dAaTJsNbfzuxIQqt/oPQE1tlngQqtZpsfKKToKw10/s+p+aT1O2gOfKzjm9k8MDHgJfRcoeUTd+wbvNhAaoxvn5VqYA34BVl+kHAQ12LE7cP0+x4HpFgZdoTU7ZtGL2QJoozF13jb0lBz5x4PCdc3D7b/hc+pmYau6DxGKMANjgaqZaL52XX3RRCrFrfNBwSplz6qQAtFr1Ct959mRY74xNVkU0PGD9O7GnEtlhfXQUukeeNZMalF4Lge01MwAuK/BpORezHSxd86chanoUVgH/BshUwQd8fb5dSyq9es51BZ64R05EhsnBtDFhh76garRCjGsvr2zUKS++o9Q9yRXGji/z+icOD9rW+1kuF0pFS+hMUTmwnX7dQiZmcN8VCD9QkfAdCT1mYj9R722sXiTME7BSlsck9vv3Dwv55u6Iyc4sDwSf4x7y62aAlMkIHRIiVAbJxREQf6oFRteH7IWh0gHY3gv62WbW6c+Qyi3RKyDyHlOFcIVYjBmMQjXWGuVd6CbjuPOAyc8rp5w38Ld/Qc4W5SJ4Yp8W0B4dbzN32sWKFGtOnz32i8FT4NYVUYsCEz81c2LdrYN8Q7MOGvZEVZBAIta9xNnTrbF9EqGLJAo5/Pf79na8ErYCZo1KmkGU/Tl9jR/D9IHtMYtZuuRYw5x4o9dKaJ2EKFut/SyxK+TZ+zXlh2iHZhBIecEliI82e6obv514Sqhl45UheUQhxsofB5xpKBjaK9onBnzvoeEbitxQ5uv681xxBA7oB4XyKR4m1rurb8oa5G12087GbWoe2hM6Fqs7FrbTnTLK6N/JE0bvZ09vdcHLxtCtRGHI6VxXr/Awis9N6zIMEPdkmunBSpLdk4HhYFMU6Y1fZ1OcEpeamQK3EdE0BHA84oeCSw3qiAbZ3TdtpVSY0v/DDZ55F+epbbaCFgCmWZAqlNqVrBwm5dMRkK4dq6zD7WCKGG/Kk051CwISwX8BzvXGIbCd3GUY59vhI+ny6FN384KMrCaGXa1MnRoMzmraPi8RbXWITGSoVSHO7BGwxwQkwYLjuBHdi7p92rVbg5LW5Ai4OqE3/ri37IMIWZHxz6lvLKLuzeVmKneVvHw6QgnQ1ZiDPztx4W63jnP6n4l67rcdFa2BWXt5bZKUhxcNip/p9Wzt1EU5fNjx8tFFWfHtlj1UflxA/OBjUO/9EcTS+4GmE1v0o63eKBt4iZENi+UD8+JGekRodowfzCU4jW5VeL04WYsDRVv52wafZfD2OMBPBN/IneVk2zW3R72pOQnYk354JQ5Z1MkiKkKMVrWe6zIaL9ifQPoGSLAwI5ZNiFze3DzkROjklldymyYTgXwyM6beu/Z/cWnquqw/WI6XR+97Jk172ZDYs6ijwKPXSWW50Nk2spTLmpMyX//B35e6qUikj6K2bL6fnjSf3vpUZaOev3jFFdK9hsEMY8yDrGk53X21apFXSul0nUVHx4QDPJoW/RquHJ3AtRAkL6ekyT3rklMpBMQtTQJxUiNTm0gELExcBKbpXCslPXHE2b8uVggXF/khUeiEZXTVELC+A/SJfD3s2N33iRNvV6FTIzU44aqX88S5ZAeDIVgYisXlRFgQrAGxdzi9yoq6J/uL2rGzY4ul5jNf/9cXdnaVupsNe9iYogjUGn3oAm1/ECYd19IcmxW9vGpaslF3uHQFQuWhHPDrAnS6Z8jEk/VHOKEl0+MQcXyHbw35xyQIDxePWzAb2BS7p/2qdUAW5Y66y4nhm/bUS0iCLbpQcMzeuSr6TRrhPDh8Xm+nN3j9HdEkwa3LeCN6zt3xKAQszbAyS8DlSLh00V8jCKmSE28bDhvPY6HX+CWBtvzSJRGgzIaYdsPyXRbRwTpGqJcoMluYKVrldjtnpQFedFgztI7+sH4NygQO1J+g/MIECMqlp85lWEQpvtvpSg5bcJCEIg1l01LapSo+iqiwHpuzzTTuPczUbIWRH49Qe8wAUaT1KFpVG8N0bS68SxUM+hLcgD8Y+3YyGo1TAouNU842UI10OtOZvhGyIEClQPD4sG357sUWwRYJnvMP3d9jS4Yxp7NDPhajit8uFjfFlGZ5oYG5oLDONeo/GJZuwaJgzP0zWA8+fI2DSoIi7SBVIpMRXbdBwz1o2Zv5eTdRODX1mGqioo7ePYqV6cU5IqQuNTXH73H5unExUHnncNn0z+4EIttpq8Zk3BUZKgWr1odyWIiHuWRMUygCAIX6rhFk2dEBW4zi7zNwqhcGLqNkLdpC56NAGL99/dvT7L8+PnFUDB9LvpVZSEkJjtiz9gLeMf9k+FV6Lw961tl2qFFFwOv9w/UU1MZhHkKCaHCLVDi4thzgwGPKjhyDJ6jVNvUVUIuCnffHru8ujymU6lrlm9tdLGA23V4AVqIkUEeYgIO15EGLxVXJHbnxDeRo72Sq++91kcfk/Y0AkaoTvZnQTgxILLqZTlGsyNuVfdBoV9we8tRxatYCg6F4GOv9fDGjVfquxRVvRM7AvsW8bbYfFkarSdZWBG5fdBbvsYEiOFlHcJxupX7L9SQ18unC01s+vpUAv1jRoRyur5ZhIORc0DYzDW0VOs+TVEtuCQH4Bsw77Bt07ZBMhHpQ+0BAF0MiBPUGqKXCmKsXcfYI4Z2MkRItMlRuq3XA8g7wvvrzlWuZC6ILj0juo+k0L9u/qd0/JWsPq8tk/frLfBYbX8Cau7Wn1g1CTpUx6fszfTLdwzrRiINA1iS/R2/AMAHgOCcqb80wGKTkkWEJ6sGNf6VWtKiBqXiZ9NE8Q08tEcYyixotRelgaJsQ2in6/ku9uztojx1R5XoJv3zy0TKgDXEduJg2ev4IwSfrS8CbdQEjmlRbIY3OrlZhHCNTN7+FNeha4pBb0ooSIesuqUZ78zd5JHAESxeItmMSRjxyiQWn+SBdPU/ey9a9c1XUIcwny33nrYjDYiUM45Sqddffib/l/zlEuF+fyFsp3PrrRGcXUWRUu6tjH1o7P6xe8vCJw9Uss9yFgfEuFRZIsBAPLO9h8sixcCaCeVL9ajwa7y2H/fTeDKwfqtatLa1q3HXC/TojZTRcUC/V2/7wb8KFjZiSiMDw8j46l5tpg6e4cbTr3P7/HPdonry2rDoaRmyIDul0ws0KjU1fwOP5ShLHwcslgxgvmlJv1Q7sZ+JhHb1xdHJfzVgzCwUZiVF582hgAMiXuYNA5jUZSmBdxRujDCXj7OBmf9Owx33kAdR5RU3kDy1+9d0s5jQUN87XkhEt3IVPdKPREBU8RlZcPejQr41ziBEDwol00C2GPFaLuXFwM2C9E5fB5uh7fc6phQ0xMDQNk5VxXBBepUQZT9ntkreUv7algnTmW6HCbFrfTmBddfcbrL0b6RD0LCuuo3tXATspCI5JKZMXb3JwDJvcBWhzU834s/vepM0gXv3y+4S6UzxzFmdelW+BjopH/Sq8ASq6mWOw8R1sJGVcnZ0dBxZMBYy5hJMDSgw5isJdB1i4kHtu7dY1P+c1ZgkIfCqeCHre6vi8h5CNZLlluDtd0Ysf9zgc8atYDeRGwmfYl7FxZJdY3NiUQllQ21tQebdV4SxZM5kSIsS3azJS64JGhFZcKaI6Rl29mjciD3H2HA3xoOYY+l4QC/8wWUMg5z2WH2/OvMSI5Felv2M0DP/IEmhPBWCU7V5pbNlXW4M5aqCw0ZLZZyEMfnhH72PF+yZhCmTU9tP7kcguuQlwXLbQQPg0aI=","iv":"fbc809e5effc5883cdf14ed4f94edf99","s":"326008aba47f1cce"};
    let entities={"ct":"S+pyltZJKb6EslB19CgaLV+Gj+FTHLNMg9RhyMxRLfIwjMeDyQmQV2BPMwswoBAU","iv":"0a39a82e75b2b7871a6aac1175f3f156","s":"a503b64f9daf01d6"};
    let flows={"ct":"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","iv":"37bda154c8379a49adddacd555b3dff8","s":"6ff0435f690c0a69"};

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


    let strictlyFlow=true;
    let humanAssistSwitch=true;https://development.jubi.ai/jubimoney/
    let voiceEnabled=true;
    let cookie=false;

    let speechGenderBackend='FEMALE'
    let speechLanguageCodeBackend='en-US'

    let projectId='JubiMoney_788585788275'
    let attachmentUrl='https://parramato.com/bot-view/images/attachment.png'
    let integrityPassPhrase='hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
    let localSavePassPhrase='8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIJubiMoney_788585788275'
            //-----code-------
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
                                    $("#jubi-textInput").show();
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
                let delayMaster = 2000;
                let msgIndex = 0;
                let gender = null;
                let profile = undefined;
                let semaphoreForFirstChatLoad = true;
                let lastConversationSemaphore = true;
                let inputQuery = get("query");
                // let inputDefault=false;
                if (!inputQuery) {
                    //inputQuery = 'Get Started';
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
                    mute = false;//st

                try {
                    document.getElementById('jubi-muteVoice').style.display = "none";//st
                    if (voiceEnabled) {
                        document.getElementById('jubi-unmuteVoice').style.display = "block";//st
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
                    $('#button-play-ws 1').show();
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
                        $("#button-play-ws").hide();
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

                function convertAndPlaySpeechFromAPI(text) {

                    return new Promise((resolve, reject) => {
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        let requestData = {
                            data: {
                                text: text,
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

                            if (options[i].text.toLowerCase() == "skip") {
                                str = str +
                                    "<li>" +
                                    "<a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "' inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options skip'>" +
                                    options[i].text
                                "</a>" +
                                    "</li>";
                            }
                            else {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            }


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
                    $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
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
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput pm-leftInputImg'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" +
                        "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput pm-leftInputImg'>" +
                        "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput pm-leftInputImg'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput pm-leftInputImg'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
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
                    return "<div id='pm-bxloadgif' class='pm-bxuser_question pm-bxloadgif ' style='visibility: visible;'><div class='pm-leftInputGif'><div class='pm-leftUserimg'><img src='" + modal.static.images.botIcon + "' class='img-responsive'></div><div class='pm-innerloadgif'>" + 
                    // "<img src='" + modal.static.images.loaderBotChat + "' />" +
                        '<span class="dot dot1" id="dot1"></span>'+
                        '<span class="dot dot2" id="dot2"></span>' +
                        '<span class="dot dot3" id="dot3"></span>'+



                    "</div></div></div>";
                }
                function prepareChatBotUserLoader() {
                    return "<div class='pm-bxRightchat'>" + "<div id='pm-Rightbxloadgif' class='pm-bxuser_question pm-Rightbxloadgif'>" + "<div class='pm-leftInputGif'>" +
                        // // "<div class='pm-leftUserimg'>"+
                        // //     "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>"+
                        // // "</div>"+
                        // "<div class='pm-rightUserimg'><img src='./images/user.png'></div>"+
                        "<div class='pm-innerloadgif pm-Rightinnerloadgif'>" + 
                        // "<img src='" + modal.static.images.loaderBotChat + "' />" + 
                        
                        '<span class="dot dot1" id="dot1"></span>'+
                        '<span class="dot dot2" id="dot2"></span>' +
                        '<span class="dot dot3" id="dot3"></span>'+

                        "</div>" + "</div>" + "</div>" + "</div>";
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
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput pm-rightInputImg'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<div class='pm-postImg'>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + imageUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        } else {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput pm-rightInputImg'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
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
                                        // console.log(JSON.stringify(data))
                                        run("upload_file>" + data.url, "file");
                                        //RIGHT LOADER
                                        // $('#jubi-answerBottom').prop('disabled', true);
                                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                        $(".inputfile").css("display", "none");
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
