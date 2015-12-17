/*global Dropzone, setTimeout */
dojo.require("DropZone.widget.lib.dropzone");
mxui.dom.insertCss(mx.moduleUrl('DropZone') + 'widget/css/dropzone.css');

mxui.widget.declare("DropZone.widget.DropZone", {
	mixins : [mxui.mixin._Contextable],
	inputargs : {
		maxFileSize : 0,
		imageentity : '',
		onChangemf : '',
		contextassociation : '',
		panelheight : 200,
		panelwidth : 500,
		buttoncaption : 'upload'
	},
	contextGUID : null,
	uploadButton : null,
	myDropZone : null,
	parallelCount : 0,

	postCreate : function () {
		this.initContext();
		this.initDropZone();
		this.actLoaded();
	},
	applyContext : function (context, callback) {
		if (context) {
			this.contextGUID = context.getTrackId();
		}
		if (callback) {
			callback();
		}
	},
	initDropZone : function () {
		dojo.empty(this.domNode);
		this.uploadButton = new mxui.widget._Button({
			caption : this.buttoncaption,
			onClick : dojo.hitch(this, this.onclickEvent),
			icon : "mxclientsystem/mxui/widget/styles/images/MxFileInput/uploading.gif"
		});
		this.domNode.appendChild(this.uploadButton.domNode);
		//this.uploadButton.hideIcon();
		this.domNode.appendChild(mxui.dom.div({
			id : this.id + '_zone',
			"class" : 'dropzone',
			style : 'height: ' + this.panelheight + 'px; width: ' + this.panelwidth + 'px; background-color: gray;'
		}));
		Dropzone.autoDiscover = false;
		Dropzone.maxFilesize = this.maxFileSize;
		this.myDropzone = new Dropzone("#" + this.id + '_zone', {
			url : "/file?fileID=4&maxFileSize=5", // dummy file id
			paramName : 'mxdocument',
			autoProcessQueue : false,
			addRemoveLinks : true,
			accept: dojo.hitch(this, this.accept)
		});
		if (this.removecaption) {
			this.myDropzone.options.dictRemoveFile = this.removecaption;
		}
		this.myDropzone.on("complete", dojo.hitch(this, this.onComplete));
		this.myDropzone.on("error", dojo.hitch(this, this.onError));
		this.myDropzone.on("removedfile", dojo.hitch(this, this.onRemoveFile));
	},
	onError: function (file, message) {
		this.removeFile(file);
		this.parallelCount += 1;
		this.sendNextFile();
	},
	onRemoveFile: function (file, message) {
		var obj = file.obj;
		var mf = this.onRemove;
		if (obj && mf !== '') {
			var args = {
				params : {
					actionname : mf,
					applyto : 'selection',
					guids : [obj.getGuid()]
				},
				callback : dojo.hitch(this, function (result) {
					file.obj = null;
					// image should be removed in microflow.
				}),
				error : function () {}
			};
			mx.data.action(args);
		} else {
			this.removeFile(file);
		}
	},
	onComplete: function (file, message) {
		if (file.obj) {
			mx.data.commit({
				mxobj : file.obj,
				callback: function () {
				}
			});
			this.parallelCount += 1;
			this.sendNextFile();
		}
	},
	accept: function(file, callback) {
		mx.data.create({
			"entity" : this.imageentity,
			"callback" : dojo.hitch(this, this.addedFile, file, callback)
		});			
	},
	addedFile: function(file, callback, obj) {
		var mf = this.onAccept;
		obj.set(this.nameattr, file.name);
		if (this.sizeattr) {
			obj.set(this.sizeattr, file.size);
		}
		if (this.typeattr) {
			obj.set(this.typeattr, file.type);
		}
		file.obj = obj;
		if (file && mf !== '') {
			var args = {
				params : {
					actionname : mf,
					applyto : 'selection',
					guids : [obj.getGuid()]
				},
				callback : dojo.hitch(this, function (result) {
					if (!result) {
						callback(this.rejectcaption);
					} else {
						callback();
					}
				}),
				error : function () {}
			};
			mx.data.action(args);
		} else {
			callback();
		}
	},
	removeFile: function(file) {
		if (file.obj) {
			mx.data.remove({
				guid    : file.obj.getGuid(),
				callback : function() {
					file.obj = null;
				},
				error : function(err) {
					console.log("Error occurred attempting to remove object " + err);
				}
			});
		}
	},
	onclickEvent : function (e) {
		this.parallelCount = 4;
		this.sendNextFile();
	},
	sendNextFile : function () {
		// mx3 this.myDropzone.options.url = "/file?fileID=" + obj.get("FileID") +"&maxFileSize=5";
		if (this.myDropzone.getQueuedFiles().length > 0) {
			var file = this.myDropzone.getQueuedFiles().shift();
			this.myDropzone.options.url = "/file?guid=" + file.obj.getGuid() + "&maxFileSize=" + this.maxFileSize + "&csrfToken=" + mx.session.getCSRFToken() + "&height=75&width=100";
			this.callOnChange(file, file.obj);
		}
	},
	callOnChange : function (file, obj) {
		if (obj) {
			var ref = this.contextassociation.split('/');
			if (obj.hasAttribute(ref[0])) {
				obj.set(ref[0], this.contextGUID);
			}		
			var mf = this.onChangemf;
			if (mf !== '') {
				var args = {
					params : {
						actionname : mf,
						applyto : 'selection',
						guids : [obj.getGuid()]
					},
					callback : dojo.hitch(this, function (result) {
						this.process(file);
					}),
					error : function () {}
				};
				mx.data.action(args);
			} else {
				this.process(file);
			}
		} else {
			this.process(file);
		}
	},	
	process: function(file) {
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

	waitFor : function (condition, callback) {
		function waiter(condition, callback) {
			return function () {
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
		if (this.myDropZone) {
			this.myDropZone.destroy();
		}
	}
});
