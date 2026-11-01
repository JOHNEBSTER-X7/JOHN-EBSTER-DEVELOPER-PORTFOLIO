export type Article = {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
};

export const knowledgeBase: Article[] = [
  {
    id: "orders-tracking",
    title: "Track an order",
    category: "Orders",
    content: "Customers can track an order from Account > Orders. A dispatch confirmation email includes a tracking link. Tracking may take up to 24 hours to update after dispatch.",
    keywords: ["track", "tracking", "order", "delivery", "dispatch", "shipment"]
  },
  {
    id: "returns-window",
    title: "Returns and refunds",
    category: "Returns",
    content: "Unused items in their original condition can be returned within 30 days of delivery. Start a return from Account > Orders > Return item. Refunds are normally processed within 5 to 10 business days after the returned item is received and inspected.",
    keywords: ["return", "refund", "money", "exchange", "cancel"]
  },
  {
    id: "payment-methods",
    title: "Accepted payment methods",
    category: "Payments",
    content: "The demo store accepts Visa, Mastercard and PayPal. Payment details are handled by the payment provider and are not stored by customer support. Never send full card numbers or security codes in chat.",
    keywords: ["payment", "pay", "card", "visa", "mastercard", "paypal", "billing"]
  },
  {
    id: "account-access",
    title: "Account access",
    category: "Account",
    content: "Use the Forgot password link on the sign-in page to request a password reset email. If the email does not arrive, check spam and confirm that you entered the email address registered to the account. Support will never ask for your password or one-time authentication code.",
    keywords: ["login", "log in", "password", "account", "sign in", "access"]
  },
  {
    id: "contact-support",
    title: "Contact a human support specialist",
    category: "Support",
    content: "If the help articles do not resolve an issue, request a human support specialist using the escalation form. Include a short description and a contact email. Do not include passwords, payment card numbers or authentication codes.",
    keywords: ["human", "agent", "person", "specialist", "escalate", "complaint", "help"]
  }
];

const STOP_WORDS = new Set(["the", "and", "for", "with", "what", "when", "where", "how", "can", "does", "from", "this", "that", "your", "you", "are", "not", "please", "about"]);

export function searchKnowledgeBase(question: string, limit = 3): Array<Article & { score: number }> {
  const terms = question.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const query = new Set(terms.filter(term => !STOP_WORDS.has(term)));
  if (!query.size) return [];
  return knowledgeBase
    .map(article => {
      const text = [article.title, article.category, article.content, ...article.keywords].join(" ").toLowerCase();
      const haystack = new Set(text.match(/[a-z0-9]+/g) ?? []);
      const hits = [...query].filter(term => haystack.has(term)).length;
      const phraseBoost = article.keywords.some(keyword => question.toLowerCase().includes(keyword)) ? 1 : 0;
      return { ...article, score: hits / Math.sqrt(query.size) + phraseBoost };
    })
    .filter(article => article.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
