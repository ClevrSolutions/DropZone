Set widget=DropZone
del .\dist\%widget%.mpk /Q
"C:\Program Files\7-Zip\7za"  a -r -tzip .\dist\%widget%.mpk .\src\*
del .\dev\widgets\%widget%.mpk /Q
copy .\dist\%widget%.mpk .\dev\widgets\%widget%.mpk 

