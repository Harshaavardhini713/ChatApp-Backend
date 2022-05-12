import users, {IUser} from "../models/user";
import mongoose from "mongoose";

export default class profileController{
    /**
     * 
     * @param uid 
     * @param name 
     */
    static async updateName(uid:string, name:string)
    {
        const userData = await users.findOne({uid:uid});
        if(userData)
        {
            await users.updateOne({uid:uid},{
                $set : {
                    name:name
                }
            })
        }
        else
        {
            throw new Error("User Doesn't Exists");
        }
        return { success:true, message:"Name Updated!!!"}
    }

    /**
     * 
     * @param uid 
     * @param avatar
     */
     static async updatePhoto(uid:string, avatar:string)
     {
        const userData = await users.findOne({uid:uid});
        if(userData)
        {
            await users.updateOne({uid:uid},{
                $set : {
                    avatar:avatar
                }
            })
        }
        else
        {
            throw new Error("User Doesn't Exists");
        }
        return { success:true, message:"Profile Picture Updated!!!"}
     }
}