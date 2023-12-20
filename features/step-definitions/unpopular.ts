import { Given, When, Then, Before, After } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals'
import UnpopularPostPage from '../pageobjects/unpopularposts.page.ts';
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

Before({tags: "@unpopular"},async () => {
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
    let { accessToken } = await responseLoginUsersAPI.data

    //    Clear all posts in the forum
    let responseDeleteAllPosts = await PostsDataBase.deleteAllPosts()
    expect(responseDeleteAllPosts).not.toBeUndefined()

    //    Create 5 Post
    // This post will be the first on the list
    let responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[0].title,
        "text",
        posts[0].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    // This post will be the second on the list
    responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[1].title,
        "text",
        posts[1].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    // This post will be the third on the list
    responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[2].title,
        "text",
        posts[2].textContent
    )

    // This post will be the fourth on the list
    responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[3].title,
        "text",
        posts[3].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    // This post will be the fifth on the list
    responseCreatePost = await postsAPI.createPost(
        accessToken,
        posts[4].title,
        "text",
        posts[4].textContent
    )
    expect(responseCreatePost.status).toBe(200)

    //  Update number of point of the first post to assurence thats will be the first post of Unpopular
    let responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[0].title }, -99) // To be the firs in the Unpopular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update number of point of the second post to assurence thats will be the second post of Unpopular
    responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[1].title }, -55) // To be the second in the Unpopular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update number of point of the third post to assurence thats will be the third post of Unpopular
    responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[2].title }, -11) // To be the second in the Unpopular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update number of point of the fourth post to assurence thats will be the fourth post of Unpopular
    responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[3].title }, -5) // To be the second in the Unpopular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update number of point of the 5 post to assurence thats will be the 5 post of Unpopular
    responseUpdatePosts = PostsDataBase.updatePostsPoints({ member_id, title: posts[4].title }, -5) // To be the second in the Unpopular page
    expect(responseUpdatePosts).not.toBeUndefined()

    // Update the date of the post 5 to emulate how the post was created more than 3 days ago to be the last on the list
    let dateToUpdate = moment().subtract(3, "days").format("YYYY-MM-DD hh:mm:ss")
    responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({ member_id, title: posts[4].title }, dateToUpdate)
    expect(responseUpdatePosts).not.toBeUndefined()

})

//Post Unpopular Steps
When(/^I view the unpopular posts$/, async () => {
    await UnpopularPostPage.openPostUnpopular();
    await browser.pause(2000)
});

Then(/^I must be able to see the number of votes for each post$/, async () => {
    expect((await UnpopularPostPage.pointsFirstPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsSecondPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsThirdPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsFourthPost).getValue()).not.toBeNull()
    expect((await UnpopularPostPage.pointsFifthPost).getValue()).not.toBeNull()

});

Then(/^Unpopular posts should be automatically sorted in ascending order by number of votes$/, async () => {
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


After({tags: "@unpopular"},async ()=> {
    //    Clear all posts in the forum
    let responseDeleteAllPosts = await PostsDataBase.deleteAllPosts()
    expect(responseDeleteAllPosts).not.toBeUndefined()
})
