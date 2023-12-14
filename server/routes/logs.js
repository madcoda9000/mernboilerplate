import { Router } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import Logs from "../models/logs.js";
import crypto from "crypto";
import doHttpLog from "../utils/httpLogger.js";
import logger from "../services/logger.service.js";

const router = Router();


/**
 * POST /v1/logs/createAuditEntry
 * @summary method to confirm a new users email address
 * @tags Logs (Authenticated:true | Role:any) - logs related api endpoints
 * @param {object} request.body.required 
 * @return {object} 201 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *   "user": "john.doe",
 *   "level": "info warn or error",
 *   "message": "message goes here"
 * }
 * @example response - 201 - example success response
 * {
 * 	"error": false,
 *  "message": "audit entry created successfully"
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/createAuditEntry", auth, async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);

		if(req.body.user===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The User parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The User parameter is required!" })		
		}

		if(req.body.level===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The level parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The level parameter is required!" })		
		}

		if(req.body.message===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The message parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The message parameter is required!" })		
		}

		req.body.level==='info' && logger.info('AUDIT | ' + req.body.user + ' | ' + req.body.message);
        req.body.level==='warn' && logger.warn('AUDIT | ' + req.body.user + ' | ' + req.body.message);
		req.body.level==='error' && logger.error('AUDIT | ' + req.body.user + ' | ' + req.body.message);
		doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Log entry created sucessfully",201);
		res
			.status(201)
			.json({ error: false, message: "Log entry created sucessfully" });	
		
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|logs.js|/createAuditEntry|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

/**
 * GET /v1/logs/getSystemLogs/{page}/{pageSize}/{searchParam}
 * @summary method to fetch a paged list of system logs 
 * @tags Logs (Authenticated:true | Role:admins) - logs related api endpoints
 * @param {number} page.query - the page (default 0)
 * @param {number} pageSize.query - the page size (default 10)
 * @param {string} searchParam.query - the optional search parameter
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * "error": false,
 * "message": "returned paginated system logs list..",
 * "paginatedResult": {
 *   "docs": [
 *     {
 *		"_id": "655328395e3027428a17c8f5",
 *      "timestamp": "2023-11-16T10:09:22.097+00:00",
 *      "level": "info",
 *      "message": "SEEDER|Admins user seeded already|::1",
 *      "meta": [
 *       {
 *       "exception": "any message"
 *       }
 *      ],
 *      "hostname": "requesting hostname or ip"
 *     }
 *   ],
 *   "total": 1,
 *   "limit": "10",
 *   "page": "1",
 *   "pages": 1
 *  }
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
 router.get("/getSystemLogs/:page/:pageSize/:searchParam?", auth, roleCheck("admins"), async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);
	
		if(req.params.page===undefined || req.params.page===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The page parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The page parameter is required!" })		
		}
	
		if(req.params.pageSize===undefined || req.params.pageSize===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The pageSize parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The pageSize parameter is required!" })		
		}	

		if(req.params.searchParam) {
			var query = {
				"$and": [
				  {
					"$or": [
					  { "level": { "$regex": new RegExp(req.params.searchParam, 'i') } }, // Case-insensitive search for the "level" field
					  { "message": { "$regex": new RegExp('^SEEDER') } },
					  { "message": { "$regex": new RegExp('^DATABASE') } },
					  { "message": { "$regex": new RegExp('^SERVER') } },
					  { "message": { "$regex": new RegExp('^API') } },
					  { "message": { "$regex": new RegExp('^MAIL') } }						  
					]
				  },
				  { "message": { "$regex": new RegExp('.*' + req.params.searchParam + '.*', 'i') } } // Case-insensitive search for the "message" field
				]
			  };
			var options = {
				page: req.params.page,
				limit: req.params.pageSize,
				sort: { "timestamp":-1 } // 1 for ascending, -1 for descending
			  };
			Logs.paginate(query, options, function(error, paginatedResults) {
				if (error) {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.message,400);
					return res.status(400).json({
						error: true,
						message: error.message,
					});
				} else {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"returned paginated roles list..",200);
					return res.status(200).json({
						error: false,
						message: "returned paginated roles list..",
						paginatedResult: paginatedResults
					});
				}
			});
		} else {
            var query = {$or: [{"message": {"$regex": /^SEEDER/}},{"message": {"$regex": /^DATABASE/}},{"message": {"$regex": /^SERVER/}}]};
			var options = {
				page: req.params.page,
				limit: req.params.pageSize,
				sort: { "timestamp":-1 } // 1 for ascending, -1 for descending
			  };
			Logs.paginate(query, options, function(error, paginatedResults) {
				if (error) {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.message,400);
					return res.status(400).json({
						error: true,
						message: error.message,
					});
				} else {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"returned paginated system logs list..",200);
					return res.status(200).json({
						error: false,
						message: "returned paginated system logs list..",
						paginatedResult: paginatedResults
					});
				}
			});
		}			
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|logs.js|/getSystemLogs|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

/**
 * GET /v1/logs/getRequestLogs/{page}/{pageSize}/{searchParam}
 * @summary method to fetch a paged requests list 
 * @tags Logs (Authenticated:true | Role:admins) - logs related api endpoints
 * @param {number} page.query - the page (default 0)
 * @param {number} pageSize.query - the page size (default 10)
 * @param {string} searchParam.query - the optional search parameter
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * "error": false,
 * "message": "returned paginated requests list..",
 * "paginatedResult": {
 *   "docs": [
 *     {
 *		"_id": "655328395e3027428a17c8f5",
 *      "timestamp": "2023-11-16T10:09:22.097+00:00",
 *      "level": "info",
 *      "message": "RES|9a190780358213fe21b185401a729771|200|/v1/roles/paginated/1/10|returned paginated requests list..|::1",
 *      "meta": [
 *       {
 *       "exception": "any message"
 *       }
 *      ],
 *      "hostname": "requesting hostname or ip"
 *     }
 *   ],
 *   "total": 1,
 *   "limit": "10",
 *   "page": "1",
 *   "pages": 1
 *  }
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/getRequestLogs/:page/:pageSize/:searchParam?", auth, roleCheck("admins"), async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);
	
		if(req.params.page===undefined || req.params.page===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The page parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The page parameter is required!" })		
		}
	
		if(req.params.pageSize===undefined || req.params.pageSize===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The pageSize parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The pageSize parameter is required!" })		
		}	

		if(req.params.searchParam) {
			var query = {"$and": [{"$or": [{ "message": { "$regex": /^RES/ } },{ "message": { "$regex": /^REQ/ } }]}, { "message": { "$regex": '.*' + req.params.searchParam + '.*' } }]};
			var options = {
				page: req.params.page,
				limit: req.params.pageSize,
				sort: { "timestamp":-1 } // 1 for ascending, -1 for descending
			  };
			Logs.paginate(query, options, function(error, paginatedResults) {
				if (error) {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.message,400);
					return res.status(400).json({
						error: true,
						message: error.message,
					});
				} else {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"returned paginated roles list..",200);
					return res.status(200).json({
						error: false,
						message: "returned paginated roles list..",
						paginatedResult: paginatedResults
					});
				}
			});
		} else {
            var query = {$or: [{"message": {"$regex": /^RES/}},{"message": {"$regex": /^REQ/}}]};
			var options = {
				page: req.params.page,
				limit: req.params.pageSize,
				sort: { "timestamp":-1 } // 1 for ascending, -1 for descending
			  };
			Logs.paginate(query, options, function(error, paginatedResults) {
				if (error) {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.message,400);
					return res.status(400).json({
						error: true,
						message: error.message,
					});
				} else {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"returned paginated request logs list..",200);
					return res.status(200).json({
						error: false,
						message: "returned paginated request logs list..",
						paginatedResult: paginatedResults
					});
				}
			});
		}			
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|logs.js|/getRequestLogs|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

/**
 * GET /v1/logs/getAuditLogs/{page}/{pageSize}/{searchParam}
 * @summary method to fetch a paged audit logs list 
 * @tags Logs (Authenticated:true | Role:admins) - logs related api endpoints
 * @param {number} page.query - the page (default 0)
 * @param {number} pageSize.query - the page size (default 10)
 * @param {string} searchParam.query - the optional search parameter
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
 * "error": false,
 * "message": "returned paginated audit logs list..",
 * "paginatedResult": {
 *   "docs": [
 *     {
 *		"_id": "655328395e3027428a17c8f5",
 *      "timestamp": "2023-11-16T10:09:22.097+00:00",
 *      "level": "info",
 *      "message": "AUDIT | userxyz modified object xyz",
 *      "meta": [
 *       {
 *       "exception": "any message"
 *       }
 *      ],
 *      "hostname": "requesting hostname or ip"
 *     }
 *   ],
 *   "total": 1,
 *   "limit": "10",
 *   "page": "1",
 *   "pages": 1
 *  }
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
 router.get("/getAuditLogs/:page/:pageSize/:searchParam?", auth, roleCheck("admins"), async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);
	
		if(req.params.page===undefined || req.params.page===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The page parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The page parameter is required!" })		
		}
	
		if(req.params.pageSize===undefined || req.params.pageSize===null) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The pageSize parameter is required!",400);
			return res
					.status(400)
					.json({ error: true, message: "The pageSize parameter is required!" })		
		}	

		if(req.params.searchParam) {
			var query = {
				"$and": [
				  {
					"$or": [
					  { "message": { "$regex": new RegExp('^AUDIT') } },
					  { "level": { "$regex": new RegExp(req.params.searchParam, 'i') } } // Case-insensitive search for the "level" field
					]
				  },
				  { "message": { "$regex": new RegExp('.*' + req.params.searchParam + '.*', 'i') } } // Case-insensitive search for the "message" field
				]
			  };
			var options = {
				page: req.params.page,
				limit: req.params.pageSize,
				sort: { "timestamp":-1 } // 1 for ascending, -1 for descending
			  };
			Logs.paginate(query, options, function(error, paginatedResults) {
				if (error) {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.message,400);
					return res.status(400).json({
						error: true,
						message: error.message,
					});
				} else {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"returned paginated roles list..",200);
					return res.status(200).json({
						error: false,
						message: "returned paginated roles list..",
						paginatedResult: paginatedResults
					});
				}
			});
		} else {
            var query = {"message": {"$regex": /^AUDIT/}};
			var options = {
				page: req.params.page,
				limit: req.params.pageSize,
				sort: { "timestamp":-1 } // 1 for ascending, -1 for descending
			  };
			Logs.paginate(query, options, function(error, paginatedResults) {
				if (error) {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.message,400);
					return res.status(400).json({
						error: true,
						message: error.message,
					});
				} else {
					doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"returned paginated audit logs list..",200);
					return res.status(200).json({
						error: false,
						message: "returned paginated audit logs list..",
						paginatedResult: paginatedResults
					});
				}
			});
		}			
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|logs.js|/getAuditLogs|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;