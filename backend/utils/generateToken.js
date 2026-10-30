import jwt from 'jsonwebtoken';

const generateToken = (id, role = 'student') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'edura_ai_super_secret_jwt_key_2026_educational_platform',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

export default generateToken;
