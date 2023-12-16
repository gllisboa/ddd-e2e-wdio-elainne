import { Given, When, Then, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import LoginPage from '../pageobjects/loginpage.js';
import PostPage from '../pageobjects/posts.page.js';
import UnpopularPage from '../pageobjects/unpopularposts.page.ts';
import UsersAPI from '../../api/Users.ts';
const usersAPI = new UsersAPI();
const user = global.lastMemberLogged
const pages = {
    login: LoginPage,
    postsPopular: PostPage,
    unpopular: UnpopularPage
}

BeforeAll(async () => {
    // Create user
        var responseCreateUserApi = await usersAPI.post(user.username, user.email, user.password)
        expect(responseCreateUserApi.status).toBe(200)
})

//Global Steps
Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()
});

// Login without navigate to page
When(/^I login$/, async () => {
    await LoginPage.login(user.username, user.password)
});

// Login navigate to the login page before
Given(/^I login with member$/, async () => {
    await LoginPage.open()
    await LoginPage.login(user.username, user.password)
});

Then(/^I should see a toast message saying (.*)$/, async (message) => {
    await expect(LoginPage.toastMessage).toBeExisting()
    await expect(await LoginPage.toastMessage.getText()).toContain(message);
});