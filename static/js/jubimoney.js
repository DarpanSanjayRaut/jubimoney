
                $(document).ready(function() {
                    // change_slider_color();

                    $('.question-options-persist-webView').click(function(){
                        $('#loading-content-gif').show();
                        setTimeout(function(){
                            $('#loading-content-gif').hide();
                        },2000)
                    })                  

                    });
                    /* Range Slider Function */
                    (function($) {
                    $.fn.rkmd_rangeSlider = function() {
                    console.log('1');
                    var self, slider_width, slider_offset, curnt, sliderContinuous, sliderDiscrete, range, slider;
                    self             = $(this);
                    slider_width     = self.outerWidth();
                    slider_offset    = self.offset().left;
    
                    sliderContinuous = $('.slider-continuous');
                    sliderDiscrete   = $('.slider-discrete');
    
                    // if(self.hasClass('slider-continuous') === true) {
                    //     console.log('2');
    
                    //     sliderContinuous.each(function(i, v) {
                    //     console.log('3');
                    //     curnt         = $(this);
                    //     curnt.append(sliderContinuous_tmplt());
                    //     range         = curnt.find('input[type="range"]');
                    //     slider        = curnt.find('.slider');
                    //     slider_fill   = slider.find('.slider-fill');
                    //     slider_handle = slider.find('.slider-handle');
    
                    //     var range_val = range.val();
                    //     slider_fill.css('width', range_val +'%');
                    //     slider_handle.css('left', range_val +'%');
    
                    //     });
                    // }
    
                    if(self.hasClass('slider-discrete') === true) {
                        console.log('4');
    
                        sliderDiscrete.each(function(i, v) {
                        console.log('5');
                        curnt         = $(this);
                        curnt.append(sliderDiscrete_tmplt());
                        range         = curnt.find('input[type="range"]');
                        slider        = curnt.find('.slider');
                        slider_fill   = slider.find('.slider-fill');
                        slider_handle = slider.find('.slider-handle');
                        slider_label  = slider.find('.slider-label');
    
                        var range_val = parseInt(range.val());
                        slider_fill.css('width', range_val +'%');
                        slider_handle.css('left', range_val +'%');
                        slider_label.find('span').text(range_val);
                        });
                    }
    
                    self.on('mousedown', '.slider-handle', function(e) {
                        console.log('6');
                        if(e.button === 2) {
                        return false;
                        }
    
                        var parents       = $(this).parents('.rkmd-slider');
                        var slider_width  = parents.outerWidth();
                        var slider_offset = parents.offset().left;
                        var check_range   = parents.find('input[type="range"]').is(':disabled');
    
                        // if(check_range === true) {
                        // console.log('7');
                        // return false;
                        // }
    
                        if(parents.hasClass('slider-discrete') === true) {
                        console.log('8');
                        $(this).addClass('is-active');
                        }
                        var handlers = {
                        mousemove: function(e) {
                            var slider_new_width = e.pageX - slider_offset;
    
                            if(slider_new_width <= slider_width && !(slider_new_width < '0')) {
                            slider_move(parents, slider_new_width, slider_width);
                            }
                        },
                        mouseup: function(e) {
                        console.log('9');
                            $(this).off(handlers);
    
                            if(parents.hasClass('slider-discrete') === true) {
                            // parents.find('.is-active').removeClass('is-active');
                            }
                        }
                        };
                        $(document).on(handlers);
                    });
    
                self.on('mousedown', '.slider', function(e) {
                    console.log('10');
                    if(e.button === 2) {
                    return false;
                    }
    
                    var parents       = $(this).parents('.rkmd-slider');
                    var slider_width  = parents.outerWidth();
                    var slider_offset = parents.offset().left;
                    var check_range   = parents.find('input[type="range"]').is(':disabled');
    
                    // if(check_range === true) {
                    // console.log('11');
                    // return false;
                    // }
    
                    var slider_new_width = e.pageX - slider_offset;
                    if(slider_new_width <= slider_width && !(slider_new_width < '0')) {
                        console.log('12');
                    slider_move(parents, slider_new_width, slider_width);
                    }
    
                    var handlers = {
                    mouseup: function(e) {
                        console.log('13');
                        $(this).off(handlers);
                    }
                    };
                    $(document).on(handlers);
    
                });
            };
    
                // function sliderContinuous_tmplt() {
                // console.log('14');
                // var tmplt = '<div class="slider">' +
                //     '<div class="slider-fill"></div>' +
                //     '<div class="slider-handle"></div>' +
                //     '</div>';
    
                // return tmplt;
                // }
                function sliderDiscrete_tmplt() {
                console.log('15');
                var tmplt = 
                    '<div class="slider">' +
                        '<div class="slider-fill"></div>' +
                        '<div class="slider-handle is-active">'+
                            '<div class="slider-label">'+
                                '<span style="display:none;">0</span>'+
                                '<div lang="eng" class="you-are-here">'+
                                    '<div class="pointYouareHere">'+
                                        '<img src="./images/arrow.png" class="img-fluid"></img>'+
                                    '</div>'+
                                    'You are here</div>'+
                                '</div>'+
                                '<div lang="hin" class="you-are-here" style="display:none !important;">'+
                                    '<div class="pointYouareHere">'+
                                        '<img src="./images/arrow.png" class="img-fluid"></img>'+
                                    '</div>'+
                                    'आप यहाँ पर है।</div>'+
                                '</div>'+
                            '</div>' +
                        '</div>';
                    '</div>';
    
                return tmplt;
                }
                function slider_move(parents, newW, sliderW) {
                console.log('16');
                var slider_new_val = parseInt(Math.round(newW / sliderW * 100));
    
                var slider_fill    = parents.find('.slider-fill');
                var slider_handle  = parents.find('.slider-handle');
                var range          = parents.find('input[type="range"]');
    
                slider_fill.css('width', slider_new_val +'%');
                slider_handle.css({
                    'left': slider_new_val +'%',
                    'transition': 'none',
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none'
                });
    
                range.val(slider_new_val);
    
                if(parents.hasClass('slider-discrete') === true) {
                console.log('17');
                    parents.find('.slider-handle span').text(slider_new_val);
                }
                }
}(jQuery));

$(".btn").click(function(){
    $(".input").toggleClass("active").focus;
    $(this).toggleClass("animate");
    $(".input").val("");
});




// var menu = document.querySelector(".menu"),
    // toggle = document.querySelector(".menu-toggle");

// function toggleToggle() {
//   toggle.classList.toggle("menu-open");
// };

// function toggleMenu() {
//   menu.classList.toggle("active");
// };

// toggle.addEventListener("click", toggleToggle, false);
// toggle.addEventListener("click", toggleMenu, false);
