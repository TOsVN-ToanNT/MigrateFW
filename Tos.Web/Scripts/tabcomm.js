/** 最終更新日 : 2017-10-01 **/
//tabcomm
(function (App) {

    // shared

    var global = new Function("return this;")();
    var ns = "$$__tabcomm__";
    var children = new Map();
    let instance;

    //namespace

    var priv = (function () {
        var map = new WeakMap();
        return function (obj) {
            if (!map.has(obj)) {
                map.set(obj, {});
            }
            return map.get(obj);
        };
    })();

    // event
    var internalEventNames = { addedChild: "addedChild", beforeUnloadChild: "beforeUnloadChild", unloadChild: "unloadChild" };
    var internalEvents = {};
    internalEvents[internalEventNames.addedChild] = function (source, key, data) {
        children.set(key, source);
        return true;
    };
    internalEvents[internalEventNames.beforeUnloadChild] = function (source, key, data) {

        return true;
    };
    internalEvents[internalEventNames.unloadChild] = function (source, key, data) {
        children.delete(key);
        return true;
    };

    function Emitter() {
        this._subscribers = new Map();
    }

    Emitter.prototype.on = function (eventName, callback) {
        if (!this._subscribers.has(eventName)) {
            this._subscribers.set(eventName, []);
        }
        var callbacks = this._subscribers.get(eventName);
        callbacks.push(callback);
    };

    Emitter.prototype.off = function (eventName, callback) {
        if (!this._subscribers.has(eventName)) {
            return;
        }
        var callbacks = this._subscribers.get(eventName);
        var index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    };

    Emitter.prototype.emit = function (eventObj, key, eventName, data) {
        if (!instance) return;

        if (eventName.indexOf(ns + ".") > -1) {
            let internalEventName = eventName.substr((ns + ".").length);
            if (internalEvents[internalEventName] && !internalEvents[internalEventName](eventObj, key, data)) {
                return;
            }
            eventName = internalEventName;
        }

        if (!this._subscribers.has(eventName)) {
            return;
        }
        var callbacks = this._subscribers.get(eventName);
        callbacks.forEach(function (callback) {
            callback({
                source: eventObj.source,
                key: key,
                data: data
            });
        });
    };

    var emitter = new Emitter();

    // post message

    function send(target, key, eventName, data) {
        if (!target || !target.postMessage) {
            return;
        }
        var messageData = ns + "/" + key + "/" + eventName + (!!data ? ("/" + JSON.stringify(data)) : "");
        target.postMessage(messageData, global.location.origin);
    }

    global.addEventListener("message", function (e) {
        if (e.origin !== global.location.origin) {
            return;
        }
        var dataString = e.data + "";
        if (dataString.substr(0, ns.length + 1) !== ns + "/") {
            return;
        }
        var afterNsStr = dataString.substr(ns.length + 1);
        var afterNsStrSplitPos = afterNsStr.indexOf("/");
        if (afterNsStrSplitPos < 1) {
            return;
        }
        var key = afterNsStr.substr(0, afterNsStrSplitPos);

        var afterKeyStr = afterNsStr.substr(afterNsStrSplitPos + 1);
        var afterKeyStrSplitPos = afterKeyStr.indexOf("/");

        if (afterKeyStrSplitPos === 0) {
            return;
        }
        if (afterKeyStrSplitPos < 0) {
            emitter.emit(e.source, key, afterKeyStr);
            return;
        }

        var eventName = afterKeyStr.substr(0, afterKeyStrSplitPos);
        var dataJson = afterKeyStr.substr(afterKeyStrSplitPos + 1);

        // TODO エラー処理したいがエラーになった場合にどうする？握りつぶす？
        var data = JSON.parse(dataJson);
        emitter.emit(e.source, key, eventName, data);
    });

    // module

    function TabCommunication(options) {
        var opts = options || {};
        const opener = !!global.opener ? (!!Object.keys(global.opener).length ? global.opener : undefined) : undefined;
        const id = (new Date()).getTime();
        priv(this).id = id;

        if (opener && !!opts.connectToOpener) {
            priv(this).opener = opener;

            send(opener, id, ns + "." + internalEventNames.addedChild, {});

            global.addEventListener("beforeunload", function () {
                send(opener, id, ns + "." + internalEventNames.beforeUnloadChild, {});
            }.bind(this));
            global.addEventListener("unload", function () {
                send(opener, id, ns + "." + internalEventNames.unloadChild, {});
            }.bind(this));
        }
    }

    TabCommunication.prototype = Object.create(Object.prototype, {
        sendToOpener: {
            value: function (eventName, data) {
                if (priv(this).opener) {
                    send(priv(this).opener, priv(this).id, eventName, data);
                }
            }
        },
        sendToChild: {
            value: function (key, eventName, data) {
                if (children.has(key)) {
                    send(children.get(key), priv(this).id, eventName, data);
                }
            }
        },

        sendToChildren: {
            value: function (eventName, data) {
                children.forEach(function (value, key) {
                    send(children.get(key), priv(this).id, eventName, data);
                });
            }
        },

        sendTo: {
            value: function (tab, eventName, data) {
                send(tab, priv(this).id, eventName, data);
            }
        },

        on: {
            value: function (eventName, callback) {
                emitter.on(eventName, callback);
            }
        },

        off: {
            value: function (eventName, callback) {
                emitter.off(eventName, callback);
            }
        }
    });

    App.ui.tabComm = Object.create(null, {
        getOrCreate: {
            value: function (options) {
                if (!instance) {
                    instance = new TabCommunication(options);
                }
                return instance;
            }
        }
    });

})(App);