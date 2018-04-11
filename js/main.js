$(document).ready(function(){
    if($('.s_about').length){
        if(Modernizr.mq('only screen and (max-width: 1165px)')){
            $('.s_about__body').prepend('<div class="s_about__item _fixer"></div>');
        }
        var Shuffle = window.Shuffle;
        var myShuffle = new Shuffle(document.querySelector('.s_about__body'), {
            itemSelector: '.s_about__item',
            sizer: '.s_about__sizer',
            speed: 700,
//            isCentered: true,
            gutterWidth: 20
        });
        Shuffle.ShuffleItem.Scale.HIDDEN = 0.5;
    }

    //header fixed color
    var header = $('.header'),
        headerHeight = $('.header').outerHeight(),
        elString = '<div class="header__temp" style="height: '+headerHeight+'px"></div>';
    header.wrap(elString);
    if($(window).scrollTop() > 0){
        header.addClass('_fixed');
    }else{
        header.removeClass('_fixed');
    }
    $(window).scroll(function(e){
        var windscroll = $(window).scrollTop();
        if(windscroll > 0){
            header.addClass('_fixed');
            $('section').each(function(i) {
                if ($(this).position().top <= windscroll + 50) {
                    $('nav a._active').removeClass('_active');
                    $('nav').find('#' + $(this).attr('class')).addClass('_active');
                }
            });
        }else{
            header.removeClass('_fixed');
            $('nav a._active').removeClass('_active');
        }
    }).scroll();

    //grid
    $('.s_about__item').click(function(){
        $(this).addClass('_active').siblings().removeClass('_active _nextrow');
        myShuffle.update();
    });

    //gmap init
    if($('#map').length){
        mapInitialize('map');
    }

    //video
    $('.s_video__video').click(function(){
        $(this).addClass('_active');
        players['player'].playVideo();
    });


    //menu
    $('nav a').on('click', function(e) {
        var scrollAnchor = $(this).attr('id');
        $('.header__nav').removeClass('_active');
        if(scrollAnchor){
            e.preventDefault();
            var scrollPoint = $('.' + scrollAnchor).offset().top - 28;
            $('body,html').animate({
                scrollTop: scrollPoint
            }, 500);
            return false;
        }else{
            if($(this).attr('href')="#"){
                e.preventDefault();
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            }
        }
    });

    //mobile nav
    $('.header__nav_hamb').click(function(){
        $('.header__nav').addClass('_active');
    });
    $('.header__nav_close').click(function(){
        $('.header__nav').removeClass('_active');
    });

    //popups
    $('._open_pop, .s_speak__item .g_link').click(function(e){
        e.preventDefault();
        var visible = $('.popup._visible'),
            name;
        if($(this).hasClass('_open_pop')){
            name = $(this).data('name');
        }else{
            name = 'video'
        };
        var popup = $('.popup_'+name),
            popup_h = popup.outerHeight(),
            popup_w = popup.outerWidth(),
            h = $(window).height(),
            px = h/2 - popup_h/2;
        popup.css({
            'top': px+'px',
            'margin-left': '-'+ popup_w/2 +'px',
        });
        if(name=="video"){
            players['player'].stopVideo();
            var link = $(this).data('src'),
                src = link.split('/');
            players['playerPop'].loadVideoById(src[src.length-1]);
        }else if(name=="thnx"){
            setTimeout(function(){
                popup.addClass('_back');
                setTimeout(function(){
                    $('.overlay, .popup').removeClass('_visible _back');
                },450);
            },3000);
        }
        $('.popup.popup_'+name+', .overlay').addClass('_visible');
    });
    $('.overlay, ._close_pop').click(function(e){
        e.preventDefault();
        var visiblePopup = $('.popup._visible');
        $('.overlay').removeClass('_visible');
        visiblePopup.addClass('_back');
        if(visiblePopup.hasClass('popup_video')){
            players['playerPop'].stopVideo();
        }
        setTimeout(function(){
            visiblePopup.removeClass('_visible _back');
        },450);
    });

    //vote btn enable
    var yeah1 = false,
        yeah2 = false;
    $('.s_vote__choose .g_radio').click(function(){
        yeah1 = true;
        if(yeah2){
            $('.s_vote__choose2_right .g_btn').removeClass('_disabled');
        }
    });
    $('.s_vote__choose2 .g_radio').click(function(){
        yeah2 = true;
        if(yeah1){
            $('.s_vote__choose2_right .g_btn').removeClass('_disabled');
        }
    });

    if(Modernizr.mq('only screen and (max-width: 960px)') & $('.s_speak').length){
        $('.s_speak__body').append($('.s_speak__inner .s_speak__item'));
        $('.s_speak__inner').remove();
    }
});

