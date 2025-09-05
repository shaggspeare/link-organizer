'use client';

import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import LinkCard from './LinkCard';
import LinkInput from './LinkInput';
import LinkDetailModal from '@/components/LinkDetailModal';
import { Loader2, Package } from 'lucide-react';

export default function MasonryGrid() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAdded = (newLink: any) => {
    setLinks(prev => [newLink, ...prev]);
    
    // If link is processing, poll for updates
    if (newLink.status === 'PROCESSING') {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch('/api/links');
          const allLinks = await response.json();
          const updatedLink = allLinks.find((l: any) => l._id === newLink._id);
          
          if (updatedLink && updatedLink.status !== 'PROCESSING') {
            setLinks(prev => prev.map(l => 
              l._id === updatedLink._id ? updatedLink : l
            ));
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Failed to poll for updates:', error);
          clearInterval(pollInterval);
        }
      }, 2000);
      
      // Clear interval after 30 seconds
      setTimeout(() => clearInterval(pollInterval), 30000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
      setLinks(prev => prev.filter(link => link._id !== id));
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const handleCardClick = (link: any) => {
    setSelectedLink(link);
    setModalOpen(true);
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <LinkInput onLinkAdded={handleLinkAdded} />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No links saved yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start building your link collection by adding your first link above. 
                Our AI will automatically categorize and tag it for you!
              </p>
            </div>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {links.map((link) => (
              <div key={link._id} className="mb-4">
                <LinkCard 
                  link={link} 
                  onDelete={handleDelete}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </Masonry>
        )}
      </div>

      <LinkDetailModal
        link={selectedLink}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onDelete={handleDelete}
      />
    </>
  );
}