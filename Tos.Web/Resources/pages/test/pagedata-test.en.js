/** 最終更新日 : 2016-10-17 **/
(function () {

    var lang = App.ui.pagedata.lang("en", {
        _pageTitle: { text: "test" },
        inputTitle: { text: "regist data" },
        count: { text: "get count" },
        id: { text: "ID" },
        cd_system: { text: "system code" },
        cd_shain: { text: "employee code" },
        cd_ope: { text: "ope code" },
        cd_kaisha: { text: "company code" },
        cd_kaiso: { text: "hierarchy code" },
        cd_bunrui: { text: "classification code" },
        cd_kengen: { text: "authority code" },
        no_table: { text: "table No." },
        cd_naiyo: { text: "description dode" },
        ymd_create: { text: "create datetime" },
        cd_create_shain: { text: "creator" },
        ymd_update: { text: "update datetime" },
        cd_update_shain: { text: "updator" },
        ts: { text: "timestamp" },
        insertCommand: { text: "insert" },
        updateCommand: { text: "update" },
        deleteCommand: { text: "delete" },
        commandTitle: { text: "test case" },
        test1: { text: "multiple" },
        test2: { text: "single" },
        test3: { text: "multiple(V)" },
        test4: { text: "single(V)" },
        test5: { text: "inset" },
        test6: { text: "update" },
        test7: { text: "delete" },
        test8: { text: "WA multiple" },
        test9: { text: "WA single" },
        test10: { text: "WA multiple(V)" },
        test11: { text: "WA single(V)" },
        test12: { text: "WA multiple(S)" },
        test13: { text: "WA single(S)" },
        test14: { text: "WA insert" },
        test15: { text: "WA update" },
        test16: { text: "WA delete" },
        test17: { text: "WA bulk" },
        test18: { text: "WA bulk(S)" },
        test19: { text: "WA bulk RB" },
        test20: { text: "WA bulk(S)RB" },
        test21: { text: "multiple CSV" },
        test22: { text: "single CSV" },
        test23: { text: "CSV up" },
        test24: { text: "Validation(SV)" }
    });

    App.ui.pagedata.validation("en", {

        cd_system: {
            rules: { required: true },
            messages: {
                required: "System code is required."
            }
        },
        cd_shain: {
            rules: {
                rangelength: [4, 10],
                alphabet: true
            },
            messages: {
                rangelength: "Please enter between {1} characters from {0} characters employee code.",
                alphabet: "Please enter alphabetic characters employees code."
            }
        },
        cd_ope: {
            rules: { number: true },
            messages: {
                number: "Please enter a numeric value opcode."
            }
        },
        cd_kaisha: {
            rules: { range: [0, 9] },
            messages: {
                range: "Please enter between {1} from {0} company code."
            }
        },
        cd_kaiso: {
            rules: { custom: true },
            messages: {
                custom: "Please enter before the company code."
            }
        },
        ymd_create: {
            rules: { date: true },
            messages: {
                date: "Please enter the date creation date."
            }
        },
        cd_update_shain: {
            rules: { custom: true },
            messages: {
                custom: "Please enter your login user name to update user."
            }
        }
    });

    App.ui.pagedata.operation("en", {

    });
})();
