import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventCard from "./components/EventCard";
import api from "./services/api";

const blankEvent = { title: "", type: "Conferencia", date: "", time: "", location: "", speaker: "", capacity: 50, description: "" };
const blankParticipant = { name: "", email: "", role: "Estudiante", career: "" };

export default function App() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [eventForm, setEventForm] = useState(blankEvent);
  const [participantForm, setParticipantForm] = useState(blankParticipant);
  const [editing, setEditing] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [modal, setModal] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [a, b, c] = await Promise.all([api.get("/events"), api.get("/participants"), api.get("/enrollments")]);
      setEvents(a.data); setParticipants(b.data); setEnrollments(c.data);
    } catch { setMessage("No se pudo conectar con la API. Verifica que JSON Server esté ejecutándose."); }
  }, []);
  useEffect(() => { loadData(); }, [loadData]);

  const count = (id) => enrollments.filter((item) => Number(item.eventId) === Number(id)).length;
  const filtered = useMemo(() => events.filter((event) => [event.title, event.speaker, event.location].join(" ").toLowerCase().includes(search.toLowerCase()) && (filter === "Todos" || event.type === filter)), [events, search, filter]);

  const saveEvent = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/events/${editing}`, eventForm); else await api.post("/events", eventForm);
    setModal(""); setEditing(null); setEventForm(blankEvent); setMessage("Evento guardado correctamente."); loadData();
  };
  const editEvent = (event) => { setEditing(event.id); setEventForm(event); setModal("event"); };
  const deleteEvent = async (event) => { if (!confirm(`¿Eliminar ${event.title}?`)) return; await api.delete(`/events/${event.id}`); setMessage("Evento eliminado."); loadData(); };
  const saveParticipant = async (e) => { e.preventDefault(); await api.post("/participants", participantForm); setParticipantForm(blankParticipant); setModal(""); setMessage("Participante registrado."); loadData(); };
  const openEnroll = (event) => { setSelectedEvent(event); setSelectedParticipant(""); setModal("enroll"); };
  const enroll = async (e) => {
    e.preventDefault();
    const exists = enrollments.some((item) => Number(item.eventId) === Number(selectedEvent.id) && Number(item.participantId) === Number(selectedParticipant));
    if (exists) return setMessage("Este participante ya está inscrito.");
    await api.post("/enrollments", { eventId: selectedEvent.id, participantId: Number(selectedParticipant), date: new Date().toISOString() });
    setModal(""); setMessage("Inscripción realizada correctamente."); loadData();
  };

  return <div><Navbar />{message && <div className="alert-message" onClick={() => setMessage("")}>{message}</div>}
    <Routes>
      <Route path="/" element={<><section className="hero"><div><span className="eyebrow">Tu comunidad académica en un solo lugar</span><h1>Conecta, aprende y<br/>vive la universidad</h1><p>Descubre conferencias, talleres y seminarios para impulsar tu formación.</p><button className="btn btn-primary btn-lg" onClick={() => navigate("/eventos")}>Explorar eventos →</button><div className="hero-search">⌕ <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && navigate("/eventos")} placeholder="Buscar eventos, temas o ponentes" /></div></div><div className="building-art"><div className="circle"></div><div className="college">▱<br/>▥▥▥▥<br/>▔▔▔</div></div></section><section className="section"><div className="section-title"><div><span className="eyebrow">Agenda académica</span><h2>Próximos eventos</h2></div><button className="link-button" onClick={() => navigate("/eventos")}>Ver todos →</button></div><div className="event-grid">{events.slice(0,3).map((event) => <EventCard key={event.id} event={event} enrolled={count(event.id)} onEnroll={openEnroll}/>)}</div></section></>} />
      <Route path="/eventos" element={<main className="page section"><div className="page-head"><div><span className="eyebrow">Gestión académica</span><h1>Eventos universitarios</h1><p>Administra conferencias, talleres y seminarios.</p></div><button className="btn btn-primary" onClick={() => { setEditing(null); setEventForm(blankEvent); setModal("event"); }}>+ Registrar evento</button></div><div className="filters"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por evento, ponente o lugar"/><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>Todos</option><option>Conferencia</option><option>Taller</option><option>Seminario</option></select></div><p className="result">{filtered.length} eventos encontrados</p><div className="event-grid">{filtered.map((event) => <EventCard key={event.id} event={event} enrolled={count(event.id)} onEnroll={openEnroll} onEdit={editEvent} onDelete={deleteEvent} admin/>)}</div></main>} />
      <Route path="/participantes" element={<main className="page section"><div className="page-head"><div><span className="eyebrow">Comunidad</span><h1>Participantes</h1><p>Consulta estudiantes y docentes registrados.</p></div><button className="btn btn-primary" onClick={() => setModal("participant")}>+ Registrar participante</button></div><div className="participants"><div className="participant header"><span>Participante</span><span>Perfil académico</span><span>Rol</span></div>{participants.map((p) => <div className="participant" key={p.id}><div className="person"><span className="avatar">{p.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span><div><b>{p.name}</b><small>{p.email}</small></div></div><span>{p.career}</span><span className="badge-soft">{p.role}</span></div>)}</div></main>} />
    </Routes>
    <footer><b>Campus Eventos</b><span>Proyecto académico de Desarrollo Web · 2026</span></footer>
    {modal && <div className="modal-bg"><div className="modal-box"><button className="close" onClick={() => setModal("")}>×</button>
      {modal === "event" && <form onSubmit={saveEvent}><h2>{editing ? "Editar evento" : "Registrar evento"}</h2><div className="form-grid"><label className="full">Título<input required value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})}/></label><label>Tipo<select value={eventForm.type} onChange={e=>setEventForm({...eventForm,type:e.target.value})}><option>Conferencia</option><option>Taller</option><option>Seminario</option></select></label><label>Ponente<input required value={eventForm.speaker} onChange={e=>setEventForm({...eventForm,speaker:e.target.value})}/></label><label>Fecha<input type="date" required value={eventForm.date} onChange={e=>setEventForm({...eventForm,date:e.target.value})}/></label><label>Hora<input type="time" required value={eventForm.time} onChange={e=>setEventForm({...eventForm,time:e.target.value})}/></label><label>Ubicación<input required value={eventForm.location} onChange={e=>setEventForm({...eventForm,location:e.target.value})}/></label><label>Capacidad<input type="number" min="1" required value={eventForm.capacity} onChange={e=>setEventForm({...eventForm,capacity:Number(e.target.value)})}/></label><label className="full">Descripción<textarea value={eventForm.description} onChange={e=>setEventForm({...eventForm,description:e.target.value})}/></label></div><button className="btn btn-primary w-100 mt-3">Guardar evento</button></form>}
      {modal === "participant" && <form onSubmit={saveParticipant}><h2>Registrar participante</h2><label>Nombre completo<input required value={participantForm.name} onChange={e=>setParticipantForm({...participantForm,name:e.target.value})}/></label><label>Correo<input type="email" required value={participantForm.email} onChange={e=>setParticipantForm({...participantForm,email:e.target.value})}/></label><label>Rol<select value={participantForm.role} onChange={e=>setParticipantForm({...participantForm,role:e.target.value})}><option>Estudiante</option><option>Docente</option></select></label><label>Carrera o facultad<input required value={participantForm.career} onChange={e=>setParticipantForm({...participantForm,career:e.target.value})}/></label><button className="btn btn-primary w-100 mt-3">Registrar participante</button></form>}
      {modal === "enroll" && <form onSubmit={enroll}><h2>Inscripción</h2><p><b>{selectedEvent?.title}</b></p><label>Selecciona un participante<select required value={selectedParticipant} onChange={e=>setSelectedParticipant(e.target.value)}><option value="">Elegir…</option>{participants.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="btn btn-primary w-100 mt-3">Confirmar inscripción</button></form>}
    </div></div>}
  </div>;
}
