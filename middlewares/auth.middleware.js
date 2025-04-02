// import { User } from "../models/user.model"

// export const authenticateAdmin = async(req,res,next) => {
//     try {
//         const user = await User.findById(req.user._id);
//         if(!user.isAdmin){
//             res.status(
//                 402
//             ).json(
//                 {
//                     error:"not an admin"
//                 }
//             )
//         }
//     } catch (error) {
        
//     }
// }