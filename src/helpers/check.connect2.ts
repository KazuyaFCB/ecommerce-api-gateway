import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const _SECONDS = 5000;

const countConnection = (): void => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

const checkOverload = (): void => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnection}`);
        console.log(`Number of cores: ${numCores}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        console.log(`Maximum number of connections: ${maxConnections}`);

        if (numConnection > maxConnections) {
            console.log('Maximum number of connections reached');
        }
    }, _SECONDS);
}

export default {
    countConnection,
    checkOverload
};
