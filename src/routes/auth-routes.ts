import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.session.save((err: any) => {
      if (err) {
        return res.status(500).json(err);
      }
      req.session.logged_in = true;
      req.session.user_id = user.id;
      req.session.username = user.username;

      return res.json({
        user: user.username,
        message: 'You are now logged in!',
      });
    });
    return;
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const logout = async (req: Request, res: Response) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);
// POST /register - Register a new user
router.post('/register', register);
// POST /logout - Logout a user
router.post('/logout', logout);

export default router;
