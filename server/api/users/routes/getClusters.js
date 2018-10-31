//http error objects
const Boom = require('boom');

//cluster model
const Cluster = require('../../clusters/model/cluster');

//mongoose
const mongoose = require('mongoose');

//unique user verification
const verifyAccessToken = require('../util/userFunctions').verifyAccessToken;

//lists all of a user's clusters
module.exports = {
    method: 'GET',
    path: '/api/users/clusters',
    config: {
        //verify user credentials
        pre: [{ method: verifyAccessToken, assign: 'user' }],
        handler: async (req, h) => {
            try {
                let user = req.pre.user;
                list=[];
                user.clusters.forEach(cluster_id => {
                    let cluster = Cluster.findOne(mongoose.Types.ObjectId(cluster_id));
                    list.push(cluster);
                });

                clusterList = await Promise.all(list);
                return clusterList;
            } catch (err) {
                return Boom.badRequest(err);
            }
        }
    }
}