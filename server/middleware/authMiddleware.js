import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ;

export function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization format must be Bearer <token>' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired or token is invalid.' });
  }
}
