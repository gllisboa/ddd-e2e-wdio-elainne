import { Given, When, Then, Before, After } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import UnpopularPostPage from '../pageobjects/unpopularposts.page.ts';

// The setup where we populate the database by API with 5 posts and update they data and points to be the first, second, third, fourth and fifth of unpopular
// This setup is in the wdio config file in the before hook
// Get the posts created from the setup to can be use in the than steps
const posts = global.unpopularPosts

//Post Unpopular Steps
When(/^I view the unpopular posts$/, async () => {
    console.log("I view the unpopular posts")
    await UnpopularPostPage.openPostUnpopular();
    await browser.pause(2000)
});

Then(/^I must be able to see the number of votes for each post$/, async () => {

    // We check if the points are not null
    expect((await UnpopularPostPage.pointsFirstPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsSecondPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsThirdPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsFourthPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsFifthPost).getValue()).not.toBeNull()

});

Then(/^Unpopular posts should be automatically sorted in ascending order by number of votes$/, async () => {
    // We check if the points are in ascending order
    expect(await UnpopularPostPage.pointsFirstPost).toHaveValue(`-99`)
    expect(await UnpopularPostPage.pointsSecondPost).toHaveValue(`-55`)
    expect(await UnpopularPostPage.pointsThirdPost).toHaveValue(`-11`)
});

Then(/^Unpopular posts with the same number of votes should be sorted in order of publication, with the most recent being displayed first$/, async () => {
    // I update in the before the date of the post[4] to be more older
    expect(await UnpopularPostPage.titleFourthPost).toHaveValue(posts[3].title)
    // How the post[4] is more he should be the last
    expect(await UnpopularPostPage.titleFifthPost).toHaveValue(posts[4].title)
});