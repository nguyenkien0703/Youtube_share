import * as jwt from 'jsonwebtoken';
import configuration from '../config/configuration';



export const generateAccessToken= (payload, option={} ) => {
    const secret = configuration().api.accessJwtSecretKey;
    return jwt.sign(payload, secret,option);
}
export const generateRefreshToken =( payload , option={}) => {
    const secret = configuration().api.accessJwtSecretKey;
    return jwt.sign(payload, secret,option);
}

export const verifyRefreshJWT = async (tokenOld, option={}) => {
    const secret = configuration().api.accessJwtSecretKey;
    return await jwt.verify(tokenOld, secret, option);
};
  