import {
    visitPluginPage,
    login,
    createForm,
} from '../support/util';

/**
 * Click on tab for form layout
 *
 * @since 1.8.10
 */
const clickLayoutTab = () => {
    cy.get('#tab_layout a').click();
};

/**
 * Click on tab for conditional logic editor
 *
 * @since 1.8.10
 */
const clickConditionalsTab = () => {
    cy.get('#tab_conditions a').click();
};

/**
 * Add a conditional and set its name and type
 *
 * @since 1.8.10
 *
 * @param name
 * @param type
 */
const createConditional = (name, type) => {
    cy.get('#new-conditional').click();
    cy.get('.condition-new-group-name').should('be.visible');
    cy.get('.condition-new-group-name').type(name).blur();
    cy.get('.condition-group-type').should('be.visible');
    cy.get('.condition-group-type').select(type);
};

describe('Using fields with conditionals', () => {
    let formName;
    beforeEach(() => {
        formName = 'Contact ' + Math.random().toString(36).substring(7);
        visitPluginPage('caldera-forms');
    });
    before(() => login());


    it('Sets field for conditional', () => {
        createForm('Sets field for conditional', false);
        cy.get( '.layout-form-field' ).should('have.length', 7);
        clickConditionalsTab();
        createConditional('c1', 'hide');
        cy.get('.condition-group-add-lines').click();
        cy.get('.condition-group-add-line').click();
        cy.get('.condition-line-field').last().select('fld_9970286');
        cy.get('.condition-line-field').first().select('fld_8768091');

    });


    it('Changes field being edited', () => {
        createForm('Changes field being edited', false);
        cy.get('.caldera-editor-header-nav li.caldera-element-type-label').should('be.visible');

        clickConditionalsTab();
        createConditional('c1', 'hide');
        cy.get('.condition-group-add-lines').click();
        cy.get('.condition-group-add-line').click();
        cy.get('.condition-line-field').first().select('fld_8768091');
    });

    it.only('Knows the labels of fields after they update', () => {
        createForm('Knows the labels of fields after they update', false);

        clickConditionalsTab();
        //create conditional using field header
        createConditional('c1', 'hide');
        cy.get('.condition-group-add-lines').click();
        cy.get('.condition-group-add-line').click();

        cy.get('.condition-line-field').first().select('header [header]');
        cy.get('.condition-line-field').should('have.value', 'fld_29462');

        //Go to layout tab and change field label
        clickLayoutTab();
        cy.get( '#fld_29462_lable' ).clear().type( 'Paste' ).blur();
        clickConditionalsTab();

        cy.get('.condition-line-field').should('have.value', 'fld_29462');

        cy.get('.condition-line-field').first().select('Paste [header]');
        cy.get('.condition-line-field').should('have.value', 'fld_29462');

    });

    it( 'Knows the slug of the field after it updates', () => {
        createForm('Knows the slug of the field after it updates', false);

        clickConditionalsTab();
        //create conditional using field header
        createConditional('c1', 'hide');
        cy.get('.condition-group-add-lines').click();
        cy.get('.condition-group-add-line').click();

        cy.get('.condition-line-field').first().select('header [header]');
        cy.get('.condition-line-field').should('have.value', 'fld_29462');

        //Go to layout tab and change field label
        clickLayoutTab();
        cy.get( '#fld_29462_slug' ).clear().type( 'Paste' ).blur();
        clickConditionalsTab();

        cy.get('.condition-line-field').should('have.value', 'fld_29462');

        cy.get('.condition-line-field').first().select('header [paste]');
        cy.get('.condition-line-field').should('have.value', 'fld_29462');
    });

});


describe.skip('Conditional Logic Editor', () => {
    let formName;
    beforeEach(() => {
        formName = Math.random().toString(36).substring(7);
        visitPluginPage('caldera-forms');
        createForm(formName)
    });
    before(() => login());
    it('Can open and close conditionals editor', () => {
        //hidden by default
        cy.get('#new-conditional').should('be.hidden');

        //Show it
        clickConditionalsTab();
        cy.get('#new-conditional').should('be.visible');

    });

    it('Can add conditional and set type', () => {
        clickConditionalsTab();
        cy.get('#new-conditional').click();
        cy.get('.condition-new-group-name').should('be.visible')
        cy.get('.condition-new-group-name').type('Condition 1').blur();
        cy.get('.condition-group-type').should('be.visible');
        cy.get('.condition-group-type').select('hide');
        cy.get('.condition-group-type').select('disable');
        cy.get('.condition-group-type').select('show');
    });

    it('Can add conditional lines', () => {
        clickConditionalsTab();
        createConditional('c1', 'hide');
        cy.get('.condition-group-add-lines').click();
        cy.get('.caldera-condition-lines').should('have.length', 1);
        cy.get('.condition-group-add-lines').click();
        cy.get('.caldera-condition-lines').should('have.length', 2);

    });

    it('Can add and remove lines from a group of lines', () => {
        clickConditionalsTab();
        createConditional('c1', 'hide');
        //Add a group and add a line to it
        cy.get('.condition-group-add-lines').click();
        cy.get('.caldera-condition-line').should('have.length', 1);
        cy.get('.condition-group-add-line').click();
        cy.get('.caldera-condition-line').should('have.length', 2);

        //Remove a line
        cy.get('.caldera-condition-line-remove').first().click();
        cy.get('.caldera-condition-line').should('have.length', 1);

        cy.get('.condition-group-add-line').click();
        cy.get('.condition-group-add-line').click();
        cy.get('.condition-group-add-line').click();
        cy.get('.caldera-condition-line').should('have.length', 4);

    });

    it('Changes compare type', () => {
        clickConditionalsTab();
        createConditional('c1', 'hide');
        cy.get('.condition-group-add-lines').click();
        cy.get('.condition-group-add-line').click();
        cy.get('.condition-line-compare').first().select('isnot');

        ['contains', 'is', 'isnot', 'startswith', 'endswith', 'smaller', 'greater'].forEach(function (conditionType) {
            cy.get('.condition-line-compare').last().select(conditionType);
            cy.get('.condition-line-compare').last().should('have.value', conditionType);
            cy.get('.condition-line-compare').first().should('have.value', 'isnot');
        });

    });

});