import { Given, When, Then, Before, After } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import PostPage from '../pageobjects/postsfive.page.js';

// Get a user global this user is created in each run in the wdio config to can be use in all tests
let user = await global.lastMemberLogged

// The setup where we populate the database by API with 3 posts and update they data and points to be the first, second and third of popular
// This setup is in the wdio config file in the before hook
//Post Popular Steps
When(/^I view the popular posts$/, async () => {
    console.log("I view the popular posts")
    await PostPage.openPostPopular();

});

Then(/^I should see the posts older than five day with the date in red$/, async () => {
    //We use the points to assurence the post created more than 5 days ago is the first
    await expect((await PostPage.dateCreateFirstPost)).toHaveStyle({"color":"rgba(255,0,0,1)"})
});

Then(/^I should see the posts created a five days with the date in the default color$/, async () => {
    //We use the points to assurence the post created five days ago is the second
    await expect((await PostPage.dateCreateSecondPost)).toHaveStyle({"color":"rgba(0,0,0,1)"})
});

Then(/^I should see the posts created today with the date in the default color$/, async () => {
    //We use the points to assurence the post created today is the third
    await expect((await PostPage.dateCreateThirdPost)).toHaveStyle({"color":"rgba(0,0,0,1)"})
});