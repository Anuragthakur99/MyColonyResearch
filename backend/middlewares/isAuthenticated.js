import jwt from "jsonwebtoken";

const isAuthenticated=async (req,res,next)=>{
    try {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.token;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if(!token){
            return res.status(401).json({
                message:"user not auth",
                success:false
            })
        }
        
        const jwtSecret = process.env.SECRET_KEY || process.env.JWT_SECRET_KEY || "fallback-secret-key-for-development";
        const decode= await jwt.verify(token, jwtSecret);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        }
        req.id=decode.userId;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message:"Authentication failed",
            success:false
        })
    }
}

export default isAuthenticated;