import React from 'react'
import { AdSlot } from '../Ads/AdSlot'

export function RightSidebar({ className = '' }) {
  return (
    <aside className={className}>
      <div className="space-y-4">
        <AdSlot size="rectangle" className="card p-0" />
        <AdSlot size="rectangle" className="card p-0" />
      </div>
    </aside>
  )
}
