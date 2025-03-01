beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
. Create second test suite for functional tests
. Create tests to verify logic of the page: 
    . all fields are filled in + corresponding assertions
    . only mandatory fields are filled in + corresponding assertions
    . mandatory fields are absent + corresponding assertions (try using function)
    . add file functionlity(google yourself for solution!)
*/

// Functional tests

describe('Functional tests', () => {
    it("User can submit form with all fields filled in", () => {
        cy.get("#name").type("Maiki")
        cy.get(".email").type("maiki@test.com")
        cy.get("#country").select("Estonia")
        cy.get("#city").select("Haapsalu")
        cy.get('input[type="date"]').eq(0).type("2025-05-05")
        cy.get('input[type="radio"]').eq(0).check() //newsletter frequency
        cy.get("#birthday").type("1988-09-09")
        cy.get('input[type="checkbox"]').eq(0).check() //privacy policy
        cy.get('input[type="checkbox"]').eq(1).check() //cookie policy


        cy.get('input[type="submit"]').should("be.enabled")
        cy.get('input[type="submit"]').click()
        cy.get("h1")
            .should("be.visible")
            .should("contain", "Submission received")
    })

    it("User can submit form with only mandatory fields filled in", () => {
        cy.get("#name").type("Maiki")
        cy.get(".email").type("maiki@test.com")
        cy.get("#country").select("Estonia")
        cy.get("#city").select("Haapsalu")
        cy.get('input[type="checkbox"]').first().check()
        cy.get('input[type="checkbox"]').last().check()

        cy.get('input[type="submit"]').should("be.enabled")
        cy.get('input[type="submit"]').click()
        cy.get("h1")
            .should("have.text", "Submission received")
    })

    it("User cannot submit form when email is absent", () => {
        cy.get("#name").type("Maiki")
        cy.get("#country").select("Estonia")
        cy.get("#city").select("Haapsalu")
        cy.get('input[type="date"]').eq(0).type("2025-05-05")
        cy.get('input[type="radio"]').eq(0).check() //newsletter frequency
        cy.get("#birthday").type("1988-09-09")
        cy.get('input[type="checkbox"]').eq(0).check() //privacy policy
        cy.get('input[type="checkbox"]').eq(1).check() //cookie policy

        cy.get('input[type="submit"]').should("be.disabled")
    })

    it('Validate that email format is checked', () => {
        cy.get('[name="email"]').type('invalid@ee.ee')
        cy.get('#emailAlert').should('not.be.visible')
        cy.get('[name="email"]').clear().type('invalid-email')
        cy.get('#emailAlert').should('be.visible')
        //first error message is not hidden
        cy.get('#emailAlert>span>span').eq(0).should('have.attr', 'class', 'ng-hide')
        //second error message is visible and is correct
        cy.get('#emailAlert>span>span').eq(1).should('be.visible').and('have.text', 'Invalid email address.')
    })

    it('Validate that email format is checked using cycle', () => {
        const wrongEmails = ['tralala', 'tralala@', '@tralala']
        for (let i = 0; i < wrongEmails.length; i++) {
        cy.get('[name="email"]').type(wrongEmails[i])
        cy.get('#emailAlert').should('be.visible').and('contain', 'Invalid email address')
        cy.get('[name="email"]').clear()
        }
    })

    it("User can upload a file", () => {
        cy.get("#name").type("Maiki")
        cy.get(".email").type("maiki@test.com")
        cy.get("#birthday").type("1988-09-09")
        cy.get("#country").select("Estonia")
        cy.get("#city").select("Haapsalu")
        cy.get('input[type="checkbox"]').eq(0).check()
        cy.get('input[type="checkbox"]').eq(1).check()

        const filePath = 'cypress_logo.png'
        cy.get("#myFile").attachFile(filePath)
        cy.get('input[type="submit"]').should("be.enabled") 
        cy.get('input[type="submit"]').click()
        cy.get("h1")
            .should("be.visible")
            .should("contain", "Submission received")
    })
// from solution file
/*
it('Upload file', () => {
//Upload file from the root folder of our project
cy.get('#myFile').selectFile('load_this_file_reg_form_3.txt')
cy.contains('Submit file').click()
cy.get('h1').should('have.text', 'Submission received')
*/
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
. Create test suite for visual tests for registration form 3 (describe block)
. Create tests to verify visual parts of the page:
    . radio buttons and its content
    . dropdown and dependencies between 2 dropdowns:
        . list of cities changes depending on the choice of country
        . if city is already chosen and country is updated, then city choice should be removed
    . checkboxes, their content and links
    . email format
 */

// Visual tests

describe("Visual tests", () => {
    it("Check that logo is correct and has correct size", () => {
      cy.get('[data-testid="picture"]')
        .should("have.attr", "src", "cerebrum_hub_logo.png")
        .and("be.visible")
  
      cy.get('[data-testid="picture"]')
        .invoke("height")
        .should("be.lessThan", 178)
        .and("be.greaterThan", 100)
    })
  
    it("Check navigation part", () => {
      cy.get("a")
        .should("have.length", 1)
        .each(($el, index) => {
          cy.wrap($el)
            .should("be.visible")
            .invoke("text")
            .then((text) => {
              expect(text.trim()).to.be.oneOf([
                "Accept our privacy policy",
                "Accept our cookie policy",
              ])
            })
        })
    })
  
    it("Check newsletter radio buttons and content", () => {
      cy.get('input[name="freq"]')
        .should("have.length", 4)
        .each(($el, index) => {
          cy.wrap($el)
            .should("be.visible")
            .next("label")
            .should("be.visible")
            .invoke("text")
            .then((text) => {
              expect(text.trim()).to.be.oneOf([
                "Daily",
                "Weekly",
                "Monthly",
                "Never",
              ])
            })
        })
    })
  
    it("Check country dropdown and dependencies", () => {
      //if no country is chosed, then city choice is also empty
        cy.get('#country').select('')
        // Assert on options in the city dropdown when the country is an empty string
        cy.get('#city').find('option')
            .should('have.length', 1) // Ensure there's only one option
            .should('have.text', '')
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').then(options => {
        const actual = [...options].map(option => option.label)
        expect(actual).to.deep.eq(['', 'Spain', 'Estonia', 'Austria'])
        })

        cy.get('#country').select('Spain')
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').select('Madrid')

        //if country is changed, then city choice is removed
        cy.get('#country').select('Estonia')
        cy.get('#city.ng-empty').should('be.visible')
        cy.get('#city').select('Tartu')
        cy.get('#city.ng-empty').should('not.exist')
        cy.get('#country').select('Austria')
        cy.get('#city.ng-empty').should('be.visible')
        cy.get('#city').select('Vienna')
    })


/*
it('Another way of checking country and city dropdowns', () => {
//Verify Spain cities
const SpainCitiesText = ['', 'Malaga', 'Madrid', 'Valencia', 'Corralejo']
cy.get('#country').select(1)
cy.screenshot('Spain&cities')
cy.get('#city').find('option').should('have.length', 5)
SpainCitiesText.forEach((country, index) => {
cy.get('#city').find('option').eq(index).should('have.text', country)
})
//Verify Estonian cities
const EstonianCitiesText = ['', 'Tallinn', 'Haapsalu', 'Tartu']
cy.get('#country').select(2)
cy.screenshot('Estonia&cities')
cy.get('#city').find('option').should('have.length', 4)
EstonianCitiesText.forEach((country, index) => {
cy.get('#city').find('option').eq(index).should('have.text', country)
})
//Verify Austrian cities
const AustriannCitiesText = ['', 'Vienna', 'Salzburg', 'Innsbruck']
cy.get('#country').select(3)
cy.screenshot('Austria&cities')
cy.get('#city').find('option').should('have.length', 4)
AustriannCitiesText.forEach((country, index) => {
cy.get('#city').find('option').eq(index).should('have.text', country)
})
*/
  
    it('Adding information to date input fields', () => {
        //adding date of registration
        cy.contains('Date of registration').next().type('2024-01-05').should('have.value',
        '2024-01-05')
        //adding birthday
        cy.get('#birthday').type('1980-12-06')
        })
        it('Verify checkboxes', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('input[type="checkbox"]').parent().should('contain', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').parent().get('a[href]').should('contain', 'Accept our cookie policy')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked').parent().find('button a').should('have.attr', 'href', 'cookiePolicy.html')
        cy.get('input[type="checkbox"]').eq(1).parent().find('button a').click()
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back')
        })
    })