import { Link } from 'react-router-dom';
import { Heart, Star, Clock, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Cake } from '@/data/dummy';

interface CakeCardProps {
  cake: Cake;
}

const CakeCard = ({ cake }: CakeCardProps) => {
  return (
    <Card className="card-product group" key={cake.id}>
      <div className="relative overflow-hidden">
        <img
          src={cake.images[0]}
          alt={cake.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {cake.featured && (
            <Badge variant="destructive" className="text-xs">
              Featured
            </Badge>
          )}
          {cake.bestseller && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">
              Bestseller
            </Badge>
          )}
          {!cake.inStock && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
        
        {/* Quick Add to Cart */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="w-full btn-hero">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Category */}
          <div className="text-xs text-muted-foreground font-medium">
            {cake.category}
          </div>
          
          {/* Name */}
          <Link to={`/cakes/${cake.id}`}>
            <h3 className="text-display font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
              {cake.name}
            </h3>
          </Link>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {cake.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {cake.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Rating & Delivery */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{cake.rating}</span>
              <span className="text-muted-foreground">({cake.reviews.length})</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{cake.deliveryTime}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">
                ₹{cake.price.toLocaleString()}
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/cakes/${cake.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CakeCard;