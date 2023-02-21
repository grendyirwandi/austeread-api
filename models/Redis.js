const winston     = require('../config/winston');
const config      = require('config');
const redis       = require('redis');
const {promisify} = require('util');
// Create connection to redis
const client   = redis.createClient({host:'192.168.10.202', port:6379, db:0});
// Create async to Get data redis
const getAsync = promisify(client.get).bind(client);
// Create async to Get KEYS redis
const keysAsync = promisify(client.keys).bind(client);
// Create async to Check exist KEYS redis
const existsAsync = promisify(client.exists).bind(client);
// Create async to Check times expire redis
const ttlAsync = promisify(client.ttl).bind(client);
// Create async to Get data from SADD redis
const sismemberAsync = promisify(client.sismember).bind(client);

async function set(key, value, EX = null) {
    try {
        if (EX == null) {
            await client.set(key, value);
        } else {
            await client.setex(key, EX, value);
        }

        return true;
    } catch (err) {
        winston.error(err);
        return false;
    }
}

async function sadd(key, value, EX = null) {
    try {
        await client.sadd(key, value);
        if (await ttlAsync(key) < 0 && EX != null) {
            await client.expire(key, EX);
        }

        return true;
    } catch (err) {
        winston.error(err);
        return false;
    }
}

async function sismember(key, value) {
    try {
        return sismemberAsync(key, value);
    } catch (err) {
        winston.error(err);
        return false;
    }
}

async function get(key) {
    try {
        return await getAsync(key);
    } catch (err) {
        winston.error(err);
        return false;
    }
}

async function keys(key) {
    try {
        return await keysAsync(key+'*');  
    } catch (err) {
        winston.error(err);
        return false;
    }
}

module.exports.SETREDIS  = set;
module.exports.SADDREDIS = sadd;
module.exports.SISMEMBER = sismember;
module.exports.GETREDIS  = get;
module.exports.KEYSREDIS = keys;