import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { cn } from "@/lib/utils";

const LocationAutocomplete = ({ onSelect, placeholder }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastSelected, setLastSelected] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only fetch if query is different from the last selected one
            if (query.length > 2 && query !== lastSelected) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
            const response = await axios.get(`https://api.locationiq.com/v1/autocomplete`, {
                params: {
                    key: apiKey,
                    q: query,
                    limit: 5,
                    dedupe: 1
                }
            });
            setSuggestions(response.data);
            setShowDropdown(true);
        } catch (error) {
            console.error("LocationIQ Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        setQuery(item.display_name);
        setLastSelected(item.display_name); // Set this to prevent immediate re-fetch
        setShowDropdown(false);
        onSelect({
            label: item.display_name,
            location: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
            }
        });
    };


    return (
        <div className="relative w-full" ref={dropdownRef}>
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
                onFocus={() => query.length > 2 && setShowDropdown(true)}
            />
            
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-3 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 cursor-pointer border-b last:border-0 border-black/5 dark:border-white/5 transition-colors group"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-orange-500 mt-0.5">📍</span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        {item.display_name.split(',')[0]}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                                        {item.display_name.split(',').slice(1).join(',').trim()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {loading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default LocationAutocomplete;
