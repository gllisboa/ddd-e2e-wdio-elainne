
@popular
Feature: Posts popular

  Background: User Login a
    Given I am on the postsPopular page
    And   I login with member
    When  I view the popular posts

  @popular
  Scenario Outline: As a user, I whant view posts older than five days, with the date in red
    Then I should see the posts older than five day with the date in red
  @popular
  Scenario Outline: As a user, I want view posts created a five days, with the date i the default color
    Then I should see the posts created a five days with the date in the default color
  @popular
  Scenario Outline: As a user, I want view posts created today, with the date in the default color
    Then I should see the posts created today with the date in the default color