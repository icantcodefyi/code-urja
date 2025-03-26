'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { 
  Video, AudioLines, Search, Filter, PlayCircle, PauseCircle,
  Download, Share2, MessageCircle, ThumbsUp, ThumbsDown, Clipboard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatarr";
import { getAvatarUrlFromEmail } from "~/utils/avatar";
import Image from "next/image";

// Mock media responses data
const mediaData = {
  video: [
    {
      id: "v123",
      candidateId: "c123",
      candidateName: "John Doe",
      candidateEmail: "johndoe@example.com",
      questionText: "Describe your experience with React and TypeScript. What are some best practices you follow?",
      videoUrl: "/video.mp4",
      transcription: "I have been working with React for over 5 years and TypeScript for 3 years. I believe in component-based architecture and always ensure my components are reusable and well-typed. For state management, I prefer using React Context for simpler applications and Redux for more complex ones. I always follow the principle of lifting state up when needed and try to keep components pure and focused on a single responsibility. For TypeScript, I use interfaces over types when possible and make sure to properly type all props and state.",
      duration: 95, // seconds
      createdAt: "2023-10-18T14:30:00Z",
      position: "Lead Frontend Developer",
      thumbnail: "/candidates/johndoe/video1_thumb.jpg",
    },
    {
      id: "v124",
      candidateId: "c124",
      candidateName: "Jane Smith",
      candidateEmail: "janesmith@example.com",
      questionText: "Tell us about a challenging project you worked on and how you approached it.",
      videoUrl: "/video.mp4",
      transcription: "One of the most challenging projects I worked on was a real-time dashboard for a financial services company. The challenge was handling large amounts of data while maintaining performance. I approached this by implementing data virtualization, efficient state management with Redux, and optimizing rendering cycles. I also used web workers for heavy calculations to keep the UI responsive. The project was successful, and the client saw a 40% improvement in dashboard loading time.",
      duration: 112, // seconds
      createdAt: "2023-10-16T10:45:00Z",
      position: "Lead Frontend Developer",
      thumbnail: "/candidates/janesmith/video1_thumb.jpg",
    },
    {
      id: "v125",
      candidateId: "c126",
      candidateName: "Emily Brown",
      candidateEmail: "emilyb@example.com",
      questionText: "How do you stay updated with the latest frontend technologies?",
      videoUrl: "/video.mp4",
      transcription: "I stay updated with the latest frontend technologies through a combination of methods. I follow several tech blogs and newsletters like JavaScript Weekly and React Status. I'm also active on Twitter where I follow influential developers in the React ecosystem. I regularly attend virtual meetups and occasionally conferences when possible. I also dedicate time each week to experiment with new libraries and techniques, and I contribute to open source when I can. This multifaceted approach helps me stay current with trends and best practices.",
      duration: 88, // seconds
      createdAt: "2023-10-18T09:15:00Z",
      position: "Lead Frontend Developer",
      thumbnail: "/candidates/emilyb/video1_thumb.jpg",
    },
  ],
  audio: [
    {
      id: "a123",
      candidateId: "c123",
      candidateName: "John Doe",
      candidateEmail: "johndoe@example.com",
      questionText: "Explain how you would optimize the performance of a React application.",
      audioUrl: "/audio.mp3",
      transcription: "For React performance optimization, I follow several strategies. First, I use React.memo for functional components that render often but with the same props. I also implement shouldComponentUpdate for class components. I avoid anonymous functions in render methods to prevent unnecessary re-renders. I use the useCallback and useMemo hooks to memoize functions and computed values. For large lists, I implement virtualization using libraries like react-window. I also code-split using React.lazy and Suspense to reduce the initial bundle size.",
      duration: 78, // seconds
      createdAt: "2023-10-18T14:40:00Z",
      position: "Lead Frontend Developer",
    },
    {
      id: "a124",
      candidateId: "c124",
      candidateName: "Jane Smith",
      candidateEmail: "janesmith@example.com",
      questionText: "Describe your experience with state management in React.",
      audioUrl: "/audio.mp3",
      transcription: "I have extensive experience with various state management solutions in React. I've worked with Redux for large-scale applications, and I find it excellent for complex state management with its predictable state container and powerful developer tools. For medium-sized applications, I often use the Context API combined with useReducer, which provides a simpler way to manage global state without the Redux boilerplate. For smaller applications or components with local state, I use useState hooks. I've also experimented with newer libraries like Recoil and Jotai, which offer atomic approach to state management.",
      duration: 92, // seconds
      createdAt: "2023-10-16T11:00:00Z",
      position: "Lead Frontend Developer",
    },
    {
      id: "a125",
      candidateId: "c127",
      candidateName: "David Wilson",
      candidateEmail: "davidw@example.com",
      questionText: "How do you handle error boundaries in React applications?",
      audioUrl: "/audio.mp3",
      transcription: "Error boundaries in React are components that catch JavaScript errors in their child component tree and display a fallback UI. I typically create a reusable ErrorBoundary component that wraps critical sections of my application. This component uses componentDidCatch lifecycle method to catch errors and update its state to render a fallback UI. I also log these errors to a monitoring service like Sentry. For asynchronous code and API calls, error boundaries don't catch those errors, so I use try/catch blocks and handle promise rejections appropriately. This approach provides a better user experience by preventing the entire application from crashing when errors occur.",
      duration: 65, // seconds
      createdAt: "2023-10-19T13:20:00Z",
      position: "Lead Frontend Developer",
    },
  ]
};

