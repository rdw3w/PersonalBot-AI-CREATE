import { getBots, Bot } from '@/lib/db';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const bots: Bot[] = await getBots();

  return <LandingPage initialBots={bots} />;
}
