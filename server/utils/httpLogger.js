import logger from "../services/logger.service.js";


const doHttpLog = (httpType, mid, method, originalUrl, ip, message='', status=200) => {    
    if(httpType==="REQ") {
        logger.http(`${httpType} | ${mid} | ${method} | ${originalUrl} | ${ip}`);
    } else if(httpType==="RES") {
        logger.http(`${httpType} | ${mid} | ${status} | ${originalUrl} | ${message} | ${ip}`);
    }    
}
export default doHttpLog;