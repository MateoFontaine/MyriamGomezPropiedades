// components/LocationPicker.jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

export default function LocationPicker({ onLocationSelect }) {
  const mapRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Inicializa mapa
  useEffect(() => {
    mapRef.current = L.map("map").setView([-34.6037, -58.3816], 13); // Bs As centro

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);
  }, []);

  // Buscar ubicaciones desde Nominatim
  const searchLocation = async (e) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  // Selección de dirección
  const handleSelect = (result) => {
    setQuery(result.display_name);
    setResults([]);

    const { lat, lon } = result;
    mapRef.current.setView([lat, lon], 16);
    L.marker([lat, lon]).addTo(mapRef.current);

    // Pasar coords al padre
    onLocationSelect({ lat, lon, displayName: result.display_name });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar dirección..."
        className="border p-2 rounded w-full"
      />
      <button onClick={searchLocation} className="bg-pink-600 text-white px-4 py-1 rounded">
        Buscar
      </button>

      {results.length > 0 && (
        <ul className="bg-white border rounded shadow max-h-40 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}

      <div id="map" className="h-60 w-full rounded shadow" />
    </div>
  );
}
