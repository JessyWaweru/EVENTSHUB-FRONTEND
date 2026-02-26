import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchbarProps {
  setSearchValue: (value: string) => void;
  handleSearch: () => void;
}

export default function Searchbar({ setSearchValue, handleSearch }: SearchbarProps) {
  // Trigger search when the user presses the Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full items-center space-x-2">
      <div className="relative flex-1">
        {/* Decorative search icon placed inside the input */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search events by title..."
          className="pl-10 bg-white border-gray-300 focus-visible:ring-primary"
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button 
        onClick={handleSearch} 
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Search
      </Button>
    </div>
  );
}