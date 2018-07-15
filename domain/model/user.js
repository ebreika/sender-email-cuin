'use strict';

module.exports = class {
    constructor(id = null, firstName,  email, phone) {
        this.id = id;
        this.firstName = firstName;
        this.email = email;
        this.phone = phone;
    }
};