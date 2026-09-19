import { supabase } from '../config/supabase.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !/^bearer\s+/i.test(authHeader)) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing or invalid. Use: Bearer <token>',
      });
    }

    const token = authHeader.split(/\s+/)[1];

    // 1. Verify token with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token.',
      });
    }

    // 2. Query public.users by Auth UID or email fallback
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .or(`id.eq.${authData.user.id},email.eq.${authData.user.email}`)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ success: false, error: profileError.message });
    }

    // Attach verified user and role to request
    req.user = {
      id: authData.user.id,
      email: authData.user.email,
      role: userProfile?.role || 'customer',
      ...userProfile,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userRole = req.user.role || 'customer';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};