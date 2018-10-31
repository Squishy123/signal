//http error objects
const Boom = require('boom');

//cluster model
const Cluster = require('../../clusters/model/cluster');

//node
const Node = require('../../nodes/model/node');

//mongoose
const mongoose = require('mongoose');

//unique user verification
const verifyAccessToken = require('../util/userFunctions').verifyAccessToken;

//adds/registers a new node to a user's cluster
//reqs: access_token: required, cluster_id: required, name: optional, node_id: optional
module.exports = {
    method: 'POST',
    path: '/api/users/clusters/nodes',
    config: {
        //verify user credentials
        pre: [{ method: verifyAccessToken, assign: 'user' }],
        handler: async (req, h) => {
            try {
                let user = req.pre.user, cluster, node;
                //adding a new cluster
                if (req.payload.cluster_id) {
                    //check if cluster is unique
                    let contains = user.clusters.some((cluster) => {
                        return cluster.equals(req.payload.cluster_id);
                    });

                    if (!contains)
                        return Boom.badRequest(`User doesn't have access to this cluster`);
                    else
                        cluster = await Cluster.findOne(mongoose.Types.ObjectId(req.payload.cluster_id));
                        console.log(cluster);

                    if (req.payload.node_id) {
                        let unique = cluster.nodes.some((node) => {
                            return node.equals(req.payload.node_id)
                        });

                        if (unique)
                            return Boom.badRequest('Cluster already has that node!');

                        node = await Node.findOne(mongoose.Types.ObjectId(req.payload.node_id));
                    } else {
                        node = new Node();
                        if (req.payload.name)
                            node.name = req.payload.name
                    }

                    //add node to cluster
                    cluster.nodes.push(node._id);
                    await cluster.save();

                    //add cluster to node
                    node.cluster_id = cluster._id;
                    await node.save();
                    return cluster;
                }
                return Boom.badRequest('Required: No cluster_id supplied!');
            } catch (err) {
                return Boom.badRequest(err);
            }
        }
    }
}
