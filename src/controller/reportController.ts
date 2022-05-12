/**
 * Chat Controller for chat related operations
 */

 import reports, { IReport} from "../models/report";
 import mongoose from "mongoose";
 
  
  export default class reportController {

    static async reportChat(data) {

        const user = data.user;
        const group = data.group;

        try {
            const newReport = {
                groupId: group,
                reportedBy: user,
                time: new Date(),
            }
            const report = await reports.create(newReport);
            return report;    
        } catch (error) {
            throw error;
        }
    }  


  }