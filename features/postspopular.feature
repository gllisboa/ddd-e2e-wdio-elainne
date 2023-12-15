Feature: Posts popular

  Scenario Outline: As a user, I whant view posts older than five days, with the date in red

    Given I am on the postsPopular page
    When I view the popular posts
    Then I should see the posts older than five day with the date in red

  Scenario Outline: As a user, I want to see posts created five days ago, with the date in the default color

    Given I am on the postsPopular page
    When I view the popular posts
    Then I should see the posts created five days ago with the date in default color

  Scenario Outline: As a user, I whant view posts created today, with the date in default color

    Given I am on the postsPopular page
    When I view the popular posts
    Then I should see the posts created today days with the date in default color