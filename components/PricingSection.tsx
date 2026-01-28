"use client";

import { Check, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Pay Per Use",
    price: "$5",
    period: "per conversion",
    icon: Zap,
    description: "Perfect for occasional use",
    features: [
      "Single video conversion",
      "Choose OpenAI or Anthropic",
      "SEO-optimized output",
      "Markdown export",
      "No account required",
    ],
    cta: "Get Started Above",
    highlighted: false,
  },
  {
    name: "Unlimited Monthly",
    price: "$19",
    period: "/month",
    icon: Crown,
    description: "Best for content creators",
    features: [
      "Unlimited conversions",
      "Choose OpenAI or Anthropic",
      "SEO-optimized output",
      "Markdown export",
      "Priority processing",
      "Cancel anytime",
    ],
    cta: "Coming Soon",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section className="mt-20" id="pricing">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Simple Pricing</h2>
        <p className="text-muted-foreground text-lg">
          Pay only for what you use, or go unlimited.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                  : "border-border bg-card shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    plan.highlighted ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      plan.highlighted ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.cta === "Coming Soon"}
                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all ${
                  plan.highlighted
                    ? "bg-primary/20 text-primary cursor-not-allowed"
                    : "bg-muted text-foreground hover:bg-muted/80"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
                onClick={() => {
                  if (plan.cta !== "Coming Soon") {
                    document
                      .getElementById("youtube-url")
                      ?.scrollIntoView({ behavior: "smooth" });
                    document.getElementById("youtube-url")?.focus();
                  }
                }}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
