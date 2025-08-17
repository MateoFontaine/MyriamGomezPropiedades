import { useState } from "react";
import { uploadToCloudinary } from "../lib/uploadCloudinary";

export default function TestUpload() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(""); setUrl("");
    try {
      const u = await uploadToCloudinary(file);
      setUrl(u);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <input type="file" accept="image/*" onChange={onChange} disabled={busy} />
      {busy && <p>Subiendo...</p>}
      {err && <p className="text-red-600">{err}</p>}
      {url && (
        <div>
          <p className="text-sm break-all">{url}</p>
          <img src={url} alt="preview" className="mt-2 w-full h-64 object-cover rounded" />
        </div>
      )}
    </div>
  );
}
