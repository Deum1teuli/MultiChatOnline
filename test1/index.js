(function () {

    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    $regLineStyle = $('<div></div>');
    $chatStyle = $('<div></div>');

    function getRegLineStyle() {
        var resStyle = '';
        ['word-break', 'word-wrap', 'font-family', 'font-size', 'color'].forEach(function (style) {
            if ($regLineStyle.css(style))
                resStyle += style + ':' + $regLineStyle.css(style) + ';';
        });
        return resStyle;
    }

    function getChatStyle() {
        var resStyle = '';
        ['background-color'].forEach(function (style) {
            if ($chatStyle.css(style))
                resStyle += style + ':' + $chatStyle.css(style) + ';';
        });
        return resStyle;
    }

    function fFF(val) {
        return $('<div></div').css('font-family', val).css('font-family');
    }

    var fonts = {
        "Open Sans": {
            link: "http://fonts.googleapis.com/css?family=Open+Sans&subset=latin,cyrillic",
            family: "'Open Sans', sans-serif"
        },
        "Roboto Condensed": {
            link: "http://fonts.googleapis.com/css?family=Roboto+Condensed&subset=latin,cyrillic",
            family: "'Roboto Condensed', sans-serif"
        },
        "PT Sans": {
            link: "http://fonts.googleapis.com/css?family=PT+Sans&subset=latin,cyrillic",
            family: "'PT Sans', sans-serif"
        },
        "Open Sans Condensed": {
            link: "http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=latin,cyrillic",
            family: "'Open Sans Condensed', sans-serif"
        },
        "Roboto Slab": {
            link: "http://fonts.googleapis.com/css?family=Roboto+Slab&subset=latin,cyrillic",
            family: "'Roboto Slab', serif"
        },
        "Lobster": {
            link: "http://fonts.googleapis.com/css?family=Lobster&subset=latin,cyrillic",
            family: "'Lobster', cursive"
        },
        "Play": {
            link: "http://fonts.googleapis.com/css?family=Play&subset=latin,cyrillic",
            family: "'Play', sans-serif"
        },
        "Ubuntu Condensed": {
            link: "http://fonts.googleapis.com/css?family=Ubuntu+Condensed&subset=latin,cyrillic",
            family: "'Ubuntu Condensed', sans-serif"
        },
        "Poiret One": {
            link: "http://fonts.googleapis.com/css?family=Poiret+One&subset=latin,cyrillic",
            family: "'Poiret One', cursive"
        },
        "Ubuntu Mono": {
            link: "http://fonts.googleapis.com/css?family=Ubuntu+Mono&subset=latin,cyrillic",
            family: "'Ubuntu Mono', sans-serif"
        },
        "Comfortaa": {
            link: "http://fonts.googleapis.com/css?family=Comfortaa&subset=latin,cyrillic",
            family: "'Comfortaa', cursive"
        },
        "Marck Script": {
            link: "http://fonts.googleapis.com/css?family=Marck+Script&subset=latin,cyrillic",
            family: "'Marck Script', cursive"
        },
        "Neucha": {
            link: "http://fonts.googleapis.com/css?family=Neucha&subset=latin,cyrillic",
            family: "'Neucha', cursive"
        },
        "Bad Script": {
            link: "http://fonts.googleapis.com/css?family=Bad+Script&subset=latin,cyrillic",
            family: "'Bad Script', cursive"
        },
        "Kelly Slab": {
            link: "http://fonts.googleapis.com/css?family=Kelly+Slab&subset=latin,cyrillic",
            family: "'Kelly Slab', cursive"
        },
        "Press Start 2P": {
            link: "http://fonts.googleapis.com/css?family=Press+Start+2P&subset=latin,cyrillic",
            family: "'Press Start 2P', cursive"
        },
        "Ruslan Display": {
            link: "http://fonts.googleapis.com/css?family=Ruslan+Display&subset=latin,cyrillic",
            family: "'Ruslan Display', cursive"
        },
        "Underdog": {
            link: "http://fonts.googleapis.com/css?family=Underdog&subset=latin,cyrillic",
            family: "'Underdog', cursive"
        },
        "Fira Mono": {
            link: "http://fonts.googleapis.com/css?family=Fira+Mono&subset=latin,cyrillic",
            family: "'Fira Mono', cursive"
        },
        "Helvetica": {
            family: "'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"
        }
    };

    var fontSizes = [10, 11, 12, 14, 16, 18, 21, 24, 36];

    var inAnimations = ['нет', 'flash', 'rubberBand', 'tada', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'flipInX', 'flipInY', 'lightSpeedIn', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rollIn', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp'];

    var outAnimations = ['нет', 'hinge', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flipOutX', 'flipOutY', 'lightSpeedOut', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'rollOut', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp'];

    $.widget("custom.fontselectmenu", $.ui.selectmenu, {
        _renderItem: function (ul, item) {
            var li = $("<li>", {
                text: item.label
            });

            if (item.disabled) {
                li.addClass("ui-state-disabled");
            }

            li.css('font-family', fonts[item.value].family);

            return li.appendTo(ul);
        }
    });

    $('#tabs').tabs();

    $regLineStyle.attr('style', Chat.settings.lineStyle);

    $.each(fonts, function (name, values) {
        $('#font').append('<option value="' + name + '"' + ((fFF(values.family) == $regLineStyle.css('font-family')) ? ' selected="selected"' : '') + '>' + name + '</option>');
        if (values.link)
            $('head').append("<link href='" + values.link + "' rel='stylesheet' type='text/css'>");
    });
    $('#font').fontselectmenu({
        change: function (e, data) {
            $('#font-button .ui-selectmenu-text').css('font-family', fonts[data.item.value].family);
            $regLineStyle.css('font-family', fonts[data.item.value].family);
            Chat.changeSettings('fontLink', fonts[data.item.value].link);
            Chat.changeSettings('lineStyle', getRegLineStyle(), true, true);
        }
    }).fontselectmenu('menuWidget').addClass('overflow');
    if (fonts[$('#font').val()])
        $('#font-button .ui-selectmenu-text').css('font-family', fonts[$('#font').val()].family);

    $('#fontFile').change(function () {
        if (this.files[0].size > 2000000) {
            alert('Слишком большой файл');
            return;
        }
        var reader = new FileReader();
        reader.onloadend = function () {
            Chat.changeSettings('fontLink', reader.result, false, false);
            $regLineStyle.css('font-family', "custom, 'sans-serif'");
            Chat.changeSettings('lineStyle', getRegLineStyle(), true, true);
        };
        reader.readAsDataURL(this.files[0]);
    });

    fontSizes.forEach(function (size) {
        $('#fontSize').append('<option value="' + size + 'px">' + size + '</option>');
    });
    $('#fontSize').children('option[value=' + $regLineStyle.css('font-size') + ']').attr('selected', 'selected');

    $('#fontSize').selectmenu({
        change: function (e, data) {
            $regLineStyle.css('font-size', data.item.value);
            Chat.changeSettings('lineStyle', getRegLineStyle(), true, true);
        }
    }).selectmenu('menuWidget').addClass('overflow');

    $('#fontColor').val(rgb2hex($regLineStyle.css('color')));
    $('#fontColor').change(function () {
        $regLineStyle.css('color', this.value);
        Chat.changeSettings('lineStyle', getRegLineStyle(), true, true);
    });

    $chatStyle.attr('style', Chat.settings.chatStyle);

    $('#background').change(function () {
        $('#noBackground').attr('checked', false);
        $chatStyle.css('background-color', this.value);
        Chat.changeSettings('chatStyle', getChatStyle(), true);
    });

    if (!$chatStyle.css('background-color') || $chatStyle.css('background-color') == 'transparent') {
        $('#noBackground').attr('checked', true);
    } else {
        $('#background').val(rgb2hex($chatStyle.css('background-color')));
    }
    $('#noBackground').change(function () {
        if (this.checked == true) {
            $chatStyle.css('background-color', 'transparent');
            Chat.changeSettings('chatStyle', getChatStyle(), true);
        } else {
            $chatStyle.css('background-color', $('#background').val());
            Chat.changeSettings('chatStyle', getChatStyle(), true);
        }
    });

    inAnimations.forEach(function (animation) {
        $('#inAnimation').append('<option value="' + animation + '">' + animation + '</option>');
    });

    $('#inAnimation').children('option[value=' + Chat.settings.inAnimation + ']').attr('selected', 'selected');
    $('#inAnimation').selectmenu({
        change: function (e, data) {
            Chat.settings.inAnimation = data.item.value;
        }
    }).selectmenu('menuWidget').addClass('overflow');

    outAnimations.forEach(function (animation) {
        $('#outAnimation').append('<option value="' + animation + '">' + animation + '</option>');
    });

    $('#outAnimation').children('option[value=' + Chat.settings.outAnimation + ']').attr('selected', 'selected');
    $('#outAnimation').selectmenu({
        change: function (e, data) {
            Chat.settings.outAnimation = data.item.value;
        }
    }).selectmenu('menuWidget').addClass('overflow');

    $("#emoticonsScale").slider({
        value: Chat.settings.emoticonsScale * 100,
        min: 25,
        max: 200,
        step: 5,
        slide: function (event, ui) {
            $('#emoticonsScaleL').val(ui.value + '%');
        },
        change: function (e, data) {
            Chat.changeSettings('emoticonsScale', data.value / 100, false, true);
        }
    });

    $('#showSources').attr('checked', Chat.settings.showSources);
    $('#showSources').change(function () {
        Chat.changeSettings('showSources', this.checked, false, true);
    });

    $('#showBadges').attr('checked', Chat.settings.showTags);
    $('#showBadges').change(function () {
        Chat.changeSettings('showTags', this.checked, false, true);
    });

    $('#breakWords').attr('checked', !($regLineStyle.css('word-break') == 'break-all' && $regLineStyle.css('word-wrap') == 'break-word'));
    $('#breakWords').change(function () {
        if (!this.checked) {
            $regLineStyle.css('word-break', 'break-all');
            $regLineStyle.css('word-wrap', 'break-word');
        } else {
            $regLineStyle.css('word-break', 'normal');
            $regLineStyle.css('word-wrap', 'normal');
        }
        Chat.changeSettings('lineStyle', getRegLineStyle(), true, true);
    });

    $('#colorNicks').attr('checked', Chat.settings.colorNicks);
    $('#colorNicks').change(function () {
        Chat.changeSettings('colorNicks', this.checked, true, true);
    });

    $('#nicksColor').val(Chat.settings.nicksColor);
    $('#nicksColor').change(function () {
        Chat.changeSettings('nicksColor', this.value, true);
    });

    $('#cutLinks').attr('checked', Chat.settings.cutLinks);
    $('#cutLinks').change(function () {
        Chat.changeSettings('cutLinks', this.checked, false, true);
    });

    $('#streamerMessageColor').val(Chat.settings.streamerMessageColor);
    $('#streamerMessageColor').change(function () {
        Chat.changeSettings('streamerMessageColor', this.value, true);
    });

    $('#forStreamerMessageColor').val(Chat.settings.forStreamerMessageColor);
    $('#forStreamerMessageColor').change(function () {
        Chat.changeSettings('forStreamerMessageColor', this.value, true);
    });

    $('#fromStreamer').attr('checked', Chat.settings.fromStreamer);
    $('#fromStreamer').change(function () {
        Chat.changeSettings('fromStreamer', this.checked, true, true);
    });

    $('#forStreamer').attr('checked', Chat.settings.forStreamer);
    $('#forStreamer').change(function () {
        Chat.changeSettings('forStreamer', this.checked, true, true);
    });

    $('#addChannel').button().click(function (e) {
        var $form = $('<div class="row"><div class="column"><select class="channelS"><option value="twitch">Twitch</option><option value="gg">GoodGame</option><option value="sc2tv">Sc2tv</option><option value="cg">Cybergame</option></select></div><div class="column channelInput" style="vertical-align:middle;">http://www.twitch.tv/<input type="text" class="channelUrl" style="height:28px;" placeholder="канал"></div><div class="column"><input type="button" class="deleteChannel" value="Удалить"></div></div>');
        $('#tabs-3').append($form);
        $form.find('.channelS').selectmenu({
            change: function (e, data) {
                if (data.item.value == 'twitch') {
                    $form.find('.channelInput').html('http://www.twitch.tv/<input type="text" class="channelUrl" style="height:28px;" placeholder="канал">');
                } else if (data.item.value == 'gg') {
                    $form.find('.channelInput').html('http://goodgame.ru/channel/<input type="text" class="channelUrl" style="height:28px;" placeholder="канал">');
                } else if (data.item.value == 'sc2tv') {
                    $form.find('.channelInput').html('http://sc2tv.ru/channel/<input type="text" class="channelUrl" style="height:28px;" placeholder="канал">');
                } else if (data.item.value == 'cg') {
                    $form.find('.channelInput').html('http://cybergame.tv/<input type="text" class="channelUrl" style="height:28px;" placeholder="канал">');
                }
            }
        });
        $form.find('.deleteChannel').button().click(function (e) {
            e.preventDefault();
            $form.remove();
        });
    });

    $('#download').button().click(function (e) {
        e.preventDefault();
        var channelsString = '';
        $('#tabs-3 .row').each(function (n, channel) {
            if ($(channel).find('.channelUrl').val()) {
                var optVal = $(channel).find('.channelS').val();
                var source = (optVal == TwitchChat.sname && 'TwitchChat') || (optVal == GGChat.sname && 'GGChat') || (optVal == Sc2tvChat.sname && 'Sc2tvChat') || (optVal == CGChat.sname && 'CGChat');
                channelsString += 'new ' + source + '("' + $(channel).find('.channelUrl').val() + '");';
            }
        });
        var settings = JSON.stringify(Chat.settings);
        $.get('ChatTemplate.html', null, null, 'text').done(function (data) {
            var blob = new Blob([data.replace(/\{url\}/g, 'http://dmitrym.github.io/MultiChatOnline/test1/').replace('{settings}', settings).replace('{channels}', channelsString)], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "Chat.html");
        });
    });
    
    $('#downloadAll').button().click(function (e) {
        e.preventDefault();
        var channelsString = '';
        $('#tabs-3 .row').each(function (n, channel) {
            if ($(channel).find('.channelUrl').val()) {
                var optVal = $(channel).find('.channelS').val();
                var source = (optVal == TwitchChat.sname && 'TwitchChat') || (optVal == GGChat.sname && 'GGChat') || (optVal == Sc2tvChat.sname && 'Sc2tvChat') || (optVal == CGChat.sname && 'CGChat');
                channelsString += 'new ' + source + '("' + $(channel).find('.channelUrl').val() + '");';
            }
        });
        var settings = JSON.stringify(Chat.settings);
        $.when($.get('ChatTemplate.html', null, null, 'text'),
              $.get('chat/chat.css', null, null, 'text'),
              $.get('lib/animate.css', null, null, 'text'),
              $.get('lib/jquery.min.js', null, null, 'text'),
              $.get('lib/socket.io.js', null, null, 'text'),
              $.get('lib/sockjs.min.js', null, null, 'text'),
              $.get('chat/chat.js', null, null, 'text'),
              $.get('chat/chats.js', null, null, 'text')).done(function (d1, d2, d3, d4, d5, d6, d7, d8) {
            var zip = new JSZip();
            zip.file("Chat.html", d1[0].replace(/\{url\}/g, '').replace('{settings}', settings).replace('{channels}', channelsString));
            var chat = zip.folder("chat");
            chat.file('chat.css', d2[0]);
            chat.file('chat.js', d7[0]);
            chat.file('chats.js', d8[0]);
            var lib = zip.folder("lib");
            lib.file('animate.css', d3[0]);
            lib.file('jquery.min.js', d4[0]);
            lib.file('socket.io.js', d5[0]);
            lib.file('sockjs.min.js', d6[0]);
            var content = zip.generate({type:"blob"});
            saveAs(content, "Chat.zip");
        });
    });

})();