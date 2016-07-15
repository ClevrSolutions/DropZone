<a name="DropZone.widget.module_DropZone"></a>

## DropZone : <code>MendixWidget</code>
DropZone.widget.DropZone


* [DropZone](#DropZone.widget.module_DropZone) : <code>MendixWidget</code>
    * [~constructor()](#DropZone.widget.module_DropZone..constructor) ⇒ <code>undefined</code>
    * [~postCreate()](#DropZone.widget.module_DropZone..postCreate) ⇒ <code>undefined</code>
    * [~update(obj, callback)](#DropZone.widget.module_DropZone..update) ⇒ <code>undefined</code>
    * [~getMendixURL(files)](#DropZone.widget.module_DropZone..getMendixURL) ⇒ <code>String</code>
    * [~onError(file, message)](#DropZone.widget.module_DropZone..onError) ⇒ <code>undefined</code>
    * [~onRemoveFile(file, message)](#DropZone.widget.module_DropZone..onRemoveFile) ⇒ <code>undefined</code>
    * [~onComplete(file, message)](#DropZone.widget.module_DropZone..onComplete) ⇒ <code>undefined</code>
    * [~accept(file, callback)](#DropZone.widget.module_DropZone..accept) ⇒ <code>undefined</code>
    * [~acceptMendix(file, callback)](#DropZone.widget.module_DropZone..acceptMendix) ⇒ <code>undefined</code>
    * [~createMendixFile(file, callback)](#DropZone.widget.module_DropZone..createMendixFile) ⇒ <code>undefined</code>
    * [~removeFile(file)](#DropZone.widget.module_DropZone..removeFile) ⇒ <code>undefined</code>
    * [~onclickEvent()](#DropZone.widget.module_DropZone..onclickEvent) ⇒ <code>undefined</code>
    * [~callOnChange(obj)](#DropZone.widget.module_DropZone..callOnChange) ⇒ <code>undefined</code>
    * [~uninitialize()](#DropZone.widget.module_DropZone..uninitialize) ⇒ <code>undefined</code>

<a name="DropZone.widget.module_DropZone..constructor"></a>

### DropZone~constructor() ⇒ <code>undefined</code>
dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  
**Access:** public  
<a name="DropZone.widget.module_DropZone..postCreate"></a>

### DropZone~postCreate() ⇒ <code>undefined</code>
dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  
<a name="DropZone.widget.module_DropZone..update"></a>

### DropZone~update(obj, callback) ⇒ <code>undefined</code>
mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>mendix/lib/MxObject</code> | the current track object, or null if there is none |
| callback | <code>mxui/widget/_WidgetBase~ApplyContextCallback</code> | function to be called when finished |

<a name="DropZone.widget.module_DropZone..getMendixURL"></a>

### DropZone~getMendixURL(files) ⇒ <code>String</code>
set the Mendix upload URL based on the GUID

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  
**Returns**: <code>String</code> - url - mendix server URL to post the file to.s  

| Param | Type |
| --- | --- |
| files | <code>Array.&lt;file&gt;</code> | 

<a name="DropZone.widget.module_DropZone..onError"></a>

### DropZone~onError(file, message) ⇒ <code>undefined</code>
on error remove the files.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>type</code> | upload files |
| message | <code>type</code> | error message |

<a name="DropZone.widget.module_DropZone..onRemoveFile"></a>

### DropZone~onRemoveFile(file, message) ⇒ <code>undefined</code>
an image should be removed from within a microflow, if there is non just delete if via the api

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>type</code> | the file that is removed from the list. |
| message | <code>type</code> | status message |

<a name="DropZone.widget.module_DropZone..onComplete"></a>

### DropZone~onComplete(file, message) ⇒ <code>undefined</code>
when uploadload is completed, commit and call onchange MF

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>type</code> | the file that is completed |
| message | <code>type</code> | status message |

<a name="DropZone.widget.module_DropZone..accept"></a>

### DropZone~accept(file, callback) ⇒ <code>undefined</code>
Create file on mendix server, and validate if it could be accepted.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | the file that validate |
| callback | <code>function</code> | callback function an acceptance. |

<a name="DropZone.widget.module_DropZone..acceptMendix"></a>

### DropZone~acceptMendix(file, callback) ⇒ <code>undefined</code>
Validate if object will be accepted by the mendix server

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | file to be send to server |
| callback | <code>function</code> | callback function on completion |

<a name="DropZone.widget.module_DropZone..createMendixFile"></a>

### DropZone~createMendixFile(file, callback) ⇒ <code>undefined</code>
Create a mendix empty file object on the server when new upload item is added.Upload of the file be done by the DropZoneJs lib

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | file that needs te be upladed |
| callback | <code>function</code> |  |

<a name="DropZone.widget.module_DropZone..removeFile"></a>

### DropZone~removeFile(file) ⇒ <code>undefined</code>
Remove file directly via the client API.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | file that needs to be removed. |

<a name="DropZone.widget.module_DropZone..onclickEvent"></a>

### DropZone~onclickEvent() ⇒ <code>undefined</code>
on click of the upload button start processing the upload queue

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  
<a name="DropZone.widget.module_DropZone..callOnChange"></a>

### DropZone~callOnChange(obj) ⇒ <code>undefined</code>
Call onchange Miroflow if any.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  

| Param | Type |
| --- | --- |
| obj | <code>mendix/lib/MxObject</code> | 

<a name="DropZone.widget.module_DropZone..uninitialize"></a>

### DropZone~uninitialize() ⇒ <code>undefined</code>
mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.

**Kind**: inner method of <code>[DropZone](#DropZone.widget.module_DropZone)</code>  
