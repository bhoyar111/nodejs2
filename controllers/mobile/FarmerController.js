import sCode from "../../custom/status-codes";
const { ok, created, bad_request, server_error } = sCode;
import { pageLimit, checkDataIsValid } from '../../custom/secure';
import {
    getIdNotFoundCommonMsg,
    getValidationErrMsg,
    getServerErrorMsg,
} from '../../custom/error-msg';

// models import here
import model from '../../db/models';
const { Farmer, State, City } = model;


export default {
    async getFarmersDS(req, res) {
        try {
            let states = [];
            states = await State.getDS();
            let cities = [];
            cities = await City.getDS();
            res.status(ok).send({ states, cities });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getFarmers(req, res) {
        try {
            const { pageNo } = req.query;
            const page = checkDataIsValid(pageNo) ? pageNo : 1;
            const pageSize = pageLimit();

            let farmersRes = [];
            farmersRes = await Farmer.getList(page, pageSize);
            const pages = Math.ceil(farmersRes.count / pageSize);

            const pageData = {
                total_record : farmersRes.count,
                per_page     : pageSize,
                current_page : page,
                total_pages  : pages
            }
            const farmers = checkDataIsValid(farmersRes.rows) ? farmersRes.rows : [];
            res.status(ok).send({ farmers, pageData });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },
}