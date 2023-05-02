const redis = require('redis');
const Redisclient = redis.createClient(6379, 'localhost');


Redisclient.on('error', (err) => {
    console.log('Redis Error ' + err);
});

Redisclient.connect().then(()=>{
    console.log("redis client connect on !");
});


/*await client.set('key', 'value');
const value = await client.get('key');
await client.disconnect();*/

module.exports = Redisclient;