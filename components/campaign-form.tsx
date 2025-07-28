'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import apiClient from '@/lib/api';
import { toast } from 'sonner';

export function CampaignForm({ onCampaignCreated }: { onCampaignCreated: () => void }) {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [toneId, setToneId] = useState('friendly');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/campaigns/', {
        name,
        brand_name: brandName,
        tone_id: toneId,
      });
      toast.success('Campaign created successfully!');
      
      // Refresh the page to update the campaign list
      window.location.reload();

    } catch (error) {
      toast.error('Failed to create campaign.');
      setLoading(false); // Only set loading to false on error
    } 
    // No finally block needed, as success causes a page reload
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>Set up a new campaign to start generating content.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Campaign Name (e.g., Summer Sale 2025)" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Brand Name" value={brandName} onChange={(e) => setBrandName(e.target.value)} required />
          <Select value={toneId} onValueChange={setToneId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
