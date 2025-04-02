
export const asyncHandler = ( fn ) => {
    return async (req,res,next) => {
        try {
            await fn(req,res,next);
        } catch (error) {
            console.log(` Error occured in async Handler ${ error }`);
        }
    }
}