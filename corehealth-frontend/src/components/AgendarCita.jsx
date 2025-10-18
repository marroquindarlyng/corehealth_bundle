import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function AgendarCita(){
  const [cats, setCats] = useState({especialidades:[], medicos:[], consultas:[], eventos:[]})
  const [f, setF] = useState({paciente_id:'', medico_id:'', especialidad_id:'', consulta_id:'', evento_id:'', fecha:'', hora:''})
  const [msg, setMsg] = useState(null)

  useEffect(()=>{
    Promise.all([
      api.get('/especialidades'),
      api.get('/medicos'),
      api.get('/consultas'),
      api.get('/eventos'),
    ]).then(([e,m,c,v]) => setCats({especialidades:e.data, medicos:m.data, consultas:c.data, eventos:v.data}))
  },[])

  function up(k,v){ setF({...f,[k]:v}) }

  async function submit(e){
    e.preventDefault()
    try{
      const { data } = await api.post('/citas', f)
      setMsg('Cita creada con id ' + data.id)
    }catch(err){
      setMsg('Error al crear cita')
    }
  }

  return (
    <div>
      <h3>Agendar Cita</h3>
      <form onSubmit={submit}>
        <input placeholder="Paciente ID" value={f.paciente_id} onChange={e=>up('paciente_id',e.target.value)}/>
        <select value={f.medico_id} onChange={e=>up('medico_id',e.target.value)}>
          <option value="">Seleccione médico</option>
          {cats.medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>)}
        </select>
        <select value={f.especialidad_id} onChange={e=>up('especialidad_id',e.target.value)}>
          <option value="">Especialidad</option>
          {cats.especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={f.consulta_id} onChange={e=>up('consulta_id',e.target.value)}>
          <option value="">Consulta</option>
          {cats.consultas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select value={f.evento_id} onChange={e=>up('evento_id',e.target.value)}>
          <option value="">Evento</option>
          {cats.eventos.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
        </select>
        <input placeholder="Fecha (YYYY-MM-DD)" value={f.fecha} onChange={e=>up('fecha',e.target.value)}/>
        <input placeholder="Hora (HH:MM)" value={f.hora} onChange={e=>up('hora',e.target.value)}/>
        <button>Agendar</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}