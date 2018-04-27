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
        ymaps.ready(init);
        function init(){
            mapInitialize('map');
        }
    }

    //video
    $('.s_video__video').click(function(){
        $(this).addClass('_active');
        players['player'].playVideo();
    });

    $(".s_win__form").each(function(){
        var it = $(this);
        it.validate({
            rules: {
                form: {required: false},
                mail: {required: true}
            },
            messages: {},
            errorPlacement: function (error, element) {},
            submitHandler: function (form) {
                var data = new FormData(it[0]);
                $.ajax({
                    url: 'mail.php',
                    type: 'POST',
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function( respond, textStatus, jqXHR ){
                        $('.s_win__form_thnx').addClass('_active');
                        setTimeout(function () {
                            $('.s_win__form_thnx').removeClass('_active');
                        }, 2000);
                        $("form").trigger( 'reset' );
                    },
                    error: function( jqXHR, textStatus, errorThrown ){
                        console.log('ОШИБКИ AJAX запроса: ' + textStatus );
                    }
                });
            },
            success: function () {
            },
            highlight: function (element, errorClass) {
                $(element).addClass('_error');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass('_error');
            }
        });
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

function mapInitialize(el_id) {
    var center = $('#'+el_id).data('center').split(','),
        points = $('#'+el_id).data('points').split(';'),
        zoom = $('#'+el_id).data('zoom'),
        dot_info = points[0].split('['),
        dot = dot_info[0].split(','),
        content = dot_info[1];
    ymaps.ready(function () {
        var myMap = new ymaps.Map(el_id, {
            center: [center[0],center[1]],
            zoom: zoom,
            controls: [ 'typeSelector', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        }),

            //Маркер
            myPlacemark = new ymaps.Placemark([dot[0],dot[1]], {
//                hintContent: content,
//                balloonContent: content
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: 'images/pin.png',
                // Размеры метки.
                iconImageSize: [72, 98],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-53, -105]
            })

        myMap.geoObjects.add(myPlacemark);


        // Создаем ломаную с помощью вспомогательного класса Polyline.
        var myPolyline1 = new ymaps.Polyline([
            // Указываем координаты вершин ломаной.
            [55.768454, 37.649359],
            [55.764067, 37.656534],
            [55.766666, 37.663687],
            [55.772154, 37.674063],
            [55.773170, 37.678415],
            [55.772412, 37.678665]
        ], {
        }, {
            // Задаем опции геообъекта.
            // Отключаем кнопку закрытия балуна.
            balloonCloseButton: false,
            // Цвет линии.
            strokeColor: "#245ba2",
            // Ширина линии.
            strokeWidth: 4,
            // Коэффициент прозрачности.
            strokeOpacity: 0.8
        });
        var myPolyline2 = new ymaps.Polyline([
            // Указываем координаты вершин ломаной.
            [55.766787, 37.659664],
            [55.765649, 37.660900]
        ], {
        }, {
            // Задаем опции геообъекта.
            // Отключаем кнопку закрытия балуна.
            balloonCloseButton: false,
            // Цвет линии.
            strokeColor: "#245ba2",
            // Ширина линии.
            strokeWidth: 4,
            // Коэффициент прозрачности.
            strokeOpacity: 0.8
        });
        // Добавляем линии на карту.
        myMap.geoObjects.add(myPolyline1);
        myMap.geoObjects.add(myPolyline2);

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
