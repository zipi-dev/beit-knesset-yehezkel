import { model, Schema } from "mongoose";

const opinionSchema = new Schema({
   userName: { 
    type: String, 
    required: true, 
    trim: true 
}, // שם המשתמש שכתב את חוות הדעת
    
    // eventId: { 
    //     type: Schema.Types.ObjectId, 
    //     ref: 'events', 
    //     required: false 
    // }, // אופציונלי: אם ריק - זו חוות דעת כללית על בית הכנסת/האתר. אם מלא - חוות דעת על אירוע ספציפי
    
  
    
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    }, // דירוג כוכבים (1 עד 5)
    
    comment: { 
        type: String, 
        required: true, 
        trim: true 
    }, // תוכן חוות הדעת
    
    likes: { 
        type: Number, 
        default: 0 
    }, // מספר הבלייקים
    
    dislikes: { 
        type: Number, 
        default: 0 
    } // מספר הדיסלייקים

},{
    timestamps: true // מוסיף אוטומטית createdAt ו-updatedAt (מתי בדיוק נכתבה חוות הדעת)
});


export const Opinion = model('opinions', opinionSchema);