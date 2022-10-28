import './formulas/ComputablePhrase.js';
import './sheets/components/ComponentFactory.js';
import processMigrations from './migrations/migrationHandler.js';
import { measureDistances } from './canvas.js';
import { exportTemplates, importTemplates } from './exports.js';

// Import document classes.
import { CustomActor } from './documents/actor.js';
import { CustomItem } from './documents/item.js';
import { CustomToken } from './documents/token.js';

// Import sheet classes.
import { CharacterSheet } from './sheets/character-sheet.js';
import { TemplateSheet } from './sheets/template-sheet.js';
import { EquippableItemSheet } from './sheets/items/equippable-item-sheet.js';
import { EquippableItemTemplateSheet } from './sheets/items/_equippable-item-template-sheet.js';
import { SubTemplateItemSheet } from './sheets/items/sub-template-item-sheet.js';

import Formula from './formulas/Formula.js';
import { postAugmentedChatMessage, postCustomSheetRoll } from './utils.js';

// Import components for factory init
import Label from './sheets/components/Label.js';
import TextField from './sheets/components/TextField.js';
import RichTextArea from './sheets/components/RichTextArea.js';
import Checkbox from './sheets/components/Checkbox.js';
import Dropdown from './sheets/components/Dropdown.js';
import Panel from './sheets/components/Panel.js';
import Table from './sheets/components/Table.js';
import DynamicTable from './sheets/components/DynamicTable.js';
import NumberField from './sheets/components/NumberField.js';
import TabbedPanel from './sheets/components/TabbedPanel.js';
import ItemContainer from './sheets/components/ItemContainer.js';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {
    // Define custom Document classes
    CONFIG.Actor.documentClass = CustomActor;
    CONFIG.Item.documentClass = CustomItem;
    CONFIG.Token.documentClass = CustomToken;

    // Register system settings - init formula
    game.settings.register('custom-system-builder', 'initFormula', {
        name: 'Initiative Formula',
        hint: "Enter a formula without '${}$'",
        scope: 'world',
        config: true,
        default: '[1d20]',
        type: String
    });

    // Register system settings - Custom CSS
    game.settings.register('custom-system-builder', 'customStyle', {
        name: 'CSS Style file',
        hint:
            'You can specify a custom styling file. If default wanted, leave blank. WARNING : Foundry does not allow ' +
            'uploading of CSS files. Please upload it manually to the server before selecting it here.',
        scope: 'world',
        config: true,
        default: '',
        type: String,
        filePicker: 'any'
    });

    // Register system settings - expand roll visibility
    game.settings.register('custom-system-builder', 'expandRollVisibility', {
        name: 'Expand Roll Visibility to whole Chat messages',
        hint: 'If checked, roll visibility will affect the whole message. This works using whispers.',
        scope: 'world',
        config: true,
        default: '',
        type: Boolean
    });

    // Register system settings - roll icon
    game.settings.register('custom-system-builder', 'rollIcon', {
        name: 'Roll Icons',
        hint: 'You can specify a fontawesome icon name to add an icon next to the clickable labels in the sheet. Example : dice-d20 to display a d20 icon. If empty, no icon will be displayed.',
        scope: 'world',
        config: true,
        default: '',
        type: String
    });

    // Register system settings - show hidden roll to GM
    game.settings.register('custom-system-builder', 'showHiddenRoll', {
        name: 'Show hidden rolls',
        hint: 'This setting will show the hidden rolls to GMs for verification purposes.',
        scope: 'world',
        config: true,
        default: '',
        type: Boolean
    });

    // Register system settings - diagonal movement computation style
    game.settings.register('custom-system-builder', 'diagonalMovement', {
        name: 'Diagonal Movement Rule',
        hint: 'Configure which diagonal movement rule should be used for games within this system.',
        scope: 'world',
        config: true,
        default: 'EQUI',
        type: String,
        choices: {
            EQUI: 'Equidistant (Always 1 unit)',
            ALT: 'Alternating (1 unit - 2 units - 1 unit)',
            EUCL: 'Euclidean (Always sqrt(2) unit)',
            CUSTOM: 'Custom, please enter unit multiplier below'
        }
    });

    // Register system settings - diagonal movement custom multiplier
    game.settings.register('custom-system-builder', 'diagonalMovementCustomVal', {
        name: 'Diagonal Movement Custom Multiplier',
        hint: 'Configure custom multiplier for diagonal movement.',
        scope: 'world',
        config: true,
        default: 1,
        type: Number
    });

    game.settings.register('custom-system-builder', 'hideFormulaBreakingMessage', {
        name: 'Hide Formula breaking change message',
        hint: 'The message will no longer be displayed on reload.',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });

    // Register sheet application classes
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('custom-system-builder', CharacterSheet, {
        makeDefault: true,
        types: ['character'],
        label: 'Default'
    });
    Actors.registerSheet('custom-system-builder', TemplateSheet, {
        makeDefault: true,
        types: ['_template'],
        label: 'Default'
    });

    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('custom-system-builder', EquippableItemTemplateSheet, {
        makeDefault: true,
        types: ['_equippableItemTemplate'],
        label: 'Default'
    });
    Items.registerSheet('custom-system-builder', EquippableItemSheet, {
        makeDefault: true,
        types: ['equippableItem'],
        label: 'Default'
    });
    Items.registerSheet('custom-system-builder', SubTemplateItemSheet, {
        makeDefault: true,
        types: ['subTemplate'],
        label: 'Default'
    });

    setInitiativeFormula();

    // Set a min-height on TinyMCE to ensure it displays even when empty
    CONFIG.TinyMCE.min_height = 100;
    // Allow TinyMCE to be resized vertically
    CONFIG.TinyMCE.resize = true;
    CONFIG.TinyMCE.statusbar = true;
    CONFIG.TinyMCE.elementpath = false;

    componentFactory.addComponentType('label', Label);
    componentFactory.addComponentType('textField', TextField);
    componentFactory.addComponentType('numberField', NumberField);
    componentFactory.addComponentType('textArea', RichTextArea);
    componentFactory.addComponentType('checkbox', Checkbox);
    componentFactory.addComponentType('select', Dropdown);
    componentFactory.addComponentType('panel', Panel);
    componentFactory.addComponentType('table', Table);
    componentFactory.addComponentType('dynamicTable', DynamicTable);
    componentFactory.addComponentType('tabbedPanel', TabbedPanel);
    componentFactory.addComponentType('itemContainer', ItemContainer);

    return true;
});

