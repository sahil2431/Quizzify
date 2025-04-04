/**
 * Middleware to check if user has required role
 * @param {Array|String} roles - Required role(s) to access the route
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    // Make sure user is authenticated
    if (!req.user || !req.dbUser) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }

    // Convert roles to array if it's a string
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has one of the required roles
    if (requiredRoles.includes(req.dbUser.role)) {
      next();
    } else {
      res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions',
        requiredRoles,
        userRole: req.dbUser.role 
      });
    }
  };
};

export default { requireRole }; 