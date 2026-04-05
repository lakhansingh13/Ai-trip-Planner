export const SelectTravelersList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveler in exploration',
        icon: '✈️',
        people: '1 Person'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '🍷🍷',
        people: '2 People'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun adventurers',
        icon: '👨‍👩‍👧‍👦',
        people: '3 to 5 People'
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekers',
        icon: '👥',
        people: '5 to 10 People'
    },
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💰',
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Keep costs on the average side',
        icon: '💵',
    },
    {
        id: 3,
        title: 'Luxury',
        desc: "Don't worry about cost",
        icon: '💳',
    },
];


export const AI_PROMPT = 'Generate a Travel Plan for Location: {location}, for {totalDays} Days for {travelers} with a {budget} budget. Output in the following JSON format: { "travelPlan": { "location": "{location}", "totalDays": "{totalDays}", "travelers": "{travelers}", "budget": "{budget}", "hotelOptions": [ { "hotelName": "", "address": "", "price": "", "geoCoordinates": { "lat": 0, "lng": 0 }, "rating": 0, "description": "" } ], "itinerary": [ { "day": 1, "activities": [ { "placeName": "", "placeDetails": "", "geoCoordinates": { "lat": 0, "lng": 0 }, "ticketPricing": "", "travelTime": "", "bestTimeToVisit": "" } ] } ] } }. Provide exactly 4 Hotels and exactly 4 activities per day (to fit the 4-column UI grid perfectly). IMPORTANT: Do NOT include image URLs in the response. Provide detailed and engaging descriptions (at least 2-3 sentences) for each hotel and activity so that the UI cards look full and informative. Crucially, provide all prices (hotels and tickets) in the locally used currency of {location} (e.g., ₹ for India, $ for USA, etc.).'