import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function AgendaGeneral(){
  const [rows, setRows] = useState([])
  const [estado, setEstado] = useState('Confirmada')
  const [id, setId] = useState('')

  useEffect(()=>{
    // Simplificado: mostrar todas las citas de hoy (en un sistema real habría un endpoint dedicado)
    api.get('/citas/medico/1').then(({data})=>setRows(data)).catch(()=>{})
  },[])

  async function updateEstado(){
    if(!id) return
    await api.put('/citas/'+id+'/estado', { estado })
    alert('Estado actualizado')
  }

  return (
    <div>
      <h3>Agenda General (demo)</h3>
      <table>
        <thead><tr><th>ID</th><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Estado</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.fecha}</td><td>{r.hora}</td><td>{r.paciente_nombre} {r.paciente_apellido}</td><td>{r.estado}</td></tr>)}</tbody>
      </table>
      <div style={{marginTop:12}}>
        <input placeholder="ID Cita" value={id} onChange={e=>setId(e.target.value)}/>
        <select value={estado} onChange={e=>setEstado(e.target.value)}>
          <option>Confirmada</option>
          <option>Cancelada</option>
          <option>Completada</option>
          <option>No Asistida</option>
        </select>
        <button onClick={updateEstado}>Actualizar</button>
      </div>
    </div>
  )
}