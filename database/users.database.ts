import {createConection} from './mysql.client.ts'

export default class UsersDataBase {

    static async getUsersIDsByEmail(email) {
        let connector = await createConection()
        let data
        await connector.promise().query(
         `
            SELECT mb.member_id , bs.base_user_id
            FROM base_user as bs
            JOIN \`member\`  as mb
              ON bs.base_user_id = member_base_id
           WHERE bs.user_email = '${email}'
         `
         )
         .then( ([rows,fields]) => {
            data = rows
          })
         .catch(console.log)
         .then( () => connector.end());

         return data

    }

    static getAllUsers() {
        let connector = createConection()
        connector.query(
        'SELECT * FROM `base_user`',
        function(err, results, fields) {
          console.log(results); // results contains rows returned by server
          console.log(fields); // fields contains extra meta data about results, if available
        })
    }
}