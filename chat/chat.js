var Chat = {
    settings: window.settings || {
        background: 'inherit',
        emoticonsScale: 1,
        fontLink: 'http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=latin,cyrillic',
        fontFamily: "'Open Sans Condensed', sans-serif",
        fontSize: 16,
        fontColor: '#000000',
        inAnimation: 'fadeInRight',
        outAnimation: 'fadeOutRight'
    },
    styles: {
        emoticonsStyles: []
    },

    updateChatStyle: function () {
        var background = Chat.settings.background || 'inherit';
        var fontLink = Chat.settings.fontLink || "http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=latin,cyrillic";
        var fontFamily = Chat.settings.fontFamily || "'Open Sans Condensed', sans-serif";
        var fontSize = Chat.settings.fontSize || 16;
        var fontColor = Chat.settings.fontColor || '#000';
        if (Chat.styles.chatStyle) {
            Chat.styles.chatStyle.remove();
            Chat.styles.chatStyle = undefined;
        }
        var fontCss = '';
        if (fontLink.match(/fonts\.googleapis\.com\/css\?/)) {
            fontCss = "@import url('" + fontLink + "');";
        }
        else {
            fontCss = "@font-face {font-family: 'custom'; src: url('" + fontLink + "');}";
            fontFamily = "'custom', sans-serif";
        }
        Chat.styles.chatStyle = Chat.addCss(fontCss + ' #chat {background: ' + background + ';} .line {font-family: ' + fontFamily + '; line-height: ' + fontSize + 'px; font-size: ' + fontSize + 'px; color: ' + fontColor + ';}');
    },

    changeBg: function (val) {
        Chat.settings.background = val;
        Chat.updateChatStyle();
    },

    changeFont: function (link, family) {
        Chat.settings.fontLink = link;
        Chat.settings.fontFamily = family;
        Chat.updateChatStyle();
    },

    changeFontSize: function (val) {
        Chat.settings.fontSize = val;
        Chat.updateChatStyle();
    },
    
    changeFontColor: function (val) {
        Chat.settings.fontColor = val;
        Chat.updateChatStyle();
    },

    changeEmoticonsScale: function (val) {
        Chat.settings.emoticonsScale = val;
        Chat.styles.emoticonsStyles.forEach(function (style) {
            style.remove();
        });
        emoticonsStyles = [];
        [TwitchChat.sname, GGChat.sname, Sc2tvChat.sname].forEach(function (chatName) {
            Chat.emoticonsLoaded(chatName);
        });
    },

    createMessageTwitch: function (source, channel, nick, userData, message, action) {
        message = Chat.emoticonizeTwitch(message, userData);
        var tagsSpan = '';
        ["staff", "admin", "moderator", "turbo", "subscriber"].forEach(function (type) {
            if (userData[type] == true)
                tagsSpan += '<span class="' + TwitchChat.sname + '-tag ' + TwitchChat.sname + '-' + type + '"></span>';
        });
        var nickSpan = ('<span class="nick" style="color: ' + userData.color + '">' + nick + '</span>');
        var messageSpan = '<span class="message">' + message + '</span>';
        var msgDiv = Chat.createMessage('<span class="source ' + TwitchChat.sname + '-source"></span>', tagsSpan, nickSpan, messageSpan);
        return msgDiv;
    },

    getColorClassByGroup: function (group) {
        var colorClass = "";
        switch (group) {
        case 0:
            colorClass = "casual";
            break;
        case 10:
        case 20:
            colorClass = "streamer";
            break;
        case 30:
        case 40:
        case 50:
            colorClass = "moder";
            break;
        default:
            colorClass = "casual";
            break
        }
        return colorClass;
    },
    getPaymentsLevel: function (amount) {
        var level = 0;
        if (amount >= 100 && amount < 300) {
            level = 1
        }
        if (amount >= 300 && amount < 500) {
            level = 2
        }
        if (amount >= 500) {
            level = 3
        }
        if (amount >= 3e3) {
            level = 4
        }
        if (amount >= 1e4) {
            level = 5
        }
        return level
    },

    createMessageGG: function (source, channel, nick, userData, message, action) {
        message = Chat.emoticonizeGG(message, userData);
        var classes = GGChat.sname + '-' + Chat.getColorClassByGroup(userData.user_rights);
        if (userData.premium)
            classes += ' ' + GGChat.sname + '-premium';
        if (userData.payments > 0)
            classes += ' ' + GGChat.sname + '-donat' + Chat.getPaymentsLevel(userData.payments);
        var tagsSpan = '';
        var nickSpan = '<span class="nick ' + GGChat.sname + '-nick ' + classes + '" style="">' + nick + '</span>';
        var messageSpan = '<span class="message">' + message + '</span>';
        var msgDiv = Chat.createMessage('<span class="source ' + GGChat.sname + '-source"></span>', tagsSpan, nickSpan, messageSpan);
        return msgDiv;
    },

    createMessageSc2tv: function (source, channel, nick, userData, message, action) {
        message = message.replace(/\[\/?b\]/g);
        message = Chat.emoticonizeSc2tv(message, userData);
        var classes = 'sc2tv-role-' + userData.role;
        var tagsSpan = '';
        if (userData.roleIds.indexOf(35) !== -1)
            tagsSpan += '<span class="' + Sc2tvChat.sname + '-top-antisupporter"></span>';
        if (userData.roleIds.indexOf(24) !== -1)
            tagsSpan += '<span class="' + Sc2tvChat.sname + '-top-supporter"></span>';
        var nickSpan = '<span class="nick ' + Sc2tvChat.sname + '-nick ' + classes + '" style="">' + nick + '</span>';
        var messageSpan = '<span class="message">' + message + '</span>';
        var msgDiv = Chat.createMessage('<span class="source ' + Sc2tvChat.sname + '-source"></span>', tagsSpan, nickSpan, messageSpan);
        return msgDiv;
    },
    
    createMessageCG: function (source, channel, nick, userData, message, action) {
        message = Chat.emoticonizeCG(message, userData);
        var nickSpan = '<span class="nick ' + CGChat.sname + '-nick" style="">' + nick + '</span>';
        var messageSpan = '<span class="message">' + message + '</span>';
        var msgDiv = Chat.createMessage('<span class="source ' + CGChat.sname + '-source"></span>', null, nickSpan, messageSpan);
        return msgDiv;
    },

    createMessage: function (source, tags, nick, msg) {
        var source = source || '',
            tags = tags || '',
            nick = nick || '',
            msg = msg || '';
        return $('<div class="line-inner">' + source + tags + nick + ': ' + msg + '</div>');
    },

    escape: function (message) {
        return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    insert: function (source, channel, nick, userData, message, action) {
        source = source || "chat";
        channel = channel || "main";
        nick = nick || "Chat";
        userData = userData || {};
        message = message || "";
        action = action || false;

        message = Chat.escape(message);
        var msgEl;
        if (source == TwitchChat.sname) {
            msgEl = Chat.createMessageTwitch(source, channel, nick, userData, message, action);
        } else if (source == Sc2tvChat.sname) {
            msgEl = Chat.createMessageSc2tv(source, channel, nick, userData, message, action);
        } else if (source == GGChat.sname) {
            msgEl = Chat.createMessageGG(source, channel, nick, userData, message, action);
        } else if (source == CGChat.sname) {
            msgEl = Chat.createMessageCG(source, channel, nick, userData, message, action);
        }

        msgEl.hide();
        $('#chat').append($('<div class="line"></div>').append(msgEl));

        if (Chat.settings.inAnimation)
            msgEl.addClass(Chat.settings.inAnimation + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass(Chat.settings.inAnimation + ' animated');
            });
        msgEl.show();
        $('#chat').dequeue();
        $('#chat').animate({
            scrollTop: $("#chat")[0].scrollHeight
        }, 1000, null, function () {
            var line;
            while ((line = $('.line').first()) && (line.offset().top + line.outerHeight()) < 0) {
                line.remove();
            }
        });
    },

    insertLog: function (source, channel, message) {
        source = source || "log";
        channel = channel || "main";
        message = message || "";
        //$('body').append('<b>LOG</b> (' + source + ') ' + message + '<br/>');
    },

    badgesLoaded: function (source, badges) {
        var cssString = '';
        $.each(badges, function (type, badge) {
            cssString += '.' + source + '-' + type + ' {background-image: url("' + badge.image + '"); }';
        });
        if (cssString)
            Chat.addCss(cssString);
    },

    emoticonsLoaded: function (source) {
        var emoticons = (source == TwitchChat.sname && TwitchChat.emoticons) || (source == GGChat.sname && GGChat.emoticons) || (source == Sc2tvChat.sname && Sc2tvChat.emoticons) || (source == CGChat.sname && CGChat.emoticons),
            cssString = '',
            zoom = Chat.settings.emoticonsScale || 1,
            lineHeight = Chat.settings.fontSize ? Chat.settings.fontSize + 6 : 19;
        emoticons.forEach(function (smile) {
            var scaledHeight = Math.round(smile.image.height * zoom),
                margin = '';
            if (scaledHeight > lineHeight)
                margin = 'margin: -' + (scaledHeight - lineHeight) / 2 + 'px 0px; ';
            cssString += '.' + source + '-emo-' + smile.n + ' {' + margin + 'background-image: url("' + smile.image.url + '");' +
                'height: ' + scaledHeight + 'px;' + 'width: ' + Math.round(smile.image.width * zoom) + 'px;}';
        });
        if (cssString)
            Chat.styles.emoticonsStyles.push(Chat.addCss(cssString));
    },

    emoticonizeTwitch: function (message, userData) {
        if (!userData.emotes) return message;
        userData.emotes.forEach(function (set) {
            if (TwitchChat.emoticons_sets[set] === undefined) return;
            TwitchChat.emoticons_sets[set].forEach(function (emoticon) {
                if (message.match(emoticon.regex)) {
                    message = message.replace(emoticon.regex, '<span class="' + TwitchChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
                }
            });
        });
        TwitchChat.emoticons_default.forEach(function (emoticon) {
            if (message.match(emoticon.regex)) {
                message = message.replace(emoticon.regex, '<span class="' + TwitchChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
            }
        });
        return message;
    },

    emoticonizeGG: function (message, userData) {
        if (userData.premium == undefined) return message;
        GGChat.emoticons_default.forEach(function (emoticon) {
            if (message.match(emoticon.regex)) {
                message = message.replace(emoticon.regex, '<span class="' + GGChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
            }
        });
        if (GGChat.emoticons_sets[this.channel_id] != undefined) {
            GGChat.emoticons_sets[this.channel_id].forEach(function (emoticon) {
                if (message.match(emoticon.regex)) {
                    message = message.replace(emoticon.regex, '<span class="' + GGChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
                }
            });
        }
        if (userData.premium == 1) {
            GGChat.emoticons_premium.forEach(function (emoticon) {
                if (message.match(emoticon.regex)) {
                    message = message.replace(emoticon.regex, '<span class="' + GGChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
                }
            });
            if (GGChat.emoticons_premium_sets[this.channel_id] != undefined) {
                GGChat.emoticons_premium_sets[this.channel_id].forEach(function (emoticon) {
                    if (message.match(emoticon.regex)) {
                        message = message.replace(emoticon.regex, '<span class="' + GGChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
                    }
                });
            }
        }
        return message;
    },

    emoticonizeSc2tv: function (message, userData) {
        if (!userData.roleIds) return message;
        userData.roleIds.forEach(function (set) {
            set = set.toString();
            if (Sc2tvChat.emoticons_sets[set] == undefined) {
                return message;
            }
            Sc2tvChat.emoticons_sets[set].forEach(function (emoticon) {
                if (message.match(emoticon.regex)) {
                    message = message.replace(emoticon.regex, '<span class="' + Sc2tvChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
                }
            });
        });
        return message;
    },
    
    emoticonizeCG: function (message, userData) {
        if (!userData.when) return message;
        CGChat.emoticons.forEach(function (emoticon) {
            if (message.match(emoticon.regex)) {
                message = message.replace(emoticon.regex, '<span class="' + CGChat.sname + '-emo-' + emoticon.n + ' emoticon"></span>');
            }
        });
        return message;
    },

    addCss: function (cssString) {
        var $css = $('<style></style>');
        $css.attr('type', 'text/css');
        $css.html(cssString);
        $("head").append($css);
        return $css;
    }

};

Chat.updateChatStyle();