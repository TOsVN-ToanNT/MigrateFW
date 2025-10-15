/** 最終更新日 : 2016-10-17 **/

; (function ($, undefined) {

    var KeyCodes = { Enter: 13 };

    var isDisplay = function (element) {
        var $element = $(element);

        if ($element.is(":not(:visible)") || $element.is(':disabled') || element.type == "hidden") {
            return false;
        } else {
            return ($element.parents(":not(:visible)").length == 0);
        }
    };


    var keydown = function (e) {
        var currentIndex,
            lastIndex,
            target = $(e.target),
            controls,
            i, l, element;

        if (e.keyCode !== KeyCodes.Enter) {
            return;
        }

        if (target.is("textarea") || target.is(":button")) {
            return;
        }

        controls = $(this).find("input, select");
        lastIndex = controls.index(e.target);
        currentIndex = lastIndex + 1;
        if (controls.length <= currentIndex) {
            currentIndex = 0;
        }

        //次のelementにフォーカスを移動する
        //次のelement・・表示されている、かつfocusできる項目
        var currentElement = controls[currentIndex],
            display;

        while (currentElement) {
            display = isDisplay(currentElement);

            if (display) {
                currentElement.focus();
                if (currentElement.nodeName == "INPUT") {
                    currentElement.select();
                }
                break;
            }

            if (lastIndex === currentIndex) {
                break;
            }
            currentElement = controls[++currentIndex];

            if (controls.length <= currentIndex + 1) {
                currentIndex = 0;
                currentElement = controls[currentIndex];
            }
        }

        e.preventDefault();
        e.stopPropagation();
    };

    $.fn.enterToTab = function () {
        var self = this;
        self.on("keydown", keydown);
    };

})(jQuery);