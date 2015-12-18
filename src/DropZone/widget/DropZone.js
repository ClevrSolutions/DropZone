/*
    Dropzone
    ========================

    @file      : Dropzone.js
    @version   : 2.0
    @author    : FlowFabric BV
    @date      : Wed, 16 Dec 2015 10:56:13 GMT
    @copyright : 
    @license   : 

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "DropZone/lib/jquery-1.11.2",
    "DropZone/lib/dropzone"
], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, _jQuery,_dropzone) {
    "use strict";

    var $ = _jQuery.noConflict(true);
    
    // Declare widget's prototype.
    return declare("DropZone.widget.DropZone", [ _WidgetBase ], {
        // _TemplatedMixin will create our dom node using this HTML template.


        // DOM elements
        inputNodes: null,
        colorSelectNode: null,
        colorInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
		maxFileSize : 0,
		imageentity: '',
		onChangemf: '',
		contextassociation: '',
		panelheight: 200,
		panelwidth: 500,
		buttoncaption: 'upload',

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        contextGUID: null,
        uploadButton : null,
        myDropZone: null,
        sendCount: 0,
        parallelCount: 0,
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
//            this._updateRendering();
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            console.log(this.id + ".update");

            this._contextObj = obj;
//            this._resetSubscriptions();
//            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function() {},

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function() {},

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function(box) {},

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function() {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function(e) {
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },
        
        _resetSubscriptions: function() {
            // Release handles on previous object, if any.
            
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });

                this._handles = [ objectHandle ];
            }
        },
        
        
        _setupEvents: function () {
		//console.log("initDropZone");
            var obj = this._contextObj;
		dojo.empty(this.domNode);
		this.uploadButton = new mxui.widget._Button({
				caption : this.buttoncaption,
				//action	: dojo.hitch(this, this.onclickEvent),
                                onClick: dojoLang.hitch(this, this.onclickEvent),
				icon : "mxclientsystem/mxui/widget/styles/images/MxFileInput/uploading.gif"
			});
		this.domNode.appendChild(this.uploadButton.domNode);
        if(this.panelwidth === 0){
            this.panelwidth = "100%";
            		//this.uploadButton.hideIcon();			
		this.domNode.appendChild(mxui.dom.div({
			id			: this.id+'_zone', 
			"class"	: 'dropzone', 
			style		: 'height: ' + this.panelheight + 'px; width: ' + this.panelwidth + '; background-color: gray;' 
			}));
        }else{
            		//this.uploadButton.hideIcon();			
		this.domNode.appendChild(mxui.dom.div({
			id			: this.id+'_zone', 
			"class"	: 'dropzone', 
			style		: 'height: ' + this.panelheight + 'px; width: ' + this.panelwidth + 'px; background-color: gray;' 
			}));
        }

		Dropzone.autoDiscover = false;
		Dropzone.maxFilesize = this.maxFileSize;
		this.myDropzone = new Dropzone("#" + this.id+'_zone', {
			url: "/file?fileID=4&maxFileSize=5",
			paramName: 'mxdocument',
			autoProcessQueue:false,
			addRemoveLinks: true
		}); 
		this.myDropzone.on("complete", dojoLang.hitch(this, function(file, message) { 
			//console.log('complete'); 
			//console.log(file);
			if (file.obj) {	
				mx.data.commit({
					mxobj    : file.obj,
					callback : function() {
						//console.log("Object committed");
					},
					error : function(err) {
						//console.log("Error occurred attempting to commit " + err);
					}
				});
			}
			this.parallelCount += 1;
			this.sendNextFile();
		}));
		this.myDropzone.on("error", dojoLang.hitch(this, function(file, message) { 
			//console.log('error'); 
			//console.log(file);
			if (file.obj) {	
				mx.data.remove({
                        guid: file.obj.guid,
                        callback: function() {
//                            console.log("Object removed");
                        },
                        error: function(e) {
//                            console.log("Error occurred attempting to remove object " + e);
                        }
                    }
                );
			}
			this.parallelCount += 1;
			this.sendNextFile();
		}));			
	},
	onclickEvent: function (e) {
		this.sendCount = this.myDropzone.files.length;
		this.parallelCount = 4;
		this.sendNextFile();
	},
	sendNextFile: function () {
		if (this.sendCount > 0) {
            
			mx.data.create({
				entity	 : this.imageentity,
				callback : dojoLang.hitch(this, this.callOnImage),
				error    :	function(e){
//                    console.log("error creating object");
                }
			}); 
		}
	},		
        
        sendParallel: function (files, callback){
            self = this, count = files.length,
            next  = function() {
                    if (--count == 0) {
                        (typeof callback == "function") && callback.call(self);
                    }
                };
            for(var i=0, len= files.length; i< lenl; i++)
                this.sendFile(next);
            
        },
        
        sendFile:function(file, callback){
            callback(); //done!
        },
        
	callOnImage: function (obj) {
		console.log('callOnImage');
		if (obj) {
			//console.log(obj);
			var ref = this.contextassociation.split('/');
			if (obj.has(ref[0])) {
				obj.set(ref[0], this._contextObj.getGuid());
			}
			//console.log(this.onChangemf);
			var mf = this.onChangemf;
			if (mf != '') {
				var args = {
					params: {
						actionname	: mf,
						applyto: 'selection',
						guids: [obj.getGuid()]						
					},
					callback	: dojoLang.hitch(this, function(result) {
							this.sendOneFile(obj);
					}),
					error		: function() {
					},

				};
				mx.data.action(args,this);
			} else {
				this.sendOneFile(obj);
			}
		} else {
			this.sendOneFile(obj);
		}
	},
	sendOneFile: function (obj){
		//console.log('send one file ' + this.sendCount );
		// mx3 this.myDropzone.options.url = "/file?fileID=" + obj.get("FileID") +"&maxFileSize=5";
		console.log(dojo.version);
		this.myDropzone.options.url = "/file?guid=" + obj.getGuid() +"&maxFileSize=" + this.maxFileSize + "&csrfToken=" + mx.session.getCSRFToken() + "&height=75&width=100";
		if (this.myDropzone.getQueuedFiles().length > 0) {
			var file = this.myDropzone.getQueuedFiles().shift();
			file.obj = obj; // pass for handling in error or complete
			this.myDropzone.processFile(file);	
			this.sendCount-=1;
			this.parallelCount-=1;
		} 
		this.waitFor(
		  function() {return this.parallelCount>0;},
		  function() {this.sendNextFile();}
		);			
	},
	waitFor: function (condition, callback) {
	  function waiter(condition, callback) {
		return function() {
		  var condMet = false;
		  try {
			condMet = condition();
		  } catch (e) {}

		  if (condMet) {
			callback();
		  } else {
			setTimeout(waiter(condition, callback), 50);
		  }
		};
	  }
	  waiter(condition, callback)();
	},

	uninitialize : function () {
		if (this.myDropZone) { this.myDropZone.destroyRecursive();}
	}
        
        
        
        
    });
});

require(["DropZone/widget/DropZone"], function() {
    "use strict";
});
