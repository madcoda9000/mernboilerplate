import { Router } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import Role from "../models/Roles.js";
import User from "../models/User.js";
import crypto from "crypto";
import doHttpLog from "../utils/httpLogger.js";
import {
	createRoleValidation,
	deleteRoleValidation,
	updateRoleValidation
} from "../utils/validationSchema.js";
import logger from "../services/logger.service.js";

const router = Router();

/**
 * PUT /v1/roles/updateRole
 * @summary method to update a role
 * @tags Roles (Authenticated:true | Role:admins) - roles related api endpoints
 * @param {object} request.body.required - the role
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "3465644556734573541",
 *  "oldRoleName": "oldRoleNameHere",
 *  "roleName": "newRoleNameHere"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "Role updated successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.put("/updateRole", auth, roleCheck("admins"), async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);
	
		const { error } = updateRoleValidation(req.body);
		if(error) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.details[0].message,400);
			return res
					.status(400)
					.json({ error: true, message: error.details[0].message })		
		}
	
		if(req.body.oldRoleName.toLowerCase()==="admins" || req.body.oldRoleName.toLowerCase()==="users") {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"The roles admins and user cannot be renamed!",400);
			res.status(400).json({
				error: true,
				message: "The roles admins and user cannot be renamed",
			});
		}
	
		const idRole = await Role.findOne({ _id: req.body._id });
		if(!idRole) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Role with id " + req.body._id + " not found!",400);
			res.status(400).json({
				error: true,
				message: "Role with id " + req.body._id + " not found!",
			});
		} 
	
		// update role properties
		const update = {
			roleName: req.body.roleName
		}
		await Role.findByIdAndUpdate({_id:req.body._id}, update);
		doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Role updated sucessfully",201);
		res
			.status(201)
			.json({ error: false, message: "Role updated sucessfully" });
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		res.status(500).json({ message: err.message });
	}
});

/**
 * POST /v1/roles/deleteRole
 * @summary method to delete a role
 * @tags Roles (Authenticated:true | Role:admins) - roles related api endpoints
 * @param {object} request.body.required - the role id
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "_id": "46355473634654436576"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": false,
 *  "message": "role deleted successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/deleteRole", auth, roleCheck("admins"), async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);
	
		const { error } = deleteRoleValidation(req.body);
		if(error) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.details[0].message,400);
			return res
					.status(400)
					.json({ error: true, message: error.details[0].message })		
		}
	
		const idRole = await Role.findOne({ _id: req.body._id });
		if(!idRole) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Role with id " + req.body._id + " not found!",400);
			res.status(400).json({
				error: true,
				message: "Role with id " + req.body._id + " not found!",
			});
		} else {
			// check if a user is memeber of the grou to delete
			var query = {roles: { $regex: '.*' + idRole.roleName + '.*' }};
			const rUser = await User.findOne(query);
			if(rUser) {
				doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Cannot delete role " + idRole.roleName + ". Role contains members!",200);
				res.status(200).json({
					error: true,
					message: "Cannot delete role " + idRole.roleName + ". Role contains members!",
				});
			} else {
				await idRole.delete();
				doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Role deleted sucessfully",200);
				res
					.status(200)
					.json({ error: false, message: "Role deleted sucessfully" });
			}			
		}
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		res.status(500).json({ message: err.message });
	} 
});

/**
 * POST /v1/roles/createRole
 * @summary method to create a new role
 * @tags Roles (Authenticated:true | Role:admins) - roles related api endpoints
 * @param {object} request.body.required - the role
 * @return {object} 201 - created response - application/json
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "roleName": "newRole1"
 * }
 * @example response - 200 - example success response
 * {
 * 	"error": true,
 *  "message": "Cannot create role. Role exists already!."
 * }
 * @example response - 201 - example success response
 * {
 * 	"error": false,
 *  "message": "role created successfully."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/createRole", auth, roleCheck("admins"), async (req, res) => {
	const mid = crypto.randomBytes(16).toString("hex");
	try {
		
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);
	
		const { error } = createRoleValidation(req.body);
		if(error) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.details[0].message,400);
			return res
					.status(400)
					.json({ error: true, message: error.details[0].message })		
		}
	
		const frole = await Role.findOne({ roleName: req.body.roleName });
		if(frole) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Cannot create role. Role exists already!",200);
			res.status(200).json({
				error: true,
				message: "Cannot create role. Role exists already!",
			});
		} else {
			// create a new role
			const newRole = new Role({
				roleName: req.body.roleName
			});
			await newRole.save();
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"Role " + req.body.roleName + " created sucessfully",201);
			res
				.status(201)
				.json({ error: false, message: "Role " + req.body.roleName + " created sucessfully" });
		}	
		
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|roles.js|/createRole|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

/**
 * GET /v1/roles/paginated/{page}/{pageSize}/{searchParam}
 * @summary method to fetch a paged roles list 
 * @tags Roles (Authenticated:true | Role:admins) - roles related api endpoints
 * @param {number} page.query - the page (default 0)
 * @param {number} pageSize.query - the page size (default 10)
 * @param {string} searchParam.query - the optional search parameter
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example response - 200 - example success response
 * {
  "error": false,
  "message": "returned paginated roles list..",
  "paginatedResult": {
    "docs": [
      {
		"_id": "655328395e3027428a17c8f5",
        "roleName": "admins",
		"__v": 0
      },
	  {
		"_id": "655328395e3027428a17c8f6",
		"roleName": "users",
		"__v": 0
	  }
    ],
    "total": 1,
    "limit": "10",
    "page": "1",
    "pages": 1
  }
}
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.get("/paginated/:page/:pageSize/:searchParam?", auth, roleCheck("admins"), async (req, res) => {
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
			var query = {roleName: { $regex: '.*' + req.params.searchParam + '.*' }};
			Role.paginate(query, { page:req.params.page, limit:req.params.pageSize }, function(error, paginatedResults) {
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
			Role.paginate({}, { page:req.params.page, limit:req.params.pageSize }, function(error, paginatedResults) {
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
		}			
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|roles.js|/paginated|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

/**
 * POST /v1/roles/checkIfRoleExists
 * @summary method to check if a role exists already
 * @tags Roles (Authenticated:true | Role:admins) - roles related api endpoints
 * @param {object} request.body.required - the role
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response - application/json
 * @example request - example payload
 * {
 *  "roleName": "newRole1"
 * }
 * @example response - 200 - example role found response
 * {
 * 	"error": false,
 *  "message": "role found.",
 *  "Role": {
 *   "roleName": "role-one"
 *  }
 * }
  * @example response - 200 - example role not found response
 * {
 * 	"error": false,
 *  "message": "role not found."
 * }
 * @example response - 400 - example error message
 * {
 *   "error": true,
 *   "message": "error message goes here..."
 * }
 */
router.post("/checkIfRoleExists", auth, roleCheck("admins"), async (req, res) => {
	try {
		const mid = crypto.randomBytes(16).toString("hex");
		doHttpLog('REQ',mid,req.method,req.originalUrl,req.ip);

		const { error } = createRoleValidation(req.body);
		if(error) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,error.details[0].message,400);
			return res
					.status(400)
					.json({ error: true, message: error.details[0].message })		
		}
	
		const frole = await Role.findOne({ roleName: req.body.roleName });
		if(frole) {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"role found.",200);
			res.status(200).json({
				error: false,
				message: "role found.",
				frole
			});
		} else {
			doHttpLog('RES',mid,req.method,req.originalUrl,req.ip,"role not found.",200);
			res.status(200).json({
				error: false,
				message: "role not found."
			});
		}
	} catch (err) {
		doHttpLog('RES',mid,req.method,req.originalUrl,err.message,500);
		logger.error("API|roles.js|/checkIfRoleExists|" + err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;