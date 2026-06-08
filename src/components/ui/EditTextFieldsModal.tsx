'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export interface EditableField {
  key: string
  label: string
  value: string
  placeholder?: string
  multiline?: boolean
}

interface Props {
  heading: string
  fields: EditableField[]
  onClose: () => void
  onSave: (values: Record<string, string>) => Promise<void>
}

const inputCls = `w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  focus:ring-[#671372]/25 focus:border-[#671372]/40 transition-all`
const labelCls = `block text-xs font-semibold uppercase tracking-wider
                  text-gray-500 dark:text-gray-400 mb-1.5`

export default function EditTextFieldsModal({ heading, fields, onClose, onSave }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(fields.map((f) => [f.key, f.value])),
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSave(values)
      onClose()
    } catch (err: any) {
      console.error('[EditTextFieldsModal]', err)
      const msg = err?.message || String(err)
      if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
        setError('Permission denied — check your Firestore security rules.')
      } else {
        setError(msg || 'Failed to save. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6
                        border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{heading}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800
                       flex items-center justify-center
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={14} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              {f.multiline ? (
                <textarea
                  value={values[f.key]}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <input
                  value={values[f.key]}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold
                         text-gray-600 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full bg-[#671372] text-white text-sm font-semibold
                         shadow-purple-lg hover:bg-[#8B1D9F] transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
