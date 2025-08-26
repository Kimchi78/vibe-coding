import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Dummy user database
const users = [
  {
    email: 'test@test.com',
    password: 'password123', // In a real app, this should be hashed
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: { email: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { email, password };
  users.push(newUser);

  res.status(201).json({ message: 'User created successfully' });
});

app.post('/api/chat', authMiddleware, (req: AuthRequest, res) => {
    const { message, image } = req.body;

    // Mock AI response
    const aiResponse = {
        text: `AI received your message: "${message}"`,
        image: image ? "AI processed your image" : undefined
    };

    res.json(aiResponse);
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});