/**
 * Chat Controller for chat related operations
 */

import chats, { IChat } from "../models/chat";
import users from "../models/user";
import mongoose from "mongoose";

 
 export default class chatController {
    static async addMember(data) {
        try {
            const groupid = new mongoose.Types.ObjectId(data.groupid);
            const member = new mongoose.Types.ObjectId(data.userid);
            const newChat = await chats.find({_id: groupid}).populate('users');
            console.log("newChat:", newChat);
            
            let usersLocal = newChat[0].users;; 
            const user = await users.findById(member);
            usersLocal.push(user.get('_id'));
            console.log("users:", usersLocal);
            
            const chat = await chats.updateOne({_id:groupid},{$set:{users:usersLocal}});
            
            
        } catch (error) {
            throw error;
        }
    }
 
   /**
    * getting all chats
    */
    static async getAllChats() : Promise<IChat[]> {
        try {
            const chat = await chats.aggregate([
                {
                    $lookup: {
                        from: "messages",
                        localField: "messages",
                        foreignField: "_id",
                        as: "messages"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: "_id",
                        as: "users"
                    }
                },
            ]).exec();
            return chat;
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * get a chat by id
     */
    static async getChatById(data) : Promise<IChat[]> {
        try {
            // console.log(data);
            
            const newId = new mongoose.Types.ObjectId(data.id);
            const newId2 = new mongoose.Types.ObjectId(data.id2);
           const chats = await this.getAllChats();
        //    chats.map(chat => {
        //        console.log("chat:", chat.users[1]._id);
        //        console.log("id:", data.id2);
               
        //    });
               
           const chat = chats.filter(chat => chat.users[0]._id.toString() === newId.toString() && chat.users[1]._id.toString() === newId2.toString());
           console.log("chat:", newId2);
           
           return chat;
        } catch (error) {
            throw error;
        }
    } 

    /**
     * get a chat by id
     * @param id
     */
    static async getUserByChatId(id) {
        try {
            const chat = await chats.findById(id).exec();
        } catch (error) {
            throw error;
        }
    }


   /**
     * creating a new chat
     */
    static async createChat(chat) {
        // console.log(chat);

        const members = chat.users.split(",");
        members.map(member => {
            member = new mongoose.Types.ObjectId(member);
        });
        
        
        try {
            const newChat = {
                messages: null,
                users: members,
                type: chat.type,
                time: new Date(),
                conType: chat.conType,
                title: chat.title,
                noOfUnreadMessages: 0
            }
            const Chat = await chats.create(newChat);
            return Chat;    
        } catch (error) {
            throw error;
        }
    }  

    /**
     * Delete a chat by id
     * @param id
     */
    static async deleteChat(id) {
        try {
            const chat = await chats.updateOne({id},{$set:{messages:null}});
            return chat;
        } catch (error) {
            throw error;
        }
    } 
    
    static async getChatByChatID(id) {
        const newId = new mongoose.Types.ObjectId(id);
        
        try {
            const chat = await chats.find({"_id":newId})
            .populate('users')
            .populate({
                path: 'messages',
                populate: {
                    path: 'parent',
                    model: 'messages',
                }
            })
            .exec();
           
            
            if(chat[0].messages !== null) {
            //get last message from messages 
            const lastMessage = chat[0].messages[chat[0].messages.length - 1];
            if(lastMessage.seen === false){    
            // find no of messages are seen is false and add the count in noOfUnreadMessages
                chat.map(chat => {
                    let noOfUnread = 0;
                    chat.messages.map(message => {
                        if(message.seen === false) {
                            noOfUnread++;
                        }
                    }
                    );
                    chat.noOfUnread = noOfUnread;
                });
            }   else {
                chat.map(chat => {
                    chat.noOfUnread = 0;
                });
            }
        }
            return chat;
        } catch (error) {
            throw error;
        }
    }

    static async getChats() : Promise<IChat[]> {
        try {
            const chat = await chats.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: "_id",
                        as: "users"
                    }
                },
                {
                    $project: {
                        "messages":0, 
                        "users.password":0,
                        "__v": 0,
                        "users.__v":0, 
                        "users.createdAt":0, 
                        "users.updatedAt":0,
                    }
                }
            ]).sort({ updatedAt: 'desc'}).exec();
            return chat;
        } catch (error) {
            throw error;
        }
    }
    /**
     * get all chat of a user
     */
    static async getUserPersonalChat(data) : Promise<IChat[]> {
        try {
           const newId = new mongoose.Types.ObjectId(data);
           const chats = await this.getChats();
           const chat = chats.filter(chat =>  chat.conType === "individual");
           const final =  chat.filter(chat => chat.users[0]._id.toString() === newId.toString() || chat.users[1]._id.toString()===newId.toString());
           return final;
        } catch (error) {
            throw error;
        }
    } 

    static async getUserGroupChat(data){
        try {
                const chat = await chats.aggregate([
                    {
                        $match: { users: { $in: [new mongoose.Types.ObjectId(data)] }, conType : "group" }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "users",
                            foreignField: "_id",
                            as: "users"
                        }
                    },
                    {
                        $project: {
                            "messages":0, 
                            "users.password":0,
                            "__v": 0,
                            "users.__v":0, 
                            "users.createdAt":0, 
                            "users.updatedAt":0,
                        }
                    }
                ]).sort({ updatedAt: 'desc'}).exec();
                return chat;
            } catch (error) {
                throw error;
            }
    }

    static async searchChat(data) : Promise<IChat[]> {
        try {
            const chat = await chats.aggregate([
                {
                    $match: { users: { $in: [new mongoose.Types.ObjectId(data)] }}
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: "_id",
                        as: "users"
                    }
                },
                {
                    $project: {
                        "messages":0, 
                        "users.password":0,
                        "__v": 0,
                        "users.__v":0, 
                        "users.createdAt":0, 
                        "users.updatedAt":0,
                    }
                }
            ]).sort({ updatedAt: 'desc'}).exec();
            return chat;
        } catch (error) {
            throw error;
        }
        // try {
        //     const newId = new mongoose.Types.ObjectId(data);
        //     const chat = chats.find({users:newId}).populate("users").sort({ updatedAt: 'desc'});
        //     //console.log(chat);
        //    return chat;
        // } catch (error) {
        //     throw error;
        // }
    } 

    static async exitGroup(data) : Promise<void> {

        // const group = await chats.find({_id: data.group, users: data.user});
        // console.log(group);
        await chats.updateOne({_id: data.group, users: data.user},{ $pull: { 'users': data.user }});
        // const updatedGroup = await chats.find({_id: data.group})
        // console.log(updatedGroup);
    } 

    static async addMembers(data) : Promise<void> {
        // console.log(data.user,data.user.length);
        const group = await chats.findById(data.group).lean();
        // console.log(group)
        for(var i=0; i< data.user.length;i++)
        { if(!group.users.toString().includes(data.user[i]))
            await chats.findByIdAndUpdate(data.group, {$push: {'users':data.user[i]}}) 
        }
        // const updatedGroup = await chats.findById(data.group)
        // console.log(updatedGroup);
    } 

 }