const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');



const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        maxlength: 20
    },
    email: {
        type: String,
        require: true,
        unique: true,
        maxlength: 100
    },
    password: {
        type: String,
        require: true
    },
    tokens: [
        {
            token: {
                type: String,
                required : true
            }
        }
    ]
});

//Hasing Password 
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcryptjs.hashSync(this.password, 10);
    }
    next();
})

// Token to Verify User
UserSchema.methods.generateToken = async function () {
    try {
        let generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: generatedToken });
        await this.save();
        return generatedToken;
    } catch (error) {
        console.log(error)
        
    }
}

const Users = new mongoose.model('USER', UserSchema);

module.exports = Users;