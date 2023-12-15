Feature: Posts popular

  Scenario Outline: As a user, I want to see the order of the unpopular posts from the post with fewer votes to the most vote

    Given I am on the unpopular page
    When I view the unpopular posts
    Then I should see the posts ordered by fewer votes to the most vote

  Scenario Outline: As a user, I want to see posts created five days ago, with the date in the default color

    Given I am on the unpopular page
    When I view the unpopular posts
    Then I should see the posts created five days ago with the date in default color

  Scenario Outline: As a user, I whant view posts created today, with the date in default color

    Given I am on the unpopular page
    When I view the unpopular posts
    Then I should see the posts created today days with the date in default color