import { PortfolioView } from '@/components/portfolio/portfolio-view';

export const metadata = {
  title: 'Portfolio — CKBHedge',
  description: 'Your Fiber channel balances, asset allocation, active protection, and recent trading activity.',
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
