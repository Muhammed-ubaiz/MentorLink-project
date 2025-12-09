import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    console.log("Auth header:", req.headers.authorization);
    
    // Get token from Authorization header only
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    // Extract token (with or without "Bearer " prefix)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;
    
    console.log("Extracted token:", token);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object
req.user = {
  id: decoded.userId,
  role: decoded.userType,
};
    next();
    
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// The rest of your middleware remains the same
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Admin access required" 
    });
  }
  next();
};

export const requireMentor = (req, res, next) => {
  if (req.user.userType !== "mentor") {
    return res.status(403).json({ 
      success: false, 
      message: "Mentor access required" 
    });
  }
  next();
};

export const requireAdminOrMentor = (req, res, next) => {
  if (req.user.userType !== "admin" && req.user.userType !== "mentor") {
    return res.status(403).json({ 
      success: false, 
      message: "Admin or mentor access required" 
    });
  }
  next();
};