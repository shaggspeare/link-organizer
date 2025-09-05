'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Trash2 } from 'lucide-react';

interface LinkCardProps {
  link: any;
  onDelete?: (id: string) => void;
  onClick?: (link: any) => void;
}

export default function LinkCard({ link, onDelete, onClick }: LinkCardProps) {
  const isProcessing = link.status === 'PROCESSING';
  const isFailed = link.status === 'FAILED';
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(link._id);
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCardClick = () => {
    if (onClick && !isProcessing) {
      onClick(link);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Image */}
      {link.imageUrl ? (
        <div className="relative h-48 bg-muted overflow-hidden">
          <img
            src={link.imageUrl}
            alt={link.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
          <span className="text-4xl">🔗</span>
        </div>
      )}
      
      <CardContent className="p-4">
        {isProcessing ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Processing link...</span>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Title */}
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {link.title}
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
              {link.aiSummary || link.description}
            </p>
            
            {/* Category */}
            {!isFailed && link.category && (
              <Badge variant="secondary" className="mb-3">
                {link.category}
              </Badge>
            )}
            
            {/* Tags */}
            {!isFailed && link.tags && link.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {link.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {link.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{link.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs p-0 h-auto font-medium text-muted-foreground hover:text-primary"
                asChild
                onClick={handleExternalClick}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  {link.domain}
                </a>
              </Button>
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}