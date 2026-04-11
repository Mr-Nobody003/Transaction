import app from './index.js';
import { connecttodb } from './config/db.js';

const port: number = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        await connecttodb();

        // Vercel sets the VERCEL environment variable.
        // We only want to call listen() when running locally.
        if (!process.env.VERCEL) {
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
    } catch (err) {
        console.error("Failed to start server:", err);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
}

// On Vercel (serverless), ensure DB is connected before handling requests
if (process.env.VERCEL) {
    connecttodb().catch(console.error);
}

startServer();

export default app;

