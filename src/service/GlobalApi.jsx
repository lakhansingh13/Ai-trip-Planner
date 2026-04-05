import axios from "axios"

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
  }
}

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

// NEW FREE PHOTO APIS
export const getUnsplashPhoto = async (query) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: query,
        client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
        per_page: 1
      }
    });
    return response.data.results[0]?.urls?.regular || null;
  } catch (error) {
    console.error("Unsplash Error:", error);
    return null;
  }
};

export const getPexelsPhoto = async (query) => {
  try {
    const response = await axios.get(`https://api.pexels.com/v1/search`, {
      params: {
        query: query,
        per_page: 1
      },
      headers: {
        Authorization: import.meta.env.VITE_PEXELS_API_KEY
      }
    });
    return response.data.photos[0]?.src?.large || null;
  } catch (error) {
    console.error("Pexels Error:", error);
    return null;
  }
};

export const getWikimediaPhoto = async (query) => {
  try {
    const params = {
      action: "query",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: 6,
      gsrlimit: 1,
      prop: "imageinfo",
      iiprop: "url",
      format: "json",
      origin: "*"
    };
    const response = await axios.get(`https://commons.wikimedia.org/w/api.php`, { params });
    const pages = response.data.query?.pages;
    if (pages) {
      const firstPage = Object.values(pages)[0];
      return firstPage.imageinfo?.[0]?.url || null;
    }
    return null;
  } catch (error) {
    console.error("Wikimedia Error:", error);
    return null;
  }
};

// Helper function to delay requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));