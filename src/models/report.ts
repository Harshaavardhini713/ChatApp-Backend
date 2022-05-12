/**
 * @info schema for Chat model
 */

import {Schema, model} from "mongoose";
import {generate} from "shortid";
import { IUser } from "./user";
import { IChat } from "./chat";
 
 export interface IReport {
    _id: string;
    reportId: string;
    groupId: IChat;
    reportedBy: IUser;
    time: Date;
 }
 
 const schema = new Schema({
    reportId:{
        type: String,
        unique:true,
        default: generate,
    },
    groupId:{
        type: Schema.Types.ObjectId,
        ref: "chats",
        required: true,
    },
    reportedBy:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    time:{
        type: Date,
        default: Date.now
    },
 },
    {
        timestamps: true
    }
 )
 
 export default model<IReport>("reports",schema)