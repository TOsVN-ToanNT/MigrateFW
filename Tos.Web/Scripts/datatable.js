/** 最終更新日 : 2016-10-17 **/
/*!
* jQuery datatable plugin.
*  
* Copyright(c) 2015 Archway Inc. All rights reserved.
*/

(function ($, undefined) {

    'use strict';

    function isFunc(value) {
        return App.isFunc(value);
    }

    function isLteIE8() {
        var ua = window.navigator.userAgent.toLowerCase();
        var ver = window.navigator.appVersion.toLowerCase();

        if (ua.indexOf("msie") != -1) {
            if (ver.indexOf("msie 6.") != -1) {
                return true;
            } else if (ver.indexOf("msie 7.") != -1) {
                return true;
            } else if (ver.indexOf("msie 8.") != -1) {
                return true;
            }
        }
        return false;
    }

    function focusable(element) {
        var map, mapName, img,
                nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                return false;
            }
            img = $("img[usemap=#" + mapName + "]")[0];
            return !!img && visible(img);
        }
        return (/input|select|textarea|button|object|a/.test(nodeName) ? !element.disabled : false) && visible(element);
    };

    function visible(element) {
        return $.expr.filters.visible(element) &&
                !$(element).parents().addBack().filter(function () {
                    return $.css(this, "visibility") === "hidden";
                }).length;
    };

    if (!$.expr[":"].focusable) {
        $.extend($.expr[":"], {
            focusable: function (element) {
                return focusable(element);
            }
        });
    }

    var uuid = function (format) {
        var rand = function (range) {
            if (range < 0) return NaN;
            if (range <= 30) return Math.floor(Math.random() * (1 << range));
            if (range <= 53) return Math.floor(Math.random() * (1 << 30)) +
                    Math.floor(Math.random() * (1 << range - 30)) * (1 << 30);
            return NaN;
        },
            prepareVal = function (value, length) {
                var result = "000000000000" + value.toString(16);
                return result.substr(result.length - length);
            },
            formats = {
                "N": "{0}{1}{2}{3}{4}{5}",
                "D": "{0}-{1}-{2}-{3}{4}-{5}",
                "B": "{{0}-{1}-{2}-{3}{4}-{5}}",
                "P": "({0}-{1}-{2}-{3}{4}-{5})"
            },
            vals = [
                rand(32),
                rand(16),
                0x4000 | rand(12),
                0x80 | rand(6),
                rand(8),
                rand(48)
            ],
            result = formats[format];

        if (!result) {
            result = formats["N"];
        }
        result = result.replace("{0}", prepareVal(vals[0], 8));
        result = result.replace("{1}", prepareVal(vals[1], 4));
        result = result.replace("{2}", prepareVal(vals[2], 4));
        result = result.replace("{3}", prepareVal(vals[3], 2));
        result = result.replace("{4}", prepareVal(vals[4], 2));
        result = result.replace("{5}", prepareVal(vals[5], 12));
        return result;
    };

    function DataRow(element) {
        this.element = element;
        this.rowid = uuid();
        this.height = 0;
        this.visible = false;
    };

    function DataRowCache() {
        this.rows = {};
        this.rowids = [];
    };

    DataRowCache.prototype.id = function (id) {
        return this.rows[id];
    }

    DataRowCache.prototype.index = function (index) {
        var id = this.rowids[index];

        return this.rows[id];
    }

    DataRowCache.prototype.add = function (row) {
        this.rows[row.rowid] = row;
        this.rowids.push(row.rowid);

        return row;
    }

    DataRowCache.prototype.remove = function (id) {

        var i, len, row;
        for (var i = 0, len = this.rowids.length; i < len; i++) {
            if (this.rowids[i] === id) {
                this.rowids.splice(i, 1);
            }
        }

        delete this.rows[id];
    }

    function DataRowPage(cache) {
        this.cache = cache;
    }

    function DataTable(element, options) {

        this._globalLock = 0;
        this.options = {};
        this.element = $(element);
        this.originalElement = this.element.clone();
        this.cache = new DataRowCache();
        this.templateHeight = 0;
        this.pageTop = 0;
        this.pageBottom = 0;

        this.selectors = {
            thead: '.dt-head',
            tbody: '.dt-body',
            tfoot: '.dt-foot',
            scrollContainer: '.scroll-container',
            flowContainer: '.flow-container',
            fixColumns: '.fix-columns',
            container: '.dt-container',
        };

        this.options = $.extend({}, DataTable.DEFAULTS, options);

        this.initialize.call(this, element, this.options);
    };

    DataTable.DEFAULTS = {
        height: '100%',
        innerWidth: 2000,
        fixedColumn: false,
        fixedColumns: 0,
        sortable: false,
        footer: false,
        resize: false,
        resizeOffset: parseFloat('undefined') || 110,
        addedOffset: 0,
        responsive: true,
        onsorting: function () { },
        onsorted: function () { },
        onselecting: function () { },
        onselected: function () { },
        ontabing: function () { },
        ontabed: function () { }
    };

    var scrollBar = { width: 18, height: 18 };
    var getScrollBarWidth = function () {
        var $outer = $('<div>').css({ visibility: 'hidden', width: 100, overflow: 'scroll' }).appendTo('body'),
            widthWithScroll = $('<div>').css({ width: '100%' }).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    };

    var getWidth = function ($elem) {
        if ($elem.length == 0) {
            return 0;
        }

        return $elem[0].clientWidth;
    };

    var getHeight = function ($elem) {
        if ($elem.length == 0) {
            return 0;
        }

        var result = $elem[0].clientHeight;


        if (result) {
            return result;
        }

        return $elem[0].offsetHeight;
    };

    var setWidth = function ($elem, width) {

        var i = 0, l = $elem.length,
            elem;

        for (; i < l; i++) {
            elem = $elem[i];
            elem.style.width = width + "px";
        }
    };

    var adjustHeight = function ($flow, $fix, margin) {

        var $flowRows = query$($flow, "tr"),
             $fixRows = query$($fix, "tr"),
             height, i = 0, l = $flowRows.length, totalHeight = 0,
             $fixRow, $flowRow,
             fixRowHeight, flowRowHeight;

        if (typeof margin === "undefined" || margin === null) {
            margin = 1;
        }

        for (; i < l; i++) {

            $flowRow = $($flowRows[i]);
            $fixRow = $($fixRows[i]);

            flowRowHeight = getHeight($flowRow);
            fixRowHeight = getHeight($fixRow);

            height = (flowRowHeight >= fixRowHeight) ? flowRowHeight : fixRowHeight;

            $flowRow.height(height + margin);
            $fixRow.height(height + margin);

            totalHeight += height + margin;
        }

        return totalHeight;
    }

    var setFocus = function ($fixItem, $flowItem, row, self) {
        var rowId = $flowItem.attr("data-rowid") || $fixItem.attr("data-rowid"),
            targetRow = self.cache.id(rowId);
        setTimeout(function () {
            var item = $fixItem.find(":focusable:first");
            if (item.length) {
                item.focus();
                return;
            }

            item = $flowItem.find(":focusable:first");
            if (item.length) {
                item.focus();
                return;
            }
            if (isFunc(self.options.onselect)) {
                self.options.onselect(undefined, targetRow);
                self.scrollTop(targetRow, undefined, self);
                return;
            }
        }, 0);


    }

    var addKeyDownEvent = function ($flowItem, $fixItem, self) {

        var isFirst = function ($targetBody, $targetItem) {
            var focusableItems = $targetBody.find(":focusable");

            if (focusableItems.length === 0) {
                return false;
            }
            return $(focusableItems[0]).is($targetItem);
        },
            isLast = function ($targetBody, $targetItem) {
                var focusableItems = $targetBody.find(":focusable");

                if (focusableItems.length === 0) {
                    return false;
                }
                return $(focusableItems[focusableItems.length - 1]).is($targetItem);
            };

        $fixItem.off("keydown");
        $fixItem.on('keydown', ':focusable', function (e) {

            var $this = $(this);

            // 列固定部の最後のフォーカス可能なコントロール
            if (e.keyCode === 9 && e.shiftKey == false) {

                var $tbody = $this.closest("tbody");

                if (!isLast($tbody, $this)) {
                    return;
                }

                // keyCode === tab
                self.options.ontabing();
                var rowid = $tbody.attr("data-rowid"),
                    row = self.cache.id(rowid),
                    item = $(row.element[0]),
                    target = item.find(":focusable:first")

                if (target.length > 0) {
                    target.focus();
                    self.options.ontabed();
                    return false;
                }
            }
                // 列固定部の最初のフォーカス可能なコントロール
            else if (e.keyCode === 9 && e.shiftKey == true) {

                var $tbody = $this.closest("tbody");

                if (!isFirst($tbody, $this)) {
                    return;
                }

                // keyCode === shift + tab
                self.options.ontabing();
                var rowid = $tbody.attr("data-rowid"),
                    row = self.cache.id(rowid),
                    next = $(row.element[0]).prev(),
                    target = next.find(":focusable:last");

                if (next.length > 0 && target.length > 0) {
                    target.focus();
                    self.options.ontabed();
                    return false;
                }
            }

        });

        $flowItem.off("keydown");
        $flowItem.on('keydown', ':focusable', function (e) {

            var $this = $(this);

            // スクロール部の最後のフォーカス可能なコントロール
            if (e.keyCode === 9 && e.shiftKey == true) {

                var $tbody = $this.closest("tbody");

                if (!isFirst($tbody, $this)) {
                    return;
                }

                // keyCode === tab
                self.options.ontabing();
                var rowid = $tbody.attr("data-rowid"),
                    row = self.cache.id(rowid),
                    item = $(row.element[1]),
                    target = item.find(":focusable:last")

                if (target.length > 0) {
                    target.focus();
                    self.options.ontabed();
                    return false;
                }
            }
                // スクロール部の最後のフォーカス可能なコントロール
            else if (e.keyCode === 9 && e.shiftKey == false) {

                var $tbody = $this.closest("tbody");

                if (!isLast($tbody, $this)) {
                    return;
                }

                self.options.ontabing();
                var rowid = $tbody.attr("data-rowid"),
                    row = self.cache.id(rowid),
                    next = $(row.element[1]).next(),
                    target = next.find(":focusable:first");

                if (next.length > 0 && target.length > 0) {
                    target.focus();
                    self.options.ontabed();
                    return false;
                }
            }
        });
    }

    var cloneNode = function ($elem) {
        if ($elem.length == 0) {
            return $();
        }
        var nodes = [];
        for (var i = 0, l = $elem.length; i < l; i++) {
            nodes.push($elem[i].cloneNode(true));
        }
        return $(nodes);
    };

    var createFixedColumns = function ($target, cellSelector, containerClass, fixeColumnNumbers) {

        var $fixed = $target.clone(),
            width = 0,
            $tr, $cell, tr, cell,
            $fixtr, $fixcell, fixtr, fixcell,
            i = 0, ilen = 0, j = 0, jlen = 0, fixedColumns, logicalCellCounts;

        fixeColumnNumbers = fixeColumnNumbers + 1;

        var $fixedTableChildren = single$($fixed, "table").children();
        var $targetTableChildren = single$($target, "table").children();

        $fixedTableChildren.each(function (index, tchild) {

            if (tchild.tagName.toLowerCase() === "tfoot") {
                return;
            }

            $fixtr = query$($(tchild), 'tr');
            $tr = query$($($targetTableChildren[index]), 'tr');

            logicalCellCounts = new Array($fixtr.length);

            for (i = 0, ilen = $fixtr.length; i < ilen; i++) {
                logicalCellCounts[i] = 0;
            }

            var k = 0, klen = 0;

            for (i = 0, ilen = $fixtr.length; i < ilen; i++) {
                fixtr = $fixtr[i];
                tr = $tr[i];
                $fixcell = query$($(fixtr), cellSelector);
                $cell = query$($(tr), cellSelector);

                for (j = 0, jlen = $fixcell.length; j < jlen; j++) {
                    fixcell = $fixcell[j];
                    cell = $cell[j];

                    logicalCellCounts[i]++;

                    if ((fixcell.colSpan > 1 && logicalCellCounts[i] <= fixeColumnNumbers)
                        && (logicalCellCounts[i] + (fixcell.colSpan - 1) > fixeColumnNumbers)) {

                        throw new Error("列の固定で指定されたインデックスでは固定位置を揃えることができません。");
                    }

                    logicalCellCounts[i] += (fixcell.colSpan > 1) ? (fixcell.colSpan - 1) : 0;

                    if (logicalCellCounts[i] <= fixeColumnNumbers) {
                        if (fixcell.rowSpan > 1) {
                            for (k = (i + 1), klen = (fixcell.rowSpan + i) ; k < klen; k++) {
                                logicalCellCounts[k]++;
                                logicalCellCounts[k] += (fixcell.colSpan > 1) ? (fixcell.colSpan - 1) : 0;
                            }
                        }
                    }

                    if (logicalCellCounts[i] > fixeColumnNumbers) {
                        $(fixcell).remove();
                    }
                    else {
                        $(cell).remove();
                    }
                };
            }
        });

        $fixed.css({
            overflow: '',
            overflowX: '',
            overflowY: '',
            width: '',
            position: 'absolute',
            top: 0
        });

        single$($fixed, 'table').css('width', 'auto');
        single$($fixed, 'table').css('max-width', '');

        return $fixed.addClass(containerClass);
    };

    var onTbodyChange = function (e, self, selector) {
        var target = $(e.target),
            tbody = target.closest("tbody"),
            rowid = tbody.attr("data-rowid"),
            row = self.cache.id(rowid),
            propName = target.attr("data-prop"),
            val = target.val();

        if (self.options.onchange && row) {
            self.options.onchange(e, row);
        }
    };

    var domElementFromjQuery = function (element) {
        if (element instanceof jQuery) {
            if (element.length === 0) {
                return null;
            }
            element = element[0];
        }

        return element;
    }

    var query = function (element, selector) {
        element = domElementFromjQuery(element);

        return element.querySelectorAll(selector);
    };

    var query$ = function (element, selector) {
        element = domElementFromjQuery(element);

        if (!element) {
            return $();
        }

        return $(element.querySelectorAll(selector));
    };

    var single = function (element, selector) {
        element = domElementFromjQuery(element);

        return element.querySelector(selector);
    };

    var single$ = function (element, selector) {
        element = domElementFromjQuery(element);

        if (!element) {
            return $();
        }

        return $(element.querySelector(selector));
    };

    var onTbodyFocus = function (e, self, selector) {
        self.options.onselecting();
        var target = $(e.target),
            tbody = target.closest("tbody"),
            rowid = tbody.attr("data-rowid"),
            row = self.cache.id(rowid);

        var enableOperation = (self.options.onselect && row);

        if (e.target && typeof e.target.scrollIntoViewIfNeeded === "function") {
            e.target.scrollIntoViewIfNeeded(true);
        }

        setTimeout(function () {

            var $divBody = target.closest(".dt-body"),
                divBody = $divBody[0],
                $container = $divBody.closest(".dt-container"),
                container = $container[0],
                scrollTop = $divBody.scrollTop();

            if (!container) {
                return;
            }

            if ($divBody.hasClass("dt-fix-body")) {
                single(container, '.flow-container>.dt-body').scrollTop = scrollTop;

            } else {
                single(container, '.flow-container>.dt-body').scrollTop = scrollTop;
                var left = target.offset().left - single$($divBody, "table").offset().left;
                if (left < divBody.scrollLeft) {
                    divBody.scrollLeft = left - 10;
                }
            }

            self.options.onselected();

            if (enableOperation) {
                self.options.onselect(e, row);
            }
        }, 0);
    };

    /** 
     * ヘッダーのクリックによるソート処理をバインドします。
     */
    var onTheadClick = function (e, self) {
        if (!self.options.sortable) {
            return;
        }

        var $target = e.target.tagName === "I" ? $(e.target).closest("th") : $(e.target),
             prop = $target.attr("data-prop"),
             isNumber = $target.hasClass("number"),
             icon = $('<i class="sort-icon"></i>'),
             modes = { none: 0, ascend: 1, descend: 2 },
             mode;

        self.options.onsorting();

        if (!prop || prop === "") {
            return;
        }

        var $container = $target.closest(".dt-container"),
            $table = single$($container, ".flow-container .dt-body table.datatable"),
            $divHead = single$($container, ".flow-container .dt-head"),
            tbs = query$($table, "tbody").get(),
            $fixHead = single$($container, ".fix-columns .dt-head"),
            $fixTable = single$($container, ".fix-columns .dt-body table.datatable"),
            fixTbs = query$($fixTable, "tbody").get(),
            aval, bval,
            valOrText = function (element, prop) {
                var rowid = element.getAttribute("data-rowid");

                if (!rowid) {
                    return "";
                }

                var row = self.cache.id(rowid),
                    target, val;

                target = row.element[0].querySelector("[data-prop='" + prop + "']");
                if (!target && row.element.length > 1) {
                    target = row.element[1].querySelector("[data-prop='" + prop + "']");
                }

                val = target.value;

                if (val && val !== "") {
                    return val;
                }

                return target.innerText;
            },
            sort = function (a, b) {
                aval = valOrText(a, prop);
                bval = valOrText(b, prop);

                if (mode === modes.ascend) {
                    if (isNumber) {
                        return aval - bval;
                    } else {
                        return (aval < bval) ? -1 : 1;
                    }
                }
                else {
                    if (isNumber) {
                        return bval - aval;
                    } else {
                        return (aval > bval) ? -1 : 1;
                    }
                }
            };

        if (query$($target, "i.sort-icon-ascend").length > 0) {
            mode = modes.descend;
            icon.addClass("sort-icon-descend");
        }
        else if (query$($target, "i.sort-icon-descend").length > 0) {

            if (isFunc(self.options.onreset)) {
                self.options.onreset();
                mode = modes.none;
            } else {
                mode = modes.ascend;
                icon.addClass("sort-icon-ascend");
            }
        }
        else {
            mode = modes.ascend;
            icon.addClass("sort-icon-ascend");
        }

        hideSortIcons($container);

        icon.on("click", function (e) { onTheadClick(e, self) });

        query$($target, ".sort-icon").replaceWith(icon);

        if (mode === modes.none) {
            return;
        }

        tbs.sort(sort);

        var tableRows = $table[0].querySelectorAll("tbody");
        for (var i = 0; i < tableRows.length; i++) {
            tableRows[i].parentNode.removeChild(tableRows[i]);
        }

        $table.append(tbs);

        if ($fixHead.length > 0) {
            fixTbs.sort(sort);
            var fixTableRows = $fixTable[0].querySelectorAll("tbody");
            for (var i = 0; i < fixTableRows.length; i++) {
                fixTableRows[i].parentNode.removeChild(fixTableRows[i]);
            }


            $fixTable.append(fixTbs);
        }

        self.options.onsorted();
    };

    DataTable.prototype.initialize = function (options) {
        var self = this,
            $body = self.element,
            $head = single$(self.element, 'thead').clone(),
            $foot = single$(self.element, 'tfoot'),
            $flow = $body.wrap('<div class="flow-container"></div>').parent(),
            $container = $flow.wrap('<div class="dt-container" style="position:relative;overflow-x:auto;overflow-y:hidden;"></div>').parent(),
            $divHead, $divBody, $divFoot, $divVScroll,
            $fixHead, $fixBody;

        var flowTheadCells = query$($flow, "thead th, thead td");
        flowTheadCells.text("");
        flowTheadCells.css({ height: "0px", padding: "0px", borderTop: 0, borderBottom: 0 });


        $body.css("margin-top", "-2px");

        $divHead = $('<div class="dt-head"style="overflow:hidden"><table></table></div>').prependTo($flow);

        $divBody = $body.wrap('<div class="dt-body" style="overflow-y:scroll;overflow-x:auto;position:relative;"></div>').parent();
        $divVScroll = $body.wrap('<div class="dt-vscroll"></div>').parent();
        $divFoot = $('<div class="dt-foot"style="overflow:hidden"><table></table></div>').appendTo($flow);

        single$($divHead, 'table').prop('class', $body.prop('class')).append($head);
        single$($divFoot, 'table').prop('class', $body.prop('class')).append($foot.clone());

        $foot.hide();

//        scrollBar.width = $divBody[0].offsetWidth - $divVScroll[0].offsetWidth;
        scrollBar.width = getScrollBarWidth();
        scrollBar.height = scrollBar.width;

        $divBody.outerHeight(self.options.height);

        $divHead.css('margin-right', scrollBar.width);
        $divFoot.css('margin-right', scrollBar.width);
        self.templateHeight = single$($container, 'tbody.item-tmpl').outerHeight();
        single$($container, 'tbody.item-tmpl').hide();

        if (true === self.options.fixedColumn) {

            single$($divHead, "table").css('width', self.options.innerWidth);
            single$($divHead, "table").css('max-width', self.options.innerWidth);

            single$($divBody, "table").css('width', self.options.innerWidth);
            single$($divBody, "table").css('max-width', self.options.innerWidth);
            $divBody.css("overflow-x", "scroll");

            $fixBody = createFixedColumns($divBody, 'td', 'dt-fix-body', self.options.fixedColumns);
            createFixedColumns($divBody, 'th', 'dt-fix-body', self.options.fixedColumns);
            $fixHead = createFixedColumns($divHead, 'th', 'dt-fix-head', self.options.fixedColumns);

            $fixBody.css('z-index', 500);

            $fixBody.css('overflow', 'hidden');
            query$($fixBody, 'table thead').remove();

            var $cpHead = query$($fixHead, 'thead').clone();
            query$($fixBody, 'table').append($cpHead);
            $fixBody.height($divBody.height() - scrollBar.height);
            $fixBody.css("margin-top", "0px");


            var fixBodyTheadCells = query$($fixBody, "thead th, thead td");
            fixBodyTheadCells.text("");
            fixBodyTheadCells.css({ height: "0px", padding: "0px", borderTop: 0, borderBottom: 0 });

            $('<div class="fix-columns"></div>')
            .append($fixHead)
            .append($fixBody)
            .insertBefore($flow);

            adjustHeight($divHead, $fixHead, 1);

            $fixBody.css('top', getHeight($fixHead));

            var w = single$($fixHead, "table").width();
            single$($fixBody, 'table').width(w);
            single$($fixHead, 'table').width(w);
            single$($divBody, 'table').css('margin-left', w - 1);
            single$($divHead, 'table').css('margin-left', w - 1);

            $divBody.css('min-width', w + 200);
            $divHead.css('min-width', w + 200 - scrollBar.width);

            $divVScroll.css("min-height", "3px").css("width", self.options.innerWidth + w - 1);

            addKeyDownEvent($divBody, $fixBody, self);

            $divBody.on('scroll', function () {
                var $target = $(this);

                $divHead.scrollLeft($target.scrollLeft());
                $divFoot.scrollLeft($target.scrollLeft());
                $fixBody.scrollTop($target.scrollTop());
            });

            $fixBody.on('mousewheel', function (e) {
                var $target = $(this);
                var delta = e.originalEvent.wheelDelta;
                var top = $target.scrollTop() - (delta);
                $divBody.scrollTop(top);

                if (top > 0) {
                    return false;
                }
            });
            if (self.options.responsive) {
                if (!isLteIE8()) {
                    query$($divHead, 'table').css('table-layout', 'fixed');
                    query$($divFoot, 'table').css('table-layout', 'fixed');
                    $body.css("table-layout", "fixed");

                    query$($fixBody, "table").css('table-layout', 'fixed');
                    query$($fixHead, "table").css('table-layout', 'fixed');
                }
            }
        } else {
            if (self.options.responsive) {

                if (!isLteIE8()) {
                    var setMinWidth = function (cells, width) {

                        var i, ilen, cell;
                        for (i = 0, ilen = cells.length; i < ilen; i++) {
                            cell = cells[i];
                            if (cell.style.width) {

                            }
                            else {
                                cell.style.minWidth = width;
                            }
                        }

                    };

                    setMinWidth(query$($divHead, 'th,td'), 40);
                    setMinWidth(query$($body, 'th,td'), 40);

                    var head = query$($divHead, 'table').css('table-layout', 'fixed');
                    var foot = query$($divFoot, 'table').css('table-layout', 'fixed');

                    $body.css("table-layout", "fixed");
                }

                $divBody.on('scroll', function () {
                    var $target = $(this);

                    $divHead.scrollLeft($target.scrollLeft());
                    $divFoot.scrollLeft($target.scrollLeft());
                });
            }
        }

        $divBody.on('change', 'tbody :input', function (e) {
            onTbodyChange(e, self, self.selectors.flowContainer);
        });

        $divBody.on('focus', 'tbody', function (e) {
            onTbodyFocus(e, self, self.selectors.flowContainer);
        });

        $divBody.on('click', 'tbody', function (e) {
            onTbodyFocus(e, self, self.selectors.flowContainer);
        });

        if (true === self.options.sortable) {
            query$($divHead, '[data-prop]').css('cursor', 'pointer').append($('<i class="sort-icon sort-icon-"></i>'));
            $divHead.on('click', 'th', function (e) {
                onTheadClick(e, self);
            });
        }

        if (true === self.options.fixedColumn) {

            $fixBody.on('change', 'tbody :input', function (e) {
                onTbodyChange(e, self, self.selectors.fixColumns);
            });

            $fixBody.on('focus', 'tbody', function (e) {
                onTbodyFocus(e, self, self.selectors.fixColumns);
            });

            $fixBody.on('click', 'tbody', function (e) {
                onTbodyFocus(e, self, self.selectors.fixColumns);
            });

            if (true === self.options.sortable) {
                query$($fixHead, '[data-prop]').css('cursor', 'pointer').append($('<i class="sort-icon sort-icon-"></i>'));
                $fixHead.on('click', 'th', function (e) {
                    onTheadClick(e, self);
                });
            }
        }

        // TODO: resize

        if (true === self.options.resize) {

            $(window).on("resize", function (e) {
                resizeFitToBottom(self, $container, $divBody, $fixBody);
            });

            $(window).resize();
        }
    };

    var resizeFitToBottom = function (self, $container, $divBody, $fixBody) {
        if (!self._globalLock++) {
            setTimeout(function () {

                var offsetTop = $divBody.offset().top;
                var currentHeight = $(window).height();
                var fooHeight = query$($container, ".dt-foot").height();
                var bodyHeight = currentHeight - offsetTop - fooHeight - (self.options.resizeOffset + (self.options.addedOffset || 0));

                if (bodyHeight > self.options.height) {
                    $divBody.height(bodyHeight);
                    if (true === self.options.fixedColumn) {
                        $fixBody.height(bodyHeight - scrollBar.width);
                    }
                    $divBody.closest(".part").css("margin-bottom", "0px");
                } else {
                    $divBody.height(self.options.height);
                    if (true === self.options.fixedColumn) {
                        $fixBody.height(self.options.height - scrollBar.width);
                    }
                    $divBody.closest(".part").css("margin-bottom", "32px");
                }

                setTimeout(function () { self._globalLock = 0; }, 0);
            }, 5);
        }
    };

    DataTable.prototype.deleteRow = function (target, operation) {
        var self = arguments[arguments.length - 1],
            $target = $(target),
            $selectedItem = $target.closest("tbody"),
            rowid, height,
            $container,
            row;

        rowid = $selectedItem.attr("data-rowid");
        row = self.cache.id(rowid);

        if (isFunc(operation)) {
            operation(row.element);
        }

        row.element.detach();
        self.cache.remove(rowid);
    };

    DataTable.prototype.insertRow = function (selectedRow, isInsertAfter, operation, isFocus) {
        var self = arguments[arguments.length - 1],
            $target = $(this),
            $container = $target.closest(".dt-container"),
            $divBody = query$($container, ".flow-container .dt-body"),
            $table = single$($divBody, "table"),
            $item = cloneNode(single$($table, ".item-tmpl")),
            $fixItem = cloneNode(single$($container, ".dt-fix-body table tbody.item-tmpl")),
            $selectedItem = $(selectedRow).closest("tbody"),
            rowid, selectRow, $selectedFlowRow, $selectedFixRow,
            row;

        hideSortIcons($container);

        rowid = $selectedItem.attr("data-rowid");
        selectRow = self.cache.id(rowid);
        $selectedFlowRow = $(selectRow.element[0]);
        if ($fixItem.length > 0) {
            $selectedFixRow = $(selectRow.element[1]);
        }

        var $flowItem = $item;
        if (operation) {
            $item = operation($item.add($fixItem));
            $flowItem = $($item[0]);
            if ($fixItem.length > 0) {
                $fixItem = $($item[1]);
            }
        }

        $item.removeClass("item-tmpl");
        $item.addClass("new");
        row = new DataRow($item);
        row.height = self.templateHeight;
        $item.attr("data-rowid", row.rowid);
        self.cache.add(row);

        if (isInsertAfter === true) {
            $item.insertAfter($selectedFlowRow).show();
        } else {
            $item.insertBefore($selectedFlowRow).show();
        }
        if ($fixItem.length > 0) {
            //$fixItem.removeClass("item-tmpl");
            if (isInsertAfter === true) {
                $fixItem.insertAfter($selectedFixRow).show();
            } else {
                $fixItem.insertBefore($selectedFixRow).show();
            }
            adjustHeight($flowItem, $fixItem);
        }

        if (isFocus === true) {
            setFocus($fixItem, $flowItem, row, self);
//            $divBody[0].scrollTop = $table.height();  //insertではスクロールは動かさない
        }
    };

    DataTable.prototype.addRow = function (operation, isFocus) {
        var self = arguments[arguments.length - 1],
            $target = $(this),
            $container = $target.closest(".dt-container"),
            $divBody = query$($container, ".flow-container .dt-body"),
            $table = single$($divBody, "table"),
            $item = cloneNode(single$($table, ".item-tmpl")),
            $fixItem = cloneNode(single$($container, ".dt-fix-body table tbody.item-tmpl")),
            row;

        hideSortIcons($container);

        var $flowItem = $item;
        if (operation) {
            $item = operation($item.add($fixItem));
            $flowItem = $($item[0]);
            if ($fixItem.length > 0) {
                $fixItem = $($item[1]);
            }
        }

        $item.removeClass("item-tmpl");
        $item.addClass("new");
        $item.appendTo($table).show();

        row = new DataRow($item);
        row.height = self.templateHeight;
        $item.attr("data-rowid", row.rowid);
        self.cache.add(row);

        if ($fixItem.length > 0) {
            $fixItem.removeClass("item-tmpl");
            $fixItem.appendTo(single$($container, ".dt-fix-body table")).show();
            adjustHeight($flowItem, $fixItem);
        }

        if (isFocus === true) {
            setFocus($fixItem, $flowItem, row, self);
            $divBody[0].scrollTop = $table.height();
        }
    };

    DataTable.prototype.addRows = function (data, operation, isFocus) {
        var self = arguments[arguments.length - 1],
            $target = $(this),
            $container = $target.closest(".dt-container"),
            $table = single$($container, ".flow-container .dt-body table"),
            $tmpl = single$($table, ".item-tmpl"), $item,
            $fixTmpl = single$($container, ".dt-fix-body table tbody.item-tmpl"),
            $fixTable = single$($container, ".dt-fix-body table"),
            row;

        hideSortIcons($container);

        var index, ilen, item,
            $flowItem, $fixItem, $items = [], $fixItems = [],
            $firstFlowItem, $firstFixItem;

        for (index = 0, ilen = data.length; index < ilen; index++) {
            item = data[index];
            $item = cloneNode($tmpl);
            $item.__index = index;
            $flowItem = $item;
            $fixItem = cloneNode($fixTmpl);

            if (operation) {
                $item = operation($item.add($fixItem), item);
                $flowItem = $($item[0]);
                if ($fixItem.length > 0) {
                    $fixItem = $($item[1]);
                }
            }

            $item.removeClass("item-tmpl");
            $item.addClass("new");

            if (index === 0) {
                $firstFlowItem = $flowItem;
                $firstFixItem = $fixItem;
            }

            if ($fixItem.length > 0) {
                $fixItem.removeClass("item-tmpl");
            }

            row = new DataRow($item);
            self.cache.add(row);
            $item.attr("data-rowid", row.rowid);

            $table[0].appendChild($item[0]);

            if ($fixItem.length > 0) {
                $fixTable[0].appendChild($fixItem[0]);
            }

            $item.show();

            if ($fixItem.length > 0) {
                adjustHeight($flowItem, $fixItem);
            }

            if (self.options.fixedColumn === true) {
                $table[0].removeChild($item[0]);
                $items.push($item[0]);
                if ($fixItem.length > 0) {
                    $fixTable[0].removeChild($fixItem[0]);
                    $fixItems.push($fixItem[0]);
                }
            }
        }


        if (self.options.fixedColumn === true) {
            var i, len;
            for (i = 0, len = $items.length; i < len; i++) {
                $table[0].appendChild($items[i]);
                if ($fixItems.length > 0) {
                    $fixTable[0].appendChild($fixItems[i]);
                }
            }
        }

        if (isFocus === true
            && data instanceof Array
            && data.length > 0) {
            setFocus($firstFixItem, $firstFlowItem, row, self);
        }
    };

    DataTable.prototype.enableRowCount = function (operation, self) {
        operation(self.cache.rowids.length);
    };

    DataTable.prototype.each = function (operation, self) {

        var key, row, i = 0;
        for (key in self.cache.rows) {
            ++i;
            row = self.cache.rows[key];
            if (row.element.is(".item-tmpl")) {
                continue;
            }

            if (operation(row, i)) {
                break;
            }
        }
    };
    DataTable.prototype.eachSorted = function (operation, self) {
        var $target = $(this),
            $container = $target.closest(".dt-container"),
            $table = single$($container, ".flow-container .dt-body table"),
            tbs = query$($table, "tbody").get();

        var key, i = 0, row, j = 0;
        for (i; i < tbs.length; i++) {
            var rowid = tbs[i].getAttribute("data-rowid");
            if (!rowid) {
                continue;
            }

            row = self.cache.id(rowid);
            if (row.element.is(".item-tmpl")) {
                continue;
            }
            ;
            if (operation(row, ++j)) {
                break;
            }
        }
    };
    DataTable.prototype.getRow = function (target, operation, self) {
        var $target = $(target),
            $selectedItem = $target.closest("tbody"),
            id = $selectedItem.attr("data-rowid");

        operation(self.cache.rows[id]);
    };

    DataTable.prototype.getFirstViewRow = function (operation, self) {

        var key, row, i = 0, targetTbody;
        for (key in self.cache.rows) {
            ++i;

            if (targetTbody) {
                break;
            }

            row = self.cache.rows[key];
            if (row.element.is(".item-tmpl")) {
                continue;
            }

            var offsetTop = row.element.offset().top - row.element.offsetParent().offset().top + 2;
            if (offsetTop >= 0) {
                targetTbody = row;
            }
        }

        if (isFunc(operation) && targetTbody) {
            operation(targetTbody);
        }

    };
    DataTable.prototype.scrollTop = function (target, operation, self) {

        var $container = self.element.closest(".dt-container"),
            $table = single$($container, ".flow-container .dt-body"),
            key, row, i = 0, totalOffsetTop = 0, firstRowOffsetTop,
            targetRowOffsetTop = target.element.offset().top;

        for (key in self.cache.rows) {
            ++i;
            row = self.cache.rows[key];
            if (row.element.is(".item-tmpl")) {
                continue;
            }
            if (!firstRowOffsetTop) {
                firstRowOffsetTop = row.element.offset().top;
                break;
            }
        }

        totalOffsetTop = ((firstRowOffsetTop || 0) * (-1)) + targetRowOffsetTop - 2;
        $table.scrollTop(totalOffsetTop);

        if (isFunc(operation)) {
            operation(totalOffsetTop);
        }

    };
    DataTable.prototype.filter = function (operation, self) {
        var $target = $(this),
            $container = $target.closest(".dt-container"),
            $table = single$($container, ".flow-container .dt-body table"),
            $fixTable = single$($container, ".dt-fix-body table");

        var key, i = 0, row;
        for (key in self.cache.rows) {
            ++i;
            row = self.cache.rows[key];

            if (row.element.is(".item-tmpl")) {
                continue;
            }

            if (operation(row, i)) {
                break;
            }
        }
    };

    var hideSortIcons = function ($container) {
        var $divHead = single$($container, ".flow-container .dt-head"),
            $fixHead = single$($container, ".fix-columns .dt-head");

        query$($divHead, ".sort-icon").replaceWith($('<i class="sort-icon sort-icon-"></i>'));
        if ($fixHead) {
            query$($fixHead, ".sort-icon").replaceWith($('<i class="sort-icon sort-icon-"></i>'));
        }
    }

    DataTable.prototype.clear = function (self) {
        var $container = self.element.closest(".dt-container"),
            $table = single$($container, ".flow-container .dt-body table"),
            $fixTable = single$($container, ".dt-fix-body table");

        hideSortIcons($container);
        $table.find("tbody").not(".item-tmpl").remove();
        $fixTable.find("tbody").not(".item-tmpl").remove();

        self.cache = new DataRowCache();
    };

    DataTable.prototype.showWait = function (operation, self) {
        self.element.closest(".dt-container").append('<div class="wait" style="width:100%;height:100%;position:absolute;background-color:white;top:0px;left:0px;"></div>');
        if (isFunc(operation)) {
            operation();
        }
    };

    DataTable.prototype.hideWait = function (operation, self) {
        query$(self.element.closest(".dt-container"), ".wait").remove();
        if (isFunc(operation)) {
            operation();
        }
    };

    DataTable.prototype.columns = function (operation) {

        var self = arguments[arguments.length - 1],
            $container = self.element.closest(".dt-container"),
            $head = single$($container, ".flow-container .dt-head table");

        validateHeaderRowLength($head);
        validateCellLength($container);

        var columns = [], column, th;

        if (self.options.fixedColumn) {
            var $fixHead = single$($container, ".fix-columns .dt-head table");
            query$($fixHead, "th").each(function (index, item) {
                th = $(item);
                if (th.is(".dt-fix-column")) {
                    return;
                }
                column = {
                    colid: th.attr("data-col"),
                    index: index,
                    title: th.text(),
                    visible: th.is(":visible")
                };
                columns.push(column);
            });
        }

        query$($head, "th").each(function (index, item) {
            th = $(item);
            if (th.is(".dt-fix-column")) {
                return;
            }
            column = {
                colid: th.attr("data-col"),
                index: self.options.fixedColumn ? index + self.options.fixedColumns + 1 : index,
                title: th.text(),
                visible: th.is(":visible")
            };
            columns.push(column);
        });

        operation(columns);
    };

    var validateCellLength = function ($container) {
        var bodyCellLength, headCellLength;
        headCellLength = query$($container, ".fix-columns .dt-head thead th").length
                      + query$($container, ".flow-container .dt-head thead th").length;
        bodyCellLength = query$($container, ".fix-columns .dt-body .item-tmpl td").length
                      + query$($container, ".flow-container .dt-body .item-tmpl td").length;

        if (headCellLength !== bodyCellLength) {
            throw new Error("ヘッダーとボディで列の数が異なるレイアウトはサポートされません。");
        }
    };

    var validateHeaderRowLength = function ($head) {
        if (query$($head, "tr").length > 1) {
            throw new Error("多段行での列の表示・非表示はサポートされません。");
        }
    };

    DataTable.prototype.hideColumn = function (index) {

        var colid;
        if (typeof index === "string") {
            colid = index;
        }

        var self = arguments[arguments.length - 1],
            $container = self.element.closest(".dt-container"),
            $head = query$($container, ".flow-container .dt-head thead"),
            $body = query$($container, ".flow-container .dt-body tbody"),
            $bodyHead = query$($container, ".flow-container .dt-body thead"),
            hideThCol = function ($targetHead) {
                if (colid) {
                    var thead, th, i, ilen;
                    for (i = 0, ilen = $targetHead.length; i < ilen; i++) {
                        thead = $targetHead[i];
                        query$(thead, "th[data-col='" + colid + "']").css("display", "none");
                    }
                } else {
                    var thead, th, i, ilen;
                    for (i = 0, ilen = $targetHead.length; i < ilen; i++) {
                        thead = $targetHead[i];
                        var th = query(thead, "th");
                        if (th[index]) {
                            th[index].style.display = "none";
                        }
                    }
                }
            },
            hideTdCol = function ($targetBody) {
                if (colid) {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetBody.length; i < ilen; i++) {
                        tbody = $targetBody[i];
                        query$(tbody, "td[data-col='" + colid + "']").css("display", "none")
                    }
                } else {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetBody.length; i < ilen; i++) {
                        tbody = $targetBody[i];
                        var td = query(tbody, "td");
                        if (td[index]) {
                            td[index].style.display = "none";
                        }
                    }
                }
            };

        if (!colid) {
            validateHeaderRowLength($head);
            validateCellLength($container);
        }

        if (colid) {
            hideThCol($head);
            hideThCol($bodyHead);
            hideTdCol($body);

            if (self.options.fixedColumn) {
                var $fixHead = query$($container, ".fix-columns .dt-head thead"),
                    $fixBodyHead = query$($container, ".fix-columns .dt-body thead"),
                    $fixBody = query$($container, ".fix-columns .dt-body tbody");

                hideThCol($fixHead);
                hideThCol($fixBodyHead);
                hideTdCol($fixBody);

                var outerWidth = $fixHead.outerWidth();
                $fixBody.closest("table").outerWidth(outerWidth + 1);
                $body.closest("table").css("margin-left", outerWidth);
                $head.closest("table").css("margin-left", outerWidth);

                var $divVScroll = query$($container, ".flow-container .dt-body .dt-vscroll");
                $divVScroll.css("width", self.options.innerWidth + outerWidth - 1);
            }

        }
        else if (index <= self.options.fixedColumns && self.options.fixedColumn) {

            var $fixHead = query$($container, ".fix-columns .dt-head thead"),
                $fixBodyHead = query$($container, ".fix-columns .dt-body thead"),
                $fixBody = query$($container, ".fix-columns .dt-body tbody");

            hideThCol($fixHead);
            hideThCol($fixBodyHead);
            hideTdCol($fixBody);

            var outerWidth = $fixHead.outerWidth();
            $fixBody.closest("table").outerWidth(outerWidth + 1);
            $body.closest("table").css("margin-left", outerWidth);
            $head.closest("table").css("margin-left", outerWidth);

            var $divVScroll = query$($container, ".flow-container .dt-body .dt-vscroll");
            $divVScroll.css("width", self.options.innerWidth + outerWidth - 1);

        }
        else {

            if (index > self.options.fixedColumns && self.options.fixedColumn) {
                index -= (self.options.fixedColumns + 1);
            }

            hideThCol($head);
            hideThCol($bodyHead);
            hideTdCol($body);
        }
    };

    DataTable.prototype.showColumn = function (index) {

        var colid;
        if (typeof index === "string") {
            colid = index;
        }

        var self = arguments[arguments.length - 1],
            $container = self.element.closest(".dt-container"),
            $head = query$($container, ".flow-container .dt-head thead"),
            $body = query$($container, ".flow-container .dt-body tbody"),
            $bodyHead = query$($container, ".flow-container .dt-body thead"),
            showThCol = function ($targetHead) {
                if (colid) {
                    query$($targetHead, "th[data-col='" + colid + "']").css("display", "");
                    var thead, th, i, ilen;
                    for (i = 0, ilen = $targetHead.length; i < ilen; i++) {
                        thead = $targetHead[i];
                        query$(thead, "th[data-col='" + colid + "']").css("display", "");
                    }
                } else {
                    var thead, th, i, ilen;
                    for (i = 0, ilen = $targetHead.length; i < ilen; i++) {
                        thead = $targetHead[i];
                        var th = query(thead, "th");
                        if (th[index]) {
                            th[index].style.display = "";
                        }
                    }
                }
            },
            showTdCol = function ($targetBody) {
                if (colid) {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetBody.length; i < ilen; i++) {
                        tbody = $targetBody[i];
                        query$(tbody, "td[data-col='" + colid + "']").css("display", "")
                    }
                } else {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetBody.length; i < ilen; i++) {
                        tbody = $targetBody[i];
                        var td = query(tbody, "td");
                        if (td[index]) {
                            td[index].style.display = "";
                        }
                    }
                }
            };

        if (!colid) {
            validateHeaderRowLength($head);
            validateCellLength($container);
        }

        if (colid) {
            showThCol($head);
            showThCol($bodyHead);
            showTdCol($body);

            if (self.options.fixedColumn) {

                var $fixHead = query$($container, ".fix-columns .dt-head thead"),
                    $fixBodyHead = query$($container, ".fix-columns .dt-body thead"),
                    $fixBody = query$($container, ".fix-columns .dt-body tbody");

                showThCol($fixHead);
                showThCol($fixBodyHead);
                showTdCol($fixBody);

                var outerWidth = $fixHead.outerWidth();
                $fixBody.closest("table").outerWidth(outerWidth + 1);
                $body.closest("table").css("margin-left", outerWidth);
                $head.closest("table").css("margin-left", outerWidth);

                var $divVScroll = query$($container, ".flow-container .dt-body .dt-vscroll");
                $divVScroll.css("width", self.options.innerWidth + outerWidth - 1);

            }

        }
        else if (index <= self.options.fixedColumns && self.options.fixedColumn) {

            var $fixHead = query$($container, ".fix-columns .dt-head thead"),
                $fixBodyHead = query$($container, ".fix-columns .dt-body thead"),
                $fixBody = query$($container, ".fix-columns .dt-body tbody");

            showThCol($fixHead);
            showThCol($fixBodyHead);
            showTdCol($fixBody);

            var outerWidth = $fixHead.outerWidth();
            $fixBody.closest("table").outerWidth(outerWidth + 1);
            $body.closest("table").css("margin-left", outerWidth);
            $head.closest("table").css("margin-left", outerWidth);

            var $divVScroll = query$($container, ".flow-container .dt-body .dt-vscroll");
            $divVScroll.css("width", self.options.innerWidth + outerWidth - 1);

        }
        else {

            if (index > self.options.fixedColumns && self.options.fixedColumn) {
                index -= (self.options.fixedColumns + 1);
            }

            showThCol($head);
            showThCol($bodyHead);
            showTdCol($body);
        }
    };

    DataTable.prototype.adjust = function (self) {

        var $container = self.element.closest(".dt-container"),
            $divBody = query$($container, ".dt-body"),
            $divVScroll = single$($container, ".dt-vscroll"),
            $divHead = query$($container, ".dt-head"),
            $divFoot = query$($container, ".dt-foot");

//        scrollBar.width = $divBody[0].offsetWidth - $divVScroll[0].offsetWidth;

        $divBody.outerHeight(self.options.height);

        $divHead.css('margin-right', scrollBar.width);
        $divFoot.css('margin-right', scrollBar.width);

    };

    DataTable.prototype.setAditionalOffset = function (offsetHeight, self) {

        if (!self.options.resize) {
            return;
        }

        var $container = self.element.closest(".dt-container"),
            $divBody = query$($container, ".flow-container .dt-body"),
            $fixBody = query$($container, ".fix-columns .dt-body");

        self.options.addedOffset = !isNaN(parseFloat(offsetHeight)) ? offsetHeight : 0;
        self._globalLock = 0;
        resizeFitToBottom(self, $container, $divBody, $fixBody);
    };
    $.fn.dataTable = function (options) {
        var args = arguments;
        return this.each(function () {

            var $self = $(this),
                data = $self.data("aw.dataTable");

            if (!data) {
                $self.data("aw.dataTable", (data = new DataTable($self, options)));
            }

            if (typeof options === "string") {
                data[options].apply($self, Array.prototype.slice.call(args, 1).concat(data));
            }
        });
    };

    $.fn.dataTable.Constructor = DataTable;

})(jQuery);
