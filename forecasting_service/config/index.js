module.exports = {
    'server': {
        'port': '8080',
        'host': 'localhost'
    },
    'mongodb': {
        'port': process.env.MONGODB_PORT || '27017',
        'host': process.env.MONGODB_HOST || 'mongodb',
        'user': process.env.MONGODB_USER || 'user',
        'password': process.env.MONGODB_PASS || 'pass'
    },
    'influxdb': {
        'port': process.env.INFLUXDB_PORT || '8086',
        'host': process.env.INFLUXDB_HOST || 'influxdb',
        'user': process.env.INFLUXDB_USER || 'root',
        'password': process.env.INFLUXDB_PASS || 'root'
    }
};