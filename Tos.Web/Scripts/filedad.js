/** 最終更新日 : 2017-10-01 **/
//File drag&drop
(function ($) {

    $.fn.filedad = function (options) {
        var self = $(this);
        var opts = options || {};
        var multiple = !!opts.multiple;

        $(window).on('dragend drop dragleave dragover', function (e) {
            var length = $(e.target).closest(self).length;
            if (!length) {
                self[0].classList.remove("drag-over");
            }
        });

        self.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        }).on('dragover dragenter', function (e) {
            self[0].classList.add("drag-over");
        }).on('drop', function (e) {
            e.preventDefault();
            self[0].classList.remove("drag-over");
            let droppedFiles = Array.prototype.slice.call(e.originalEvent.dataTransfer.files);
            if (droppedFiles.length < 1) {
                return;
            }
            if (!multiple && droppedFiles.length > 1) {
                droppedFiles = [droppedFiles[0]];
            }
            self.trigger("selected", [{ selectedFiles: droppedFiles }]);
        });

        if (opts.enableClickFileSelect) {
            var fileField = $("<input type='file' style='display:none;' />");
            if (multiple) {
                fileField.attr("multiple", "multiple");
            }
            $(document.body).append(fileField);
            fileField.on("change", function (e) {
                var selectedFiles = Array.prototype.slice.call(e.target.files);
                if (selectedFiles.length < 1) {
                    return;
                }
                self.trigger("selected", [{ selectedFiles: selectedFiles }]);

                //入力したファイルをクリアする
                fileField.val('');
            });
            self.on("click", function (e) {
                fileField.click();
            });
        }

        return self;
    };

})(jQuery);
