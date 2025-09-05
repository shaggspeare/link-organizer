'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, User, Hash, Trash2, Copy } from "lucide-react";
import { useState } from "react";

interface LinkDetailModalProps {
  link: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function LinkDetailModal({ link, open, onOpenChange, onDelete }: LinkDetailModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!link) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(link._id);
      onOpenChange(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">{link.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          {link.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <img
                src={link.imageUrl}
                alt={link.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* URL and Actions */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1 text-sm text-muted-foreground break-all">
              {link.url}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              className="shrink-0"
            >
              <Copy className="h-4 w-4 mr-1" />
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="shrink-0"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit
              </a>
            </Button>
          </div>

          {/* Status and Category */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge 
              variant={
                link.status === 'COMPLETED' ? 'default' :
                link.status === 'PROCESSING' ? 'secondary' : 
                'destructive'
              }
            >
              {link.status}
            </Badge>
            
            {link.category && link.status === 'COMPLETED' && (
              <Badge variant="outline">
                {link.category}
              </Badge>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(link.createdAt)}
            </div>
          </div>

          {/* AI Summary */}
          {link.aiSummary && link.status === 'COMPLETED' && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center">
                <Hash className="h-4 w-4 mr-1" />
                AI Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {link.aiSummary}
              </p>
            </div>
          )}

          {/* Description */}
          {link.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {link.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {link.tags && link.tags.length > 0 && link.status === 'COMPLETED' && (
            <div className="space-y-2">
              <h3 className="font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {link.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {link.metadata && link.status === 'COMPLETED' && (
            <div className="space-y-3">
              <h3 className="font-semibold">Additional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {link.metadata.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Author:</span>
                    <span className="ml-1 font-medium">{link.metadata.author}</span>
                  </div>
                )}
                {link.metadata.publishedDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Published:</span>
                    <span className="ml-1 font-medium">
                      {new Date(link.metadata.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {link.domain && (
                  <div className="flex items-center col-span-full">
                    <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Domain:</span>
                    <span className="ml-1 font-medium">{link.domain}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete Button */}
          {onDelete && (
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}