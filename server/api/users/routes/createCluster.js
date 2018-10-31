//http error objects
const Boom = require('boom');

//cluster model
const Cluster = require('../../clusters/model/cluster');

//mongoose
const mongoose = require('mongoose');

//unique user verification
const verifyAccessToken = require('../util/userFunctions').verifyAccessToken;

//authenticate a user
module.exports = {
    method: 'POST',
    path: '/api/users/clusters',
    config: {
        //verify user credentials
        pre: [{ method: verifyAccessToken, assign: 'user' }],
        handler: async (req, h) => {
            try {
                let user = req.pre.user, cluster;
                //adding a new cluster
                if (req.payload.cluster_id) {
                    //check if cluster is unique
                   let unique=user.clusters.some((cluster) => {
                       return cluster.equals(req.payload.cluster_id);
                   });

                   if(unique) 
                        return Boom.badRequest('User already has access to this cluster!');

                    cluster = await Cluster.findOne(mongoose.Types.ObjectId(req.payload.cluster_id));
                } else { //if theres an existing cluster to add
                    cluster = new Cluster();
                    cluster.name = req.payload.name;
                }
                //add user ref to cluster
                cluster.users.push(user._id);
                await cluster.save();

                //add cluster ref to user clusters
                user.clusters.push(cluster._id);
                await user.save();

                return cluster;
            } catch (err) {
                return Boom.badRequest(err);
            }
        }
    }
}