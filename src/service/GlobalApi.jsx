import axios from "axios"

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
  }
}

export const GetPlaceDetails = (data) => {
  // Use Pixabay if Key is available
  if (import.meta.env.VITE_PIXABAY_API_KEY) {
    const cacheKey = `pixabay_${data.textQuery}`;
    const cachedResult = localStorage.getItem(cacheKey);

    // Return cached result if available
    if (cachedResult) {
      return Promise.resolve(JSON.parse(cachedResult));
    }

    return axios.get('https://pixabay.com/api/', {
      params: {
        key: import.meta.env.VITE_PIXABAY_API_KEY,
        q: data.textQuery,
        image_type: 'photo',
        per_page: 3
      }
    }).then(resp => {
      // Adapt Pixabay response to mimic Google Places structure
      const photos = resp.data.hits.map(item => ({ name: item.largeImageURL }));
      const result = {
        data: {
          places: [{
            photos: photos.length > 0 ? photos : Array(10).fill({ name: '/placeholder.jpg' })
          }]
        }
      };

      // Save to cache
      localStorage.setItem(cacheKey, JSON.stringify(result));

      return result;
    }).catch(err => {
      console.error("Pixabay API Error:", err.response?.data || err.message);
      // Fallback to placeholder on error
      return {
        data: {
          places: [{
            photos: Array(10).fill({ name: '/placeholder.jpg' })
          }]
        }
      }
    });
  }

  // Fallback to placeholder if no key
  return Promise.resolve({
    data: {
      places: [{
        photos: Array(10).fill({ name: '/placeholder.jpg' })
      }]
    }
  });
};


export const PHOTO_REF_URL = '{NAME}';