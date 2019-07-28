$(document).ready(function () {

    $('#chat-loading-gif-2').hide();
    setTimeout(function(){
        $('#chat-loading-gif').hide();
    },2000)
    setTimeout(function(){
        $('#chat-start-here').show()
    },2500)
    setTimeout(function(){
        $('#chat-start-here-1').show()
    },3500)
    setTimeout(function(){
        $('#chat-start-here-2').show()
    },4500)
    
    $('#showLanguage').click(function(){
        $('.dropdown-content').toggle()
    })
    $('.language').click(function(){
        if($('.language').children().is('a')){
            console.log(this.id)
            console.log($(this).text())
            $(this).addClass('active');
            $('.language').not(this).removeClass('active')

            let getLanguage = $(this).text();
            $('#get-language').text(getLanguage)
            setTimeout(function(){
                $('#chat-loading-gif-2').show();
            },1000)
            setTimeout(function(){
                setTimeout(function(){
                    $('#pm-get-language').show();
                },100)
                setTimeout(function(){
                    $('.lastReply').show(200);
                },100)
                
                setTimeout(function(){
                    $('#pm-language-start').hide();
                    $('#pm-mainSec').show(0);
                },0)
            },500)
        }
    })

    $('.jubi-menu_val').click(function(){
        console.log('jubi-menu_val 1' );
        $('#langNav').hide(500);
    })

    $('.language').click(function(){
        let languageId = $(this).attr('id');
        switch(languageId){
            case "english":
            $('#jubi-answerBottom').attr("placeholder","Your message here...")
            break;
            case "hindi":
            $('[lang="eng"]').hide();
            $('[lang="hin"]').fadeIn(200);
            $('#jubi-answerBottom').attr("placeholder","आपका सन्देश यहां...")
            break;
            case "marathi":
            $('[lang="eng"]').hide();
            $('[lang="marathi"]').fadeIn(200);
            $('#jubi-answerBottom').attr("placeholder","आपला संदेश येथे...")
            break;
            case "kannada":
            $('[lang="eng"]').hide();
            $('[lang="kannada"]').fadeIn(200);
            $('#jubi-answerBottom').attr("placeholder","ನಿಮ್ಮ ಸಂದೇಶ ಇಲ್ಲಿ...")
            break;
            case "tamil":
            $('[lang="eng"]').hide();
            $('[lang="tamil"]').fadeIn(200);
            $('#jubi-answerBottom').attr("placeholder","உங்கள் செய்தி இங்கே...")
            break;
            case "bengali":
            $('[lang="eng"]').hide();
            $('[lang="bengali"]').fadeIn(200);
            $('#jubi-answerBottom').attr("placeholder","এখানে আপনার বার্তা...")
            break;
            default:
            $('[lang="eng"]').show();
            $('#jubi-answerBottom').attr("placeholder","Your message here...")
        }
    });

    let firstClick = false
    $("#secCloseMsg").show();
    $("#jubi-secCloseview").show();
    $("#jubi-secIframe").fadeIn(500);
    $('#chatProceed').fadeIn(1000);
    $('.chatProceed-botimg').fadeIn(1000);
    $('#chatprocedWelcome').fadeIn(1500);
    $('#continueFreshChat').fadeIn(2000);
    $('#continueChat').fadeIn(2500);
    $('#startFreshChat').fadeIn(3000);
    $('#jubi-textInput').fadeIn();
    $(".jubi-iconMenu").click(function () {
        $(".jubiSecMenucontent").toggle(200)
    })
    $(".jubiSecMenucontent").click(function () {
        $(".jubiSecMenucontent").hide(200);
    })
    $("#pm-data").click(function () {
        $(".jubiSecMenucontent").hide(200);
    })

    $("#jubi-secHideChat").click(function () {
        $("#jubi-aside_fullopenview").hide(200);
        $("#jubi-secCloseview").show(200);
    })
    $("#jubi-btnClose").click(function () {
        $("#jubi-secCloseMsg").hide(200);
    })

    /* ==========================
            Textarea height
     =========================== */
    $("body").on('keypress', 'jubi-bottomClick', function (e) {
        document.getElementById("jubi-answerBottom").style.height = "26px";
        $('#button-send').show();
        $('#button-send').css('display', 'block !important');
        $('#button-send').css('display', 'block');
    })

    $("body").on('keydown', '#jubi-answerBottom', function (e) {
        var answer = $("#jubi-answerBottom").val();
        var textareaElmnt = document.getElementById("jubi-answerBottom");
        var textareaheightnow = textareaElmnt.scrollHeight;
        console.log("textareaheightnow: " + textareaheightnow)
        if (textareaheightnow < 26) {
            document.getElementById("jubi-answerBottom").style.height = "26px";
        }
        else {
            document.getElementById("jubi-answerBottom").style.height = textareaheightnow + "px";
        }
        if (answer == "") {
            // console.log("if (answer=='')");
            document.getElementById("jubi-answerBottom").style.height = "26px";
        }

        $('#button-send').show();
        $('#button-send').css('display', 'block !important');
        $('#button-send').css('display', 'block');
    });

    $("#jubi-bottomClick").click(function () {
        $("#jubi-bxinput").show();
        $("#button-send").show();
    })
    $("#jubi-redSend").click(function () {
        $("#jubi-bxinput").show();
        $("#jubi-bottomClick").show();
        $("#button-send").show();
        $("#jubi-redSend").show();
    })
    $('.question-options-persist-webView').click(function(){
        $('#loading-content-gif').show();
        setTimeout(function(){
            $('#loading-content-gif').hide();
        },2000)
    })

    function showChatBot(){
        $("#rightpanel").show(200);
        $("#pm-secIframe").show(200);
        $("#jubi-secCloseview").hide(200);
        $("#secCloseMsg").hide(200);
    }

    $("#jubi-secCloseview").click(function () {
        $("#rightpanel").show(200);
        $("#pm-secIframe").show(200);
        $("#jubi-secCloseview").hide(200);
        $("#jubi-secCloseMsg").hide(200);
        if (!firstClick) {
            setTimeout(function () {
                if (window.jubiStartEvent) {
                    window.jubiStartEvent()
                    firstClick = true;
                }
            }, 300)
        }

    })

    $("body").click(function (e) {
        setTimeout(function () {
            if ($("textarea").is(":focus")) {
                $('#jubi-bottomClick').hide();
            }
            else {
                $('#button-play-ws').show();    
            }
        }, 100);
    });
});      

