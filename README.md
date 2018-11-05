**Dropzone**
--------------

Mendix implementation of the DropZone widget.

Credits to: http://www.dropzonejs.com/
 
**Description**

 Upload multiple images or filedocuments on a canvas an upload them together. All processed files are marked with a tick-box, errors with a red cross.

**Typical usage scenario**

 Upload multiple images or documents

**Dependencies**

 Mendix 7.x

**Configuration**

 -   Put the widget on a context form.

**Properties**
 
-   Image entity: filedocument or inherited entity

-   Association to context: Set this to associate the images to the context. For example Item has multiple images use Image\_Item.

-   Name attribute: The name of the uploaded file is put in this this attribute

-   Filetype: the filetype is filled before on accept and can be used to accept or reject the file.

-   On change: when an image is uploaded this is called.

-   On accept: when an image is uploaded this is called. Return true to accept a file, false to reject.

-   On remove: when a file is uploaded and then deleted, this microflow is called an should delete the filedocument.

-   maxFileSize: Maximum file size in MB

-   Button caption: Text on the upload button (can be translated).

-   Remove caption. If loaded this will be displayed on the icon

-   Auto Start Upload: Hides upload button start uploading on drop.


**Known bugs**

 When you don't provide an on remove microflow the file is deleted but the screen is not refreshed.

 All of the original issues of the [Dropzone library] (https://github.com/enyo/dropzone/issues)
 

**Frequently Asked Questions**

 Ask your question at the Mendix Community [*Forum*](https://mxforum.mendix.com/)
