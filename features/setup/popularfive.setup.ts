import UsersAPI from '../../api/Users.ts';
import PostsAPI from '../../api/Posts.ts';
import UsersDataBase from '../../database/users.database.ts'
import PostsDataBase from '../../database/posts.database.ts'
import { faker } from '@faker-js/faker';
import moment from 'moment';
const usersAPI = new UsersAPI();
const postsAPI = new PostsAPI();

// We generate tree post to be the first, second and third of popular
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
    }
]

// We export the class to can be use in the before hook in the wdio config
export default class SetupPopularFive {
    user: {username: string, email: string, password: string};

    constructor(user: {username: string, email: string, password: string}) {
        this.user = user
    }
    async setup () {

        console.log("Setup Popular Five")

        //    Get user base and member ID on DATABASE
        let dataUser = await UsersDataBase.getUsersIDsByEmail(this.user.email)
        expect(dataUser[0]).toBeDefined()

        //   Destruct memberID and baseUserID from the response
        let {
            member_id,
            base_user_id
        } = dataUser[0]

        //    Login by API to get the token to can create posts
        let responseLoginUsersAPI = await usersAPI.postLogin(this.user.username, this.user.password)
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
        let responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[0].title }, 999) // To be the firs in the popular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update the date of the first post to emulate how the post was created more than 5 days ago
        let dateToUpdate = moment().subtract(7, "days").format("YYYY-MM-DD hh:mm:ss")
        responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({ member_id, title: posts[0].title }, dateToUpdate)
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update number of point of the second post to assurence thats will be the second post of popular
        responseUpdatePosts = await PostsDataBase.updatePostsPoints({ member_id, title: posts[1].title }, 555) // To be the second in the popular page
        expect(responseUpdatePosts).not.toBeUndefined()

        // Update the date of the second post to emulate how the post was created more than 5 days ago
        dateToUpdate = moment().subtract(4, "days").format("YYYY-MM-DD hh:mm:ss") // Update to be in the limit of the validation to the date be red
        responseUpdatePosts = await PostsDataBase.updatePostsDateCreate({ member_id, title: posts[1].title }, dateToUpdate)
        expect(responseUpdatePosts).not.toBeUndefined()

        // The third post is not necessary update because we want the data like today and the 0 points will assurence that post wiil be the third in the list of popular
    }
}