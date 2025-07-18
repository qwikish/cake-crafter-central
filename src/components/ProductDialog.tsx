import { useCallback, useEffect, useState } from 'react';
import { Star, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Cake } from '@/data/dummy';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import type { EmblaCarouselType } from 'embla-carousel';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cake: Cake | null;
}

export const ProductDialog = ({ open, onOpenChange, cake }: ProductDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const { toast } = useToast();

  const weights = ['500g', '1kg', '1.5kg', '2kg'];

  // Auto slide effect
  useEffect(() => {
    if (!api || !open) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [api, open]);

  const onSelectImage = useCallback((index: number) => {
    setSelectedImageIndex(index);
    api?.scrollTo(index);
  }, [api]);

  const handleAddToCart = useCallback(() => {
    toast({
      title: "Added to cart!",
      description: `${cake?.name} has been added to your cart.`,
    });
    onOpenChange(false);
  }, [cake?.name, onOpenChange, toast]);

  const handleBuyNow = useCallback(() => {
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to the checkout page...",
    });
    onOpenChange(false);
    window.location.href = '/checkout';
  }, [onOpenChange, toast]);

  if (!cake) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              {/* Main Carousel */}
              <Carousel
                setApi={setApi}
                className="relative w-full rounded-lg overflow-hidden mb-4"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {cake.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square">
                        <img
                          src={image}
                          alt={`${cake.name} ${index + 1}`}
                          className="w-full h-80 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2" />
              </Carousel>

              {cake.bestseller && (
                <Badge className="absolute top-3 left-3 bg-orange-500">
                  Bestseller
                </Badge>
              )}
              {cake.featured && (
                <Badge className="absolute top-3 right-3 bg-purple-500">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl">{cake.name}</DialogTitle>
            </DialogHeader>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(cake.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {cake.rating} ({cake.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ₹{cake.price}
              </span>
              {cake.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{cake.price + 100}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {cake.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{cake.description}</p>
            </div>

            {/* Weight Selection */}
            <div>
              <Label className="text-sm font-medium">Weight</Label>
              <div className="flex gap-2 mt-2">
                {weights.map((weight) => (
                  <Button
                    key={weight}
                    variant={selectedWeight === weight ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <Label htmlFor="message" className="text-sm font-medium">
                Custom Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal message for the cake..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Quantity:</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} className="flex-1">
                Buy Now
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};