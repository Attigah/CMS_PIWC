import mongoose, {Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp = /^[^\s@] +@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
    name : string;
    email: string;
    password: string;
    iavatar:{
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please enter your name"],
    },
    email:{
        type:String,
        required: [true, "Please enter your name"],
        validate: {
            validator: function (value:string){
                return emailRegexPattern.test(value);
            },
            message:"Please enter a valide email",
        },
        unique:true,
    },
    password:{
        type:String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must bee at least 6 Characters"],
        select: false,
    },
    avatar:{
        public_id: String,
        url: String,
    },
    role:{
        type:String,
        default: "User",
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    courses:[
        {
            courseId: String,
        }
    ],
}, {timestamps:true});

// Hash Password before saving
userSchema.pre<IUser>('save', async function(next){
if(!this.isModified('password')){
    next();
}
this.password = await bcrypt.hash(this.password, 10);
next();
});

// compare password
userSchema.method.comparePassword = async function(enteredPassword:string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};