/**
 * Log connected IP
 * This will log to console the IP that connect to server
 * This function is considering to be deprecated
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function logIp(req, res, next) {
    console.log(req.ip, "-", req.method);
    next();
}
