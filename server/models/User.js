const mongoose = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        maxlength: 100
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        maxlength: 50
    },
    encrypted_password: {
        type: String,
        require: true
    },
    salt: String,
}, { timestamps: true });

UserSchema.virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = uuid.v1();
        this.encrypted_password = this.securePassword(password);
    })
    .get(function() { return this._password });

// Encrypting password
UserSchema.methods = {
    authenticate: function (plainPassword) {
        //storing user passsword in encrypted_password variable
        return this.securePassword(plainPassword) === this.encrypted_password;
    },
    securePassword: function (plainPassword){
        if (!plainPassword) return "";
        try {
            // Hashing password - crypto
            return crypto.createHmac('sha256', this.salt).update(plainPassword).digest('hex')
        } catch (error) { return error;}
    }
}
module.exports = mongoose.model('User', UserSchema);