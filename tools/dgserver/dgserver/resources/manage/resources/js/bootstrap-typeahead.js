/* bootstrap-typeahead.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * ============================================================ */
!function ($) {
    "use strict"; // jshint ;_;

    /* TYPEAHEAD PUBLIC CLASS DEFINITION
     * ================================= */

    var Typeahead = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.typeahead.defaults, options)
        this.matcher = this.options.matcher || this.matcher
        this.sorter = this.options.sorter || this.sorter
        this.highlighter = this.options.highlighter || this.highlighter
        this.updater = this.options.updater || this.updater

        this.$menu = $(this.options.menu).appendTo('body')
        this.source = this.options.source
        this.propName = this.options.propName || ""
        this.labeler = this.options.labeler || [this.propName]
        this.shown = false
        this.showType = this.options.showType
        this.callback1 = this.options.callback1 || ''
        this.callback2 = this.options.callback2 || ''
        this.listen()
    }

    Typeahead.prototype = {

        constructor: Typeahead,
        propName: 'value',
        labeler: ['value'],
        select: function () {
            var active = this.$menu.find('.active');
            var val = active.attr('data-value')
            var row = active.data('bootstrap-typeahead-item');
            this.$element.val(this.updater(val)).change();
            this.$element.next().next().fadeIn(0)

            if (this.callback2) {
                var data = new Array(row);
                this.callback2(this, data);
            }

            return this.hide()
        },
        updater: function (item) {
            return item;
        },
        show: function () {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            })
            var input = this.$element[0];
            this.$menu.css({
                top: pos.top + pos.height,
                left: 'auto',
                right: 94 + "px",
                width: 300 + "px"
            })

            this.$menu.show()
            this.shown = true
            return this
        },
        hide: function () {
            try {
                this.$menu.hide()
            } catch (e) { }
            this.shown = false
            return this
        },
        lookup: function (event) {
            var items

            this.query = this.$element.val().replace(/[ ]/g, "");

            items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

            if (!this.objLen(items)) {
                this.$menu.html("<div style='position: absolute; top: 40%;left: 50%;margin-left: -36px;'><span class='glyphicon glyphicon-info-sign' style='top: 2px; right: 2px; color: rgb(68, 157, 68);'></span> 无内容！</div>");
                this.show();
                return false;
            }

            if (!this.query || this.query.length < this.options.minLength) {
                if (this.callback2) {
                    this.callback2(this, items);
                }
                this.$element.next().next().fadeOut(0);
                this.render(items).show();
                this.$menu.animate({ scrollTop: 0 }, 0)
                return
            }

            this.$element.next().next().fadeIn(0);

            return items ? this.process(items) : this
        },
        process: function (items) {
            var that = this
            var newItems = {};

            for (var key in items) {
                var mat = that.matcher(items[key])
                if (mat)
                    newItems[key] = items[key]
            }

            newItems = this.sorter(newItems)

            if (!that.objLen(newItems)) {
                this.$menu.html("<div style='position: absolute; top: 40%;left: 50%;margin-left: -90px;'><span class='glyphicon glyphicon-info-sign' style='top: 2px; right: 2px; color: rgb(68, 157, 68);'></span> 没有找到符合条件的数据！</div>").show();
                return false;
            }

            return this.render(newItems.slice(0, this.options.items)).show()
        },
        onequals: function (keyword, i, value) {
            var content = null,
                isHave = 0;
            value = value.toString();
            switch (i) {
                case 0:
                    content = value;
                    break;
                case 1:
                    content = chinese2spell.ToFullPinyin(value);
                    break;
                case 2:
                    content = chinese2spell.ToShortPinyin(value);
                    break;
            }
            var regexp = RegExp(keyword, 'igm');
            return regexp.test(content);
        },
        matcher: function (item) {
            var isHave = null,
                txt = this.$element.val();

            if (!chinese2spell) {
                chinese2spell = require('system::Globalization::Chinese2Spell');
            }

            if (this.propName == "")
                return ~item.toLowerCase().indexOf(txt.toLowerCase())
            else {
                for (var i = 0; i < this.propName.length; i++) {
                    var a = this.propName[i];
                    if (!item[a]) {
                        continue;
                    } else {
                        for (var j = 0; j < 3; j++) {
                            if (this.onequals(txt, j, item[a])) {
                                isHave = this.onequals(txt, j, item[a])
                                this.$type = this.propName[i]
                                return isHave;
                            }
                        }
                    }
                }
            }
        },
        sorter: function (items) {
            var beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item,
                num = 0

            //while (item = items.shift()) {
            //    var myPropVal = this.propName == "" ? item : item[this.$type];
            //    if (!myPropVal.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
            //    else if (~myPropVal.indexOf(this.query)) caseSensitive.push(item)
            //    else caseInsensitive.push(item)
            //}

            for (var key in items) {
                if (num == 0) {
                    item = items[key];
                    var myPropVal = this.propName == "" ? item : item[this.$type];
                    if (!myPropVal) {
                        continue;
                    }
                    myPropVal = myPropVal.toString();
                    if (!myPropVal.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
                    else if (~myPropVal.indexOf(this.query)) caseSensitive.push(item)
                    else caseInsensitive.push(item)
                } else {
                    break
                }
            }

            return beginswith.concat(caseSensitive, caseInsensitive)
        },
        highlighter: function (item) {
            var myPropVal = ''
            if (this.labeler.length == 0) {
                myPropVal = item
            } else {
                $.each(this.labeler, function (i, pname) {
                    if (!item[pname]) { item[pname] = "" }
                    myPropVal = myPropVal.concat(item[pname]).concat(' ')
                })
            }

            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')

            return myPropVal.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        },
        render: function (items) {
            var that = this
            var newItems = []

            for (var key in items) {
                var item = items[key];
                var i = $(that.options.item).attr('data-value', that.propName == "" ? item : item[that.showType])
                i.data('bootstrap-typeahead-item', item);

                i.find('a').html(that.highlighter(item));
                newItems.push(i);
            }

            newItems[0].addClass('active')
            this.$menu.html(newItems)
            return this
        },
        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
                , next = active.next()

            if (!next.length) {
                next = $(this.$menu.find('li')[0])
            }

            next.addClass('active')
            var y = this.$menu.find('.active')[0].offsetTop - 170;
            this.$menu.animate({ scrollTop: y }, 0);
        },
        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
                , prev = active.prev()

            if (!prev.length) {
                prev = this.$menu.find('li').last()
            }

            prev.addClass('active');
            var y = this.$menu.find('.active')[0].offsetTop;
            this.$menu.animate({ scrollTop: y }, 0);
        },
        listen: function () {
            var that = this;
                that.$element
                .on('blur', $.proxy(that.blur, that))
                .on('focus', $.proxy(that.focus, that))
                .on('keypress', $.proxy(that.keypress, that))
                .on('keyup', $.proxy(that.keyup, that))
                .on('input', $.proxy(that.change, that))

            var onmousedown = $.proxy(that.mousedown, that);
            $(document).on('mousedown', onmousedown);

            iflisten(function (errno, element) {
                var element = element.contentDocument || element.contentWindow.document;
                $(element).on('mousedown', onmousedown);
            }).start();

            that.$element.next().on('click', $.proxy(that.focus, that));
            that.$element.next().next().on('click', $.proxy(that.clear, that));

            that.$menu
                .on('click', $.proxy(that.click, that))
                .on('mouseenter', 'li', $.proxy(that.mouseenter, that))
        },
        eventSupported: function (eventName) {
            var isSupported = eventName in this.$element
            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;')
                isSupported = typeof this.$element[eventName] === 'function'
            }
            return isSupported
        },
        move: function (e) {
            if (!this.shown) return

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault()
                    break

                case 38: // up arrow
                    e.preventDefault()
                    this.prev()
                    break

                case 40: // down arrow
                    e.preventDefault()
                    this.next()
                    break
            }

            e.stopPropagation()
        },
        keydown: function (e) {
            this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40, 38, 9, 13, 27])
            this.move(e)
        },
        keypress: function (e) {
            if (this.suppressKeyPressRepeat) return
            this.move(e)
        },
        keyup: function (e) {
            switch (e.keyCode) {
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break

                case 40: // down arrow
                    this.next()
                    break

                case 38: // up arrow
                    this.prev()
                    break

                case 9: // tab
                case 13: // enter
                    if (!this.shown) return
                    this.select()
                    break

                case 27: // escape
                    if (!this.shown) return
                    this.hide()
                    break

                default:
                    clearTimeout(timer);
                    var that = this;
                    var timer = setTimeout(function () {
                        that.lookup();
                        that.$element.focus();
                    }, 300)
            }

            e.stopPropagation()
            e.preventDefault()
        },
        blur: function (e) {
            var that = this
            var menu = that.$menu;
            if (!menu.is(':hidden')) {
                setTimeout(that.hide, 150);
            }
        },
        mousedown: function (e) {
            var that = this;
            var menu = that.$menu;
            if (!menu.is(':hidden')) {
                var search = that.$element.get(0);
                var current = e.target;
                if (current !== menu.get(0) && current !== search && menu.find($(current)).length <= 0) {
                    var that = this
                    setTimeout(function () {
                        that.hide();
                        search.blur();
                    }, 150);
                }
            }
        },
        focus: function (e) {
            this.lookup()
        },
        change: function (e) {
            if (this.callback1) {
                this.callback1();
            }
            this.lookup();
        },
        click: function (e) {
            var elemName = e.target.tagName;
            if (elemName.toLowerCase() == "a") {
                e.stopPropagation()
                e.preventDefault()
                this.select()
            }
        },
        clear: function () {
            var items
            this.$element.val("").focus();
            this.lookup();
            this.$element.next().next().fadeOut(0);
        },
        mouseenter: function (e) {
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        },
        objLen: function (obj) {
            var count = 0;
            for (var key in obj) {
                count++;
            }
            return count;
        }
    }

    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */
    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('typeahead'),
                options = typeof option == 'object' && option;
            if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.typeahead.defaults = {
        source: [],
        //items: 10, //搜索结果的显示个数
        menu: '<ul class="typeahead dropdown-menu" style="height: 200px;overflow: auto;"></ul>',
        item: '<li><a href="#"></a></li>',
        minLength: 1,
        propName: 'value',
        labeler: ['value'],
        itemSelected: function () { }
    }

    $.fn.typeahead.Constructor = Typeahead


    /*   TYPEAHEAD DATA-API
    * ================== */
    $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
        var $this = $(this);
        if ($this.data('typeahead'))
            return
        e.preventDefault()
        $this.typeahead($this.data())
    })
}(window.jQuery);