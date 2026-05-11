// lib/validation.js
import { z } from 'zod';

// Auth payload schema
export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Analytics POST payload schema
export const analyticsSchema = z.object({
  type: z.enum(['visit', 'click', 'sale']),
  amount: z.number().nonnegative().optional(),
});

// Generic payment payload
export const paymentSchema = z.object({
  amount: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/)]),
  productId: z.string().optional(),
  productTitle: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

// Message (Contact form) schema
export const messageSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez fournir une adresse email valide"),
  message: z.string().min(30, "Veuillez préciser votre demande (minimum 30 caractères)").max(5000, "Le message est trop long"),
});