function toggleFooterMenu() {
    let footermenu = document.getElementById("secMenucontent");
    if (footermenu.style.display === "none") {
        footermenu.style.display = "block";
    }
    else {
        footermenu.style.display = "none";
    }
}
function toggleLanguage(){
    // console.log('toggleLanguage()');
    $('#langNav').toggle(100);
}
function hideChatBot() {
    let chatBot = document.getElementById("rightpanel");
    if (chatBot.style.display === "block") {
        chatBot.style.display = "none";
        $("#jubi-secCloseview").show(200);
        $("#secCloseMsg").show(200);
    }
    else {
        chatBot.style.display = "block";
    }
}
function closeOpenMsg() {
    let message = document.getElementById("secCloseMsg");
    if (message.style.display === "block") {
        message.style.display = "none";
    }
    else {
        message.style.display = "block";
    }
}

function openChatBot() {
    let rightpanel = document.getElementById("rightpanel");
    if (rightpanel.style.display === "none") {
        rightpanel.style.display = "block";
        secCloseview.style.display = "none";
        secCloseMsg.style.display = "none";
    }
    else {
        rightpanel.style.display = "none";
    }
}          

    function showChatBot(){
        $("#rightpanel").show(200);
        $("#pm-secIframe").show(200);
        $("#jubi-secCloseview").hide(200);
        $("#secCloseMsg").hide(200);
    }
