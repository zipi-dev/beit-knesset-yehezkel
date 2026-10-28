import { model, Schema } from "mongoose";

const opinionSchema = new Schema({
   userName: { 
    type: String, 
    required: true, 
    trim: true ,
    default: 'Anonymous'
}, 
//שם הכותב
    comment: { 
        type: String, 
        required: true, 
        trim: true 
    },
     // תוכן חוות הדעת
    
    likes: { 
        type: Number, 
        default: 0 
    }, // מספר הלייקים
  likedBy: {
    type:[String],
    default: []
  }// מערך של מזהי משתמשים שהוסיפו לייק   
},{
    timestamps: true // מוסיף אוטומטית createdAt ו-updatedAt (מתי בדיוק נכתבה חוות הדעת)
});


export const Opinion = model('opinions', opinionSchema);