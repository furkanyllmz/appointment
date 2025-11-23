"use client"

interface FilterChipsProps {
  selected: string
  onSelect: (filter: string) => void
}

const FILTERS = ["Tümü", "Berber", "Kuaför", "Güzellik", "Nail Artist", "Dövme", "Masaj"]

export function ServiceFilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-3 p-6 bg-white border-b border-gray-200">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            selected === filter
              ? "bg-black text-white"
              : "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
