
        "use strict";
        (function () {
            // window.jubiChatEventListener=function(event){ 
            //     if(event.input.validation.data){
            //         var inputLanguage = JSON.stringify(event.input.validation.data)
            //         console.log("inputLanguage" + inputLanguage)
                   
            //     }
            // } 
            window.jubiChatEventListener=function(event){ 
                // console.log(event)
                try{
                    if(event.type=="process" &&!(event.input.user.conversationId=="getstarted" && event.input.user.tracker==0 )){
                        // console.log(event.input.user.tracker+" inputLanguage " +event.input.user.conversationId + "event.input.validation.data")
                        
                    }
                }
                catch(e){}
            }
            function loadJs(jsUrls) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(jsUrls)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        var _url = jsUrls[key];
                        if (!isMyScriptLoaded(_url)) {
                            document.writeln("<script type='text/javascript' src='" + _url + "'></script>");
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            function isMyScriptLoaded(url) {
                var scripts = document.getElementsByTagName('script');
                for (var i = scripts.length; i--;) {
                    if (scripts[i].src == url) return true;
                }
                return false;
            }

            function isMyCssLoaded(url) {
                var scripts = document.getElementsByTagName('link');
                for (var i = scripts.length; i--;) {
                    if (scripts[i].src == url) return true;
                }
                return false;
            }
            function loadCss(cssUrls) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Object.keys(cssUrls)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var key = _step2.value;

                        var _url2 = cssUrls[key];
                        if (!isMyCssLoaded(_url2)) {
                            var head = document.getElementsByTagName('head')[0];
                            var link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = _url2;
                            link.media = 'all';
                            head.appendChild(link);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            loadCss({
    bootstrapFont: "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
    owl: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.css",
    owlTheme: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css",
    pmTheme: "./css/theme.css"
});
loadJs({
    crypt: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js",
    jQuery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    carousel: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js",
    socket: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js",
    responsiveVoice :"https://code.responsivevoice.org/responsivevoice.js",
    nluComponent:"https://unpkg.com/compromise@latest/builds/compromise.min.js",
    // bundle: "https://parramato.com/bot-view/JubiMoney_788585788275/dev/js/bundle.test.js",
    bundle: "./js/bundle.test.js",
    jubiEvents:"./js/jubievents.js"
});
        window.directMultiplier=1;
        window.fallbackMultiplier=0.8;
        window.speechOnBrowser="Hindi Female"
        window.speechGenderBackend="FEMALE"
        window.speechLanguageCodeBackend="en-US"
        window.jubiUrl='https://parramato.com/bot-view/JubiMoney_788585788275/dev/';
        window.jubiModal={
        url:'wss://development.jubi.ai',
        path:'/jubimoney/socket',
        static:{
                url:window.jubiUrl,
                scripts:{
                },
                css:{
                },
                images:{"logo":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/logo.png",
                "sendIcon":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/icon_send.png",
                "sendIconActive":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/iconRed_send.png",
                "loaderBotChat":"./images/loading_new.gif","userIcon":"./images/rightuser.png",
                "botIcon":"./images/botAvatar.png",
                "logoIcon":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/logo-icon.png",
                "voiceIcon":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/voice.png",
                "closeWebView":"./images/close.png",
                "attachment":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/attachment.png",
                "permissionIcon":"https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/parrot_loader.gif"},
                text:{
                    closeMessage:'',
                    headMessage:'Ask me anything.'
                }
            }
        };
        window.passphraseMiddleware="YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE"
        window.mainpage = '<section class="sec_main" id="jubisecmain" style="display: none;"></section>';
        window.leftpanel = '<aside class="asideLeft">'+
                                '<div class="logo">'+
                                    '<a href="javascript:void(0)">'+
                                        '<img src="./images/logo.png" class="img-fluid">'+
                                    '</a>'+
                                '</div>'+
                                '<div class="leftContent">'+
                                    '<h3 lang="eng">Here to upgrade<br> your relationship with money.</h3>'+
                                    '<p lang="eng">From stress to joy.</p>'+

                                    '<h3 lang="hin" style="display:none;">चलिए आपके पैसों के साथ<br>रिश्ते को अपग्रेड करे।</h3>'+
                                    '<p lang="hin" style="display:none;">तनाव से लेकर ख़ुशी तक।।</p>'+

                                    '<h3 lang="marathi" style="display:none;">पैशाबरोबर आपले संबंध<br>सुधारण्यासाठी येथे.</h3>'+
                                    '<p lang="marathi" style="display:none;">तणाव पासून आनंद.</p>'+

                                    '<h3 lang="kannada" style="display:none;">பணத்துடனான உங்கள் உறவை<br>மேம்படுத்த இங்கே.</h3>'+
                                    '<p lang="kannada" style="display:none;">மன அழுத்தத்திலிருந்து மகிழ்ச்சி வரை.</p>'+

                                    '<h3 lang="tamil" style="display:none;">ಹಣದೊಂದಿಗಿನ ನಿಮ್ಮ<br>ಸಂಬಂಧವನ್ನು ನವೀಕರಿಸಲು ಇಲ್ಲಿ.</h3>'+
                                    '<p lang="tamil" style="display:none;">ಒತ್ತಡದಿಂದ ಸಂತೋಷದವರೆಗೆ.</p>'+

                                    '<h3 lang="bengali" style="display:none;">টাকা দিয়ে আপনার সম্পর্ক<br>আপগ্রেড করতে এখানে।</h3>'+
                                    '<p lang="bengali" style="display:none;">চাপ থেকে আনন্দ।</p>'+
                                '</div>'+
                                '<div class="bgLeftpanel">'+
                                    '<img src="./images/graphic.png" class="img-fluid">'+
                                '</div>'+
                            '</aside>';   
            window.rightpanel = 
            '<div class="rightPage" id="rightpanel">'+
                '<section class="jubichatbot" id="jubichatbot" style="display: none;">'+
                '</section>'+
            '</div>';
            window.templateOpenView = '<section class="pm-sec_calliframe" id="pm-secIframe" style="display:none">'+
            '<section id="pm-start-section">'+
                '<section id="pm-heading" class="pm-sec_newHeader">'+
                    '<div class="title-report">'+
                        '<a href="javascript:void(0)"><img src="./images/logoBlack.png" class="img-responsive"></a>'+
                    '</div>'+

                    // `<div class="menuBx">
                    //     <div class="menuIcon">
                    //         <div class="menuDots">.</div>
                    //         <div class="menuDots">.</div>
                    //         <div class="menuDots">.</div>
                    //     </div>
                    // </div>`+

                '</section>'+
                '<div class="language-select-container" id="pm-language-start">'+
                '<div class="pm-bxLeftchat" id="chat-loading-gif" style="margin-top: 10px;"><div class="pm-leftUserimg"><img src="./images/botAvatar.png" class="img-responsive"></div><div class="pm-leftInput lang-loading-gif"><img class="img-responsive" src="./images/loading_new.gif"></div><div class="clearfix"></div></div>'+
                    '<div class="pm-bxLeftchat" id="chat-start-here">'+
                        '<div class="pm-leftUserimg">'+
                            '<img src="./images/botAvatar.png" class="img-responsive">'+
                        '</div>'+
                        '<div class="pm-leftInput">'+
                            '<p>Hi! I’m Jubi. </p>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                    
                    '<div class="pm-bxLeftchat" id="chat-start-here-1">'+
                        '<div class="pm-leftInput pm-ImgLeftInput">'+
                            '<div class="pm-postImg">'+
                                '<a href="https://jubimoney.com/jubimoney/images/introGif.gif" target="_blank">'+
                                    '<img src="https://jubimoney.com/jubimoney/images/introGif.gif" class="img-responsive">'+
                                '</a>'+
                            '</div>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                    '<div class="pm-bxLeftchat"  id="chat-start-here-2">'+
                        '<div class="select-option pm-leftInput" id="showLanguage" style="padding:10px 15px;">'+
                            '<p>Select your Language</p>'+
                            '<div class="dropdown-icon-content">'+
                                '<img src="./images/dropdown-icon-black.png" alt="">'+
                            '</div>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                    '<div class="pm-bxLeftchat">'+
                        '<div class="dropdown-content pm-leftInput">'+
                            '<div class="language-list-content">'+
                                '<ul>'+
                                    '<li class="language" id="english" onclick="window.askBot(\'English\');removerightbx()"><a href="javascript:void(0)">English</a></li>'+
                                    '<li class="language" id="hindi" onclick="window.askBot(\'Hindi\')"><a href="javascript:void(0)">Hindi ( हिंदी )</a></li>'+
                                    // '<li class="language" id="marathi" onclick="window.askBot(\'Marathi\')"><a href="javascript:void(0)">Marathi ( मराठी )</a></li>'+
                                    // '<li class="language" id="kannada" onclick="window.askBot(\'Kannada\')"><a href="javascript:void(0)">Kannada ( ಕನ್ನಡ )</a></li>'+
                                    // '<li class="language" id="tamil" onclick="window.askBot(\'Tamil\')"><a href="javascript:void(0)">Tamil ( தமிழ் )</a></li>'+
                                    // '<li class="language" id="bengali" onclick="window.askBot(\'Bengali\')"><a href="javascript:void(0)">Bengali ( বাঙালি )</a></li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                    '<div id="pm-get-language" class="pm-bxRightchat" style="visibility: visible;">'+
                        '<div class="pm-rightInput">'+
                            '<p id="get-language"></p>'+
                            '<div class="clearfix"></div>'+
                        '</div>'+
                        '<div class="pm-rightUserimg"><img src="./images/rightuser.png" class="img-responsive"></div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                    '<div class="lastReply">'+
                        '<div class="pm-leftUserimg">'+
                            '<img src="./images/botAvatar.png" class="img-responsive">'+
                        '</div>'+
                        '<div class="pm-leftInput">'+
                            '<p>Personalising the experience for you!</p>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                    '<div id="chat-loading-gif-2" style="margin-top: 10px;display:none;"><div class="pm-leftUserimg"><img src="./images/botAvatar.png" class="img-responsive"></div><div class="pm-leftInput last-loading-gif"><span></span> <div class="left-loading-gif"><img class="img-responsive" src="./images/loading_new.gif"></div></div><div class="clearfix"></div></div>'+
                '</div>'+
            '</section>'+

            '<section class="pm-sec_scroll2 pm-sec_openview" id="pm-mainSec">' + 
                '<section id="pm-heading" class="pm-sec_newHeader">'+
                    '<div class="title-report">'+
                        '<a href="javascript:void(0)"><img src="./images/logoBlack.png" class="img-responsive"></a>'+
                    '</div>'+  

                    // `<div class="menuBx">
                    //     <div class="menuIcon">
                    //         <div class="menuDots"></div>
                    //         <div class="menuDots"></div>
                    //         <div class="menuDots"></div>
                    //     </div>
                    // </div>`+

                    // '<div class="headerNav">'+
                    //     `<div class="get-smartBx">
                    //         <a href="http://blog.jubimoney.com/" target="_blank"><i class="fa fa-home" aria-hidden="true"></i> Get smart!</a>
                    //     </div>`+                        
                    // '</div>'+
                '</section>'+

                '<section class="pm-sec_chatbody" id="pm-data" >'+
                    '<div class="pm-bxChatbox pm-bxChat chatWindow" id="pm-buttonlock">'+
                    '</div>'+
                '</section>'+

                '<div class="loading-content" id="loading-content-gif">'+
                    '<div class="img-content">'+
                        '<img src="./images/botAvatar.gif">'+
                    '</div>'+
                '</div>'+


                '<div id="jubi-recording-text">'+
                    '<p id="jubi-result-text">'+
                        '<span class="jubi-grey-text"><span>'+
                    '</p>'+
                '</div>'+

                '<section id="jubi-textInput" class="jubi-sec_newFooter footer-two" style="display:block !important;">'+           
                   
                    '<aside class="jubi-muteUnmuteVoice">'+
                        '<div id="jubi-unmuteVoice" >'+
                            '<img src="./images/unmute.png">'+
                        '</div>'+
                        '<div id="jubi-muteVoice">'+
                            '<img src="./images/mute.png">'+
                        '</div>'+
                    '</aside>'+
                    '<div class="voice-buttons" id="voice-buttons" style="display:block;">'+
                        '<div class="voicePulse" id="button-stop-ws">'+
                            '<div class="sk-three-bounce">'+
                                '<div class="sk-child sk-bounce1"></div>'+
                                '<div class="sk-child sk-bounce2"></div>'+
                                '<div class="sk-child sk-bounce3"></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="inputArea">'+
                        '<div class="jubi-bxinput" id="jubi-bxinput">'+
                            '<textarea id="jubi-answerBottom" onkeypress="showSendIcon()" placeholder="Your message here..."></textarea> '+
                        '</div>'+
                        '<div class="datasendButtons">'+
                            '<div class="sendIcon" id="button-send">'+
                                '<button id="jubi-bottomClick" type="submit" onclick="clickSendButton();return false;" style="display: none">'+
                                    '<img src="./images/send.png" id="jubi-graySend" class="img-responsive">'+
                                    
                                '</button>'+
                                '<div class="voiceIcon button-play-ws-right" id="button-play-ws" style="display:block;"><img src="./images/voice.png" class="img-fluid"></div>'+
                            '</div>'+
                            '<div class="uploadbox" style="display:none;">' +
                                '<label>' +
                                    '<div class="inputfile">' +
                                        '<img src="https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/attachment.png" class="img-responsive">' +
                                        '<input class="jubi-file-upload" type="file" name="fileName" >' +
                                    '</div>' +
                                    '<div class="button-section" style="display:none">' +
                                        '<button type="submit">Submit</button>' +
                                    '</div>' +
                                '</label>'+
                            '</div>' +
                            '<div class="keyboard-icon" id="keyboard-icon" style="display:none;">'+
                                '<i class="fa fa-keyboard-o" aria-hidden="true"></i>'+
                            '</div>'+        
                        '</div>'+
                    '</div>'+

                '</section>'+

                '<div class="jubi-new_copyright" id="jubi-new_copyright">' +
                   `<div class="footerBtm">
                        <div class="socialShareBx">
                            <div class="addthis_inline_share_toolbox"></div>
                        </div>
                   </div>`+
               ' </div>' +

            '</section>' +       
        '</section>';
            window.loadPermissionView = 
'<section id="pm-permission-view" style="display:none" >'+
    '<section id="pm-heading" class="pm-sec_newHeader">'+

        
    // '<div class="headerNav">'+
    //     `<div class="get-smartBx">
    //         <a href="http://blog.jubimoney.com/" target="_blank"><i class="fa fa-home" aria-hidden="true"></i> Get smart!</a>
    //     </div>`+                        
    // '</div>'+


        '<div class="pm-titleheader" >'+
            '<h3>'+
                '<img src="https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/logo-icon.png" class="img-responsive"><span class="pm-headOnline" >&nbsp;</span>'+
            '</h3>'+
        '</div>'+
        '<p>Ask me anything.</p>'+
    '</section>'+
    '<section class="pm-sec_show_option_on_start" id="pm-sec_show_option_on_start" style="display:block">'+         
        '<div class="chatProceed" id="chatProceed">'+
            '<div class="chatProceed-botimg">'+
                '<img src="https://parramato.com/bot-view/JubiMoney_788585788275/dev/images/parrot_loader.gif" class="img-responsive">'+
            '</div>'+
            '<p>Welcome back! Let us begin...</p>'+
            '<ul>'+
                '<li>'+
                    '<a href="javascript:void(0)" id="jubi-continue-storage" >Continue from where we left</a>'+
                '</li>'+
                '<li>'+
                    '<a href="javascript:void(0)" id="jubi-start-fresh">Start fresh</a>'+
                '</li>'+
            '</ul>'+
        '</div>'+
    '</section>'+
'</section>';

        })();
        
        $(document).on('change', '#change-langauge', function() {
            if($(this).val()==1){
                $('[lang="eng"]').show();
                $('[lang="hin"]').hide();
                $('[lang="beg"]').hide();
            }
            if($(this).val()==2){
                $('[lang="hin"]').show();
                $('[lang="eng"]').hide();
                $('[lang="beg"]').hide();
            }
            if($(this).val()==3){
                $('[lang="beg"]').show();
                $('[lang="hin"]').hide();
                $('[lang="eng"]').hide();
            }
            // if you want to do stuff based on the OPTION element:
            var opt = $(this).find('option:selected')[0];
            // use switch or if/else etc.
        });
         
        var inputflag = 0;
        function showSendIcon(){
            var textInput = document.getElementById("jubi-answerBottom").value;
                textInput = textInput.trim();
            // console.log('textInput' + textInput);   
            // let space=' ';
            // setTimeout(function(){                
                // console.log('textInput' + textInput);
                if(textInput!=''){
                    document.getElementById('jubi-bottomClick').style.display='block';
                    document.getElementById('button-play-ws').style.display='none';
                }
                else if(textInput==''){
                    document.getElementById('jubi-bottomClick').style.display='none';
                    document.getElementById('button-play-ws').style.display='block';
                }
                // else{
                //     document.getElementById('jubi-bottomClick').style.display='none';
                //     document.getElementById('button-play-ws').style.display='block';
                // }
            // }, 10)
            
            if(!inputflag){
                document.getElementById('jubi-bottomClick').style.display='block';
                document.getElementById('button-play-ws').style.display='none';
                inputflag++;
            }   
            
            // console.log('textInput' + textInput);
        }
        function clickSendButton(){
            document.getElementById('jubi-bottomClick').style.display='none';
            document.getElementById('button-play-ws').style.display='block';
        }
        function removerightbx(){
            console.log('removerightbx()')
            $('.pm-bxRightchat').remove();
            // setTimeout(function(){
            //     $('.pm-bxRightchat').remove();
            // }, 5000);
        }