type PlayingState = Record<string, boolean>;

export default function MediaResponses() {
  const [tabValue, setTabValue] = useState("video");
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isPlaying, setIsPlaying] = useState<PlayingState>({});
  
  // Filter and sort media data
  const filteredVideoData = mediaData.video.filter(item => {
    return (
      item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transcription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  const filteredAudioData = mediaData.audio.filter(item => {
    return (
      item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transcription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  const togglePlayback = (id: string) => {
    setIsPlaying(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const copyTranscription = async (transcription: string) => {
    try {
      await navigator.clipboard.writeText(transcription);
      // Would normally add a toast notification here
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Media Responses</h1>
        <p className="text-muted-foreground">Review candidate video and audio responses with transcriptions</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find responses by candidate name, question content, or transcription text</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media responses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={sortOrder} 
                onValueChange={setSortOrder}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Responses ({mediaData.video.length})
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <AudioLines className="h-4 w-4" />
            Audio Responses ({mediaData.audio.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="space-y-6">
          {filteredVideoData.length > 0 ? (
            filteredVideoData.map((video) => (
              <Card key={video.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <Avatar>
                          <AvatarImage src={getAvatarUrlFromEmail(video.candidateEmail)} alt={video.candidateName} />
                          <AvatarFallback>{video.candidateName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-1">
                          {video.candidateName}
                          <span className="text-xs text-muted-foreground ml-1">
                            for {video.position}
                          </span>
                        </CardTitle>
                        <CardDescription>{video.candidateEmail}</CardDescription>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(video.createdAt).toLocaleString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm font-medium mb-2">
                    Q: {video.questionText}
                  </div>
                  
                  <div className="relative aspect-video bg-black/5 rounded-lg overflow-hidden">
                    {!isPlaying[video.id] ? (
                      <Image 
                        src={video.thumbnail || "/assets/video_banner.png"} 
                        alt="Video thumbnail" 
                        fill 
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <video 
                        src={video.videoUrl} 
                        className="w-full h-full object-cover"
                        autoPlay
                        controls
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full h-12 w-12 bg-white/80"
                        onClick={() => togglePlayback(video.id)}
                      >
                        {isPlaying[video.id] ? (
                          <PauseCircle className="h-8 w-8" />
                        ) : (
                          <PlayCircle className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white flex justify-between items-center">
                      <div className="text-sm font-medium">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-white hover:text-white hover:bg-white/20">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-white hover:text-white hover:bg-white/20">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Dislike
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium">Transcription</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7"
                              onClick={() => copyTranscription(video.transcription)}
                            >
                              <Clipboard className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{video.transcription}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm">
                      View Candidate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <Video className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No video responses found</h3>
              <p className="text-muted-foreground mb-4">Try changing your search criteria</p>
              {searchQuery && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-6">
          {filteredAudioData.length > 0 ? (
            filteredAudioData.map((audio) => (
              <Card key={audio.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <Avatar>
                          <AvatarImage src={getAvatarUrlFromEmail(audio.candidateEmail)} alt={audio.candidateName} />
                          <AvatarFallback>{audio.candidateName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-1">
                          {audio.candidateName}
                          <span className="text-xs text-muted-foreground ml-1">
                            for {audio.position}
                          </span>
                        </CardTitle>
                        <CardDescription>{audio.candidateEmail}</CardDescription>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(audio.createdAt).toLocaleString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm font-medium mb-2">
                    Q: {audio.questionText}
                  </div>
                  
                  <div className="flex items-center gap-3 h-16 border rounded-md p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => togglePlayback(audio.id)}
                    >
                      {isPlaying[audio.id] ? (
                        <PauseCircle className="h-6 w-6" />
                      ) : (
                        <PlayCircle className="h-6 w-6" />
                      )}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="w-full h-8">
                        <div className="w-full h-full flex items-center gap-0.5">
                          {Array.from({length: 50}).map((_, i) => (
                            <div 
                              key={i} 
                              className="bg-primary/60 w-1 rounded-full"
                              style={{height: `${Math.random() * 100}%`}}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(audio.duration / 60)}:{String(audio.duration % 60).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium">Transcription</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7"
                              onClick={() => copyTranscription(audio.transcription)}
                            >
                              <Clipboard className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{audio.transcription}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm">
                      View Candidate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <AudioLines className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No audio responses found</h3>
              <p className="text-muted-foreground mb-4">Try changing your search criteria</p>
              {searchQuery && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 