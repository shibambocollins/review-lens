import { Coffee, Hotel, Utensils, MapPin, Activity, Star } from 'lucide-react';

const mockBusinesses = [
  {
    id: 'b1',
    name: 'Truth Coffee Roasting',
    category: 'Coffee Shop',
    address: '36 Buitenkant St, Cape Town City Centre',
    rating: 4.8,
    reviewCount: 4250,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    icon: Coffee,
    aiSummary: "Truth Coffee is globally recognized for its exceptional coffee and immersive steampunk aesthetic in Cape Town. Customers overwhelmingly praise the unique atmosphere and high-quality artisanal brews. However, some note that prices are premium and seating can be highly limited during peak weekend hours.",
    sentiment: { positive: 85, neutral: 10, negative: 5, score: 9.2 },
    emotions: [
      { name: 'Happy', value: 50 }, { name: 'Excited', value: 25 }, { name: 'Relaxed', value: 15 }, { name: 'Frustrated', value: 7 }, { name: 'Disappointed', value: 3 }
    ],
    aspects: [
      { name: 'Coffee Quality', positive: 96, negative: 1, score: 9.8 },
      { name: 'Atmosphere', positive: 92, negative: 4, score: 9.4 },
      { name: 'Service', positive: 75, negative: 15, score: 7.8 },
      { name: 'Pricing', positive: 40, negative: 40, score: 5.0 },
      { name: 'Seating', positive: 45, negative: 35, score: 5.5 }
    ],
    keywords: {
      positive: ['best coffee', 'steampunk', 'amazing vibe', 'world class', 'pastries'],
      negative: ['expensive', 'crowded', 'noisy', 'wait time', 'touristy'],
      trending: ['flat white', 'croissant', 'roastery tour']
    },
    trends: [
      { month: 'Jan', sentiment: 9.0, rating: 4.7 }, { month: 'Feb', sentiment: 9.2, rating: 4.8 }, { month: 'Mar', sentiment: 9.1, rating: 4.7 },
      { month: 'Apr', sentiment: 9.3, rating: 4.8 }, { month: 'May', sentiment: 9.4, rating: 4.9 }, { month: 'Jun', sentiment: 9.2, rating: 4.8 }
    ],
    ratingDistribution: { 5: 3200, 4: 800, 3: 150, 2: 70, 1: 30 },
    insights: [
      "The steampunk aesthetic drives significant positive mentions and social media sharing.",
      "Coffee quality is consistently rated as world-class by both locals and tourists.",
      "Wait times and finding a table are the most common sources of friction.",
      "Negative sentiment regarding price is often offset by the perceived value of the experience."
    ],
    recommendations: [
      "Implement a virtual queue or reservation system for peak tourist seasons.",
      "Highlight combo deals (coffee + pastry) to improve value perception.",
      "Expand merchandise offerings, as tourists frequently want souvenirs of the unique aesthetic."
    ],
    reviews: [
      { id: 'r1', text: "Absolutely incredible experience. The coffee is unmatched and the steampunk decor is mind-blowing. Worth every penny.", rating: 5, sentiment: 'positive', date: '2023-11-10', aspects: ['Coffee Quality', 'Atmosphere'] },
      { id: 'r2', text: "Great coffee but insanely crowded. We had to wait 30 minutes just to get a seat, and it's quite loud inside.", rating: 3, sentiment: 'neutral', date: '2023-11-05', aspects: ['Seating', 'Wait Time'] },
      { id: 'r3', text: "The baristas really know their stuff. Had a fantastic pour-over. A bit pricey but justified for the quality.", rating: 4, sentiment: 'positive', date: '2023-10-28', aspects: ['Coffee Quality', 'Pricing', 'Service'] },
      { id: 'r4', text: "Overhyped and too expensive. The coffee was good but not worth the 40-minute wait.", rating: 2, sentiment: 'negative', date: '2023-10-20', aspects: ['Pricing', 'Wait Time'] }
    ]
  },
  {
    id: 'b2',
    name: 'The Oyster Box',
    category: 'Hotel',
    address: '2 Lighthouse Rd, Umhlanga Rocks, Durban',
    rating: 4.7,
    reviewCount: 6800,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    icon: Hotel,
    aiSummary: "The Oyster Box is a legendary luxury hotel in Umhlanga, highly praised for its stunning ocean views, famous curry buffet, and impeccable high tea. Service is generally rated as world-class. Minor complaints mostly center around the high cost and occasional slow service during peak holiday seasons.",
    sentiment: { positive: 82, neutral: 12, negative: 6, score: 8.8 },
    emotions: [
      { name: 'Happy', value: 45 }, { name: 'Relaxed', value: 35 }, { name: 'Surprised', value: 10 }, { name: 'Disappointed', value: 8 }, { name: 'Frustrated', value: 2 }
    ],
    aspects: [
      { name: 'Location/Views', positive: 98, negative: 1, score: 9.9 },
      { name: 'Food (Curry/High Tea)', positive: 90, negative: 5, score: 9.2 },
      { name: 'Service', positive: 85, negative: 10, score: 8.5 },
      { name: 'Rooms', positive: 88, negative: 7, score: 8.7 },
      { name: 'Value', positive: 60, negative: 25, score: 6.8 }
    ],
    keywords: {
      positive: ['ocean view', 'curry buffet', 'high tea', 'skabenga the cat', 'luxury'],
      negative: ['expensive', 'slow service', 'fully booked', 'noisy pool'],
      trending: ['spa treatment', 'anniversary', 'lighthouse']
    },
    trends: [
      { month: 'Jan', sentiment: 8.9, rating: 4.8 }, { month: 'Feb', sentiment: 8.7, rating: 4.7 }, { month: 'Mar', sentiment: 8.8, rating: 4.7 },
      { month: 'Apr', sentiment: 8.9, rating: 4.8 }, { month: 'May', sentiment: 8.6, rating: 4.6 }, { month: 'Jun', sentiment: 8.8, rating: 4.7 }
    ],
    ratingDistribution: { 5: 5200, 4: 1100, 3: 300, 2: 120, 1: 80 },
    insights: [
      "The 'High Tea' and 'Curry Buffet' are massive drivers of foot traffic and positive reviews even from non-staying guests.",
      "The resident cat (Skabenga) is frequently mentioned fondly in reviews, adding a unique charm.",
      "Value for money is the lowest-rated aspect, though most guests accept it as a premium luxury experience.",
      "Service speeds drop during December/January peak season."
    ],
    recommendations: [
      "Increase temporary staffing slightly ahead of peak December holiday season.",
      "Create exclusive package deals that bundle the spa and high tea to improve perceived value.",
      "Capitalize on the popularity of the curry buffet by offering a cookbook or spice mix for sale."
    ],
    reviews: [
      { id: 'r1', text: "An absolute dream. Waking up to the view of the lighthouse was magical, and the high tea was incredible.", rating: 5, sentiment: 'positive', date: '2023-11-12', aspects: ['Location/Views', 'Food (Curry/High Tea)'] },
      { id: 'r2', text: "Beautiful property but very expensive. The pool area gets quite crowded with kids during school holidays.", rating: 3, sentiment: 'neutral', date: '2023-11-01', aspects: ['Value', 'Location/Views'] },
      { id: 'r3', text: "The curry buffet is the best in Durban! Service was attentive and the ambiance is old-world charm at its best.", rating: 5, sentiment: 'positive', date: '2023-10-15', aspects: ['Food (Curry/High Tea)', 'Service'] },
      { id: 'r4', text: "Check-in took way too long and our room wasn't ready. For this price, I expect perfection.", rating: 2, sentiment: 'negative', date: '2023-10-05', aspects: ['Service', 'Value'] }
    ]
  },
  {
    id: 'b3',
    name: 'Marble Restaurant',
    category: 'Restaurant',
    address: 'Trumpet on Keyes, Rosebank, Johannesburg',
    rating: 4.6,
    reviewCount: 3400,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    icon: Utensils,
    aiSummary: "Marble offers a premium wood-fired dining experience with spectacular sunset views over Johannesburg. Reviewers consistently praise the meat quality, the sophisticated ambiance, and the extensive wine list. The primary criticisms involve high pricing, small portion sizes on some dishes, and difficulty securing a reservation.",
    sentiment: { positive: 78, neutral: 14, negative: 8, score: 8.4 },
    emotions: [
      { name: 'Satisfied', value: 40 }, { name: 'Happy', value: 35 }, { name: 'Disappointed', value: 12 }, { name: 'Frustrated', value: 8 }, { name: 'Surprised', value: 5 }
    ],
    aspects: [
      { name: 'Food/Meat Quality', positive: 92, negative: 4, score: 9.4 },
      { name: 'Ambiance/Views', positive: 95, negative: 2, score: 9.6 },
      { name: 'Service', positive: 80, negative: 12, score: 8.2 },
      { name: 'Pricing', positive: 35, negative: 45, score: 4.8 },
      { name: 'Portion Sizes', positive: 50, negative: 30, score: 6.0 }
    ],
    keywords: {
      positive: ['wood-fired', 'sunset view', 'steak', 'wine selection', 'special occasion'],
      negative: ['expensive', 'small portions', 'arrogant staff', 'hard to book'],
      trending: ['ribeye', 'rooftop', 'cocktails']
    },
    trends: [
      { month: 'Jan', sentiment: 8.2, rating: 4.5 }, { month: 'Feb', sentiment: 8.4, rating: 4.6 }, { month: 'Mar', sentiment: 8.3, rating: 4.5 },
      { month: 'Apr', sentiment: 8.5, rating: 4.7 }, { month: 'May', sentiment: 8.6, rating: 4.7 }, { month: 'Jun', sentiment: 8.4, rating: 4.6 }
    ],
    ratingDistribution: { 5: 2400, 4: 600, 3: 200, 2: 120, 1: 80 },
    insights: [
      "Marble is predominantly viewed as a 'special occasion' venue rather than a casual dining spot.",
      "The sunset view from the bar area is highly sought after and frequently mentioned.",
      "There is a recurring minor complaint regarding perceived aloofness or 'arrogance' from some front-of-house staff.",
      "Meat dishes (specifically ribeye) receive near-universal praise for flavor and cooking technique."
    ],
    recommendations: [
      "Introduce a slightly more affordable 'sunset tapas' menu at the bar to capture early evening traffic.",
      "Conduct customer service refresher training focusing on warmth and approachability for hosts.",
      "Clarify portion sizes on the menu or suggest side dishes proactively for lighter mains."
    ],
    reviews: [
      { id: 'r1', text: "Best steak I've had in Joburg, hands down. The view at sunset is spectacular. Perfect for our anniversary.", rating: 5, sentiment: 'positive', date: '2023-11-08', aspects: ['Food/Meat Quality', 'Ambiance/Views'] },
      { id: 'r2', text: "Food was good but the portions are tiny for the price you pay. Left feeling a bit hungry.", rating: 3, sentiment: 'neutral', date: '2023-10-22', aspects: ['Pricing', 'Portion Sizes'] },
      { id: 'r3', text: "The cocktails at the bar were fantastic. Loved the vibe, but getting a table requires booking weeks in advance.", rating: 4, sentiment: 'positive', date: '2023-10-10', aspects: ['Ambiance/Views'] },
      { id: 'r4', text: "Hostess was incredibly rude when we arrived 5 minutes late. Ruined the mood for the whole expensive evening.", rating: 1, sentiment: 'negative', date: '2023-09-28', aspects: ['Service', 'Pricing'] }
    ]
  },
  {
    id: 'b4',
    name: 'V&A Waterfront',
    category: 'Shopping & Attractions',
    address: '19 Dock Rd, Cape Town',
    rating: 4.8,
    reviewCount: 25400,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    icon: MapPin,
    aiSummary: "The V&A Waterfront is Africa's most visited destination, blending premium shopping, dining, and scenic harbor views. Visitors heavily praise the safety, cleanliness, and sheer variety of activities. The main friction points are expensive parking, heavy crowds during summer, and the high cost of dining in the precinct.",
    sentiment: { positive: 88, neutral: 8, negative: 4, score: 9.4 },
    emotions: [
      { name: 'Happy', value: 55 }, { name: 'Excited', value: 20 }, { name: 'Relaxed', value: 15 }, { name: 'Overwhelmed', value: 7 }, { name: 'Frustrated', value: 3 }
    ],
    aspects: [
      { name: 'Variety/Shopping', positive: 96, negative: 2, score: 9.7 },
      { name: 'Atmosphere/Views', positive: 95, negative: 1, score: 9.8 },
      { name: 'Safety & Cleanliness', positive: 90, negative: 4, score: 9.3 },
      { name: 'Parking', positive: 45, negative: 35, score: 5.5 },
      { name: 'Pricing', positive: 50, negative: 25, score: 6.2 }
    ],
    keywords: {
      positive: ['table mountain view', 'safe', 'great shopping', 'live music', 'restaurants'],
      negative: ['expensive parking', 'too crowded', 'windy', 'tourist trap'],
      trending: ['zeitz mocaa', 'food market', 'ferris wheel']
    },
    trends: [
      { month: 'Jan', sentiment: 9.3, rating: 4.8 }, { month: 'Feb', sentiment: 9.4, rating: 4.8 }, { month: 'Mar', sentiment: 9.5, rating: 4.9 },
      { month: 'Apr', sentiment: 9.4, rating: 4.8 }, { month: 'May', sentiment: 9.2, rating: 4.7 }, { month: 'Jun', sentiment: 9.3, rating: 4.8 }
    ],
    ratingDistribution: { 5: 19500, 4: 4500, 3: 900, 2: 300, 1: 200 },
    insights: [
      "Safety is a highly recurring positive theme compared to other parts of the city.",
      "The integration of working harbor elements with luxury shopping provides a unique, highly rated atmosphere.",
      "Parking fees are the most consistent complaint, especially for quick visits.",
      "The Time Out Market and Zeitz MOCAA are driving significant recent positive mentions."
    ],
    recommendations: [
      "Introduce a loyalty program or validated parking for locals to encourage more frequent, shorter visits.",
      "Improve digital wayfinding apps to help tourists navigate the massive precinct more easily.",
      "Add more shaded/wind-protected seating areas in the outdoor sections."
    ],
    reviews: [
      { id: 'r1', text: "Always a great vibe. So clean and safe to walk around, even at night. The views of Table Mountain are stunning.", rating: 5, sentiment: 'positive', date: '2023-11-15', aspects: ['Safety & Cleanliness', 'Atmosphere/Views'] },
      { id: 'r2', text: "Great shops but it was incredibly crowded and finding parking took 45 minutes.", rating: 3, sentiment: 'neutral', date: '2023-11-02', aspects: ['Parking', 'Variety/Shopping'] },
      { id: 'r3', text: "Love the food market! Such a great variety of local flavors. Always end up spending too much money though.", rating: 4, sentiment: 'positive', date: '2023-10-18', aspects: ['Variety/Shopping', 'Pricing'] },
      { id: 'r4', text: "Extremely overpriced tourist trap. You pay a premium for everything here just because of the location.", rating: 2, sentiment: 'negative', date: '2023-09-30', aspects: ['Pricing'] }
    ]
  },
  {
    id: 'b5',
    name: 'Gold Reef City Theme Park',
    category: 'Attraction',
    address: 'Northern Pkwy & Data Crescent, Johannesburg',
    rating: 4.4,
    reviewCount: 11200,
    image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    icon: Activity,
    aiSummary: "Gold Reef City offers a thrilling mix of rollercoasters and historical mining tours. Families strongly appreciate the variety of rides and the educational mine tour. The negative sentiment is largely driven by long queues, occasional ride breakdowns, and high food prices inside the park.",
    sentiment: { positive: 74, neutral: 15, negative: 11, score: 7.9 },
    emotions: [
      { name: 'Excited', value: 45 }, { name: 'Happy', value: 25 }, { name: 'Frustrated', value: 20 }, { name: 'Tired', value: 7 }, { name: 'Disappointed', value: 3 }
    ],
    aspects: [
      { name: 'Rides/Thrills', positive: 88, negative: 8, score: 9.0 },
      { name: 'Mine Tour', positive: 85, negative: 5, score: 8.8 },
      { name: 'Queues/Wait Times', positive: 15, negative: 70, score: 3.5 },
      { name: 'Food Pricing', positive: 20, negative: 60, score: 4.0 },
      { name: 'Staff/Service', positive: 65, negative: 20, score: 7.2 }
    ],
    keywords: {
      positive: ['tower of terror', 'mine tour', 'fun for kids', 'anaconda', 'historical'],
      negative: ['long lines', 'rides closed', 'expensive food', 'not enough shade', 'poor management'],
      trending: ['family ticket', 'online booking', 'jump city']
    },
    trends: [
      { month: 'Jan', sentiment: 7.5, rating: 4.2 }, { month: 'Feb', sentiment: 7.8, rating: 4.4 }, { month: 'Mar', sentiment: 8.0, rating: 4.5 },
      { month: 'Apr', sentiment: 7.6, rating: 4.3 }, { month: 'May', sentiment: 8.1, rating: 4.5 }, { month: 'Jun', sentiment: 7.9, rating: 4.4 }
    ],
    ratingDistribution: { 5: 6100, 4: 2800, 3: 1200, 2: 600, 1: 500 },
    insights: [
      "The heritage/mine tour adds significant educational value that parents specifically highlight in 5-star reviews.",
      "Frustration peaks during school holidays when wait times for major rides exceed 90 minutes.",
      "Unexpected ride maintenance closures lead directly to 1- and 2-star reviews.",
      "Customers feel captive to high food and beverage prices once inside the park."
    ],
    recommendations: [
      "Implement an interactive app with live queue times to help manage visitor expectations.",
      "Communicate scheduled ride maintenance clearly on the website before ticket purchase.",
      "Introduce more shaded queue lines and misting fans for the hot Johannesburg summers."
    ],
    reviews: [
      { id: 'r1', text: "Kids had the best day ever. The Tower of Terror is intense! The underground mine tour was also surprisingly interesting.", rating: 5, sentiment: 'positive', date: '2023-11-04', aspects: ['Rides/Thrills', 'Mine Tour'] },
      { id: 'r2', text: "Spent more time standing in the sun waiting than actually riding. Food inside is a rip-off. Needs better management.", rating: 2, sentiment: 'negative', date: '2023-10-25', aspects: ['Queues/Wait Times', 'Food Pricing'] },
      { id: 'r3', text: "Great variety of rides for all ages. Anaconda is a classic. A bit packed on a Saturday but expected.", rating: 4, sentiment: 'positive', date: '2023-10-12', aspects: ['Rides/Thrills', 'Queues/Wait Times'] },
      { id: 'r4', text: "Three of the main rides were closed for maintenance and we weren't told at the gate. Very disappointing.", rating: 1, sentiment: 'negative', date: '2023-09-18', aspects: ['Rides/Thrills', 'Staff/Service'] }
    ]
  },
  {
    id: 'b6',
    name: 'Max\'s Lifestyle',
    category: 'Restaurant & Lounge',
    address: '328 Mbe Rd, Umlazi, Durban',
    rating: 4.5,
    reviewCount: 3800,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    icon: Star,
    aiSummary: "Max's Lifestyle is a highly celebrated authentic Shisa Nyama experience in Umlazi. Guests love the vibrant atmosphere, top-tier DJs, and expertly braaied meat. The main complaints involve slow service on very busy Sundays and premium pricing compared to traditional township venues.",
    sentiment: { positive: 79, neutral: 14, negative: 7, score: 8.6 },
    emotions: [
      { name: 'Happy', value: 45 }, { name: 'Excited', value: 30 }, { name: 'Relaxed', value: 10 }, { name: 'Frustrated', value: 10 }, { name: 'Disappointed', value: 5 }
    ],
    aspects: [
      { name: 'Atmosphere/Vibe', positive: 96, negative: 2, score: 9.7 },
      { name: 'Meat/Food', positive: 90, negative: 5, score: 9.3 },
      { name: 'Music/DJs', positive: 94, negative: 2, score: 9.6 },
      { name: 'Service Speed', positive: 40, negative: 45, score: 4.8 },
      { name: 'Pricing', positive: 55, negative: 30, score: 6.2 }
    ],
    keywords: {
      positive: ['shisa nyama', 'great vibe', 'sunday session', 'top djs', 'safe'],
      negative: ['slow service', 'expensive drinks', 'no parking', 'crowded', 'long wait for food'],
      trending: ['VIP section', 'champagne', 'sunday chill']
    },
    trends: [
      { month: 'Jan', sentiment: 8.5, rating: 4.5 }, { month: 'Feb', sentiment: 8.6, rating: 4.6 }, { month: 'Mar', sentiment: 8.4, rating: 4.4 },
      { month: 'Apr', sentiment: 8.7, rating: 4.6 }, { month: 'May', sentiment: 8.8, rating: 4.7 }, { month: 'Jun', sentiment: 8.6, rating: 4.5 }
    ],
    ratingDistribution: { 5: 2300, 4: 900, 3: 400, 2: 120, 1: 80 },
    insights: [
      "Sundays are the absolute peak for positive sentiment regarding atmosphere, but the lowest for service speed.",
      "The venue is frequently praised for changing the perception of township tourism, highlighting safety and luxury.",
      "Meat quality (Braai/Shisa Nyama) is consistently rated as excellent.",
      "Drink prices are frequently compared to upmarket Sandton/Umhlanga venues rather than local spots."
    ],
    recommendations: [
      "Optimize the meat ordering-to-table pipeline to reduce wait times on Sundays.",
      "Consider dedicated VIP parking or a shuttle service to alleviate parking congestion.",
      "Introduce faster drink service protocols or dedicated bottle-service waiters for the VIP areas."
    ],
    reviews: [
      { id: 'r1', text: "Best Shisa Nyama in the country. The vibe on a Sunday is unmatched. Meat was cooked to perfection.", rating: 5, sentiment: 'positive', date: '2023-11-06', aspects: ['Atmosphere/Vibe', 'Meat/Food'] },
      { id: 'r2', text: "Great music and atmosphere, but we waited almost two hours for our meat to arrive. Very disorganized.", rating: 2, sentiment: 'negative', date: '2023-10-30', aspects: ['Service Speed', 'Meat/Food'] },
      { id: 'r3', text: "Felt very safe, the venue is world-class. It's expensive but you pay for the premium experience.", rating: 4, sentiment: 'positive', date: '2023-10-15', aspects: ['Atmosphere/Vibe', 'Pricing'] },
      { id: 'r4', text: "Awesome place to chill with friends. The DJs always bring the heat. Drinks are a bit steep though.", rating: 4, sentiment: 'positive', date: '2023-09-25', aspects: ['Music/DJs', 'Pricing'] }
    ]
  }
];

export { mockBusinesses };
