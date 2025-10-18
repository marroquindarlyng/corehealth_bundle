import React from 'react'
import EmitirReceta from '../components/EmitirReceta'

export default function DashboardMedico(){
  return (
    <div style={{padding:16}}>
      <h2>Panel del Médico</h2>
      <EmitirReceta/>
    </div>
  )
}