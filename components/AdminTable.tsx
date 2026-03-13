"use client"
import { useState } from "react"

interface Props {
  title: string
  emoji: string
  data: any[]
  columns: string[]
  onDelete?: (id: string) => void
  onEdit?: (row: any) => void
  onCreate?: () => void
  createLabel?: string
}

export default function AdminTable({ title, emoji, data, columns, onDelete, onEdit, onCreate, createLabel }: Props) {
  const [search, setSearch] = useState("")

  const filtered = data.filter((row) =>
    columns.some((col) => String(row[col] ?? "").toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">{emoji} {title} <span className="text-gray-500 text-sm font-normal ml-2">{data.length} records</span></h2>
        <div className="flex gap-3">
          <input
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-48 focus:outline-none focus:border-indigo-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {onCreate && (
            <button onClick={onCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              + {createLabel || "Add New"}
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-gray-400 text-xs uppercase tracking-wider">{col.replace(/_/g, " ")}</th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3 text-gray-400 text-xs uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((row, i) => (
              <tr key={row.id || i} className="border-b border-gray-800 hover:bg-gray-800 transition">
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">
                    {typeof row[col] === "boolean" ? (row[col] ? "✅" : "—") : String(row[col] ?? "—")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {onEdit && <button onClick={() => onEdit(row)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition">Edit</button>}
                      {onDelete && <button onClick={() => onDelete(row.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition">Delete</button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}