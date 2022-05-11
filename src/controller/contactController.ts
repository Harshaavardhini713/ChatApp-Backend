import users, { IUser } from "../models/user";
import mongoose from "mongoose";

export default  class  ContactController {

    

        /**
         * @description - This method is used to get all categories
         */
        
        public static async getAllUsers() : Promise<IUser[]>{
            // sort by name
                // const chatList = await users.find({project :{ _id:1,password:0, uid:0, createdAt:0, 
                //     updatedAt:0}}).sort({name:1}).lean()
                const chatList = await users.find({}, {name:1, phone: 1, avatar:1,  _id:1}).sort({name:1}).lean()
                if(chatList.length > 0) {
                    return chatList;
                } else {
                  throw new Error('No Contact found');
                }
        }
    } 
    // {$project :{ _id:0, name:0, password:0, uid:0, createdAt:0,
    //     updatedAt:0}}.