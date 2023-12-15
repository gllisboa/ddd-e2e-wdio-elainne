import {createConection} from './mysql.client.ts'

export default class PostsDataBase {

    static async deleteAllPosts() {
        let connector = await createConection()
        let data
        await connector.promise().query(
         `
         DELETE FROM post;
         `
         )
         .then( ([rows,fields]) => {
            data = rows
          })
         .catch(console.log)
         .then( () => connector.end());

         return data

    }

    static async updatePostsPoints({member_id, title}, points) {
        let connector = await createConection()
        let data
        await connector.promise().query(
         `
         UPDATE post
         SET
         points=${points}
         WHERE member_id = '${member_id}'
         AND title  = '${title}';
         `
         )
         .then( ([rows,fields]) => {
            data = rows
          })
         .catch(console.log)
         .then( () => connector.end());

         return data

    }

    static async updatePostsDateCreate({member_id, title}, date) {
        let connector = await createConection()
        let data
        await connector.promise().query(
         `
         UPDATE post
         SET
         created_at= '${date}'
         WHERE member_id = '${member_id}'
         AND title  = '${title}';
         `
         )
         .then( ([rows,fields]) => {
            data = rows
          })
         .catch(console.log)
         .then( () => connector.end());

         return data

    }

}