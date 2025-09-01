import React, { useState } from 'react';
import { ArrowLeft, Play, Download, Image, ThumbsUp, ThumbsDown } from 'lucide-react';

interface MapPageProps {
  map: {
    name: string;
    image: string;
    description: string;
    status: string;
    genre: string;
    lastUpdated: string;
    features: string[];
    details: string;
  };
  onBack: () => void;
}

export function MapPage({ map, onBack }: MapPageProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    profilePic: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Using placeholder data as requested
  const screenshots = [
    'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png',
    'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png',
    'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png',
    'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png',
    'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png',
    'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png'
  ];

  const trailerUrl = 'https://raw.githubusercontent.com/GHASTBOT/error404/refs/heads/main/ghastbanner.png';

  // Sample reviews with custom profile pics and names
  const [reviews, setReviews] = useState<any[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/20';
      case 'Beta Testing': return 'text-yellow-400 bg-yellow-400/20';
      case 'Coming Soon': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const review = {
      id: reviews.length + 1,
      name: newReview.name,
      profilePic: newReview.profilePic || 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/error404logo.png',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '', profilePic: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-5 h-5 rounded border-2 cursor-pointer ${
              star <= rating 
                ? 'bg-yellow-400 border-yellow-400' 
                : 'bg-transparent border-zinc-600'
            } ${interactive ? 'hover:border-yellow-300' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          >
            {star <= rating && <div className="w-full h-full bg-yellow-400 rounded-sm" />}
          </div>
        ))}
      </div>
    );
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Realms
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={map.image}
          alt={map.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(map.status)}`}>
                {map.status}
              </span>
              <span className="text-zinc-400">{map.genre}</span>
              <div className="flex items-center gap-2">
                {reviews.length > 0 ? (
                  <>
                    {renderStars(Math.round(averageRating))}
                    <span className="text-zinc-300">({reviews.length} reviews)</span>
                  </>
                ) : (
                  <>
                    {renderStars(0)}
                    <span className="text-zinc-300">(No reviews)</span>
                  </>
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{map.name}</h1>
            <p className="text-xl text-zinc-300 max-w-3xl">{map.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Overview Section */}
            <section id="overview">
              <div className="bedrock-card p-8">
                <h2 className="text-3xl font-bold mb-6">Overview</h2>
                <p className="text-zinc-300 leading-relaxed mb-8 text-lg">{map.details}</p>
                
                <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {map.features.map((feature, index) => (
                    <div key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                      <span className="text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* System Requirements */}
                <div className="mt-8 p-6 bg-zinc-800/30 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-zinc-300 mb-2">Minecraft Version</h4>
                      <p className="text-zinc-400">Java Edition 1.20+</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-300 mb-2">Players</h4>
                      <p className="text-zinc-400">1-4 players recommended</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-300 mb-2">Difficulty</h4>
                      <p className="text-zinc-400">Medium</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trailer Section */}
            <section id="trailer">
              <div className="bedrock-card p-8">
                <h2 className="text-3xl font-bold mb-6">Map Trailer</h2>
                <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-6">
                  <img 
                    src={trailerUrl}
                    alt={`${map.name} Trailer`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bedrock-button rounded-full p-6 hover:scale-110 transition-transform">
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Official {map.name} Trailer</h3>
                  <p className="text-zinc-400">Get a preview of what awaits you in this exciting map!</p>
                </div>
              </div>
            </section>

            {/* Screenshots Section */}
            <section id="screenshots">
              <div className="bedrock-card p-8">
                <h2 className="text-3xl font-bold mb-6">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {screenshots.map((screenshot, index) => (
                    <div 
                      key={index}
                      className="relative overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform group"
                      onClick={() => setSelectedScreenshot(index)}
                    >
                      <img 
                        src={screenshot}
                        alt={`${map.name} Screenshot ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Image className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews">
              <div className="bedrock-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Reviews</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {reviews.length > 0 ? (
                          <>
                            {renderStars(Math.round(averageRating))}
                            <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
                          </>
                        ) : (
                          <>
                            {renderStars(0)}
                            <span className="text-xl font-semibold text-zinc-500">No ratings yet</span>
                          </>
                        )}
                      </div>
                      <span className="text-zinc-400">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bedrock-button"
                  >
                    Write Review
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-zinc-800/30 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
                    
                    {/* Name and Profile Picture in a row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Profile Picture URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={newReview.profilePic}
                          onChange={(e) => setNewReview({...newReview, profilePic: e.target.value})}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors"
                          placeholder="https://example.com/avatar.png"
                        />
                      </div>
                    </div>
                    
                    {/* Rating section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-zinc-300 mb-3">
                        Rating *
                      </label>
                      <div className="flex items-center gap-3">
                        {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                        <span className="text-zinc-400">({newReview.rating} out of 5 stars)</span>
                      </div>
                    </div>
                    
                    {/* Review text area */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Your Review *
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 transition-colors resize-vertical"
                        placeholder="Share your thoughts about this map..."
                        required
                      />
                    </div>
                    
                    {/* Form buttons */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bedrock-button flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bedrock-button flex-1"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 bg-zinc-800/30 rounded-lg">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.profilePic}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-white">{review.name}</h4>
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-zinc-400">({review.rating}/5)</span>
                              </div>
                            </div>
                            <span className="text-sm text-zinc-400">{review.date}</span>
                          </div>
                          <p className="text-zinc-300 mb-4 leading-relaxed">{review.comment}</p>
                          <div className="flex items-center gap-4">
                            <button className="text-zinc-400 hover:text-green-400 transition-colors text-sm">
                              Helpful ({review.helpful})
                            </button>
                            <button className="text-zinc-400 hover:text-red-400 transition-colors text-sm">
                              Not Helpful ({review.notHelpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-zinc-300 mb-2">No reviews yet</h3>
                    <p className="text-zinc-400 mb-6">Be the first to share your thoughts about this map!</p>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bedrock-button"
                    >
                      Write First Review
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download/Play Button */}
            <div className="bedrock-card p-6">
              <button className="bedrock-button w-full mb-4">
                Download Map
              </button>
              <button className="bedrock-button w-full">
                Watch Trailer
              </button>
            </div>

            {/* Map Info */}
            <div className="bedrock-card p-6">
              <h3 className="text-lg font-bold mb-4">Map Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(map.status)}`}>
                    {map.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Genre</span>
                  <span className="text-white">{map.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Last Updated</span>
                  <span className="text-white">{map.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Average Rating</span>
                  {reviews.length > 0 ? (
                    <span className="text-white">{averageRating.toFixed(1)}/5</span>
                  ) : (
                    <span className="text-zinc-500">No ratings</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">File Size</span>
                  <span className="text-white">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bedrock-card p-6">
              <h3 className="text-lg font-bold mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                <a href="#overview" className="block text-zinc-300 hover:text-white transition-colors py-1">Overview</a>
                <a href="#trailer" className="block text-zinc-300 hover:text-white transition-colors py-1">Trailer</a>
                <a href="#screenshots" className="block text-zinc-300 hover:text-white transition-colors py-1">Screenshots</a>
                <a href="#reviews" className="block text-zinc-300 hover:text-white transition-colors py-1">Reviews</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot !== null && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={screenshots[selectedScreenshot]}
              alt={`${map.name} Screenshot ${selectedScreenshot + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-zinc-300 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}