@unpopular
Feature: Posts unpopular

  Background: User Login a
    Given I am on the unpopular page
    And   I login with member
    When  I view the unpopular posts

  @unpopular
  Scenario Outline: As a user, I want see the number of votes for each post
    Then I must be able to see the number of votes for each post

  @unpopular
  Scenario Outline: As a user, I want see the unpopular posts sorted in ascending order by number of votes
    Then Unpopular posts should be automatically sorted in ascending order by number of votes

  @unpopular
  Scenario Outline: As a user, I want see posts with the same number of votes should be sorted in order of publication, with the most recent being displayed first
    Then Unpopular posts with the same number of votes should be sorted in order of publication, with the most recent being displayed first
