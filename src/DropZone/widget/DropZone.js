/*jslint browser: true, devel:true, nomen:true, unparam:true, regexp: true*/
/*global define, require, mxui, mx, Dropzone, logger*/

define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "DropZone/widget/lib/dropzone"
], function (declare, _WidgetBase, domConstruct, _TemplatedMixin, dojoArray, dojoLang, _Dropzone) {
    "use strict";

    // Declare widget's prototype.
    return declare("DropZone.widget.DropZone", [_WidgetBase], {
        maxFileSize: 0,
        imageentity: "",
        onChangemf: "",
        contextassociation: "",
        panelheight: 200,
        panelwidth: 500,
        buttoncaption: "upload",
        contextGUID: null,
        uploadButton: null,
        myDropZone: null,
        parallelCount: 0,

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this.initDropZone();
            this.actLoaded();
        },

        applyContext: function (context, callback) {
            logger.debug(this.id + ".applyContext");
            if (context) {
                this.contextGUID = context.getTrackId();
            }
            if (callback) {
                callback();
            }
        },

        initDropZone: function () {
            logger.debug(this.id + ".initDropZone");
            domConstruct.empty(this.domNode);
            this.uploadButton = new mxui.widget._Button({
                caption: this.buttoncaption,
                onClick: dojoLang.hitch(this, this.onclickEvent),
                icon: "mxclientsystem/mxui/widget/styles/images/MxFileInput/uploading.gif"
            });
            this.domNode.appendChild(this.uploadButton.domNode);
            //this.uploadButton.hideIcon();
            this.domNode.appendChild(mxui.dom.div({
                id: this.id + "_zone",
                "class": "dropzone",
                style: "height: " + this.panelheight + "px; width: " + this.panelwidth + "px; background-color: gray;"
            }));
            Dropzone.autoDiscover = false;
            Dropzone.maxFilesize = this.maxFileSize;
            this.myDropzone = new Dropzone("#" + this.id + "_zone", {
                url: "/file?fileID=4&maxFileSize=5", // dummy file id
                paramName: "mxdocument",
                autoProcessQueue: false,
                addRemoveLinks: true,
                accept: dojoLang.hitch(this, this.accept)
            });
            if (this.removecaption) {
                this.myDropzone.options.dictRemoveFile = this.removecaption;
            }
            this.myDropzone.on("complete", dojoLang.hitch(this, this.onComplete));
            this.myDropzone.on("error", dojoLang.hitch(this, this.onError));
            this.myDropzone.on("removedfile", dojoLang.hitch(this, this.onRemoveFile));
        },

        onError: function (file, message) {
            logger.debug(this.id + ".onError");
            this.removeFile(file);
            this.parallelCount += 1;
            this.sendNextFile();
        },

        onRemoveFile: function (file, message) {
            logger.debug(this.id + ".onRemoveFile");
            var obj = file.obj,
                mf = this.onRemove,
                args;
            if (obj && mf !== "") {
                args = {
                    params: {
                        actionname: mf,
                        applyto: "selection",
                        guids: [obj.getGuid()]
                    },
                    callback: dojoLang.hitch(this, function (result) {
                        file.obj = null;
                        // image should be removed in microflow.
                    }),
                    error: function (e) {
                        logger.error("onRemoveFile", e);
                    }
                };
                mx.data.action(args);
            } else {
                this.removeFile(file);
            }
        },

        onComplete: function (file, message) {
            logger.debug(this.id + ".onComplete");
            if (file.obj) {
                mx.data.commit({
                    mxobj: file.obj,
                    callback: function () {
                        logger.debug("onComplete");
                    }
                });
                this.parallelCount += 1;
                this.sendNextFile();
            }
        },

        accept: function (file, callback) {
            logger.debug(this.id + ".accept");
            mx.data.create({
                "entity": this.imageentity,
                "callback": dojoLang.hitch(this, this.addedFile, file, callback)
            });
        },

        addedFile: function (file, callback, obj) {
            logger.debug(this.id + ".addedFile");
            var mf = this.onAccept, rejectcaption = "reject", args;
            obj.set(this.nameattr, file.name);
            if (this.sizeattr) {
                obj.set(this.sizeattr, file.size);
            }
            if (this.typeattr) {
                obj.set(this.typeattr, file.type);
            }
            file.obj = obj;
            if (file && mf !== "") {
                if (this.rejectcaption) {
                    rejectcaption = this.rejectcaption;
                }
                args = {
                    params: {
                        actionname: mf,
                        applyto: "selection",
                        guids: [obj.getGuid()]
                    },
                    callback: dojoLang.hitch(this, function (result) {
                        if (!result) {
                            callback(rejectcaption);
                        } else {
                            callback();
                        }
                    }),
                    error: function (e) {
                        logger.error("addedFile", e);
                    }
                };
                mx.data.action(args);
            } else {
                callback();
            }
        },

        removeFile: function (file) {
            logger.debug(this.id + ".removeFile");
            if (file.obj) {
                mx.data.remove({
                    guid: file.obj.getGuid(),
                    callback: function () {
                        file.obj = null;
                    },
                    error: function (err) {
                        console.log("Error occurred attempting to remove object " + err);
                    }
                });
            }
        },

        onclickEvent: function (e) {
            logger.debug(this.id + ".onclickEvent");
            this.parallelCount = 4;
            this.sendNextFile();
        },

        sendNextFile: function () {
            logger.debug(this.id + ".sendNextFile");
            if (this.myDropzone.getQueuedFiles().length > 0) {
                var file = this.myDropzone.getQueuedFiles().shift();
                this.myDropzone.options.url = "/file?guid=" + file.obj.getGuid() + "&maxFileSize=" + this.maxFileSize + "&csrfToken=" + mx.session.getCSRFToken() + "&height=75&width=100";
                this.callOnChange(file, file.obj);
            }
        },

        callOnChange: function (file, obj) {
            logger.debug(this.id + ".callOnChange");
            if (obj) {
                var ref = this.contextassociation.split("/"),
                    mf = this.onChangemf,
                    args;
                if (obj.has(ref[0])) {
                    obj.set(ref[0], this.contextGUID);
                }
                if (mf !== "") {
                    args = {
                        params: {
                            actionname: mf,
                            applyto: "selection",
                            guids: [obj.getGuid()]
                        },
                        callback: dojoLang.hitch(this, function (result) {
                            this.process(file);
                        }),
                        error: function (e) {
                            logger.error("callOnChange", e);
                        }
                    };
                    mx.data.action(args);
                } else {
                    this.process(file);
                }
            } else {
                this.process(file);
            }
        },

        process: function (file) {
            logger.debug(this.id + ".process");
            this.myDropzone.processFile(file);
            this.parallelCount -= 1;
            this.waitFor(
                function () {
                    return this.parallelCount > 0;
                },
                function () {
                    this.sendNextFile();
                }
            );
        },

        waitFor: function (condition, callback) {
            logger.debug(this.id + ".waitFor");
            function waiter(condition, callback) {
                return function () {
                    var condMet = false;
                    try {
                        condMet = condition();
                    } catch (e) {
                        logger.error("waitFor", e);
                    }

                    if (condMet) {
                        callback();
                    } else {
                        setTimeout(waiter(condition, callback), 50);
                    }
                };
            }
            waiter(condition, callback)();
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            if (this.myDropZone) {
                this.myDropZone.destroy();
            }
        }
    });
});