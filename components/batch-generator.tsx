'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wand2, Loader2, PartyPopper } from 'lucide-react';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import type { Campaign } from '@/app/dashboard/page';

interface PostInput {
  id: string;
  title: string;
  topic: string;
  brief: string;
}

export function BatchGenerator({ campaign }: { campaign: Campaign }) {
  const [posts, setPosts] = useState<PostInput[]>([{ id: Date.now().toString(), title: '', topic: '', brief: '' }]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const addPost = () => setPosts([...posts, { id: Date.now().toString(), title: '', topic: '', brief: '' }]);
  const removePost = (id: string) => posts.length > 1 && setPosts(posts.filter(p => p.id !== id));
  const updatePost = (id: string, field: keyof PostInput, value: string) => setPosts(posts.map(p => p.id === id ? { ...p, [field]: value } : p));
  const addMultiplePosts = (count: number) => {
    const newPosts = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}_${i}`, title: `Post ${posts.length + i + 1}`, topic: '', brief: 'Sample brief for quick testing'
    }));
    setPosts([...posts, ...newPosts]);
  };

  const pollJobStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get(`/batch-jobs/${id}/status`);
        setJobStatus(response.data);
        if (response.data.status.startsWith('completed')) {
          clearInterval(interval);
          setIsGenerating(false);
          setEndTime(Date.now());
          toast.success("Generation Complete!", {
            description: `Processed ${response.data.progress.total} posts.`,
            icon: <PartyPopper className="h-4 w-4" />,
          });
        }
      } catch (error) {
        clearInterval(interval);
        setIsGenerating(false);
        setEndTime(Date.now());
        toast.error("Failed to get job status.");
      }
    }, 2000);
  };

  const startGeneration = async () => {
    if (posts.some(p => !p.title.trim() || !p.brief.trim())) {
      toast.error("All posts must have a title and a brief.");
      return;
    }
    setIsGenerating(true);
    setJobStatus(null);
    setJobId(null);
    setStartTime(Date.now());
    setEndTime(null);

    const batchData = {
      name: `Batch for ${campaign.name}`,
      posts: posts.map(p => ({
        ...p,
        brand_name: campaign.brand_name,
        tone: campaign.tone_id,
      })),
    };

    try {
      const response = await apiClient.post(`/campaigns/${campaign.id}/generate-batch`, batchData);
      setJobId(response.data.job_id);
      toast.info("Batch generation started!", { description: "You can monitor the progress below."});
      pollJobStatus(response.data.job_id);
    } catch (error) {
      toast.error("Failed to start batch generation.");
      setIsGenerating(false);
      setEndTime(Date.now());
    }
  };

  // Helper to format elapsed time
  const getElapsedTime = () => {
    if (!startTime) return null;
    const end = endTime || Date.now();
    const seconds = Math.floor((end - startTime) / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Content Generator</CardTitle>
          <CardDescription>Add post ideas for the campaign: <b>{campaign.name}</b></CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button onClick={addPost} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add Post</Button>
          <Button onClick={() => addMultiplePosts(10)} variant="outline" size="sm">Add 10 Posts</Button>
          <Button onClick={() => addMultiplePosts(50)} variant="outline" size="sm">Add 50 Posts</Button>
        </CardContent>
      </Card>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
        {posts.map((post, index) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="font-medium">Post #{index + 1}</h3>
              <Button variant="ghost" size="icon" onClick={() => removePost(post.id)} disabled={posts.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Post title or main idea" value={post.title} onChange={(e) => updatePost(post.id, 'title', e.target.value)} />
              <Textarea placeholder="Brief description, keywords, or key points..." value={post.brief} onChange={(e) => updatePost(post.id, 'brief', e.target.value)} rows={2} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={startGeneration} disabled={isGenerating} size="lg">
          {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />Generate {posts.length} Posts</>}
        </Button>
      </div>

      {jobStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Progress</CardTitle>
            <CardDescription>Job ID: {jobId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={jobStatus.progress.percentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Status: <Badge variant="secondary" className='capitalize'>{jobStatus.status.replace('_', ' ')}</Badge></span>
              <span>Completed: {jobStatus.progress.completed}/{jobStatus.progress.total}</span>
              <span className="text-red-500">Failed: {jobStatus.progress.failed}</span>
            </div>
            <div className="text-right text-xs text-gray-400">
              {startTime && (
                <>Elapsed Time: <span className="font-mono">{getElapsedTime()}</span></>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}