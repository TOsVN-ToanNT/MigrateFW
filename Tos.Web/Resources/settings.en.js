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
        utcDate: false,
        chart: {
            grid: true,                         // Chart Settings ON/OFF
            gridBackgroundColor: "#ffffff",     // Chart Background Color 
            gridBborderWidth: 0,                // Thickness of the outer frame line
            xaxisTickLength: 0,                 // Thickness of the vertical lines
            legend: true,                       // Display Legend
            colors: [                           // Series Default Color
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
            closeText: 'select',
            currentText: 'This Month',
            dateFormat: 'yy/mm',
            yearSuffix: '/',
            //monthNamesShort: ['1', '2', '3', '4', '5', '6',
            //'7', '8', '9', '10', '11', '12'],
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

    })
})();
