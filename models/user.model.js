import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv' 
import bcrypt from 'bcryptjs'; 

dotenv.config();

const userSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true 
    },
    password: {
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now 
    },
    updatedAt:{
        type:Date,
        default:Date.now 
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.tokenGenerate = function(){
    return jwt.sign(
        {
            userId: this._id,
            email: this.email 
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:process.env.JWT_SECRET_EXPIRY 
        }
    )
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


export const User = model('User', userSchema);