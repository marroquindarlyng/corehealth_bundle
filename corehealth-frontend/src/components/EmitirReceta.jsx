import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function EmitirReceta(){
  const [meds, setMeds] = useState([])
  const [f, setF] = useState({cita_id:'', diagnostico_id:'', observaciones:'', medicamentos:[]})
  const [msg, setMsg] = useState(null)

  useEffect(()=>{
    api.get('/medicamentos').then(({data}) => setMeds(data))
  }, [])

  function addMed(){
    setF({...f, medicamentos:[...f.medicamentos, {medicamento_id:'', indicaciones:'', duracion_dias:''}]})
  }
  function upMed(i,k,v){
    const arr=[...f.medicamentos]; arr[i] = {...arr[i], [k]:v}; setF({...f, medicamentos:arr})
  }
  async function submit(e){
    e.preventDefault()
    try{
      const { data } = await api.post('/recetas', f)
      setMsg('Receta creada con id '+data.id)
    }catch(e){ setMsg('Error al emitir receta') }
  }

  return (
    <div>
      <h3>Emitir Receta</h3>
      <form onSubmit={submit}>
        <input placeholder="Cita ID" value={f.cita_id} onChange={e=>setF({...f, cita_id:e.target.value})}/>
        <input placeholder="Diagnóstico ID" value={f.diagnostico_id} onChange={e=>setF({...f, diagnostico_id:e.target.value})}/>
        <textarea placeholder="Observaciones" value={f.observaciones} onChange={e=>setF({...f, observaciones:e.target.value})}/>
        <h4>Medicamentos</h4>
        {f.medicamentos.map((m,i)=>(
          <div key={i} style={{border:'1px solid #ccc', padding:8, marginBottom:8}}>
            <select value={m.medicamento_id} onChange={e=>upMed(i,'medicamento_id',e.target.value)}>
              <option value="">Seleccione medicamento</option>
              {meds.map(md => <option key={md.id} value={md.id}>{md.nombre}</option>)}
            </select>
            <input placeholder="Indicaciones" value={m.indicaciones} onChange={e=>upMed(i,'indicaciones',e.target.value)}/>
            <input placeholder="Duración (días)" value={m.duracion_dias} onChange={e=>upMed(i,'duracion_dias',e.target.value)}/>
          </div>
        ))}
        <button type="button" onClick={addMed}>Añadir medicamento</button>
        <button>Guardar Receta</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}