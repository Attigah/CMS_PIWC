require('dotenv').config();
import { Request, Response, NextFunction} from "express";
import userModel,{any} from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt from "jsonwebtoken";

// register user
interface IRegistrationBody{
    name: string;
    email: string;
    password: string;
    avatar?:string;
}

export const registrationUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {name,email,password} = req.body;

        const isEmailExist = await userModel.findone({email});
        if(isEmailExist){
            return next(new ErrorHandler("Email already exist", 400))
        };

        const user:IRegistrationBody = {
            name,
            email,
            password,
        };

        const activationTommen = createActivationToken(user);
    }
    catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
});

interface IActivationToken{
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

const token = jwt.sign({
    user,activationCode
},process.env.ACTIVATION_SECRET as Secret,{
    expiresIn:"5m",
});

return {token,activationCode};
}