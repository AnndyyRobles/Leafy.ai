"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface Technique {
  id: number;
  name: string;
}

interface TechniquesFilterProps {
  selectedTechnique: string | null
  onSelectTechnique: (technique: string | null) => void
}

export function TechniquesFilter({ selectedTechnique, onSelectTechnique }: TechniquesFilterProps) {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar las técnicas de cultivo desde la API
    const fetchTechniques = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/techniques`);
        setTechniques(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las técnicas de cultivo:", err);
        setError("No se pudieron cargar las técnicas de cultivo");
        setLoading(false);
      }
    };

    fetchTechniques();
  }, []);

  if (loading) return <div className="flex-1">Cargando técnicas...</div>;
  if (error) return <div className="flex-1 text-red-500">{error}</div>;

  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTechnique === null
              ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
              : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
          }`}
          onClick={() => onSelectTechnique(null)}
        >
          All
        </button>

        {techniques.map((technique) => (
          <button
            key={technique.id}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTechnique === technique.name
                ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
                : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
            }`}
            onClick={() => onSelectTechnique(technique.name)}
          >
            {technique.name}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search posts..."
          className="px-4 py-1.5 rounded-full border border-leafy-green-light/30 focus:outline-none focus:ring-2 focus:ring-leafy-green-medium w-full"
        />
      </div>
    </div>
  )
}