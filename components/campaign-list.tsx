'use client'
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/api';
import { Campaign } from '@/app/dashboard/page';

export function CampaignList({ onSelectCampaign }: { onSelectCampaign: (campaign: Campaign) => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const response = await apiClient.get('/campaigns/');
        setCampaigns(response.data || []);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  if (loading) return <div>Loading campaigns...</div>;
  if (campaigns.length === 0) return (
    <Card>
        <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
            <CardDescription>Select a campaign to generate content.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>No campaigns found. Create one to get started!</p>
        </CardContent>
    </Card>
  );

  return (
    <Card>
        <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
            <CardDescription>Select a campaign to generate content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                        <p className="font-semibold">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.brand_name}</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Badge variant="outline" className="capitalize">{campaign.tone_id}</Badge>
                        <Button onClick={() => onSelectCampaign(campaign)} size="sm">Generate</Button>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
  );
}