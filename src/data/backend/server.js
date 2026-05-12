import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import { attachUser } from './middleware/auth.js';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import faqRoutes from './routes/faq.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';
import visitRoutes from './routes/visit.js';
import rejoindreRoutes from './routes/rejoindre.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

// --- Sécurité ---
app.use(helmet());
app.use(hpp());
app.disable('x-powered-by');

// --- CORS allowlist (plus de "any origin with credentials") ---
const defaultDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultDevOrigins;

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin non autorisée: ${origin}`));
    },
    credentials: true,
  })
);

// --- Body parsers : petites limites par défaut, 10mb seulement pour /rejoindre ---
app.use('/api/rejoindre', express.json({ limit: '10mb' }));
app.use('/api/rejoindre', express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ limit: '64kb', extended: true }));
app.use(cookieParser());

// --- Rate limiting ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Trop de tentatives. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Trop de soumissions. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const visitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, error: 'Trop de messages. Patientez un instant.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/', authLimiter);
app.use('/api/contact', formLimiter);
app.use('/api/rejoindre', formLimiter);
app.use('/api/visit', visitLimiter);
app.use('/api/chat/messages', chatLimiter);
app.use('/api/faq/requests', chatLimiter);

// --- Auth context attaché à toutes les requêtes /api ---
app.use('/api/', attachUser);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visit', visitRoutes);
app.use('/api/rejoindre', rejoindreRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Serveur Express backend lancé sur http://localhost:${port}`);
  console.log(`CORS origines autorisées: ${allowedOrigins.join(', ')}`);
});