//gmap init
function mapInitialize(el_id) {
    var center = $('#'+el_id).data('center').split(','),
        zoom = $('#'+el_id).data('zoom');
    var center = new google.maps.LatLng(center[0],center[1]);
    var mapOptions = {
        zoom: zoom,
        center: center,
        mapTypeControl: false,
        scrollwheel: false,
        navigationControl: false,
        scaleControl: false,
        styles: mapStyles
    };
    var mapElement = document.getElementById(el_id);
    var map = new google.maps.Map(mapElement, mapOptions);

    var icoImg = {
        path: 'M409.1 109.2c-19.6-33.6-46.2-60.2-79.8-79.8C295.7 9.8 259.1 0 219.3 0c-39.8 0-76.5 9.8-110.1 29.4 -33.6 19.6-60.2 46.2-79.8 79.8C9.8 142.8 0 179.5 0 219.3c0 39.8 9.8 76.5 29.4 110.1 19.6 33.6 46.2 60.2 79.8 79.8 33.6 19.6 70.3 29.4 110.1 29.4s76.5-9.8 110.1-29.4c33.6-19.6 60.2-46.2 79.8-79.8 19.6-33.6 29.4-70.3 29.4-110.1C438.5 179.5 428.7 142.8 409.1 109.2zM353.7 297.2c-13.9 23.8-32.7 42.6-56.5 56.5 -23.8 13.9-49.8 20.8-77.9 20.8 -28.2 0-54.1-6.9-77.9-20.8 -23.8-13.9-42.6-32.7-56.5-56.5 -13.9-23.8-20.8-49.8-20.8-77.9 0-28.2 6.9-54.2 20.8-77.9 13.9-23.8 32.7-42.6 56.5-56.5 23.8-13.9 49.8-20.8 77.9-20.8 28.2 0 54.2 6.9 77.9 20.8 23.8 13.9 42.6 32.7 56.5 56.5 13.9 23.8 20.8 49.8 20.8 77.9C374.6 247.4 367.6 273.4 353.7 297.2z',
        fillColor: '#f15a38',
        fillOpacity: 1,
        scale: 0.2,
        strokeOpacity: 0
    };

    var points = $('#'+el_id).data('points').split(';');
    points.forEach(function(feature) {
        var dot_info = feature.split('['),
            dot = dot_info[0].split(','),
            content = dot_info[1];
        var marker = new google.maps.Marker({
            position: {
                lat: Number(dot[0]),
                lng: Number(dot[1])
            },
            icon: icoImg,
            map: map,
            title: "Мы находимся тут!",
            optimized: false
        });
    });
}

//load youtube iframe api
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = {};

function onYouTubePlayerAPIReady() {
    $(document).ready(function() {
        $('._video').each(function(event) {
            var iframeID = $(this).attr('id');
            players[iframeID] = new YT.Player(iframeID);
        });
    });
}

var mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fffbf8"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fffbf8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fffbf8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#dbeea7"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#f9bd79"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#3ca4dc"
            }
        ]
    }
];


//mobile hover disable
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return null;
}

if (getMobileOperatingSystem()) {
    try {
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) {}
}
