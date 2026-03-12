import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const COUNTRIES = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
];

const CountryPicker = ({ selectedCountry, onSelect, onClose, title = 'Select country' }) => {
    const [search, setSearch] = useState('');
    const normalizedSearch = search.toLowerCase();

    const filteredCountries = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(normalizedSearch) ||
        c.code.includes(search)
    );

    return (
        <div className="absolute inset-0 bg-bg-surface z-1000 flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shadow-sm shrink-0">
                <button
                    onClick={() => { setSearch(''); onClose?.(); }}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-secondary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[18px] font-semibold text-text-primary">{title}</h1>
            </header>

            <div className="px-4 py-3 shrink-0">
                <div className="flex items-center gap-2 bg-bg-input rounded-full px-4 py-2.5">
                    <Icons.Search size={16} className="text-text-secondary shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search country or code..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-text-secondary">
                            <Icons.X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredCountries.length === 0 ? (
                    <div className="text-center text-text-secondary text-[14px] py-12">No results</div>
                ) : (
                    filteredCountries.map((country, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                onSelect?.(country);
                                setSearch('');
                            }}
                            className={`flex items-center gap-4 px-4 py-3.5 hover:bg-bg-hover cursor-pointer transition-colors border-b border-border-main/10 ${selectedCountry?.name === country.name ? 'bg-accent/5' : ''}`}
                        >
                            <span className="text-[22px]">{country.flag}</span>
                            <span className="flex-1 text-[15px] text-text-primary">{country.name}</span>
                            <span className="text-[14px] text-text-secondary font-medium">{country.code}</span>
                            {selectedCountry?.name === country.name && (
                                <Icons.Check size={18} className="text-accent" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CountryPicker;
