import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface City {
  id: string;
  name: string;
  state?: string;
  country: string;
}

interface CityAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CityAutocomplete({
  value = '',
  onChange,
  onBlur,
  error,
  label = 'City',
  placeholder = 'Enter your city',
  required = false,
  className,
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchCities = useCallback(
    async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .ilike('name', `${searchTerm}%`)
          .eq('is_active', true)
          .limit(10);

        if (error) throw error;

        setSuggestions(data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        fetchCities(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, fetchCities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
    onChange(newValue);
  };

  const handleSuggestionClick = (city: City) => {
    const cityName = city.state ? `${city.name}, ${city.state}` : city.name;
    setInputValue(cityName);
    onChange(cityName);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onBlur?.();
    }, 200);
  };

  return (
    <div className={cn('relative', className)}>
     
      <div className="relative">
        <Input
          id="city-autocomplete"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls="city-suggestions"
          aria-expanded={showSuggestions}
          aria-invalid={error ? 'true' : 'false'}
          required={required}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="city-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((city, index) => (
            <li
              key={city.id}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSuggestionClick(city)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                'px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-accent transition-colors',
                index === selectedIndex && 'bg-accent'
              )}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {city.name}
                {city.state && <span className="text-muted-foreground">, {city.state}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
