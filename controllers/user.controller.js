import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = async (id) => {
    const user = await User.findById({ _id: id });
    const token = user.tokenGenerate();
    return { token };
}

const checkPassword = async (userId, password) => {
    const user = await User.findById({ _id: userId });
    const result = await user.comparePassword(password);
    console.log("is password correct ", result);
    return result;
}

const registerUser = asyncHandler(
    async (req, res, next) => {
        console.log(req.body);
        const { username, email, password } = req.body;

        if (
            [username, email, password].some((field) => {
                return field === ""
            })
        ) {
            res.status(402).json(
                new ApiResponse(
                    402,
                    " Invalid credentials "
                )
            )
        }

        const isUserExist = await User.find({ email });
        if (
            isUserExist.length > 0
        ) {
            res.status(
                401
            ).json(
                new ApiResponse(
                    401,
                    " User already exist  "
                )
            )
        }

        const newUser = new User({
            username,
            email,
            password
        })

        const user = await newUser.save();

        res.status(
            200
        ).json(
            new ApiResponse(
                200,
                " User Registered Successfully ",
                user
            )
        )

    }
)

const loginUser = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (
            [email, password].some((field) => {
                return field === ""
            })
        ) {
            res.status(
                402,
                " email and password is required ! "
            )
        }

        const isUserExist = await User.find({ email });

        if (
            !isUserExist
        ) {
            res.status(
                404
            ).json(
                new ApiResponse(
                    404,
                    " user not found "
                )
            )
        }

        const isPasswordCorrect = await checkPassword(isUserExist[0]._id, password);

        if (
            !isPasswordCorrect
        ) {
            res.status(
                402
            ).json(
                new ApiResponse(
                    402,
                    " Incorrect Password "
                )
            )
        }

        const { token } = await generateToken(isUserExist[0]._id);

        const cookieOptions = {
            httpOnly: true,
            secure: false, 
            path:'/',
            domain: 'localhost'
        };

        res.cookie(
            'token',
            token,
            cookieOptions
        );

        res.status(
            200
        ).json(
            new ApiResponse(
                200,
                " Logged In Successfully ",
                { token, isUserExist }
            )
        )


    }
)

const logoutUser = asyncHandler(
    async (req, res, next) => {
      res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        path: '/',
        expires: new Date(0), 
      });
  
      res.status(200).json({ message: 'Logged out successfully' });
    }
  );

const getUserProfile = asyncHandler(
    async (req, res, next) => {

        const singleUser = await User.findById({ _id: req.user._id });

        if (
            !singleUser
        ) {
            res.status(
                402
            ).json(
                new ApiResponse(
                    402,
                    "no single user found "
                )
            )
        }

        res.status(
            200
        ).json(
            new ApiResponse(
                200,
                " user profile ",
                singleUser
            )
        )
    }
)


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
}


