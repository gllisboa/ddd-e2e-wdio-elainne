import UsersAPI from '../../api/Users.ts';
import PostsAPI from '../../api/Posts.ts';
import UsersDataBase from '../../database/users.database.ts'
import PostsDataBase from '../../database/posts.database.ts'
import moment from 'moment';
import { faker } from '@faker-js/faker';
const usersAPI = new UsersAPI();
const postsAPI = new PostsAPI();


// We generate five post to be the first, second, third, fourth and fifth of unpopular
// with title and textContent random, we create the post by API
// the user that will create the post is the user that we get from constructor
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

// We export as a global variable to can be use in the than steps of unpopular feature
global.unpopularPosts = posts

// We export the class to can be use in the before hook in the wdio config
export default class SetupUnpopular {
    user: { username: string, email: string, password: string };

    constructor(user: { username: string, email: string, password: string }) {
        this.user = user
    }
    async setup() {

        console.log("Setup Unpopular")

        //    Get user base and member ID on DATABASE
        let dataUser = await UsersDataBase.getUsersIDsByEmail(this.user.email)
        expect(dataUser[0]).not.toBeUndefined()

        //   Destruct memberID and baseUserID from the response
        let {
            member_id,
            base_user_id
        } = dataUser[0]

        //    Login by API to get the token to can create posts
        let responseLoginUsersAPI = await usersAPI.postLogin(this.user.username, this.user.password)
        expect(responseLoginUsersAPI.status).toBe(200)
        let { accessToken } = await responseLoginUsersAPI.data

        //    Create 5 Post
        // This post will be the first on the unpopularlist
        let responseCreatePost = await postsAPI.createPost(
            accessToken,
            posts[0].title,
            "text",
            posts[0].textContent
        )
        expect(responseCreatePost.status).toBe(200)

        // This post will be the second on the unpopularlist
        responseCreatePost = await postsAPI.createPost(
            accessToken,
            posts[1].title,
            "text",
            posts[1].textContent
        )
        expect(responseCreatePost.status).toBe(200)

        // This post will be the third on the unpopularlist
        responseCreatePost = await postsAPI.createPost(
            accessToken,
            posts[2].title,
            "text",
            posts[2].textContent
        )

        // This post will be the fourth on the unpopularlist
        responseCreatePost = await postsAPI.createPost(
            accessToken,
            posts[3].title,
            "text",
            posts[3].textContent
        )
        expect(responseCreatePost.status).toBe(200)

        // This post will be the fifth on the unpopularlist
        responseCreatePost = await postsAPI.createPost(
            accessToken,
            posts[4].title,
            "text",
            posts[4].textContent
        )
        expect(responseCreatePost.status).toBe(200)

        //  Update number of point of the first post to assurence thats will be the first post of Unpopular
        let responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[0].title }, -99) // To be the firs in the Unpopular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update number of point of the second post to assurence thats will be the second post of Unpopular
        responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[1].title }, -55) // To be the second in the Unpopular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update number of point of the third post to assurence thats will be the third post of Unpopular
        responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[2].title }, -11) // To be the second in the Unpopular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update number of point of the fourth post to assurence thats will be the fourth post of Unpopular
        responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[3].title }, -5) // To be the second in the Unpopular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update number of point of the 5 post to assurence thats will be the 5 post of Unpopular
        responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[4].title }, -5) // To be the second in the Unpopular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update the date of the post 5 to emulate how the post was created more than 3 days ago to be the last on the list
        let dateToUpdate = moment().subtract(3, "days").format("YYYY-MM-DD hh:mm:ss")
        responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({ member_id, title: posts[4].title }, dateToUpdate)
        expect(responseUpdatePosts).not.toBeUndefined()

    }
}