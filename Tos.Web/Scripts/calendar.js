/** 最終更新日 : 2017-09-08 **/
/*! 
* jQuery fixed header and column plugin.
*
* Copyright(c) 2013 Archway Inc. All rights reserved.
*/

(function ($, undefined) {

    'use strict';

    var dateCalc = {
        addDays: function (currentDate, days) {
            var result = new Date(currentDate.setDate(currentDate.getDate() + days));
            return result;
        },
        addWeeks: function (currentDate, weeks) {
            var result = new Date(currentDate.setDate(currentDate.getDate() + (weeks * 7)));
            return result;
        },
        addMonth: function (currentDate, month) {
            var result = new Date(currentDate.setMonth(currentDate.getMonth() + month));
            return result;
        },
        getFirstWeekday: function (today, day) {
            if (typeof day === "undefined" || day === null) {
                day = 1;
            }

            var first = today.getDate() - today.getDay() + day,
                firstDay = new Date(today.setDate(first));
            return firstDay;
        },
        getLastWeekday: function (today) {
            var last = today.getDate() - today.getDay() + 7,
                lastDay = new Date(today.setDate(last));

            return lastDay;
        }

    };


    /**
     * 列がカレンダーになるテーブルを作成します。
     */
    function ColumnCalendar(element, options) {
        this._globalLock = 0;
        this.options = {};
        this.element = $(element);
        this.options = $.extend({}, ColumnCalendar.DEFAULTS, options);
        this.initialize.call(this, element, this.options);
    };

    var DateSpans = {
        daily: "addDays",
        weekly: "addWeeks",
        monthly: "addMonth"
    };

    var dayClasses = "sun mon tue wed thu fri sat".split(" ");

    ColumnCalendar.DEFAULTS = {
        from: new Date(),
        to: dateCalc.addDays(new Date(), 30),
        colWidth: 80,
        dateFormat: "yyyy/MM/dd",
        width: 2000,
        initialized: function () {

        },
        span: "daily",
        weekFirstDay: 0,
        control: "<span class='number-right' data-prop='{0}'></span>"
    };

    ColumnCalendar.prototype.initialize = function (options) {
        var self = this,
            $tmpl = self.element.find("tbody.item-tmpl>tr"),
            $thead = self.element.find("thead>tr"),
            currentDate, dateStr, dayClass,
            th = "", td = "", control,
            width = 0, dataProp;

        if (self.options.span === "monthly") {
            self.options.from.setDate(1);
        } else if (self.options.span === "weekly") {
            self.options.from = dateCalc.getFirstWeekday(self.options.from);
        }

        for (currentDate = self.options.from;
             currentDate <= self.options.to;
             currentDate = dateCalc[DateSpans[self.options.span]](currentDate, 1)) {

            dateStr = (App.settings.base.dateDefinitions) ?
                App.date.format(currentDate, self.options.dateFormat, App.settings.base.dateDefinitions) :
                App.date.format(currentDate, self.options.dateFormat);

            dayClass = dayClasses[currentDate.getDay()];
            dataProp = App.date.format(currentDate, "yyyy-MM-dd");
            th += "<th class='date-col " + dayClass + " " + dataProp + "' style='width:" + self.options.colWidth + "px'>" + dateStr + "</th>";
            control = App.str.format(self.options.control, dataProp);
            td += "<td class='date-col " + dayClass + "'>" + control + "</td>";
            width += self.options.colWidth;
        }

        $thead.append(th);
        $tmpl.append(td);

        self.width = width;
        self.options.initialized.apply(self);
    };

    $.fn.columnCalendar = function (options) {
        var args = arguments;
        return this.each(function () {

            var $self = $(this),
                data = $self.data("aw.columnCalendar");

            if (!data) {
                $self.data("aw.columnCalendar", (data = new ColumnCalendar($self, options)));
            }

            if (typeof options === "string") {
                data[options].apply($self, Array.prototype.slice.call(args, 1).concat(data));
            }
        });
    };

    $.fn.columnCalendar.Constructor = ColumnCalendar;



})(jQuery);