'use client'
import clsx from 'clsx'

export interface CollectionItem {
  id: string;
  name: string;
  productsCount: number;
  thumbnailUrl?: string;
}

export interface ProductCollectionSelectorProps {
  collections: CollectionItem[];
  selectedIds?: string[];
  onChange?: (ids: string[]) => void;
  className?: string;
}

export default function ProductCollectionSelector({ collections, selectedIds = [], onChange, className }: ProductCollectionSelectorProps) {
  const toggle = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]
    onChange?.(next)
  }

  return (
    <div className={clsx('space-y-2', className)}>
      <h2 className="text-sm font-medium">Product Collections</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {collections.map((col) => {
          const checked = selectedIds.includes(col.id)
          return (
            <label
              key={col.id}
              className={clsx(
                'relative cursor-pointer rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition',
                checked ? 'ring-2 ring-blue-500' : '',
              )}
            >
              <input
                type="checkbox"
                className="absolute inset-0 h-full w-full opacity-0"
                checked={checked}
                onChange={() => toggle(col.id)}
              />
              {col.thumbnailUrl ? (
                <img src={col.thumbnailUrl} alt={col.name} className="h-20 w-full rounded-md object-cover" />
              ) : (
                <div className="flex h-20 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                  No Image
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{col.name}</p>
                <p className="text-xs text-gray-500">{col.productsCount} products</p>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
} 