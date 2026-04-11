import app from './index.js';
import { connecttodb } from './config/db.js';

const port: number = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        await connecttodb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();
