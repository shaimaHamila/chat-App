const origins = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
};
export default origins;
