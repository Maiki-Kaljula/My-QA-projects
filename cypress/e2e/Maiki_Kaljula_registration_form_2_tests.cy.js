beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Functional tests', () => {
    // Fill in all mandatory fields (except passwords) before each test
    beforeEach(() => {
        cy.get('input[data-testid="user"]').type('Maiki479')
        cy.get('#email').type('maiki@test.com')
        cy.get('[data-cy="name"]').type('Maiki')
        cy.get('#lastName').type('Kaljula')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    });

    it('User can use only same both first and validation passwords', () => {
        // Type different passwords
        cy.get('#password').type('Parool479')
        cy.get('#confirm').type('Parool479123')
        cy.get('h2').contains('Password').click() // Click outside to trigger validation

        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible');
        cy.get('#password_error_message').should('be.visible').should('contain', 'Passwords do not match!'); // Assert error message

        // Type matching passwords
        cy.get('#password').clear().type('MyPass');
        cy.get('#confirm').clear().type('MyPass');
        cy.get('h2').contains('Password').click(); // Click outside to trigger validation

        cy.get('#password_error_message').should('not.be.visible'); // Assert no error message
        cy.get('.submit_button').should('be.enabled'); // Assert submit button is enabled
    });


    it('User can submit form with all fields added', () => {
        // Add test steps for filling in ALL fields
        cy.get('input[data-testid="user"]').type('Maiki479');
        cy.get('#email').type('maiki@test.com');
        cy.get('[data-cy="name"]').type('Maiki');
        cy.get('#lastName').type('Kaljula');
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040');

        // Select Javascript radio button
        cy.get('#javascriptFavLanguage').check();

        // Select Bike and Car checkboxes
        cy.get('#vehicle1').check();
        cy.get('#vehicle2').check();

        // Select Audi from cars dropdown
        cy.get('#cars').select('audi');

        // Select Cat from animal dropdown
        cy.get('#animal').select('cat');

        cy.get('#password').type('MyPass');
        cy.get('#confirm').type('MyPass');
        cy.get('h2').contains('Password').click(); // Click outside to trigger validation

        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled');

        // Submit the form
        cy.get('.submit_button').click();

        // Assert that successful message is visible
        cy.get('#success_message').should('be.visible').should('contain', 'User successfully submitted registration')
    });

    it('User can submit form with valid data and only mandatory fields added', () => {
        // Call the function to fill in mandatory fields
        inputValidMandatoryData('johnDoe')

        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled');

        // Submit the form
        cy.get('.submit_button').click();

        // Assert that successful message is visible
        cy.get('#success_message').should('be.visible').should('contain', 'User successfully submitted registration')
    });

    it('User cannot submit form when username is absent', () => {
        inputValidMandatoryData('johnDoe');
        cy.get('input[data-testid="user"]').clear(); // Clear the username field
        cy.get('h2').contains('Password').click(); // Trigger validation

        cy.get('.submit_button').should('be.disabled');
        cy.get('#success_message').should('not.be.visible');

        // See oli solution failis
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
        cy.get('#username').should('have.css', 'box-shadow').should('contain', 'rgb(255, 0, 0)')
        cy.get('#username').should('have.attr', 'title').should('contain', 'Input field')
    });

    it('User cannot submit form when email is absent', () => {
        inputValidMandatoryData('johnDoe');
        cy.get('#email').clear(); // Clear the email field
        cy.get('h2').contains('Password').click(); // Trigger validation

        cy.get('.submit_button').should('be.disabled');
        cy.get('#success_message').should('not.be.visible');
    });

    function inputValidMandatoryData(username) {
        cy.log('Username will be filled')
        cy.get('input[data-testid="user"]').type(username)
        cy.get('#email').type('validemail@yeap.com')
        cy.get('[data-cy="name"]').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        cy.get('#password').type('MyPass')
        cy.get('#confirm').type('MyPass')
        cy.get('h2').contains('Password').click()
    }

})

/*
Assignement 5: create more visual tests
*/

describe('Visual tests', () => {
    it('Check that first logo is correct and has correct size', () => {
        cy.log('Will check Cerebrum Hub logo source and size')
        cy.get('img').eq(0).should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height
        // it should be less than 178 and greater than 100
        cy.get('img').eq(0).invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check that second logo picture is correct and has correct size', () => {
        cy.log('Will check Cypress logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').should('include', 'cypress_logo')
        cy.get('img').eq(1).invoke('height').should('equal', 88)
        cy.get('img').eq(1).invoke('width').should('equal', 116) 
    });

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')

        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()

        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')

        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')

        // Get navigation element, find its second child, check the link content and click it
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()

        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_3.html')

        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    
    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'PHP')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from the other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    // Create test similar to previous one verifying check boxes
    it('Check that check box list is correct', () => {
        // Array of found elements with given selector has 3 elements in total
        cy.get('input[type="checkbox"]').should('have.length', 3)

        // Verify labels of the check boxes
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text', 'I have a bike')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text', 'I have a car')
        cy.get('input[type="checkbox"]').next().eq(2).should('have.text', 'I have a boat')

        // Verify default state of check boxes
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(2).should('not.be.checked')

        // Mark the first checkbox as checked and assert its state
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')

        // Mark the second checkbox as checked and assert the state of the first and second checkboxes
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('be.checked')
    })

    it('Car dropdown is correct', () => {
        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)

        // Check  that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')

        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value.trim())
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    // Create test similar to previous one verifying animal dropdown
    it('Animal dropdown is correct', () => {
        // Here are given different solutions how to get the length of array of elements in Animal dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#animal').children().should('have.length', 6)
        cy.get('#animal').find('option').should('have.length', 6)

        // Advanced level how to check the content of the Animal dropdown
        cy.get('#animal').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['dog','cat','snake','hippo','cow','mouse'])
        })
    })

});