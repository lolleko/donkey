# Donkey A Key Value Editor

A Editor for Valve's KeyValue1 Format (VDF). Currently the Editor is in a very early stage of development and pretty much just a prototype os be careful if you use this in production.


### What works?
- Opening, Editing & Saving of KeyValue files
- Drag & Drop for KeyValue pairs and ParentKeys (press alt to show drag buttons)
- Autocompletion & Special Controls (e.g "ScriptFile" => FileDialog) for Values. List of supported games below

### What doesn't work (TODO)
- Some things you would expect from your generic editor: Copy & Paste, Undo/Redo (Partially works for input fields),  Renaming files, Deleting files (currently just closes the file), CTRL & F
- Comments will be deleted upon saving
- Displaying whole files directly larger than 250kb will cause lags
- Custom themes

### Supported games
Game     | Description                                                                                       | Status
-------- | ------------------------------------------------------------------------------------------------- | ---------
KeyValue | Base Game that supports all KV files.                                                             | 100% Done
Dota2    | Autocompletion for Keys, Special Controls for Values. Templates for abilities, units, items.      | 70% Done
CS:GO    | coming soon™                                                                                      | 0%


### Contributing

This project was created without a plan and in a few weeks, therefore the code isn't very SOLID. So getting into it could be hard.
If this project will get some attention I will probably recode huge parts(everything) of it.

Anyways if you are just interested in extending the support for a game or add a new game. You can look at the existing ones in `src/js/games` the API is pretty straightforward, see the wiki for more information(TODO!).

Powered by [Electron](http://electron.atom.io) and Node.js
