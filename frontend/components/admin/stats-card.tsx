"use client"

import type React from "react"

interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: "purple" | "amber" | "green" | "blue"
}

const COLOR_CONFIG = {
  purple: "bg-gray-100 text-black",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
}

export function StatsCard({ label, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${COLOR_CONFIG[color]} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}
