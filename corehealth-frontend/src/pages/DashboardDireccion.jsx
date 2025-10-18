import React, { useEffect, useState } from 'react'
import api from '../api/axios'

function Card({ title, value }) {
  return <div style={{border:'1px solid #ddd', padding:16, borderRadius:8, minWidth:200}}>
    <h4>{title}</h4><div style={{fontSize:28}}>{value}</div>
  </div>
}

export default function DashboardDireccion(){
  const [kpis, setKpis] = useState({medicos:[], diag:[], ausentismo:null})

  useEffect(()=>{
    Promise.all([
      api.get('/kpis/consultas-por-medico'),
      api.get('/kpis/diagnosticos-frecuentes'),
      api.get('/kpis/ausentismo'),
    ]).then(([m,d,a]) => setKpis({medicos:m.data, diag:d.data, ausentismo:a.data}))
  }, [])

  return (
    <div style={{padding:16, display:'flex', gap:16, flexWrap:'wrap'}}>
      <Card title="Ausentismo" value={kpis.ausentismo ? (kpis.ausentismo.ratio*100).toFixed(1)+'%' : '—'} />
      <div style={{flexBasis:'100%'}}/>
      <div>
        <h3>Consultas por Médico</h3>
        <ul>{kpis.medicos.map(r => <li key={r.medico_id}>Medico #{r.medico_id}: {r.total}</li>)}</ul>
      </div>
      <div>
        <h3>Diagnósticos frecuentes</h3>
        <ul>{kpis.diag.map(r => <li key={r.diagnostico_id}>Diagnóstico #{r.diagnostico_id}: {r.total}</li>)}</ul>
      </div>
    </div>
  )
}