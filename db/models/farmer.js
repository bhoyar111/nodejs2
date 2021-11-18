'use strict';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default (sequelize, DataTypes) => {
	const Farmer = sequelize.define('Farmer', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		full_name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		email_id: {
			type: DataTypes.STRING(191),
			allowNull: true,
			// unique: true
		},
		mobile_no: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		otp: {
			type: DataTypes.STRING(10),
			allowNull: true
		},
		password: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		address: {
			type: DataTypes.STRING(666),
			allowNull: true,
		},
        state_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        district_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        taluka: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        pin_code: {
            type: DataTypes.STRING(6),
            allowNull: true,
        },
		status: {
			type: DataTypes.BOOLEAN(true),
			allowNull: true,
			defaultValue: '1'
		},
		created_by: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		updated_by: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	}, {
		tableName: 'farmers'
	});

	Farmer.associate = function(models) {
		// associations can be defined here
		Farmer.belongsTo(models.State, {
            foreignKey: "state_id",
            as: "state",
        });
		Farmer.belongsTo(models.City, {
            foreignKey: "district_id",
            as: "city",
        });
	};

	// queries and other function starts
	Farmer.getDS = async () => {
		try {
			return await Farmer.findAll({
				where:{
					status: true
				},
				attributes: [ 'id', 'full_name', 'status']
			});
		} catch (e) {
			return [];
		}
	};
	
	Farmer.getFarmer = async (reqData) => {
		try {
			return await Farmer.findOne({
				where: {
					mobile_no: reqData.mobile_no,
					status: true
				},
				attributes: [
					'id', 'mobile_no', 'otp', 'status'
				]
			});
		} catch (e) {
			return false;
		}
	}

	Farmer.otpGetFarmer = async (reqData) => {
		try {
			return await Farmer.findOne({
				where: {
					mobile_no: reqData.mobile_no,
					status: true
				},
				attributes: [
					'id', 'full_name', 'mobile_no', 'otp', 'status'
				]
			});
		} catch (e) {
			return false;
		}
	}

	Farmer.checkFarmer = async (reqData) => {
		try {
			return await Farmer.findOne({
				where: {
					mobile_no: reqData.mobile_no,
					status: true
				},
				attributes: ['id', 'mobile_no', 'status']
			});
		} catch (e) {
			return false;
		}
	}

	Farmer.getList = async (curPage, pgSize) => {
		try {
			const { State, City } = sequelize.models;
			return await Farmer.findAndCountAll({
				where:{
					status: true
				},
				include:[
					{ model : State, as : 'state', attributes: ['state_name']  },
					{ model : City, as : 'city', attributes: ['city_name']  }
				],
				distinct: true,
                order: [['full_name', 'ASC']],
                offset: (curPage-1)*pgSize,
				limit: pgSize,
				attributes: ['id', 'full_name', 'email_id', 'mobile_no', 'otp', 'password', 'address', 'state_id', 'district_id', 'taluka', 'pin_code','status']
			});
		} catch (e) {
			return [];
		}
	};

	Farmer.saveRecord = async (reqData) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				let hashPassword = "";
				if(reqData.password != undefined && reqData.password != null && reqData.password != ''){
				 	hashPassword = bcrypt.hashSync(reqData.password, bcrypt.genSaltSync(10), null);
				}	
				const saveObj = {
					...reqData,
					password: hashPassword,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				return await Farmer.create(saveObj, { transaction: t });
			});
			// return result from saved record
			return result;
		} catch (e) {
			return false;
		}
	};

	Farmer.getRecordById = async (id) => {
		try {
			const searchRecord = await Farmer.findByPk(id, {
				attributes: ['id', 'full_name', 'email_id', 'mobile_no', 'otp', 'password', 'address', 'state_id', 'district_id', 'taluka', 'pin_code', 'status' ]
			});
			if(!searchRecord || !searchRecord.status) return false;
			return searchRecord;
		} catch (e) {
			return false;
		}
	};

	Farmer.updateRecord = async (record, reqData) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				const updateObj = {
					...reqData,
					updatedAt: new Date()
				};
				return await record.update(updateObj, { transaction: t });
			});
			// return result from updated record
			return result;
		} catch (e) {
			return false;
		}
	};

	Farmer.deleteRecord = async (record) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				return await record.update({
					status: false,
					updatedAt: new Date()
				}, { transaction: t });
			});
			// return result from updated record
			return result;
		} catch (e) {
			return false;
		}
	};
	
    Farmer.validatePassword = (pass, hashPass) => {
        return bcrypt.compareSync(pass, hashPass);
	}

	Farmer.generateTokens = (userSerialize) => {
		const accessSecret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : '';
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET :'';
        return {
            access_token  : jwt.sign(userSerialize, accessSecret, { expiresIn: '6h' }),
            refresh_token : jwt.sign(userSerialize, refreshSecret)
        }
	}

	return Farmer;
};