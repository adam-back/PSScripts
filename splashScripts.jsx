/* Photoshop Script to Create iPhone Splash Screens

Credit: This is edited for my own use from progrmr: https://gist.github.com/progrmr/11146412

1. Create two large splash screens with your logo as a png file.
The lanscape png should be: 2048 x 1496.
The portrait png should be: 1536 x 2008.

2. Download this script somewhere easy to find, maybe even within the project.

3. Open Photoshop. Select File > Scripts > Browse

4. Find this file. Clip open.

5. On the next screen, select your giant png logo file.

6. On the final screen, select the directory where you want your icons to be saved.
WARNING: If your big logo has the same name as any of the file names below, your logo
will be overwritten. 
 
 
// Turn debugger on. 0 is off.
// $.level = 1;
 
try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a sqaure PNG file that is at least 1024x1024.", "*.png", false);
 
  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }
 
    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels
 
    if (doc.width != doc.height)
    {
        throw "Image is not square";
    }
    else if ((doc.width < 1024) && (doc.height < 1024))
    {
        throw "Image is too small!  Image must be at least 1024x1024 pixels.";
    }
    else if (doc.width < 1024)
    {
        throw "Image width is too small!  Image width must be at least 1024 pixels.";
    }
    else if (doc.height < 1024)
    {
        throw "Image height is too small!  Image height must be at least 1024 pixels.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");
 
    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }
 
    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = true;
    doc.info = null;  // delete metadata
    
    var icons = [
      {"name": "iTunesArtwork@2x", "size":1024},
      {"name": "iTunesArtwork",    "size":512},
      
      {"name": "icon-small",          "size":29},
      {"name": "icon-small@2x",       "size":58},
      {"name": "icon-small@3x",       "size":87},
      
      {"name": "icon-40",          "size":40},
      {"name": "icon-40@2x",       "size":80},
      {"name": "icon-40@3x",       "size":120},
      
      {"name": "icon-50",          "size":50},
      {"name": "icon-50@2x",       "size":100},
      
      {"name": "icon",          "size":57},
      {"name": "icon@2x",       "size":114},
      
      {"name": "icon-60@2x",       "size":120},
      {"name": "icon-60@3x",       "size":180},
 
      {"name": "icon-72",          "size":72},
      {"name": "icon-72@2x",       "size":144},
      
      {"name": "icon-76",          "size":76},
      {"name": "icon-76@2x",       "size":152},
      
      {"name": "icon-120",         "size":120}
    ];
 
    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      doc.resizeImage(icon.size, icon.size, // width, height
                      null, ResampleMethod.BICUBICSHARPER);
 
      var destFileName = icon.name + ".png";
 
      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork files don't have an extension
        destFileName = icon.name;
      }
 
      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }
 
    alert("iOS Icons created!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
  if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}