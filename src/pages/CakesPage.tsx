import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import CakeCard from '@/components/CakeCard';
import { categoriesEnum, dummyCakes } from '@/data/dummy';
import { Label } from '@/components/ui/label';

const CakesPage = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<categoriesEnum | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating' | 'newest'>('popular');

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState<string>('all');
  const categories = Object.values(categoriesEnum);

  // Get all unique tags from cakes
  const allTags = Array.from(new Set(dummyCakes.flatMap(cake => cake.tags)));

  // Get all unique delivery times
  const allDeliveryTimes = Array.from(new Set(dummyCakes.map(cake => cake.deliveryTime)));

  // Filter function
  const filteredCakes = dummyCakes.filter(cake => {
    // Basic filters
    const matchesSearch = searchTerm === '' ||
      cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cake.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || cake.category === selectedCategory;
    const matchesPrice = cake.price >= priceRange[0] && cake.price <= priceRange[1];

    // Advanced filters
    const matchesTags = !showAdvancedFilters || selectedTags.length === 0 ||
      selectedTags.some(tag => cake.tags.includes(tag));
    const matchesStock = !showAdvancedFilters || !inStockOnly || cake.inStock;
    const matchesFeatured = !showAdvancedFilters || !featuredOnly || cake.featured;
    const matchesBestseller = !showAdvancedFilters || !bestsellerOnly || cake.bestseller;
    const matchesRating = !showAdvancedFilters || cake.rating >= minRating;
    const matchesDeliveryTime = !showAdvancedFilters || deliveryTime === 'all' || cake.deliveryTime === deliveryTime;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesTags &&
      matchesStock &&
      matchesFeatured &&
      matchesBestseller &&
      matchesRating &&
      matchesDeliveryTime
    );
  });

  // Sort function
  const sortedCakes = [...filteredCakes].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      default: return b.reviews.length - a.reviews.length;
    }
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSelectedTags([]);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setBestsellerOnly(false);
    setMinRating(0);
    setDeliveryTime('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm ||
    selectedCategory !== 'all' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000 ||
    (showAdvancedFilters && (
      selectedTags.length > 0 ||
      inStockOnly ||
      featuredOnly ||
      bestsellerOnly ||
      minRating > 0 ||
      deliveryTime !== 'all'
    ));

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Cake Collection</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover our complete range of handcrafted cakes for every occasion
          </p>
        </div>

        {/* Search and Basic Filters */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cakes by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <Select
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={selectedCategory as any}
                  onValueChange={(value: string) => setSelectedCategory(value as categoriesEnum | 'all')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(categoriesEnum).map((category) => (
                      <SelectItem
                        key={category}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value={category as any}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="h-10"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Sort By */}
              <Select
                value={sortBy}
                onValueChange={(value: "popular" | "price-low" | "price-high" | "rating" | "newest") => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expand/Collapse Advanced Filters */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Advanced Filters
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Advanced Filters
                </>
              )}
            </Button>

            {/* Advanced Filters (Collapsible) */}
            {showAdvancedFilters && (
              <div className="space-y-6 pt-4 border-t">
                {/* Rating Filter */}
                <div className="space-y-2">
                  <Label>Minimum Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-5 w-5 cursor-pointer ${star <= minRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          }`}
                        onClick={() => setMinRating(star)}
                      />
                    ))}
                    {minRating > 0 && (
                      <button
                        className="ml-2 text-sm text-muted-foreground"
                        onClick={() => setMinRating(0)}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Time */}
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Delivery Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Delivery Time</SelectItem>
                    {allDeliveryTimes.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Checkbox Filters */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={inStockOnly ? 'default' : 'outline'}
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className="flex items-center gap-2"
                  >
                    <span>In Stock Only</span>
                    {inStockOnly && <span className="text-xs">✓</span>}
                  </Button>

                  <Button
                    variant={featuredOnly ? 'default' : 'outline'}
                    onClick={() => setFeaturedOnly(!featuredOnly)}
                    className="flex items-center gap-2"
                  >
                    <span>Featured</span>
                    {featuredOnly && <span className="text-xs">✓</span>}
                  </Button>

                  <Button
                    variant={bestsellerOnly ? 'default' : 'outline'}
                    onClick={() => setBestsellerOnly(!bestsellerOnly)}
                    className="flex items-center gap-2"
                  >
                    <span>Bestsellers</span>
                    {bestsellerOnly && <span className="text-xs">✓</span>}
                  </Button>
                </div>

                {/* Tags Filter */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {selectedTags.length > 0 && (
                      <button
                        className="text-sm text-muted-foreground ml-2"
                        onClick={() => setSelectedTags([])}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground mr-2">Active filters:</p>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center">
                    Search: {searchTerm}
                    <button
                      className="ml-1 text-xs"
                      onClick={() => setSearchTerm('')}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center">
                    Category: {selectedCategory}
                    <button
                      className="ml-1 text-xs"
                      onClick={() => setSelectedCategory('all')}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                  <Badge variant="secondary" className="flex items-center">
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    <button
                      className="ml-1 text-xs"
                      onClick={() => setPriceRange([0, 10000])}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {showAdvancedFilters && (
                  <>
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center">
                        Tag: {tag}
                        <button
                          className="ml-1 text-xs"
                          onClick={() => toggleTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {inStockOnly && (
                      <Badge variant="secondary" className="flex items-center">
                        In Stock
                        <button
                          className="ml-1 text-xs"
                          onClick={() => setInStockOnly(false)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {featuredOnly && (
                      <Badge variant="secondary" className="flex items-center">
                        Featured
                        <button
                          className="ml-1 text-xs"
                          onClick={() => setFeaturedOnly(false)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {bestsellerOnly && (
                      <Badge variant="secondary" className="flex items-center">
                        Bestseller
                        <button
                          className="ml-1 text-xs"
                          onClick={() => setBestsellerOnly(false)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {minRating > 0 && (
                      <Badge variant="secondary" className="flex items-center">
                        Rating: {minRating}+
                        <button
                          className="ml-1 text-xs"
                          onClick={() => setMinRating(0)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {deliveryTime !== 'all' && (
                      <Badge variant="secondary" className="flex items-center">
                        Delivery: {deliveryTime}
                        <button
                          className="ml-1 text-xs"
                          onClick={() => setDeliveryTime('all')}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="ml-auto"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedCakes.length} {sortedCakes.length === 1 ? 'cake' : 'cakes'}
            {filteredCakes.length < dummyCakes.length && ` (filtered from ${dummyCakes.length})`}
          </p>
        </div>

        {/* Cakes Grid */}
        {sortedCakes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🍰</div>
                <h3 className="text-xl font-semibold">No cakes match your filters</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse our full collection
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Reset All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CakesPage;