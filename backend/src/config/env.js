const requiredEnvVars = ["MONGO_URI"];

const ensureEnv = () => {
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  }
};

module.exports = {
  ensureEnv,
};
