/**
 * @info user model
 */
 import {Schema, model} from "mongoose"
 import {generate} from "shortid"
  
  export interface IUser {
      _id: string;
      uid: string;
      name: string;
      phone: string;
      password: string;
      avatar: string;
  }
  
 const schema = new Schema({
      uid:{
          type:String,
          unique:true,
          default: generate,
          index: true
      },
      name:{
          type: String,
          required:true
      },
      phone:{
          type:String,
          unique:true,
          index:true,
          required: true
      },
      password:{
          type:String,
          required:true
      },
      avatar:{
          type:String,
          default:"https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-vector-contact-symbol-illustration-184752213.jpg",
      }
  },
     {
         timestamps: true
     }
  )
  
  export default model<IUser>("users",schema)
 