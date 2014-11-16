var settings = Chat.settings;

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
    }
};

$.each(fonts, function (name, params) {
    $('#font').append('<option value="' + name + '">' + name + '</option>');
});

$('#font option[value="' + settings.font + '"]').attr('selected', true);
$('#fontSize').val(settings.fontSize);
$('#framesIndent').val(settings.framesIndent);

$("#tabs").tabs();
$('#font').fontSelector({
    fontChange: function (e, ui) {
        Chat.changeFont(fonts[ui.font].link, fonts[ui.font].family);
    }
});
$('#fontFile').change(function () {
    if (this.files[0].size > 2000000) {
        alert('Слишком большой файл');
        return;
    }
    var reader = new FileReader();
    reader.onloadend = function () {
        Chat.changeFont(reader.result, null);
    };
    reader.readAsDataURL(this.files[0]);
});
if (!settings.background || settings.background == 'inherit') {
    $('#noBackground').attr('checked', true);
}
$('#noBackground').change(function () {
    if (this.checked == true) {
        Chat.changeBg('inherit');
    } else {
        Chat.changeBg($('#background').val());
    }
});
$('#background').change(function () {
    $('#noBackground').attr('checked', false);
    Chat.changeBg(this.value);
});
$('#fontColor').val(settings.fontColor);
$('#fontColor').change(function () {
    Chat.changeFontColor(this.value);
});
$('#inAnimation option[value="' + settings.inAnimation + '"]').attr('selected', true);
$('#inAnimation').selectmenu({
    change: function (e, d) {
        Chat.settings.inAnimation = d.item.value;
    }
}).selectmenu("menuWidget").css('height', '250px');;
$('#fontSize option[value="' + settings.fontSize + '"]').attr('selected', true);
$('#fontSize').css('width', '75px').selectmenu({
    change: function (e, d) {
        Chat.changeFontSize(d.item.value);
    }
}).selectmenu("menuWidget").css('height', '250px');
$('#framesIndent').spinner();
$('#emoticonsScaleL').val(settings.emoticonsScale * 100 + '%');
$('#emoticonsScale').slider({
    value: settings.emoticonsScale * 100,
    min: 0,
    max: 150,
    slide: function (e, ui) {
        $('#emoticonsScaleL').val(ui.value + '%');
    },
    change: function (e, ui) {
        Chat.changeEmoticonsScale(ui.value / 100);
    }
});

$('#download').button().click(function (e) {
    e.preventDefault();
    var channelsString = '';
    $('#tabs-3 fieldset').each(function (n, channel) {
        if ($(channel).children('.channelUrl').val()) {
            var optVal = $(channel).children('.channelS').val();
            var source = (optVal == TwitchChat.sname && 'TwitchChat') || (optVal == GGChat.sname && 'GGChat') || (optVal == Sc2tvChat.sname && 'Sc2tvChat') || (optVal == CGChat.sname && 'CGChat');
            channelsString += 'new ' + source + '("' + $(channel).children('.channelUrl').val() + '");';
        }
    });
    var blob = new Blob(['<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Chat (dev)</title><link rel="stylesheet" type="text/css" href="http://dmitrym.github.io/MultiChatOnline/chat/chat.css"><link rel="stylesheet" type="text/css" href="http://dmitrym.github.io/MultiChatOnline/lib/animate.css"><script src="http://dmitrym.github.io/MultiChatOnline/lib/jquery.min.js"></script><script src="http://dmitrym.github.io/MultiChatOnline/lib/socket.io.js"></script><script src="http://dmitrym.github.io/MultiChatOnline/lib/sockjs.min.js"></script><script>var settings = ' + JSON.stringify(Chat.settings) + ';</script></head><body><div id="chat"></div><script src="http://dmitrym.github.io/MultiChatOnline/chat/chat.js"></script><script src="http://dmitrym.github.io/MultiChatOnline/chat/chats.js"></script><script>' + channelsString + '</script></body></html>'], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "Chat.html");
});

$('#addChannel').button().click(function (e) {
    $('#tabs-3').append('<fieldset><select class="channelS"><option value="twitch">Twitch</option><option value="gg">GG</option><option value="sc2tv">Sc2tv</option><option value="cg">CG</option></select><input type="text" class="channelUrl" placeholder="Адрес канала"><input type="button" class="deleteChannel" value="Удалить"></fieldset>');
    $('#tabs-3 .channelS').last().selectmenu();
    $('#tabs-3 .deleteChannel').last().button().click(function (e) {
        e.preventDefault();
        $(this).parent('fieldset').remove();
    });
});