Feature: Posts popular

  Scenario Outline: As a user, I whant view posts older than five days, with the date in red

    Given I am on the postsPopular page
    When I view the popular posts
    Then I should see the posts older than five day with the date in red