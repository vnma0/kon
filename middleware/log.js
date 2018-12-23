/**
 * Log connected IP
 * This will log to console the IP that connect to server
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function logIp(req, res, next) {
    console.log(req.ip, "-", req.method);
    next();
}
