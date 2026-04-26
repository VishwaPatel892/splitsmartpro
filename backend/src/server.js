import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

// Connect to database
connectDB();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});
