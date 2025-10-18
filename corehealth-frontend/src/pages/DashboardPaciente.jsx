import React from 'react'
import AgendarCita from '../components/AgendarCita'
import HistorialCitas from '../components/HistorialCitas'
import VerRecetas from '../components/VerRecetas'

export default function DashboardPaciente(){
  return (
    <div style={{padding:16}}>
      <h2>Panel del Paciente</h2>
      <AgendarCita/>
      <hr/>
      <HistorialCitas/>
      <hr/>
      <VerRecetas/>
    </div>
  )
}