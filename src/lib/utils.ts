import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

// Simple redaction function for sensitive information
export function redactSensitiveInfo(text: string): string {
  // Redact phone numbers
  text = text.replace(/(\+233|0)\d{9}/g, '[PHONE_REDACTED]');
  
  // Redact email addresses
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
  
  // Redact credit card numbers (basic pattern)
  text = text.replace(/\b\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\b/g, '[CARD_REDACTED]');
  
  // Redact Ghana Card IDs
  text = text.replace(/GHA-\d{9}-\d/g, '[ID_REDACTED]');
  
  return text;
}

export const reportCategories = {
  negative: [
    'Fraud',
    'Scam',
    'Theft',
    'Poor Service',
    'Misconduct',
    'Unprofessional Behavior',
    'Breach of Contract',
    'Overcharging',
    'Discrimination',
    'Other'
  ],
  positive: [
    'Excellent Service',
    'Honesty',
    'Refund Provided',
    'Community Contribution',
    'Fair Pricing',
    'Professional Conduct',
    'Timely Delivery',
    'Going Above and Beyond',
    'Transparency',
    'Other'
  ]
};