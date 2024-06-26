const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

const countConnection = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;
        console.log(`Active connections: ${numConnection}`);
        console.log(`Number of cores: ${numCores}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        console.log(`Maximum number of connections: ${maxConnections}`);
        if (numConnection > maxConnections) {
            console.log('Maximum number of connections reached');
        }
    }, _SECONDS); // every 5 seconds
}

module.exports = {
    countConnection
}