import Stripe from "stripe";
import { env } from "./env";

// null hasta que se configure STRIPE_SECRET_KEY — permite que el resto del
// servidor arranque y se pruebe sin depender de credenciales de Stripe.
export const stripe = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey, { apiVersion: "2024-06-20" })
  : null;
