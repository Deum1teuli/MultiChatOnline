var Chat = {
    settings: window.settings || {
        chatStyle: 'background-color:transparent;',
        lineStyle: "word-break: break-all;word-wrap: break-word;font-family:'Open Sans Condensed', sans-serif;font-size:16px;color:#000000;",
        emoticonsScale: 1,
        fontLink: 'http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=latin,cyrillic',
        emoticonize: true,
        colorNicks: true,
        nicksColor: '#000000',
        showSources: true,
        showTags: true,
        inAnimation: 'fadeInRight',
        outAnimation: 'fadeOutRight',
        fromStreamer: true,
        forStreamer: true,
        streamerAnimation: 'pulse',
        forStreamerAnimation: 'pulse',
        streamerMessageColor: '#ffff00',
        forStreamerMessageColor: '#00ff00',
        cutLinks: true
    },
    dynamicStyles: null,
    ggBadges: ['\ue012', '\ue60c', '\ue611', '\ue60f', '\ue607'],
    fontSize: 16,
    messageQueue: [],
    resizing: false,
    resizingTimer: null,
    startPos: 30,
    lastPos: 0,
    endPos: 0,

    init: function () {
        $('#chat').append($('<div id="chat-inner"></div>'));
        Chat.updateStyles();
        Chat.update();
        $(window).resize(function () {
            $('#chat-inner').css('border', '2px dashed black');
            clearTimeout(Chat.resizingTimer);
            Chat.resizing = true;
            Chat.resizingTimer = setTimeout(function () {
                $('#chat-inner').css('border', '');
                Chat.resizing = false;
                Chat.update();
            }, 100);
        });
    },

    updateStyles: function () {
        if (Chat.dynamicStyles) {
            Chat.dynamicStyles.remove();
            Chat.dynamicStyles = null;
        }
        var fontCss = '';
        if (Chat.settings.fontLink && Chat.settings.fontLink.match(/fonts\.googleapis\.com\/css\?/)) {
            fontCss = "@import url('" + Chat.settings.fontLink + "');";
        } else {
            fontCss = "@font-face {font-family: 'custom'; src: url('" + Chat.settings.fontLink + "');}";
        }
        var bounds = 'left:' + 30 + 'px;' + 'right:' + 30 + 'px;';
        var chatInnerStyle = 'top: ' + Chat.startPos + 'px;bottom:' + Chat.startPos + 'px;' + bounds;
        var nickStyle = '';
        if (!Chat.settings.colorNicks)
            nickStyle = '.nick {color:' + Chat.settings.nicksColor + ';}';
        Chat.dynamicStyles = Chat.addCss(fontCss + '#chat-inner {' + chatInnerStyle + Chat.settings.chatStyle + '} .line {' + bounds + Chat.settings.lineStyle + '} .fromStreamer {color:' + Chat.settings.streamerMessageColor + '!important;} .forStreamer {color:' + Chat.settings.forStreamerMessageColor + '!important;}' + nickStyle);
        var $tmpEl = $('<div></div>').attr('style', Chat.settings.lineStyle);
        Chat.fontSize = parseInt($tmpEl.css('font-size') || 16);
        $tmpEl.remove();
    },

    update: function () {
        Chat.endPos = $('#chat').outerHeight() - Chat.startPos;
        Chat.lastPos = Chat.startPos;
        $('.line').remove();
        var queue = Chat.messageQueue.slice(0);
        queue.forEach(function (message) {
            Chat.insert(message, true);
        });
    },

    changeSettings: function (name, value, updateStyles, updateChat) {
        updateStyles = updateStyles || false;
        updateChat = updateChat || false;
        Chat.settings[name] = value;
        if (updateStyles)
            Chat.updateStyles();
        if (updateChat)
            Chat.update();
    },

    addCss: function (cssString) {
        var $css = $('<style></style>');
        $css.attr('type', 'text/css');
        $css.html(cssString);
        $("head").append($css);
        return $css;
    },

    badgesLoaded: function (source, badges) {
        var cssString = '';
        $.each(badges, function (type, badge) {
            cssString += '.' + source.static.sname + '-' + type + ' {background-image: url("' + badge.image + '"); }';
        });
        if (cssString)
            Chat.addCss(cssString);
    },

    emoticonsLoaded: function () {},

    getEmoticonHtml: function (source, emoticon) {
        var zoom = Chat.settings.emoticonsScale || 1,
            lineHeight = Chat.fontSize ? Chat.fontSize + 6 : 19,
            scaledHeight = Math.round(emoticon.image.height * zoom),
            margin = '';
        if (scaledHeight > lineHeight)
            margin = 'margin: -' + 3 + 'px 0px; ';
        var cssString = margin + 'background-image: url(\'' + emoticon.image.url + '\');' +
            'height: ' + scaledHeight + 'px;' + 'width: ' + Math.round(emoticon.image.width * zoom) + 'px;';
        return '<span class="emoticon" style="' + cssString + '"></span>';
    },

    createMessageTwitch: function (message) {
        var tags = '';
        ["staff", "admin", "moderator", "turbo", "subscriber"].forEach(function (type) {
            if (message.userData[type] == true)
                tags += '<span class="' + TwitchChat.sname + '-tag ' + TwitchChat.sname + '-' + type + '"></span>';
        });
        var nick = ('<span class="nick" ' + (Chat.settings.colorNicks ? ('style="color: ' + (message.userData.color.charAt(0) == '#' ? message.userData.color : '#' + message.userData.color) + '"') : '') + '>' + message.from + '</span>');
        var msg = '<span class="message ' + ((message.isStreamer() && 'fromStreamer') || (message.isForStreamer() && 'forStreamer')) + '">' + (Chat.settings.emoticonize ? message.getEmoticonizedMessage() : message.message) + '</span>';
        var msgEl = Chat.createMessage('<span class="source ' + TwitchChat.sname + '-source"></span>', tags, nick, msg);
        return msgEl;
    },

    createMessageGG: function (message) {
        var classes = GGChat.sname + '-' + GGChat.getGroup(message.userData.user_rights);
        var tagSymbol = '';
        var tags = '';
        if (message.userData.premium) {
            classes += ' ' + GGChat.sname + '-premium';
            tagSymbol = Chat.ggBadges[0];
        }
        if (message.userData.payments > 0) {
            var paymentsLevel = GGChat.getPaymentsLevel(message.userData.payments);
            classes += ' ' + GGChat.sname + '-donat' + paymentsLevel;
            tagSymbol = Chat.ggBadges[paymentsLevel];
        }
        if (tagSymbol)
            var tags = '<span class="' + classes + ' gg-tag">' + tagSymbol + '</span>';
        var nick = '<span class="nick ' + (Chat.settings.colorNicks ? (GGChat.sname + '-nick ' + classes) : '') + '" style="">' + message.from + '</span>';
        var msg = '<span class="message ' + ((message.isStreamer() && 'fromStreamer') || (message.isForStreamer() && 'forStreamer')) + '">' + (Chat.settings.emoticonize ? message.getEmoticonizedMessage() : message.message) + '</span>';
        var msgEl = Chat.createMessage('<span class="source ' + GGChat.sname + '-source"></span>', tags, nick, msg);
        return msgEl;
    },

    createMessageSc2tv: function (message) {
        var classes = 'sc2tv-role-' + message.userData.role;
        var tags = '';
        Sc2tvChat.getBadges(message.userData.roleIds).forEach(function (badge) {
            tags += '<span class="' + Sc2tvChat.sname + '-' + badge + '"></span>';
        });
        var nick = '<span class="nick ' + (Chat.settings.colorNicks ? (Sc2tvChat.sname + '-nick ' + classes) : '') + '" style="">' + message.from + '</span>';
        var msg = '<span class="message ' + ((message.isStreamer() && 'fromStreamer') || (message.isForStreamer() && 'forStreamer')) + '">' + (Chat.settings.emoticonize ? message.getEmoticonizedMessage() : message.message) + '</span>';
        var msgEl = Chat.createMessage('<span class="source ' + Sc2tvChat.sname + '-source"></span>', tags, nick, msg);
        return msgEl;
    },

    createMessageCG: function (message) {
        var nick = '<span class="nick ' + (Chat.settings.colorNicks ? (CGChat.sname + '-nick') : '') + '" style="">' + message.from + '</span>';
        var msg = '<span class="message ' + ((message.isStreamer() && 'fromStreamer') || (message.isForStreamer() && 'forStreamer')) + '">' + (Chat.settings.emoticonize ? message.getEmoticonizedMessage() : message.message) + '</span>';
        var msgDiv = Chat.createMessage('<span class="source ' + CGChat.sname + '-source"></span>', '', nick, msg);
        return msgDiv;
    },

    createMessage: function (source, tags, nick, msg) {
        var source = source || '',
            tags = tags || '',
            nick = nick || '',
            msg = msg || '';
        return $('<div class="line"><div class="line-inner">' + (Chat.settings.showSources ? source : '') + (Chat.settings.showTags ? tags : '') + nick + ': ' + msg + '</div></div>');
    },

    insert: function (message, fromQueue) {
        fromQueue = fromQueue || false;

        if (!fromQueue)
            Chat.messageQueue.push(message);
        if (Chat.resizing)
            return;
        message.escape();
        if (message.source.static.sname == Sc2tvChat.sname)
            message.removeBBCode();
        
        if (Chat.settings.cutLinks)
            message.cutLinks();

        var msgEl;
        if (message.source.static.sname == TwitchChat.sname) {
            msgEl = Chat.createMessageTwitch(message);
        } else if (message.source.static.sname == GGChat.sname) {
            msgEl = Chat.createMessageGG(message);
        } else if (message.source.static.sname == Sc2tvChat.sname) {
            msgEl = Chat.createMessageSc2tv(message);
        } else if (message.source.static.sname == CGChat.sname) {
            msgEl = Chat.createMessageCG(message);
        }

        if (!msgEl)
            return;

        msgEl.offset({
            top: Chat.lastPos
        }).data('newTop', Chat.lastPos).data('message', message);
        msgEl.css('visibility', 'hidden');
        $('#chat').append(msgEl);
        msgEl.data('height', msgEl.outerHeight());
        Chat.lastPos += msgEl.data('height');

        if (!fromQueue && Chat.settings.inAnimation && Chat.settings.inAnimation != 'нет') {
            msgEl.addClass(Chat.settings.inAnimation + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $this = $(this);
                if ($this.hasClass(Chat.settings.inAnimation)) {
                    $this.removeClass(Chat.settings.inAnimation + ' animated');
                    if (Chat.settings.fromStreamer && Chat.settings.streamerAnimation && Chat.settings.streamerAnimation != 'нет' && message.isStreamer())
                        $this.children('.line-inner').addClass(Chat.settings.streamerAnimation + ' animated');
                    else if (Chat.settings.forStreamer && Chat.settings.forStreamerAnimation && Chat.settings.forStreamerAnimation != 'нет' && message.isForStreamer())
                        $this.children('.line-inner').addClass(Chat.settings.forStreamerAnimation + ' animated');
                }
            });
        } else if (Chat.settings.fromStreamer && Chat.settings.streamerAnimation && Chat.settings.streamerAnimation != 'нет' && message.isStreamer())
            msgEl.children('.line-inner').addClass(Chat.settings.streamerAnimation + ' animated');
        else if (Chat.settings.forStreamer && Chat.settings.forStreamerAnimation && Chat.settings.forStreamerAnimation != 'нет' && message.isForStreamer())
            msgEl.children('.line-inner').addClass(Chat.settings.forStreamerAnimation + ' animated');
        msgEl.css('visibility', 'visible');

        if ((msgEl.data('newTop') + msgEl.data('height')) > Chat.endPos) {
            $('.line').each(function (n, line) {
                $line = $(line);
                $line.data('newTop', $line.data('newTop') - msgEl.data('height'));
                if ($line.data('newTop') < Chat.startPos) {
                    if (!fromQueue && Chat.settings.outAnimation && Chat.settings.outAnimation != 'нет') {
                        $line.addClass(Chat.settings.outAnimation + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            if (!$(this).data('message')) return;
                            Chat.messageQueue.shift();
                            /*var mIndex = Chat.messageQueue.indexOf($(this).data('message'));
                            if (mIndex >= 0)
                                Chat.messageQueue.splice(mIndex, 1);*/
                            $(this).remove();
                        });
                    } else {
                        Chat.messageQueue.shift();
                        /*var mIndex = Chat.messageQueue.indexOf($(this).data('message'));
                        if (mIndex >= 0)
                            Chat.messageQueue.splice(mIndex, 1);*/
                        $line.remove();
                    }
                } else {
                    if (!fromQueue) {
                        $line.stop().animate({
                            top: $line.data('newTop')
                        });
                    } else {
                        $line.offset({
                            top: $line.data('newTop')
                        });
                    }
                }
            });
            Chat.lastPos -= msgEl.data('height');
        }
    },

    insertLog: function (source, channel, message) {}
};

$(document).ready(function () {
    Chat.init();
});