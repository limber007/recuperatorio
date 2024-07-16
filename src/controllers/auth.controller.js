import logger from "../logs/logger.js";
import { User } from "../models/user.js";
import { comparar } from "../common/bycript.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
async function login(req, res) {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({
            where: {
                username
            },
        });
        if (!user) 
            return res.status(404).json({message: "Usuario no encontrado"});

        if (!(await comparar(password, user.password))) 
            return res.status(403).json({message: "Usuario no autenticado"});
        
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET , {
            expiresIn: eval(process.env.JWT_EXPIRES_SECOND),
        });
        res.json({token});
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
}

export default {login};