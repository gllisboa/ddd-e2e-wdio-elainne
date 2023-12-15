Feature: Login

  Scenario Outline: As a user, I can log into forum

    Given I am on the login page
    When I login
    Then I should see a toast message saying <message>

    Examples:
      | message    |
      | Logged in! 🤠|