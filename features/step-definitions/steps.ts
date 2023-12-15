import { Given, When, Then, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import LoginPage from '../pageobjects/loginpage.js';
import PostPage from '../pageobjects/posts.page.js';
import UnpopularPage from '../pageobjects/unpopular.posts.page.js'
import UsersAPI from '../../api/Users.ts';
import PostsAPI from '../../api/Posts.ts';
import UsersDataBase from '../../database/users.database.ts'
import PostsDataBase from '../../database/posts.database.ts'
import moment from 'moment';
import { faker } from '@faker-js/faker';
const usersAPI = new UsersAPI();
const postsAPI = new PostsAPI();

const user = {
    username: `${faker.internet.userName()}`.substring(0,9),
    email: `${faker.internet.email()}`,
    password: `${faker.internet.password()}`
}

const posts = [
    {
        title: `${faker.lorem.sentence(5)}`,
        textContent: `${faker.lorem.paragraph(4)}`
    }
]

const pages = {
    login: LoginPage,
    postsPopular: PostPage,
    unpopular: UnpopularPage
}

BeforeAll(async () => {

    //Create user
    var responseCreateUserApi = await usersAPI.post(user.username, user.email, user.password)
    expect(responseCreateUserApi.status).toBe(200)

    // Get user base and member ID on DATABASE
    let dataUser =  await UsersDataBase.getUsersIDsByEmail(user.email)
    expect(dataUser[0]).not.toBeUndefined()

    // Destruct memberID and baseUserID from the response
    var {
        member_id,
        base_user_id
    } = dataUser[0]

    //Login by API to get the token to can create posts
    var responseLoginUsersAPI = await usersAPI.postLogin(user.username, user.password)
    expect(responseLoginUsersAPI.status).toBe(200)
    var {accessToken} = responseLoginUsersAPI.data

    //Clear all posts in the forum
    let responseDeleteAllPosts = await PostsDataBase.deleteAllPosts()
    expect(responseDeleteAllPosts).not.toBeUndefined()

    //Create First Post of Popular and the Last of UnPopular
    var responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[0].title,
        "text",
        posts[0].textContent
        )
    expect(responseCreatePost.status).toBe(200)

    //Update number of point to assurence thats will be the first post of popular and the last of unpopular
    var responseUpdatePosts = PostsDataBase.updatePostsPoints({member_id, title:posts[0].title}, 999)
    expect(responseUpdatePosts).not.toBeUndefined()

    //Update the date to emulate how the post was created more than 5 days ago
    let dateToUpdate = moment().subtract(7 , "days").format("YYYY-MM-DD hh:mm:ss")
    responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({member_id, title:posts[0].title}, dateToUpdate)
    expect(responseUpdatePosts).not.toBeUndefined()
})

// Global Steps
Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open(user.email,user.password)
});

// When(/^I login$/, async () => {
//     await LoginPage.login(user.username, user.password)
// });

// Then(/^I should see a toast message saying (.*)$/, async (message) => {
//     await expect(LoginPage.toastMessage).toBeExisting()
//     await expect(await LoginPage.toastMessage.getText()).toContain(message);
// });

//Post Popular Steps
When(/^I view the popular posts$/, async () => {
    await LoginPage.open()
    await LoginPage.login(user.username, user.password)
    await PostPage.openPostPopular();
});

Then(/^I should see the posts older than five day with the date in red$/, async () => {
    //We use the points to assurence the post created more than 5 days ago is the first
    await expect((await PostPage.dateCreateFirstPost)).toHaveStyle({"color":"rgba(255,0,0,1)"})
});

// Then(/^I should see the posts created five days ago with the date in default color$/, async () => {
//     //We use the points to assurence the post created five days ago is the second
//     await expect((await PostPage.dateCreateSecondPost)).toHaveStyle({"color":"rgba(0,0,0,1)"})
// });

// Then(/^I should see the posts created today days with the date in default color$/, async () => {
//     //We use the points to assurence the post created today is the third
//     await expect((await PostPage.dateCreateThirdPost)).toHaveStyle({"color":"rgba(0,0,0,1)"})
// });

// //Post Unpopular Steps
// When(/^I view the popular posts$/, async () => {
//     await PostPage.openPostPopular();
// });

// AfterAll(async () => {
//     // var responseLoginApi = await usersAPI.postLogin(user.username, user.password)
//     // expect(responseLoginApi.status).toBe(200)
//     // var accessToken = responseLoginApi.data.accessToken
// })