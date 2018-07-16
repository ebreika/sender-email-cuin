var express = require('express');
var router = express.Router();
var validator = require('validator');
var path = require('path');
var fs = require("fs");
var service = require("../domain/services/userService")
var User = require("../domain/model/user")
var transporter = require("../infrastructure/mail")


const pug = require('pug');


// Send email
router.get('/', function (req, res, next) {
    res.send('respond with a resource');

});

router.post('/', function (req, res, next) {
    req.checkBody("email", "Enter a valid email").isEmail();
    req.checkBody("name", "Enter a valid name").not().isEmpty();
    req.checkBody("phone", "Enter a valid phone").isMobilePhone('any');
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        let user = new User(0, req.body.name, req.body.email, req.body.phone);

        var data = {
            sender: process.env.MAIL_USER,
            receiver: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
        };
        service.saveUser(user)
        sendMailToCustomer(data);
        sendMailToOwner(data);
        res.json({message: 'OK'});
    }


})


// Send email for customer
function sendMailToCustomer(data) {
    var file = fs.readFileSync(path.join(__dirname, '../public/template.html'), "utf8");
    const msg = {
        from: data.sender,
        to: data.receiver,
        subject: 'Informes CUIN',
        text: 'Nos pondremos en contacto lo mas pronto posible',
        html: file
    }
    // send mail with defined transport object
    transporter.sendMail(msg, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}


// Send email for customer
function sendMailToOwner(data) {
    const compiledFunction = pug.compileFile(path.join(__dirname, '../templates/email-information.pug'));
    const msg = {
        to: data.sender,
        from: data.sender,
        subject: 'Contactar ',
        text: 'Contacto ',
        html: compiledFunction({name: data.name, phone: data.phone, email: data.receiver})
    }
    transporter.sendMail(msg, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}


module.exports = router