'use client'

import React, { useState } from 'react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { X, GripVertical, Plus, Check } from 'lucide-react'

export interface SelectableItem {
  id: string
  label: string
  sublabel?: string
}

export default function FeaturedSelectionModal({
  title,
  items,
  selectedIds,
  onClose,
  onSave,
}: {
  title: string
  items: SelectableItem[]
  selectedIds: string[]
  onClose: () => void
  onSave: (ids: string[]) => Promise<void>
}) {
  const byId = new Map(items.map((item) => [item.id, item]))
  const [selected, setSelected] = useState<SelectableItem[]>(
    selectedIds.map((id) => byId.get(id)).filter((i): i is SelectableItem => !!i),
  )
  const [saving, setSaving] = useState(false)

  const selectedIdSet = new Set(selected.map((i) => i.id))
  const available = items.filter((item) => !selectedIdSet.has(item.id))

  const addItem = (item: SelectableItem) => setSelected([...selected, item])
  const removeItem = (id: string) => setSelected(selected.filter((i) => i.id !== id))

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(selected.map((i) => i.id))
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-large border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto">
          {/* Featured / selected (drag to reorder) */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Featured ({selected.length})
            </p>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nothing selected yet — add items from the right.</p>
            ) : (
              <Reorder.Group axis="y" values={selected} onReorder={setSelected} className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {selected.map((item) => (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#671372]/08 dark:bg-[#671372]/18 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</p>
                        {item.sublabel && (
                          <p className="text-xs text-gray-400 truncate">{item.sublabel}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-full hover:bg-[#671372]/15 dark:hover:bg-[#671372]/30 transition-colors flex-shrink-0"
                      >
                        <X size={12} className="text-gray-400" />
                      </button>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}
          </div>

          {/* Available */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Available ({available.length})
            </p>
            {available.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Everything is featured.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {available.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left
                               bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={14} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</p>
                      {item.sublabel && (
                        <p className="text-xs text-gray-400 truncate">{item.sublabel}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#671372] text-white text-sm font-semibold hover:bg-[#8B1D9F] shadow-purple-lg transition-all disabled:opacity-50"
          >
            <Check size={14} />
            {saving ? 'Saving…' : 'Save Selection'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
