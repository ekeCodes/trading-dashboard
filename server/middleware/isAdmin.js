export function isAdmin(req, res, next) {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  next();
}
