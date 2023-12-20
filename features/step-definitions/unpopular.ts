import { Given, When, Then, Before, After } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import UnpopularPostPage from '../pageobjects/unpopularposts.page.ts';
import { time } from 'console';

// The setup where we populate the database by API with 5 posts and update they data and points to be the first, second, third, fourth and fifth of unpopular
// This setup is in the wdio config file in the before hook
// Get the posts created from the setup to can be use in the than steps
const posts = global.unpopularPosts

//Post Unpopular Steps
When(/^I view the unpopular posts$/, async () => {
    await UnpopularPostPage.openPostUnpopular();
    await browser.pause(2000)
});

Then(/^I must be able to see the number of votes for each post$/, async () => {

    await UnpopularPostPage.pointsFirstPost.waitForStable(5000)
    // We check if the points are not null
    expect((await UnpopularPostPage.pointsFirstPost).getText()).not.toBeNull()
    expect((await UnpopularPostPage.pointsSecondPost).getText()).not.toBeNull()
    expect((await UnpopularPostPage.pointsThirdPost).getText()).not.toBeNull()
    expect((await UnpopularPostPage.pointsFourthPost).getText()).not.toBeNull()
    expect((await UnpopularPostPage.pointsFifthPost).getText()).not.toBeNull()

});

Then(/^Unpopular posts should be automatically sorted in ascending order by number of votes$/, async () => {
    await UnpopularPostPage.pointsFirstPost.waitForStable(5000)
    // We check if the points are in ascending order
    expect(await UnpopularPostPage.pointsFirstPost).toHaveText(`-99`)
    expect(await UnpopularPostPage.pointsSecondPost).toHaveText(`-55`)
    expect(await UnpopularPostPage.pointsThirdPost).toHaveText(`-11`)
});

Then(/^Unpopular posts with the same number of votes should be sorted in order of publication, with the most recent being displayed first$/, async () => {
    await UnpopularPostPage.titleFourthPost.waitForStable(5000)
    // I update in the before the date of the post[4] to be more older
    expect(await UnpopularPostPage.titleFourthPost).toHaveText(posts[3].title)
    // How the post[4] is more he should be the last
    expect(await UnpopularPostPage.titleFifthPost).toHaveText(posts[4].title)
});