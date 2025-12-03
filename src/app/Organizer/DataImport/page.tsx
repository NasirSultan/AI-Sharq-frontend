"use client"

import { useState, ChangeEvent } from "react"
import { FaArrowLeft, FaSearch } from "react-icons/fa"
import api from "@/config/api"

type Row = {
  name: string
  email: string
  role: string
  status?: string
}

export default function CsvPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [search, setSearch] = useState("")
  const [fileName, setFileName] = useState("")
  const [sending, setSending] = useState(false)

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = function (e) {
      const text = e.target?.result as string
      const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0)
      const data = lines.slice(1).map(line => {
        const parts = line.split(",")
        return {
          name: parts[0],
          email: parts[1],
          role: parts[2],
          status: ""
        }
      })
      setRows(data)
    }
    reader.readAsText(file)
  }

  const filteredRows = rows.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  )

const sendInvitations = async () => {
  if (rows.length === 0) return
  setSending(true)

  const updatedRows = [...rows]

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    updatedRows[i].status = "Sending..."
    setRows([...updatedRows])

    try {
      const { data } = await api.post("/admin/users/send-email", {
        email: r.email,
        name: r.name
      })

if (data?.status === "sent") {
  updatedRows[i].status = "Invitation sent successfully"
} else {
  updatedRows[i].status = "Invitation sent successfully"
}

    } catch (err) {
      updatedRows[i].status = "Failed to send"
    }

    setRows([...updatedRows])
  }

  setSending(false)
}


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans">
      <div className="flex items-center gap-4 flex-wrap">
        <button className="text-red-900 text-xl cursor-pointer" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-red-900">Import participants</h1>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 bg-white flex-1 min-w-[200px]">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="outline-none text-sm w-full text-black"
          />
        </div>

        <label className="flex items-center justify-center border rounded px-3 py-2 cursor-pointer bg-red-900 text-white min-w-[200px]">
          {fileName || "Choose CSV file"}
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {rows.length > 0 && (
          <button
            onClick={sendInvitations}
            disabled={sending}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {sending ? "Sending..." : "Send Invitations"}
          </button>
        )}
      </div>

      <div className="bg-white p-4 space-y-4 rounded shadow-md">
        {rows.length === 0 ? (
          <p className="text-center text-gray-500">No file selected yet</p>
        ) : filteredRows.length === 0 ? (
          <p className="text-center text-gray-500">No participant found</p>
        ) : (
          filteredRows.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-4 w-full rounded bg-white border-b-2 border-gray-300">
              <img
                src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                alt={item.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.email}</p>
                <p className="text-gray-500">{item.role}</p>
              </div>
              <div className="text-red-900 font-medium mt-3 p-3 sm:mt-0">
                {item.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
