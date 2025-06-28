import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Search,
  Menu,
  X,
  Zap,
  Shield,
  Award,
  Truck,
  Mail,
  Phone,
  MapPin,
  Play,
  Users,
  TrendingUp,
  Clock,
  Gift,
  Sparkles,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isPreOrder?: boolean;
  discount?: number;
  stock: number;
  category?: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
  description?: string;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  badge?: string;
}

function HomeCustomer() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });
  const [email, setEmail] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    features: false,
    categories: false,
    products: false,
  });

  // Enhanced mock data
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "RG 1/144 Strike Freedom Gundam",
      price: 1250000,
      originalPrice: 1450000,
      image:
        "https://images.pexels.com/photos/6686442/pexels-photo-6686442.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      reviews: 324,
      isNew: true,
      discount: 14,
      stock: 12,
      category: "Real Grade",
    },
    {
      id: 2,
      name: "MG 1/100 Barbatos Lupus Rex",
      price: 2100000,
      image:
        "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.9,
      reviews: 156,
      stock: 8,
      category: "Master Grade",
    },
    {
      id: 3,
      name: "PG 1/60 Unicorn Gundam",
      price: 4500000,
      image:
        "https://images.pexels.com/photos/6686449/pexels-photo-6686449.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 5.0,
      reviews: 89,
      isPreOrder: true,
      stock: 0,
      category: "Perfect Grade",
    },
    {
      id: 4,
      name: "HG 1/144 Gundam Aerial",
      price: 850000,
      originalPrice: 950000,
      image:
        "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7,
      reviews: 203,
      discount: 11,
      stock: 25,
      category: "High Grade",
    },
    {
      id: 5,
      name: "RG 1/144 Nu Gundam",
      price: 1800000,
      image:
        "https://images.pexels.com/photos/6686442/pexels-photo-6686442.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.9,
      reviews: 178,
      isNew: true,
      stock: 15,
      category: "Real Grade",
    },
    {
      id: 6,
      name: "MG 1/100 Freedom Gundam 2.0",
      price: 2350000,
      originalPrice: 2650000,
      image:
        "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.8,
      reviews: 267,
      discount: 11,
      stock: 7,
      category: "Master Grade",
    },
  ];

  const categories: Category[] = [
    {
      id: 1,
      name: "Real Grade",
      image:
        "https://images.pexels.com/photos/6686442/pexels-photo-6686442.jpeg?auto=compress&cs=tinysrgb&w=400",
      count: 45,
      description: "1/144 scale with incredible detail",
    },
    {
      id: 2,
      name: "Master Grade",
      image:
        "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=400",
      count: 78,
      description: "1/100 scale with inner frame",
    },
    {
      id: 3,
      name: "Perfect Grade",
      image:
        "https://images.pexels.com/photos/6686449/pexels-photo-6686449.jpeg?auto=compress&cs=tinysrgb&w=400",
      count: 23,
      description: "1/60 scale ultimate experience",
    },
    {
      id: 4,
      name: "High Grade",
      image:
        "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400",
      count: 156,
      description: "1/144 scale perfect for beginners",
    },
  ];

  const heroSlides: HeroSlide[] = [
    {
      title: "Strike Freedom",
      subtitle: "Ultimate Gundam Experience",
      description:
        "Experience the pinnacle of mobile suit technology with highly detailed Real Grade kits featuring advanced articulation and premium finish.",
      image:
        "https://images.pexels.com/photos/6686442/pexels-photo-6686442.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Shop Now",
      badge: "NEW ARRIVAL",
    },
    {
      title: "Barbatos Lupus",
      subtitle: "Iron-Blooded Orphans",
      description:
        "Relive the epic battles with Master Grade precision and articulation. Complete with weapon accessories and detailed inner frame.",
      image:
        "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Explore",
      badge: "BEST SELLER",
    },
    {
      title: "Unicorn Destroy",
      subtitle: "Perfect Grade Excellence",
      description:
        "The ultimate collector's piece with LED unit and premium details. Transform between Unicorn and Destroy modes.",
      image:
        "https://images.pexels.com/photos/6686449/pexels-photo-6686449.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Pre-Order",
      badge: "LIMITED EDITION",
    },
  ];

  // Enhanced effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Intersection observer for animations
      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          el.classList.add("animate-in");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    // Add success animation here
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Enhanced Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        {/* Enhanced Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100">
            <div className="px-4 py-6 space-y-4">
              {["Home", "Products", "Categories", "About", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300 font-medium"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={{
                  transform: `translateY(${scrollY * 0.3}px) scale(${
                    1 + scrollY * 0.0001
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-full transition-all duration-300 group"
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-full transition-all duration-300 group"
        >
          <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-3">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-300 font-medium tracking-wide">
                    {heroSlides[currentSlide].badge}
                  </span>
                </div>

                <div className="space-y-6">
                  <p className="text-blue-400 font-semibold text-lg tracking-wide uppercase animate-fade-in-up">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <h1 className="text-6xl md:text-8xl font-black text-white leading-none animate-fade-in-up animation-delay-200">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl animate-fade-in-up animation-delay-400">
                    {heroSlides[currentSlide].description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
                  <button className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center">
                    {heroSlides[currentSlide].cta}
                    <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center">
                    <Play className="mr-3 h-6 w-6" />
                    Watch Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 h-3 bg-white rounded-full"
                  : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Enhanced Scroll indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/70 rounded-full flex justify-center p-2">
            <div className="w-1 h-4 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our premium service and authentic
              products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "On orders over 1,000,000 VND",
                color: "blue",
                delay: "0",
              },
              {
                icon: Shield,
                title: "Authentic Products",
                description: "100% genuine Bandai kits",
                color: "green",
                delay: "100",
              },
              {
                icon: Award,
                title: "Premium Quality",
                description: "Carefully inspected items",
                color: "purple",
                delay: "200",
              },
              {
                icon: Zap,
                title: "Fast Delivery",
                description: "2-3 days nationwide shipping",
                color: "orange",
                delay: "300",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 animate-fade-in-up`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div
                  className={`bg-${feature.color}-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-${feature.color}-100 transition-all duration-300 group-hover:scale-110`}
                >
                  <feature.icon
                    className={`h-10 w-10 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
        data-animate
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Shop by Grade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our extensive collection of Gundam model kits across all
              grades, from beginner-friendly to expert level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-bold text-gray-800">
                      {category.count}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    {category.description}
                  </p>
                  <button className="group/btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center">
                    View Collection
                    <ChevronRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Flash Sale Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Zap className="h-12 w-12 mr-4 animate-pulse text-yellow-300" />
              <h2 className="text-6xl font-black">Flash Sale</h2>
              <Zap className="h-12 w-12 ml-4 animate-pulse text-yellow-300" />
            </div>
            <p className="text-2xl opacity-90 mb-12 font-medium">
              Limited time offers - Don't miss out on these incredible deals!
            </p>

            {/* Enhanced Countdown Timer */}
            <div className="flex justify-center items-center space-x-6 mb-12">
              {[
                { value: timeLeft.hours, label: "HOURS" },
                { value: timeLeft.minutes, label: "MINUTES" },
                { value: timeLeft.seconds, label: "SECONDS" },
              ].map((time, index) => (
                <React.Fragment key={time.label}>
                  <div className="text-center group">
                    <div className="bg-white/20 backdrop-blur-md text-4xl md:text-5xl font-black px-6 py-4 rounded-2xl min-w-[100px] border border-white/30 group-hover:scale-105 transition-transform duration-300">
                      {String(time.value).padStart(2, "0")}
                    </div>
                    <div className="text-sm mt-2 opacity-80 font-semibold tracking-wider">
                      {time.label}
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="text-4xl font-black opacity-60 animate-pulse">
                      :
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts
              .filter((p) => p.discount)
              .map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white/15 backdrop-blur-md rounded-3xl p-8 hover:bg-white/25 transition-all duration-500 transform hover:scale-105 border border-white/20"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-lg shadow-lg animate-bounce">
                      -{product.discount}%
                    </div>
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SALE
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-4 group-hover:text-yellow-300 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-300 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm opacity-80 font-medium">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="mb-6">
                    {product.originalPrice && (
                      <span className="text-gray-300 line-through text-lg mr-3">
                        {product.originalPrice.toLocaleString()} VND
                      </span>
                    )}
                    <span className="text-3xl font-black text-yellow-300">
                      {product.price.toLocaleString()} VND
                    </span>
                  </div>

                  <button className="w-full bg-white text-red-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Buy Now - Save {product.discount}%
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-20 bg-white" data-animate>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked selection of the most popular and highly-rated Gundam
              kits from our collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform hover:-translate-y-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Product badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        NEW
                      </span>
                    )}
                    {product.isPreOrder && (
                      <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        PRE-ORDER
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg group/heart">
                      <Heart className="h-5 w-5 text-gray-600 group-hover/heart:text-red-500 transition-colors" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg">
                      <Eye className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
                    </button>
                  </div>

                  {/* Category badge */}
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.category}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm font-medium">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm mr-2">
                          {product.originalPrice.toLocaleString()} VND
                        </span>
                      )}
                      <span className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString()} VND
                      </span>
                    </div>
                    <div className="text-sm">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                          ✓ In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      disabled={product.stock === 0}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center transform hover:scale-105 disabled:transform-none"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {product.isPreOrder ? "Pre-Order" : "Add to Cart"}
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
              View All Products
              <ChevronRight className="inline-block ml-3 h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Mail className="h-12 w-12 text-blue-300" />
            </div>

            <h2 className="text-5xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
              Get the latest news about new releases, exclusive offers, and
              special events. Join our community of Gundam enthusiasts!
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="max-w-lg mx-auto mb-8"
            >
              <div className="flex rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 p-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-transparent placeholder-white/70 text-white focus:outline-none text-lg"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>50,000+ subscribers</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Privacy protected</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                <span>Exclusive offers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-8">
                <Shield className="h-10 w-10 text-blue-400" />
                <div>
                  <span className="font-bold text-2xl">GUNDAM</span>
                  <div className="text-sm text-blue-400">PREMIUM STORE</div>
                </div>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Your premier destination for authentic Gundam model kits and
                accessories. Building dreams, one kit at a time.
              </p>
              <div className="flex space-x-4">
                {[Phone, Mail, MapPin].map((Icon, index) => (
                  <button
                    key={index}
                    className="bg-gray-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Quick Links",
                links: [
                  "Home",
                  "Products",
                  "Categories",
                  "About Us",
                  "Contact",
                ],
              },
              {
                title: "Categories",
                links: [
                  "Real Grade",
                  "Master Grade",
                  "Perfect Grade",
                  "High Grade",
                  "Accessories",
                ],
              },
              {
                title: "Customer Service",
                links: [
                  "Shipping Info",
                  "Returns",
                  "FAQ",
                  "Support",
                  "Privacy Policy",
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-xl mb-8">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                      >
                        <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2025 Gundam Store. All rights reserved. Built with passion for
                Gunpla enthusiasts.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        [data-animate] {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        [data-animate].animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}

export default HomeCustomer;