/**
 * Sets initiative formula for all tokens
 * @ignore
 */
function setInitiativeFormula() {
    Combatant.prototype._getInitiativeFormula = function () {
        let initF = game.settings.get('custom-system-builder', 'initFormula');
        let formula = initF || '1d20';

        CONFIG.Combat.initiative.formula = formula;

        console.debug('Initiative formula : ' + formula);

        return CONFIG.Combat.initiative.formula || game.system.initiative;
    };

    Combatant.prototype.getInitiativeRoll = async function (rawFormula) {
        return new Formula(rawFormula || this._getInitiativeFormula());
    };

    Combatant.prototype.rollInitiative = async function (rawFormula) {
        let formula = await this.getInitiativeRoll(rawFormula);

        await formula.compute(this.actor.system.props, {
            defaultValue: '0',
            computeExplanation: true
        });
        return this.update({ initiative: formula.result });
    };

    Combat.prototype.rollInitiative = async function (
        ids,
        { rawFormula = null, updateTurn = true, messageOptions = {} } = {}
    ) {
        // Structure input data
        ids = typeof ids === 'string' ? [ids] : ids;
        const currentId = this.combatant?.id;
        const rollMode = messageOptions.rollMode || game.settings.get('core', 'rollMode');

        // Iterate over Combatants, performing an initiative roll for each
        const updates = [];
        const messages = [];
        for (let [i, id] of ids.entries()) {
            // Get Combatant data (non-strictly)
            const combatant = this.combatants.get(id);
            if (!combatant?.isOwner) return results;

            // Produce an initiative roll for the Combatant
            const formula = await combatant.getInitiativeRoll(rawFormula);
            let phrase = new ComputablePhrase('${' + formula.raw + '}$');
            await phrase.compute(combatant.actor.system.props, {
                defaultValue: '0',
                computeExplanation: true
            });
            updates.push({ _id: id, initiative: phrase.result });

            // Construct chat message data
            let messageData = foundry.utils.mergeObject(
                {
                    speaker: ChatMessage.getSpeaker({
                        actor: combatant.actor,
                        token: combatant.token,
                        alias: combatant.name
                    }),
                    flavor: game.i18n.format('COMBAT.RollsInitiative', {
                        name: combatant.name
                    }),
                    flags: { 'core.initiativeRoll': true }
                },
                messageOptions
            );

            const chatData = await postAugmentedChatMessage(phrase, messageData, {
                create: false,
                rollMode: combatant.hidden && ['roll', 'publicroll'].includes(rollMode) ? 'gmroll' : rollMode
            });

            // Play 1 sound for the whole rolled set
            if (i > 0) chatData.sound = null;
            messages.push(chatData);
        }
        if (!updates.length) return this;

        // Update multiple combatants
        await this.updateEmbeddedDocuments('Combatant', updates);

        // Ensure the turn order remains with the same combatant
        if (updateTurn && currentId) {
            await this.update({
                turn: this.turns.findIndex((t) => t.id === currentId)
            });
        }

        // Create multiple chat messages
        await ChatMessage.implementation.create(messages);
        return this;
    };
}

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
    // Inject custom stylesheet if provided in settings
    if (game.settings.get('custom-system-builder', 'customStyle') !== '') {
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = game.settings.get('custom-system-builder', 'customStyle');
        await document.getElementsByTagName('head')[0].appendChild(link);
    }

    await processMigrations();

    let allReferencableProps = {};
    for (let template of game.actors.filter((actor) => actor.type === '_template')) {
        let headerProps = template._fetchSpecialFields(template.system.header).keyedProperties;
        headerProps.forEach((item) => {
            if (!item.includes('.')) allReferencableProps[item] = 0;
        });

        let bodyProps = template._fetchSpecialFields(template.system.body).keyedProperties;
        bodyProps.forEach((item) => {
            if (!item.includes('.')) allReferencableProps[item] = 0;
        });
    }

    game.system.model.Actor.generatedCustom = { props: allReferencableProps };

    if (game.user.isGM && !game.settings.get('custom-system-builder', 'hideFormulaBreakingMessage')) {
        Dialog.prompt({
            title: 'Custom System Builder - Breaking changes',
            content:
                '<h1>Warning : Formula changes in Custom System Builder</h1>\n' +
                '<p>The formula syntax has changed, and some specific syntax has been deprecated. Here is a summary of the changes :</p>\n' +
                '<ul>\n' +
                "<li>$&lt;colName&gt; becomes sameRow('&lt;colName&gt;')</li>\n" +
                "<li>&lt;dynamicTableKey&gt;(&lt;columnName&gt;=&lt;filterValue&gt;)$&lt;targetColumn&gt; becomes fetchFromDynamicTable('&lt;dynamicTableKey&gt;', '&lt;targetColumn&gt;', '&lt;columnName&gt;', '&lt;filterValue&gt;')</li>\n" +
                "<li>&lt;dynamicTableKey&gt;$&lt;targetColumn&gt; becomes fetchFromDynamicTable('&lt;dynamicTableKey&gt;', '&lt;targetColumn&gt;')</li>\n" +
                '<li>@&lt;property&gt; becomes ref(&lt;property&gt;)</li>\n' +
                "<li>@$&lt;colName&gt; becomes ref(sameRow('&lt;colName&gt;'))</li>\n" +
                '</ul>\n' +
                '<p>The legacy syntax will be available, while deprecated (meaning unsupported) for all Foundry v10 duration, and will be removed in Foundry v11. Any compted legacy syntax will trigger a warning in the Console, allowing you to update your formulas more easily.</p>\n' +
                '<p><a href="https://gitlab.com/linkedfluuuush/custom-system-builder#4-formulas" target="_blank" rel="noopener">Please go here to get information on the new syntax.</a></p>\n' +
                '<p>&nbsp;</p>\n' +
                '<p>This message will be displayed until Foundry v11 is released. You can disable it in the system settings</p>\n' +
                '<p><input type="checkbox" id="hideFormulaBreakingMessage" name="hideFormulaBreakingMessage" /><label for="hideFormulaBreakingMessage">Do not show again</label></p>\n' +
                '<p>Sorry for the inconvenience, and thank you for using the system !</p>',
            label: 'Close',
            callback: () => {},
            render: (html) => {
                let hideCheckbox = $(html).find('#hideFormulaBreakingMessage');
                hideCheckbox.change((ev) => {
                    let target = $(ev.currentTarget);
                    game.settings.set('custom-system-builder', 'hideFormulaBreakingMessage', target.is(':checked'));
                });
            }
        });
    }

    Hooks.callAll('customSystemBuilderReady');
});

