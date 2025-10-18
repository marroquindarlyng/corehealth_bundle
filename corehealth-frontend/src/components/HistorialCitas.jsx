import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function HistorialCitas(){
  const { user } = useAuth()
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (user) {
      api.get('/citas/paciente/' + user.id).then(({data}) => setRows(data))
    }
  }, [user])

  return (
    <div>
      <h3>Historial de Citas</h3>
      <table>
        <thead><tr><th>Fecha</th><th>Hora</th><th>Médico</th><th>Estado</th></tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}><td>{r.fecha}</td><td>{r.hora}</td><td>{r.medico_nombre}</td><td>{r.estado}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}