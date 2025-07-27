'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { CampaignForm } from '@/components/campaign-form';
import { CampaignList } from '@/components/campaign-list';
import { BatchGenerator } from '@/components/batch-generator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface Campaign {
  id: string;
  name: string;
  brand_name: string;
  tone_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!localStorage.getItem('access_token')) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center py-8 px-2">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Content Dashboard</h1>
        <Button variant="outline" onClick={() => {
          logout();
          router.push('/');
        }}>Logout</Button>
      </header>
      
      {selectedCampaign ? (
        <div className="w-full max-w-3xl">
          <Button variant="outline" onClick={() => setSelectedCampaign(null)} className="mb-4">
            ← Back to Campaigns
          </Button>
          <BatchGenerator campaign={selectedCampaign} />
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="glass-card">
            <CampaignForm onCampaignCreated={() => setSelectedCampaign(null)} />
          </div>
          <div className="glass-card">
            <CampaignList onSelectCampaign={setSelectedCampaign}/>
          </div>
        </div>
      )}
    </div>
  );
}