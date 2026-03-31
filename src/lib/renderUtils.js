/**
 * Safely renders values that might be objects (specifically AI-generated data).
 * If the value is an object with known keys ({name, distance, travel_time}), 
 * it converts it to a readable string. Otherwise, it stringifies it or returns it as is.
 */
export const safeRender = (val) => {
  if (val === null || val === undefined) return '';
  
  if (typeof val === 'object') {
    // Check for specific keys identified in the React crash error
    const { name, distance, travel_time, travel_time_from_previous, description, summary } = val;
    
    // Check if it's a "Navigation" or "Travel" object, or a descriptive object
    if (name || distance || travel_time || travel_time_from_previous || description || summary) {
      return [name, travel_time || travel_time_from_previous, distance, description, summary]
        .filter(Boolean)
        .join(' - ');
    }
    
    // Check for common 'details', 'text', or 'value' keys
    if (val.details) return safeRender(val.details);
    if (val.text) return val.text;
    if (val.value) return String(val.value);
    
    // Generic Fallback: If it's an object we don't recognize, 
    // join all its own string/number values together.
    const values = Object.values(val)
      .filter(v => typeof v === 'string' || typeof v === 'number')
      .filter(Boolean);
    
    if (values.length > 0) {
      return values.join(' - ');
    }
    
    try {
      return JSON.stringify(val);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(val);
};
