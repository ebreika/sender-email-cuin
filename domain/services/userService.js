var db = require("../../infrastructure/database")

const text = 'INSERT INTO users(name, email,phone) VALUES($1, $2, $3)'

exports.readUser=function (){


}
module.exports.saveUser=function (user){
    db.connect()
    const values = [user.firstName, user.email,user.phone]
    db.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        }
    })


}