// Prepare export buttons
Hooks.on('renderSidebarTab', createExportButtons);

/**
 * Create export button
 * @param sidebar
 * @param jq
 * @ignore
 */
function createExportButtons(sidebar, jq) {
    if (sidebar._element[0].id !== 'settings') return;

    if (!game.user.isGM) return;

    /* -------------------------------------------- */
    /*  Export button                               */
    /* -------------------------------------------- */
    let exportButton = document.createElement('button');
    exportButton.innerHTML = '<i class="fas fa-download"></i>Export templates JSON';

    exportButton.addEventListener('click', exportTemplates);

    /* -------------------------------------------- */
    /*  Import button                               */
    /* -------------------------------------------- */
    let importButton = document.createElement('BUTTON');
    importButton.innerHTML = '<i class="fas fa-upload"></i>Import templates JSON';

    importButton.addEventListener('click', importTemplates);

    // Add everything cleanly into menu
    let exportTitle = document.createElement('h2');
    exportTitle.innerText = 'Custom System Builder';

    let exportDiv = document.createElement('div');
    exportDiv.id = 'settings-custom-system-export';

    exportDiv.appendChild(exportButton);
    exportDiv.appendChild(importButton);

    let jSidebar = $(sidebar._element[0]);
    let helpBox = jSidebar.find('#settings-documentation');

    helpBox.prev('h2').before(exportTitle);
    helpBox.prev('h2').before(exportDiv);
}

