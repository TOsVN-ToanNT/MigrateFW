/** 最終更新日 : 2017-08-18 **/
/*! 
* jQuery fixed header and column plugin.
*
* Copyright(c) 2013 To solutions All rights reserved.
*/

(function ($, undefined) {

    'use strict';

    /**
     * 列が可変になるテーブルを作成します。
     */
    function MultiColumnFlex(element, options) {
        this._globalLock = 0;
        this.options = {};
        this.element = $(element);
        this.options = $.extend({}, MultiColumnFlex.DEFAULTS, options);
        this.initialize.call(this, element, this.options);
    };

    MultiColumnFlex.DEFAULTS = {
        colWidth: 80,
        width: 2000,
        initialized: function () {
        }
    };

    MultiColumnFlex.prototype.initialize = function (options) {
        var self = this,
            $tmpl, $thead, $element,
            th = "", th2 = [], control,
            width = 0, dataProp, dataStr, flexClass, headerCtrl, header,
            i, l;

        $tmpl = self.element.find("tbody.item-tmpl > tr");
        $thead = self.element.find("thead > tr");
        //colSpan未指定時は1（結合なし）とする
        if (App.isUndefOrNull(self.options.colSpan) || self.options.colSpan == 0) {
            self.options.colSpan = 1;
        }
        //ヘッダ下段用配列の初期化
        if (self.options.headerLowerControls) {
            $.each(self.options.headerLowerControls, function (i, element) {
                th2[i] = "";
            });
        }

        // ＨＴＭＬレイアウトを作成する
        // 指定された繰り返したい箇所(subKey)を基に、配列を横に伸ばす
        for (i = 0, l = self.options.header.length; i < l; i++) {
            header = self.options.header[i];
            dataProp = header[self.options.subKey];       // キー作成
            dataStr = header[self.options.headerName];    // ヘッダー作成
            flexClass = self.options.subKey + "_" + i;        // クラス名指定

            // 可変列ヘッダに付加するコントロールの作成
            headerCtrl = App.isUndefOrNull(self.options.headerCtrl) ? "" : self.options.headerCtrl;
            headerCtrl = App.str.format(headerCtrl, dataProp);

            th += ("<th class='data-col " + flexClass + " " + dataProp + "' style='width:" + self.options.colWidth + "px' "
                + "colspan='" + self.options.colSpan + "'" + ">" + dataStr + headerCtrl + "</th>");
            if (self.options.headerLowerControls) {
                $.each(self.options.headerLowerControls, function (i, element) {
                    $element = $(element);
                    if ($element.attr("data-prop")) {
                        var value = header[$element.attr("data-prop")];
                        if (typeof value !== "undefined" && value !== null) {
                            $element.text(value);
                        }
                        th2[i] += $element[0].outerHTML;
                    } else {
                        th2[i] += element;
                    }
                });
            }

            $.each(self.options.controls, function (i, element) {
                $($tmpl[i]).append($(element).attr("data-prop", dataProp))
            });
            width += self.options.colWidth;
        }

        th2.unshift(th);
        $.each(th2, function(i, element) {
            $($thead[i]).append(element);
        });

        self.width = width;
        self.options.initialized.apply(self);
    };

    $.fn.multiColumnFlex = function (options) {
        var args = arguments;
        return this.each(function () {

            var $self = $(this),
                data = $self.data("aw.multiColumnFlex");

            if (!data) {
                $self.data("aw.multiColumnFlex", (data = new MultiColumnFlex($self, options)));
            }

            if (typeof options === "string") {
                data[options].apply($self, Array.prototype.slice.call(args, 1).concat(data));
            }
        });
    };

    $.fn.multiColumnFlex.Constructor = MultiColumnFlex;


})(jQuery);
