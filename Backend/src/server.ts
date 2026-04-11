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

startServer();

export default app;
