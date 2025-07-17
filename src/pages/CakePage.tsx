import { Star, Heart, Minus, Plus, ShoppingCart, ChevronLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { dummyCakes } from '@/data/dummy';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CakeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [customMessage, setCustomMessage] = useState('');
    const [selectedWeight, setSelectedWeight] = useState('1kg');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
    });

    const cake = dummyCakes.find(cake => cake.id === id);

    const weights = ['500g', '1kg', '1.5kg', '2kg'];

    const handleAddToCart = () => {
        toast({
            title: "Added to cart!",
            description: `${cake?.name} has been added to your cart.`,
        });
    };

    const handleBuyNow = () => {
        toast({
            title: "Redirecting to checkout",
            description: "Taking you to the checkout page...",
        });
        navigate('/checkout');
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would submit this to your backend
        toast({
            title: "Review submitted!",
            description: "Thank you for your feedback.",
        });
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '' });
    };

    if (!cake) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Cake not found</h2>
                <Button onClick={() => navigate('/cakes')}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Cakes
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6"
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                        <Carousel className="w-full h-full">
                            <CarouselContent>
                                {cake.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <img
                                            src={image}
                                            alt={`${cake.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                        </Carousel>

                        <div className="absolute top-4 left-4 flex gap-2">
                            {cake.bestseller && (
                                <Badge className="bg-orange-500">Bestseller</Badge>
                            )}
                            {cake.featured && (
                                <Badge className="bg-purple-500">Featured</Badge>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="grid grid-cols-4 gap-2">
                        {cake.images.map((image, index) => (
                            <button
                                key={index}
                                className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${selectedImageIndex === index
                                        ? 'border-primary'
                                        : 'border-transparent'
                                    }`}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{cake.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
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
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-primary">
                            ₹{cake.price}
                        </span>
                        {cake.price && (
                            <span className="text-lg text-muted-foreground line-through">
                                ₹{cake.price * 1.2}
                            </span>
                        )}
                    </div>

                    <p className="text-base text-muted-foreground">{cake.description}</p>

                    <Separator />

                    {/* Weight Selection */}
                    <div>
                        <Label className="text-sm font-medium">Weight</Label>
                        <div className="flex gap-2 mt-2 flex-wrap">
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

                    {/* Additional Info */}
                    <div className="pt-6 space-y-4">
                        <div>
                            <h3 className="font-medium">Ingredients</h3>
                            <p className="text-sm text-muted-foreground">
                                {cake.ingredients || 'Fresh eggs, premium flour, quality butter, natural flavors'}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium">Delivery Info</h3>
                            <p className="text-sm text-muted-foreground">
                                {cake.deliveryInfo || 'Free delivery on orders over ₹1000. Next-day delivery available.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <Separator className="my-8" />

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(cake.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-muted-foreground">
                                {cake.rating} average • {cake.reviews.length} reviews
                            </span>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {cake.reviews.filter(review => review.approved).map(review => (
                            <div key={review.id} className="border rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={`/avatars/${review.userId}.jpg`} />
                                        <AvatarFallback>
                                            {review.userName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{review.userName}</h4>
                                            {review.featured && (
                                                <Badge variant="secondary">Featured</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-xs text-muted-foreground ml-1">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-2">{review.comment}</p>

                                        {/* Review Images */}
                                        {review.images && review.images.length > 0 && (
                                            <div className="flex gap-2 mt-4">
                                                {review.images.map((image, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={image}
                                                        alt={`Review ${idx + 1}`}
                                                        className="h-20 w-20 object-cover rounded-md"
                                                        loading="lazy"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CakeDetailsPage;