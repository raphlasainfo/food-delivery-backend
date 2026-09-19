import { supabase } from '../config/supabase.js';

export const signUp = async (req, res, next) => {
  try {
    const { email, password, name, phone, role = 'customer' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // 1. Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Link created Auth UID to your public.users profile table
    if (authData.user) {
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          name: name || email.split('@')[0],
          email,
          phone: phone || null,
          role,
        },
      ]);

      if (profileError) throw profileError;
    }

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user: authData.user,
      access_token: authData.session?.access_token || null,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ success: false, message: error.message });
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    });
  } catch (error) {
    next(error);
  }
};