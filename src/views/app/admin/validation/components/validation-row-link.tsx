import React from 'react';
import Link from 'next/link';
import { Card, Badge, CardContent } from "public/src/components/ui"; 
import { cn } from 'public/src/lib'; 
import { getOfferTypeDisplay } from 'public/src/lib'; 
import { OfferForAdmin, ValidationItemFull } from 'public/src/models/responses/publication'; 

interface ValidationRowLinkProps {
    itemId: string;
    item: OfferForAdmin; 
}

export default function ValidationRowLink({ itemId, item }: ValidationRowLinkProps) {
    const { text, className: badgeClasses } = getOfferTypeDisplay(item.type);
    
    const detailUrl = `/admin/publications/validate/${itemId}`; 

    return (
        <Link 
            href={detailUrl} 
            className="group block w-full focus:outline-none transition-all"
        >
            <Card 
                className={cn( 
                    "flex flex-col sm:flex-row items-center justify-between p-4 transition-colors duration-200",
                    "border border-border bg-card",
                    "hover:border-primary/50 hover:shadow-md hover:bg-muted/50"
                )}
            >
                <CardContent className="flex-1 min-w-0 p-0 sm:pr-4">
                    <h3 
                        className={cn(
                            "font-semibold text-lg truncate text-foreground",
                            "group-hover:text-primary transition duration-150"
                        )}
                    >
                        {item.title}
                    </h3>
                </CardContent>

                <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0">
                    <Badge 
                        variant="default" 
                        className={cn(
                            "text-sm font-semibold", 
                            badgeClasses 
                        )}
                    >
                        {text}
                    </Badge>
                </div>
            </Card>
        </Link>
    );
}