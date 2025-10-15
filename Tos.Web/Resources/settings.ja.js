/** 最終更新日 : 2016-10-17 **/
/**
 * グループオープン系システム共通基盤の Web アプリケーションで定義する設定・定数です。
 */
(function () {

    App.define("App.settings.base", {
        conflictStatus: 409,
        validationErrorStatus: 400,
        dataTakeCount: 100,
        dialogDataTakeCount: 100,
        maxSearchDataCount: 1000,
        maxInputDataCount: 100,
        dateDefinitions: {
            months: {
                shortNames: "1 2 3 4 5 6 7 8 9 10 11 12".split(" "),
                names: "1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月".split(" ")
            },
            meridiem: {
                shortNames: { ante: "A", post: "P" },
                names: { ante: "AM", post: "PM" }
            },
            weekdays: {
                shortNames: "日 月 火 水 木 金 土".split(" "),
                names: "日曜日 月曜日 火曜日 水曜日 木曜日 金曜日 土曜日".split(" ")
            },
            dateChangeHour: 5
        },
        utcDate: false,
        chart: {
            grid: true,                         // チャート背景設定のON/OFF
            gridBackgroundColor: "#ffffff",     // チャート背景色 
            gridBborderWidth: 0,                // 外枠線の太さ
            xaxisTickLength: 0,                 // 縦罫線の太さ
            legend: true,                       // 凡例の表示/非表示
            colors: [                           // チャートに設定されるデフォルトの色
                '#2f7ed8',                      // Strong blue
                '#0d233a',                      // Very dark blue
                '#8bbc21',                      // Strong green
                '#910000',                      // Dark red
                '#1aadce',                      // Strong cyan
                '#492970',                      // Very dark violet
                '#f28f43',                      // Bright orange
                '#77a1e5',                      // Soft blue
                '#c42525',                      // Strong red
                '#a6c96a'                       // Slightly desaturated green
            ]
        },

        datepicker_month: {
            closeText: '選択',
            currentText: '今月',
            dateFormat: 'yy/mm',
            yearSuffix: '年',
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'],
            showMonthAfterYear: true,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,

            beforeShow: function (el, dp) {
                $('#ui-datepicker-div').addClass('hide-calendar');
            },
            onClose: function (dateText, inst) {

                if (inst.lastVal != dateText) {
                    if (/^[0-9]{4}\/[0-9]{2}$/.test(dateText)) {
                        var month = dateText.split("/")[1] - 1;
                        var year = dateText.split("/")[0];
                        $(this).datepicker('option', 'defaultDate', new Date(year, month, 1));
                        $(this).datepicker('setDate', new Date(year, month, 1)).change();
                    } else {
                        $(this).datepicker('option', 'defaultDate', new Date());
                    }
                }
                else {
                    var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                    var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                    $(this).datepicker('option', 'defaultDate', new Date(year, month, 1));
                    $(this).datepicker('setDate', new Date(year, month, 1)).change();
                }

                $('#ui-datepicker-div').removeClass('hide-calendar');
            }
        }
    });

})();
