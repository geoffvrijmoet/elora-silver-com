'use client';

import { useEffect, useState } from 'react';

interface QRCode {
  _id: string;
  name: string;
  targetUrl: string;
  redirectUrl: string;
  bgColor: string;
  scanCount: number;
  dataUrl: string;
  createdAt: string;
}

export default function QRPage() {
  const [codes, setCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [bgColor, setBgColor] = useState('transparent');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchCodes = async () => {
    const res = await fetch('/api/qr');
    if (res.ok) setCodes(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetUrl.trim()) return;

    setCreating(true);
    const res = await fetch('/api/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        targetUrl: targetUrl.trim(),
        bgColor: bgColor === 'custom' ? customColor : bgColor,
      }),
    });
    if (res.ok) {
      setName('');
      setTargetUrl('');
      setBgColor('transparent');
      setShowForm(false);
      fetchCodes();
    }
    setCreating(false);
  };

  const handleDownload = (code: QRCode) => {
    const link = document.createElement('a');
    link.href = code.dataUrl;
    link.download = `${code.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
    link.click();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this QR code?')) return;
    await fetch(`/api/qr/${id}`, { method: 'DELETE' });
    fetchCodes();
  };

  const handleUpdateBg = async (id: string, newBg: string) => {
    await fetch(`/api/qr/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bgColor: newBg }),
    });
    fetchCodes();
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">QR Codes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showForm ? 'Cancel' : 'New QR Code'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Spring Flyer 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="https://elorasilver.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <div className="flex gap-3 items-center">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="bg"
                  checked={bgColor === 'transparent'}
                  onChange={() => setBgColor('transparent')}
                />
                Transparent
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="bg"
                  checked={bgColor === '#ffffff'}
                  onChange={() => setBgColor('#ffffff')}
                />
                White
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="bg"
                  checked={bgColor === 'custom'}
                  onChange={() => setBgColor('custom')}
                />
                Custom
              </label>
              {bgColor === 'custom' && (
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={creating || !name.trim() || !targetUrl.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {creating ? 'Creating...' : 'Create QR Code'}
          </button>
        </form>
      )}

      {codes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No QR codes yet. Click &quot;New QR Code&quot; to create one.
        </div>
      ) : (
        <div className="grid gap-4">
          {codes.map((code) => (
            <div key={code._id} className="bg-white border rounded-xl p-4 flex gap-4 items-start">
              <div
                className="flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center"
                style={{ background: code.bgColor === 'transparent' ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 16px 16px' : code.bgColor }}
              >
                <img src={code.dataUrl} alt={code.name} className="w-20 h-20" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{code.name}</h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">{code.targetUrl}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {code.scanCount} scan{code.scanCount !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDownload(code)}
                    className="px-3 py-1 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => {
                      const newBg = prompt('Enter background color (hex like #ffffff, or "transparent"):', code.bgColor);
                      if (newBg) handleUpdateBg(code._id, newBg);
                    }}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Change BG
                  </button>
                  <button
                    onClick={() => handleDelete(code._id)}
                    className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
