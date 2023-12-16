import { Given, When, Then, Before, After } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import PostPage from '../pageobjects/posts.page.js';
import UsersAPI from '../../api/Users.ts';
import PostsAPI from '../../api/Posts.ts';
import UsersDataBase from '../../database/users.database.ts'
import PostsDataBase from '../../database/posts.database.ts'
import moment from 'moment';
import { faker } from '@faker-js/faker';
const usersAPI = new UsersAPI();
const postsAPI = new PostsAPI();
// Get a user global this user is created in each run in the wdio config to can be use in all tests
let user = await global.lastMemberLogged
const posts = [
    {
        title: `${faker.lorem.sentence(5)}`,
        textContent: `${faker.lorem.paragraph(4)}`
    },
    {
        title: `${faker.lorem.sentence(5)}`,
        textContent: `${faker.lorem.paragraph(4)}`
    },
    {
        title: `${faker.lorem.sentence(5)}`,
        textContent: `${faker.lorem.paragraph(4)}`
    }
]

Before({tags: "@popular"},async () => {

    //    Get user base and member ID on DATABASE
    let dataUser = await UsersDataBase.getUsersIDsByEmail(user.email)
    expect(dataUser[0]).not.toBeUndefined()

    //   Destruct memberID and baseUserID from the response
    let {
        member_id,
        base_user_id
    } = dataUser[0]

    //    Login by API to get the token to can create posts
    let responseLoginUsersAPI = await usersAPI.postLogin(user.username, user.password)
    expect(responseLoginUsersAPI.status).toBe(200)
    let { accessToken } = responseLoginUsersAPI.data

    //    Clear all posts in the forum
    let responseDeleteAllPosts = await PostsDataBase.deleteAllPosts()
    expect(responseDeleteAllPosts).not.toBeUndefined()

    //    Create Tree Post to be the first, second and third of popular
    let responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[0].title,
        "text",
        posts[0].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[1].title,
        "text",
        posts[1].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[2].title,
        "text",
        posts[2].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    //  Update number of point of the first post to assurence thats will be the first post of popular
    let responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[0].title }, 999) // To be the firs in the popular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update the date of the first post to emulate how the post was created more than 5 days ago
    let dateToUpdate = moment().subtract(7, "days").format("YYYY-MM-DD hh:mm:ss")
    responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({ member_id, title: posts[0].title }, dateToUpdate)
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update number of point of the second post to assurence thats will be the second post of popular
    responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[1].title }, 555) // To be the second in the popular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update the date of the second post to emulate how the post was created more than 5 days ago
    dateToUpdate = moment().subtract(4, "days").format("YYYY-MM-DD hh:mm:ss") // Update to be in the limit of the validation to the date be red
    responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({ member_id, title: posts[1].title }, dateToUpdate)
    expect(responseUpdatePosts).not.toBeUndefined()
})

//Post Popular Steps
When(/^I view the popular posts$/, async () => {
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

After({tags: "@popular"},async ()=> {
        //    Clear all posts in the forum
        let responseDeleteAllPosts = await PostsDataBase.deleteAllPosts()
        expect(responseDeleteAllPosts).not.toBeUndefined()
})