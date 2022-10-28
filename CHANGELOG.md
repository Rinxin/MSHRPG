# CHANGELOG

## 2.1.0

### Features

- Rework attribute bars for full support of Core and Bar Brawl bars
- Added support for text values for ItemModifier 'set'
- Added option for ItemModifier 'set' to not set a value if formula result is ''
- Added new functions: 'replace()', 'replaceAll()' and 'recalculate()'

### Fixes

- [#168] Fixed issue with map distance measuring
- [#164] Fixed issue causing error message to be displayed on actor and item creation
- [#169] Fixed error in console on item reference click
- [#161] Fixed error on item formula computing
- [#171] Fixed error with @{<actor>|<propertyKey>} in chat messages
- [#177] Fixed error log on chat messages containing only numbers
- [#173] Fixed issue with '$' value in formulas

## 2.0.1

### Fixes

- Fixed issue with unique items being able to be added to an actor multiple times
- Fixed issue with items lacking some properties 
- Added mathjs blacklist to check field keys

## 2.0.0

### Features

- **BREAKING** - V10 compatibility - System is no longer compatible with v9

### Fixes

- Fixed issue with Formula functions not returning booleans when asked a boolean value

## 1.7.3

### Fixes

- Fixed Formula referencing issues with other Computed Labels referencing
- Fixed token data recovering

## 1.7.2

### Fixes

- Fixed user input computation when no default value is entered

## 1.7.1

### Fixes

- Fixed fetchFromDynamicTable to be used with an empty filter
- Fixed Formula handling to allow macro calling from roll
- Fixed Panel display when adding grid panels inside other grid panels

## 1.7.0

### Features

- Reworked formula syntax to use functions, which are more flexible than previous syntax
- Added possibility to use custom formula in Roll Table draws
- Fixed permission level to edit Item Modifiers
- Added option to prevent sheet resizing

### Fixes

- Fixed unnecessary HTML encoding

## 1.6.2

### Fixes

- Fixed 's' present at the bottom of Number Field edit dialog
- Fixed Label display for rollMessage to respect Label style
- Fixed Table alignment display for Labels

## 1.6.1

### Fixes

- Fixed Label icon display (again)
- Fixed Label display in Dynamic Tables when label value is empty
- Fixed issue with Tables being unable to receive any new component

## 1.6.0

### Features

- Added permission system at component level
- Added unique item option
- Added capability to use a dynamic table to populate dropdown list choices
- Added tooltips to components
- Added prefixes and suffixes to labels : text added before or after the label but not kept in props computation
- Add custom label for item container 'Name' column

### Fixes

- Fixed Custom CSS setting hint
- Fixed Label display
- Removed useless 'Grid of 1 column' option from Panel layouts
- Fixed Table error when other container is changed to Table
- Added a check to prevent addition of multiple fields with the same key to a template
- Fixed context menu to only appear for labels with keys
- Fixed issue with Item Containers not working in items

## 1.5.3

### Fixes

- Fixed Label display (yet again)
- Fixed props handling when prop is deleted and recreated
- Fixed Item Container roll properties

## 1.5.2

### Fixes

- Fixed labels display
- Fixed bug with Item container in compact mode when delete button should be shown and no additional column exists 
- Added item name to its properties 
- Fixed roll explanations for items

## 1.5.1

### Fixes

- Fixed issue with Rich Text Area display

## 1.5.0

### Features

- Added item support !
  - Added equippable items which can be added to actor sheets with property modifiers
  - Added sub templates items which can be used to define reusable template parts
- Added item container element
- Added option to avoid accidental row removal in dynamic tables
- Added alternative roll option with + SHIFT Key
- Changed custom CSS selector to be a FilePicker
- Added full support of documents on Rich text editors
- Reworked export popup to sort templates by folders

### Fixes

- Fixed missing key and additional css classes in Tabbed Panels
- Fixed profile picture aspect ratio display
- Fixed issue when tabbed panels contained another tabbed panel
- Fixed issue creating ghost attribute bars in attribute bar editor
- Fixed lost focus on field update issue
- Fixed issue on Numeric field's minus button trigger on enter press
- Fixed issue with inputs without labels on firefox
- Fixed issue with Rich Text Area display on firefox

## 1.4.0

### Features

- Select first input from start on user input on rolls
- Reset template display size on template reloading
- Added attribute bar edition on token
- Added Tabbed Panel component, allowing users to create their own tabbed panels in the sheet
  - This induced a rework of the basic sheet layout, which is now a simple Panel in which users can add a Tabbed Panel as a root element if they want a standard sheet layout.
  - This removed the display option to display Header below the profile picture. This display can now be obtained by adding components before a Tabbed Panel in the body.
  - Existing sheets will be automatically migrated to this new layout, creating a Tabbed Panel and copying existing tabs to the sheet.
- Added diagonal movement configuration

### Fixes

- Fixed minimum Number Field size for inner display of + and - buttons
- Fixed actor data formula computation
- Fixed attribute bar dialog display
- Fixed chat message formatting in case result is used as parameter in a macro
- Fixed issue in dynamic table referencing with non ASCII characters
- Fixed numeric field buttons to allow for multiple clicks before sheet reloading

### Other

- Added a sheet library to the Gitlab repository, for people to share their templates

## 1.3.0

### Features
- Added RollTable support
- Added foundry permission system support
- Added button to reload all characters linked to a template
- Added more size options for fields
- Added + and - controls on Number Fields

### Fixes
- Fixed issues with template reloading
- Fixed issues with Number Fields missing values
- Fixed issue with Complex attributes bar deleting
- Fixed issue with Rich Text Area display

## 1.2.0

### Features
- Added attributes bar handling
- Added formula handling on Number fields min & max

### Fixes
- Fixed display of some core components
- Fixed issue with Table edition
- Fixed chat commands dependency lib version

## 1.1.2

### Fixes
- Fixed component creation in tables

## 1.1.1

### Fixes
- Fixed roll icon display
- Fixed dialog minimization / maximization issue
- Fixed bug in rolls when no token is on the scene
- Fixed bug in header components edition
- Fixed character creation error
- Removed 0.0.9 Breaking change warning

## 1.1.0

### Features
- Added roll from macro & chat message
- Added property referencing from chat message
- Added default value handling in user inputs
- Added sheet display settings on templates
- Added number fields

### Technical
- Added component extension capabilities
- Refactored component rendering to ES6 classes
- Migrated number-formatted text fields to Number fields

## 1.0.1

-   Fixed table alignment display
-   Fixed roll icons display
-   Fixed component bugs by enforcing use of keys on data-saving components
-   Fixed component editor field display bugs
-   Fixed component editor bugs by disallowing multiple component editor windows to be openeded

## 1.0.0

-   Changed system name to Custom System Builder !

## 0.0.9

-   **BREAKING** - Added ability to reference the value of a field in formula outside dynamic tables
    -   This feature changed dynamic table referencing system, it now uses a `$` instead of the `@`
-   Added more formula explanations on chat messages
-   Added context-menu action to reload sheet template
-   Disabled sheet reloading for non GM players
-   Fixed tab edition bug when tab key was an integer

## 0.0.8

-   Fixed an issue with empty string handling in formulas
-   Fixed an issue with chat messages without rolls

## 0.0.7

-   Added compatibility with the Dice so Nice module
-   Fixed issue with actor data calculation leading to errors in sheet display
-   Fixed issue with formula calculations and string handling in formulas

## 0.0.6

-   Added initiative formula setting
-   Added basic text-field formats
-   Added user inputs for formulas
-   Added field sizing on sheets
-   Fixed core version compatibility
-   Fixed label HTML display
-   Fixed dynamic tables aggregation functions handling
-   Fixed minor error with math.js library

## 0.0.5

-   Fixed bug on hidden properties calculation
-   Fixed rendering of rich text elements in chat messages
-   Added possibility to add an icon in front of labels
-   Added aggregation capabilities on dynamic table values

## 0.0.4

-   Added hidden properties, used for intermediate calculations only
-   Added better explanation of rolls & formulas
-   Added option to display icon next to rollable labels
-   Added CSS class customization on components
-   Added edit button float on dialog editors RTF
-   Added option to set first line of array 'head'
-   Code cleanup - Separate character and \_template sheet codes

## 0.0.3

-   Fixed naming errors

## 0.0.2

-   Corrected typo in repo name
-   Updated README.md & TODO.md

## 0.0.1

-   System init