Hooks.on('getActorDirectoryEntryContext', addReloadToActorContext);

/**
 * @ignore
 * @param html
 * @param menuItems
 */
function addReloadToActorContext(html, menuItems) {
    menuItems.push({
        callback: (li) => {
            let id = $(li).data('document-id');
            let actor = game.actors.get(id);

            actor.reloadTemplate();
        },
        condition: (li) => {
            let id = $(li).data('document-id');
            let actor = game.actors.get(id);

            return actor.type === 'character' && game.user.isGM;
        },
        icon: '<i class="fas fa-sync"></i>',
        name: 'Reload template'
    });
}

/**
 * Add Chat command to perform sheet rolls from chat / macros
 */
Hooks.on('chatCommandsReady', function (chatCommands) {
    chatCommands.registerCommand(
        chatCommands.createCommandFromData({
            commandKey: '/sheetAltRoll',
            invokeOnCommand: (chatlog, messageText, chatdata) => {
                postCustomSheetRoll(messageText, true);
            },
            shouldDisplayToChat: false,
            iconClass: 'fa-dice-d20',
            description: 'Perform a roll from a character sheet',
            gmOnly: false
        })
    );

    chatCommands.registerCommand(
        chatCommands.createCommandFromData({
            commandKey: '/sheetRoll',
            invokeOnCommand: (chatlog, messageText, chatdata) => {
                postCustomSheetRoll(messageText);
            },
            shouldDisplayToChat: false,
            iconClass: 'fa-dice-d20',
            description: 'Perform a roll from a character sheet',
            gmOnly: false
        })
    );
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on('canvasInit', function () {
    // Extend Diagonal Measurement
    SquareGrid.prototype.measureDistances = measureDistances;
});
