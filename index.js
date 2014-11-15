var settings = {
    font: 'Open Sans Condensed',
    fontSize: 16,
    emoticonsScale: 1
};

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

$('#font option:contains("' + settings.font + '")').attr('selected', true);
$('#fontSize').val(settings.fontSize);
$('#framesIndent').val(settings.framesIndent);

$("#tabs").tabs();
$('#font').fontSelector({
    fontChange: function (e, ui) {
        $('#dummyChat')[0].contentWindow.Chat.changeFont(fonts[ui.font].link, fonts[ui.font].family);
        $('#dummyChat')[0].refresh();
    }
});
$('#fontSize option:contains("' + settings.fontSize + '")').attr('selected', true);
$('#fontSize').css('width', '75px').selectmenu({
    change: function (e, d) {
        $('#dummyChat')[0].contentWindow.Chat.changeFontSize(d.item.value);
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
        $('#dummyChat')[0].contentWindow.Chat.changeEmoticonsScale(ui.value / 100);
    }
});

/*var settings = {
    font: $('#font').val();
};

$('#font').fontSelector({
    fontChange: function (e, ui) {
        settings.font = ui.font;
    }
});
$('button').button();
$('#frames').buttonset();
for (var i = 1; i < 250; i++) {
    $('#frames').append($("<input type='radio' id='radio" + i + "' name='tipo' value='" + i + "'/><label for='radio" + i + "'>#" + i + "</label>"));
}
$('#frames').buttonset('refresh');*/

//alert("ASD");