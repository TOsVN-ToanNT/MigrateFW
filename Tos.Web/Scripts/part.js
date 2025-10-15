/** 最終更新日 : 2016-10-17 **/
; (function ($, undefined) {

    "use strict";

    var initialize = function (element, options) {
        var self = this,
            $content = element.children().not(".part-command").wrapAll('<div class="part-content"></div>').parent(),
            $part = element;

        $part.addClass("part");

        if (options.header) {

            var title = $part.attr("title");
            title = (title) ? title : "";

            $content.before('<h1 class="part-title' + (options.collapsible ? ' collapsible' : '') + '" unselectable="on">'
                            + (options.collapsible ?
                                 '<i class="icon-chevron-down"></i><i class="hidden-icon icon-chevron-right"></i>' :
                                 '')
                              + '<span unselectable="on">' + title + '</span>'
                          + '</h1>');
            $part.attr("title", "");
        } else {
            $part.css("border-width", "0px");
        }

        this.collapsed = false;

        if (!options.height) {
            self.options.height = $part.height();
        }

        if (!options.width) {
            self.options.width = $part.width();
        }

        self.minHeight = $part.find(".part-title").outerHeight() + 2;

        $part.find(".part-title").click(function (e) {

            if (self.collapsed) {
                self.show();
            } else {
                self.close();
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        if (self.options.collapse && self.options.collapsible) {
            $part.find(".part-title").click();
        }
    };

    function Part(element, options) {
        this.element = $(element);
        this.options = $.extend({}, Part.DEFAULTS, options);
        initialize.call(this, element, this.options);
    }

    Part.prototype.show = function () {
        var self = this;
        if (self.collapsed) {
            self.element.children(".part-content").show();
            self.element.children(".part-command").show();
            self.element.animate({
                height: self.options.height
            },
                self.options.duration, "easeOutCubic",
                function () {
                    self.element.css("height", "auto");
                    self.element.trigger("expanded.aw.part");
                    $(window).resize();

                });
            self.collapsed = false;
            self.element.children(".part-title").find("i").toggleClass("hidden-icon");
        };
    };

    Part.prototype.close = function () {
        var self = this;
        if (!self.options.collapsible) {
            return;
        }
        if (!self.collapsed) {
            self.options.height = self.element.height();
            self.element.animate({
                height: self.minHeight
                },
                self.options.duration, "easeOutCubic",
                function () {
                    self.element.children(".part-content").hide();
                    self.element.trigger("collapsed.aw.part");
                    $(window).resize();

                });
            self.collapsed = true;
            self.element.children(".part-title").find("i").toggleClass("hidden-icon");
        }
    };

    Part.DEFAULTS = {
        header: true,
        duration: 400,
        collapse: false,
        collapsible: true
    };

    $.fn.part = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("aw.part");

            if (!data) {
                $this.data("aw.part", (data = new Part($this, options)));
            }
            if (typeof options === "string") {
                data[options].call(data);
            }
        });
    };

    $.fn.part.Constructor = Part;

})(jQuery);

