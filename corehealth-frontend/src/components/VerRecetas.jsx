import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function VerRecetas(){
  const [citaId, setCitaId] = useState('')
  const [data, setData] = useState(null)

  async function load(){
    const { data } = await api.get('/recetas/cita/' + citaId)
    setData(data)
  }

  return (
    <div>
      <h3>Ver Receta por Cita</h3>
      <input placeholder="Cita ID" value={citaId} onChange={e=>setCitaId(e.target.value)} />
      <button onClick={load}>Buscar</button>
      {data && <div>
        <p><b>Diagnóstico:</b> {data.diagnostico_nombre}</p>
        <p><b>Observaciones:</b> {data.observaciones}</p>
        <h4>Medicamentos</h4>
        <ul>{data.detalle.map(d => <li key={d.id}>{d.medicamento_nombre} — {d.indicaciones} ({d.duracion_dias} días)</li>)}</ul>
      </div>}
    </div>
  )
}