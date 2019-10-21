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

To create new svg document go to "SVG dev" activity bar "Tools" menu and press `Document -> New` menu item. Or start typing "SVG dev: new document" in command prompt. New svg visual document would be opened with empty artboard on it.

To edit existing document open it and click `SVG dev: Edit` top context menu button. Or start typing "SVG dev: Edit" in command prompt.


### View svg code

To view svg code select `Document -> Show svg code` menu item at "SVG dev" activity bar "Tools" menu. Or start typing "SVG dev: show code".

### Artboard moving and zooming

You can move artboard by click, hold and drag outside of artboard, or click hold and drag inside artboard, outside of any shape.

You can zoom artboard using buttons in top context menu, or using commands from "Zoom" section of "SVG dev" activity bar "Tools" menu.

### Artboard size and background

You can change artboard size or background clicking on tools inside editor window or using "Artboard" section of "SVG dev" activity bar "Tools" menu.

### Creating shapes

You can create shapes using tools from editor window or "Add" items from correponding sections of "SVG dev" activity bar "Tools" menu.

Select tool, click some points and shape would be created. Circle, ellipse, rect, line requires two points. Polygon, polyline and path can have any quantity of points, so to stop adding them press `esc` or `enter`.

While adding path points you can click, hold and drag - to curve the line between previous and current point.

While drawing path you can press `esc` to finish path as not closed, and press `enter` to finish path as closed.

### Styling shapes

You can change shape appearance using menu items from corresponding to this shape section from "SVG dev" activiry bar menu. Common properties like fill, stroke and stoke style could be changed in corresponding section of the same menu. Fill and stroke also could be changed using editor window buttons.

### Deleting shapes

You can delete shapes by clicking `ctrl+delete` (mac: `cmd+backspace`) keys or using `Element -> Delete` item from "SVG dev" activity bar "Tools" menu.

### Selecting shapes

You can select shapes by clicking on them. To select multiple shapes `shift+click` on them. To deselect selected shape `shift+click` on it too. To deselect all click on artboard outside of any shape.

### Moving and grouping shapes

You can move shapes by selecting and dragging them.
Pressing `alt` while moving shape would create copy of this shape.
Pressing `shift` while moving would force strict vertical or horizontal moving.

You can move shapes by with __keyboard arrows__ holding `ctrl` (mac: `cmd`) by 1px, holding `ctrl+shift` (mac: `cmd+shift`) by 10px.

Selected shapes can be grouped to move or copy them together. Use "group/ungroup" tools in editor window or "Group" section from "SVG dev" activity ba "Tools"r menu. Keyboard shortcut `ctrl+g` (mac: `cmd+g`) would also group selected shapes, keyboard shortcut `ctrl+shift+g` (mac: `cmd+shift+g`) would ungroup selected group.

### Copying shapes

You can copy shapes by `ctrl+d` (or `cmd+d` for mac), adding `shift` would make copy with the same coordinates as original shape. Also you can use `Element -> Copy` or `Element -> Copy in place` items from "SVG dev" activity bar "Tools" menu.

Also you can hold `alt` while moving shape to make copy of this shape.

### Editing shapes by points

You can edit existing shapes (path, polygon, polyline, line) point by point clicking on "edit points" button in editor window (button would appear if editable shape selected), editing mode would be entered and editable points would be shown, you can drag them and see shape changes - when you done editing press `esc` or `enter` to exit point editing mode.
You can also enter edit by points mode with keyboard shortcut `ctrl+e` (mac: `cmd+e`).

### Edit-on-pick mode
In this mode if you pick an editable shape it would automatically go to edit mode. You can switch it on/off by button in editor window.

## What`s new
 - 0.8.12
   - edit-on-pick mode added - you can switch it on by button within editor window
 - 0.8.11
   - circle and ellipse are editable by points
   - shapes are now movable in edit-points-mode, also you can pick other shapes and switch to edit-points-mode on picked shape by "edit points" button or pressing `ctrl+e` (mac: `cmd+e`)
 - 0.8.10
   - hints are now implemented as vscode info messages, you could silence them by pressing 'don`t show again' button indside message popup, you can enable or disable each hint in settings
   - edit rect by poins
   - edit by points triggers by `ctrl+e` (mac: `cmd+e`) - for all shapes that supports edit by poins (rect, path, polygon, polyline, line)
 - 0.8.9
   - formatted svg code view
   - keyboard shortcuts changes and fixes
     - `ctrl+g` (mac: `cmd+g`) to group selected shapes
     - `ctrl+shift+g` (mac: `cmd+shift+g`) to ungroup selected shapes group
     - `ctrl+delete` (mac: `cmd+backspace`) to delete selected shapes
     - `ctrl+arrows` and `ctrl+shift+arrows` (mac: `cmd+arrows` and `cmd+shift+arrows`) to move shapes
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
