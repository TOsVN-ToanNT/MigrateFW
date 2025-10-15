/** 最終更新日 : 2016-10-17 **/
(function (global, $, undefined) {

    var createSubtotalRow = function (element, props, subtotals, condition, currentCondition) {
        var subtotalRow = element.clone(),
            prop;
        subtotalRow.find("input, button, select").remove();
        subtotalRow.find("td span").text("");

        for (k = 0, klen = props.length; k < klen; k++) {
            prop = props[k];
            subtotalRow.findP(prop).text(subtotals[prop]);
        };

        subtotalRow.addClass("subtotal");
        subtotalRow.findP(condition).text(currentCondition);

        return subtotalRow;
    };

    $.fn.subtotal = function (condition, props) {
        var $tbody = $(this);
        var $table = $tbody.closest("table");
        var datatable, $datatable;
        $table.each(function (index, val) {
            $datatable = $(val);
            datatable = $datatable.data("aw.dataTable");
            if (datatable) {
                return false;
            }
        });

        if (datatable) {
            var cache = datatable.cache,
                isNumber = false,
                valOrText = function (rowid, prop) {

                    var row = cache.id(rowid),
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
                sortDataRow = function (a, b) {
                    var aval = valOrText(a, condition),
                        bval = valOrText(b, condition);

                    if (isNumber) {
                        return aval - bval;
                    } else {
                        return (aval < bval) ? -1 : 1;
                    }

                    return (aval < bval) ? -1 : 1;

                };

            if (cache.rowids.length === 0) {
                return;
            }

            datatable.clear(datatable);
            cache.rowids.sort(sortDataRow);

            var initSubTotals = function (props) {
                var result = {}, i;
                for (i = 0; i < props.length; i++) {
                    result[props[i]] = 0;
                };

                return result;
            };

            var currentCondition, lastCondition,
                subtotals = initSubTotals(props),
                i, ilen, id, dtRow,
                j, jlen, prop,
                k, klen,
                subtotalRow, newRows = [];

            for (i = 0, ilen = cache.rowids.length; i < ilen; i++) {
                id = cache.rowids[i];
                dtRow = cache.id(id);

                if (dtRow.element.hasClass("subtotal")) {
                    continue;
                }

                var requireLength = 2;
                if (!dtRow.element.hasClass("item-tmpl")) {
                    requireLength = 1;
                }
                if (cache.rowids.length < requireLength) {
                    return;
                }

                if (typeof currentCondition === "undefined") {
                    currentCondition = dtRow.element.findP(condition).text();
                    lastCondition = dtRow.element.findP(condition).text();
                }

                lastCondition = dtRow.element.findP(condition).text();
                
                if (currentCondition !== lastCondition) {
                    subtotalRow = createSubtotalRow(dtRow.element, props, subtotals, condition, currentCondition);
                    newRows.push(subtotalRow);

                    currentCondition = lastCondition;
                    subtotals = initSubTotals(props)
                }

                for (j = 0, jlen = props.length; j < jlen; j++) {
                    prop = props[j];
                    num = parseFloat(dtRow.element.findP(prop).text());
                    subtotals[prop] += isNaN(num) ? 0 : num;
                };

                newRows.push(dtRow.element);
            }

            subtotalRow = dtRow.element.clone();
            subtotalRow.find("input, button, select").remove();
            subtotalRow.find("td span").text("");

            for (k = 0, klen = props.length; k < klen; k++) {
                prop = props[k];
                subtotalRow.findP(prop).text(subtotals[prop]);
            };

            subtotalRow.addClass("subtotal");
            subtotalRow.findP(condition).text(currentCondition);

            subtotalRow = createSubtotalRow(dtRow.element, props, subtotals, condition, currentCondition);
            newRows.push(subtotalRow);

            var index = 0;
            datatable.addRows.apply($datatable, [newRows, function (row, id) {

                return newRows[index++];

            }, false, datatable]);

        } else {
            var subtotals = initSubTotals(props),
                $subtotal, $row, $tmpl,
                i, prop, num,
                last, current;

            $tbody.filter(".subtotal").remove();
            $tbody = $tbody.not(".subtotal");

            //行がない場合は終了する
            var requireLength = 2;
            if (!$tbody.hasClass("item-tmpl")) {
                requireLength = 1;
            }
            if ($tbody.length < requireLength) {
                return;
            }

            $tbody.each(function (index, val) {
                $row = $(val);

                if ($row.hasClass("item-tmpl")) {
                    $tmpl = $row;
                    return;
                }

                current = $row.findP(condition).text();

                if (index > 1 && last != current) {

                    $subtotal = $tmpl.clone();

                    $subtotal.find('input, button, select').remove();
                    for (i = 0; i < props.length; i++) {
                        prop = props[i];
                        $subtotal.findP(prop).text(subtotals[prop]);
                    };

                    $subtotal.findP(condition).text(last);
                    $subtotal.insertBefore($row).show();
                    $subtotal.removeClass('item-tmpl');
                    $subtotal.addClass('subtotal');
                    subtotals = initSubTotals(props);
                    last = undefined;
                }

                for (i = 0; i < props.length; i++) {
                    prop = props[i];
                    num = Number($row.findP(prop).text());
                    subtotals[prop] += isNaN(num) ? 0 : num;
                };


                last = current;
            });

            $subtotal = $tmpl.clone();
            $subtotal.find('input, button, select').remove();
            for (i = 0; i < props.length; i++) {
                prop = props[i];
                $subtotal.findP(prop).text(subtotals[prop]);
            };
            $subtotal.findP(condition).text(current);
            $subtotal.insertAfter($row).show();
            $subtotal.removeClass('item-tmpl');
            $subtotal.addClass('subtotal');
            subtotals = initSubTotals(props);

        }
    };

})(this, jQuery);