import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});

/**
 * Price in cents for a single conversion ($5)
 */
export const SINGLE_CONVERSION_PRICE = 500;

/**
 * Monthly unlimited plan price ID (configured in Stripe Dashboard)
 */
export const MONTHLY_PLAN_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;

/**
 * Create a Stripe Checkout Session for a single conversion ($5)
 */
export async function createCheckoutSession({
  videoUrl,
  provider,
}: {
  videoUrl: string;
  provider: string;
}): Promise<Stripe.Checkout.Session> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "YouTube to Blog Conversion",
            description: "Convert a YouTube video into an SEO-optimized blog post",
          },
          unit_amount: SINGLE_CONVERSION_PRICE,
        },
        quantity: 1,
      },
    ],
    metadata: {
      videoUrl,
      provider,
    },
    success_url: `${baseUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?canceled=true`,
  });

  return session;
}

/**
 * Verify that a checkout session is paid and unused
 */
export async function verifySession(
  sessionId: string
): Promise<{ valid: boolean; videoUrl?: string; provider?: string }> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status === "paid" &&
      session.metadata?.used !== "true"
    ) {
      return {
        valid: true,
        videoUrl: session.metadata?.videoUrl,
        provider: session.metadata?.provider,
      };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
}

/**
 * Mark a checkout session as used so it can't be reused
 */
export async function markSessionUsed(sessionId: string): Promise<void> {
  await stripe.checkout.sessions.update(sessionId, {
    metadata: { used: "true" },
  });
}
