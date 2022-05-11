/**
 * @info schema for Chat model
 */


 import {Schema, model} from "mongoose"
 import {generate} from "shortid"
import { IMessage } from "./message";
import { IUser } from "./user";
 
 export interface IChat {
    _id: string;
    chatId: string;
    messages: IMessage[];
    users: IUser[];
    type: string;
    time: Date;
    conType: string;
    title: string;
    avatar: string;
    noOfUnread: number;
 }
 
 const schema = new Schema({
    chatId:{
        type: String,
        unique:true,
        default: generate,
    },
    messages:[{
        type: Schema.Types.ObjectId,
        ref: "messages",
    }],
    users:[{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    type:{
        type: String,
        required:true
    },
    time:{
        type: Date,
        default: Date.now
    },
    conType:{
        type: String,
        required:true
    },
    title:{
        type: String,
        default: "chat"
    },
    noOfUnread:{
        type: Number,
        default:0,
        min: 0,
    },
    avatar:{
        type:String,
        default:"https://images.unsplash.com/photo-1623582854588-d60de57fa33f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
 },
    {
        timestamps: true
    }
 )
 
 export default model<IChat>("chats",schema)
 