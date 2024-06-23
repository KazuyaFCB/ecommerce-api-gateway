const app = require("./app");
const config = require("config");

const PORT = config.get("production.server.port");

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});