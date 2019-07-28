# SVG dev

## Description

Visual svg editor.

Create and edit vector graphic.

## Table of contents
 - [How to use it](#how-to-use-it)
 - [What`s new](#whats-new)

![SVG dev](https://raw.githubusercontent.com/alexklyuev/svg-dev/master/docs/images/screenshot1.png)

## How to use it

### Creating and editing svg documents

To create new svg document go to "SVG dev" activity bar menu and press `Document -> New` menu item. Or start typing "SVG dev: new document" in command prompt. New svg visual document would be opened with empty artboard on it.

To edit existing document open it and click `SVG dev: Edit` top context menu button. Or start typing "SVG dev: Edit" in command prompt.


### View svg code

To view svg code select `Document -> Show svg code` menu item at "SVG dev" activity bar menu. Or start typing "SVG dev: show code".

### Artboard moving and zooming

You can move artboard by click, hold and drag outside of artboard, or click hold and drag inside artboard, outside of any shape.

You can zoom artboard using buttons in top context menu, or using commands from 'Zoom' section of 'SVG dev' activity bar menu.

### Artboard size and background

You can change artboard size or background clicking on tools inside editor window or using "Artboard" section of 'SVG dev' activity bar menu.

### Creating shapes

...

### Selecting shapes

You can select shapes by clicking on them. To select multiple shapes `shift+click` on them. To deselect selected shape `shift+click` on it too. To deselect all click on artboard outside of any shape.

### Styling shapes

...

### Moving and grouping shapes

...

### Editing shapes by points

You can edit existing shapes (path, polygon, polyline, line) point by point clicking on "edit points" button in editor window (button would appear if editable shape selected), editing mode would be entered and editable points would be shown, you can drag them and see shape changes - when you done editing press `esc` or `enter` to exit point editing mode.

## What`s new
 - 0.8.8
   - documentation updated
 - 0.8.7
   - copy and copy-in-place commands in element menu (also keybindings cmd+d and cmd+shift+d)
   - attributes menu - add any attribute to element, get list of attributes to edit
 - 0.8.6
   - group/ungroup tool in editor window
 - 0.8.5
   - move shapes by alt+arrows (and shift+alt+arrows)
   - strict vertical/horizontal shape moving with shift key pressed
 - 0.8.4
   - edit points tool appears in editing window if editable element selected
 - 0.8.3
   - shape tools inside edition window
 - 0.8.2
   - artboard dimensions control inside editing window
   - fill and stroke updates on element selection
   - polygon and polyline visual editing
   - line visual editing
 - 0.8.1
   - fill and stroke controls inside editing window
   - hints
 - 0.8.0
   - movable artboard
   - create and edit path
   - visual create all elements (circle, ellipse, rect, polygon, polyline, path)
   - new view and extension icons

_(more in changelog)_


## Todo
- docs
- format flush
- flush current selection
- conditional tools
- strict position tool group
- visual transform
- beacons mode
