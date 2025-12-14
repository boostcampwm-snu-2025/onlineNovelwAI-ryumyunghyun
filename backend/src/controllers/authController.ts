import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      // callback(error,result)
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: '이미 존재하는 사용자명 또는 이메일입니다' });
          }
          return res.status(500).json({ error: '사용자 등록 실패' });
        }

        const token = jwt.sign(
          { userId: this.lastID },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: '회원가입 성공',
          token,
          user: { id: this.lastID, username, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요' });
    }

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user: any) => {
        if (err) {
          return res.status(500).json({ error: '서버 오류가 발생했습니다' });
        }

        if (!user) {
          return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password); //async func

        if (!isValidPassword) {
          return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        res.json({
          message: '로그인 성공',
          token,
          user: { id: user.id, username: user.username, email: user.email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};
