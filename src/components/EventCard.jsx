export default function EventCard({ event, enrolled = 0, onEnroll, onEdit, onDelete, admin = false }) {
  const date = new Date(`${event.date}T12:00:00`);
  const free = event.capacity - enrolled;
  return (
    <article className="event-card">
      <div className="d-flex justify-content-between align-items-start">
        <div className="date-box"><strong>{String(date.getDate()).padStart(2, "0")}</strong><span>{date.toLocaleDateString("es-PE", { month: "short" }).toUpperCase()}</span></div>
        <span className="badge-soft">{event.type}</span>
      </div>
      <h3>{event.title}</h3>
      <p className="speaker">Por {event.speaker}</p>
      <p className="meta">◷ {event.time}</p><p className="meta">⌖ {event.location}</p>
      <div className="capacity"><span><b>{free}</b> cupos disponibles</span><span>{enrolled}/{event.capacity}</span></div>
      <div className="card-buttons">
        <button className="btn btn-primary flex-grow-1" onClick={() => onEnroll(event)} disabled={free <= 0}>{free > 0 ? "Inscribirme" : "Completo"}</button>
        {admin && <><button className="btn btn-outline-primary" onClick={() => onEdit(event)} aria-label={`Editar ${event.title}`}>✎</button><button className="btn btn-outline-danger" onClick={() => onDelete(event)} aria-label={`Eliminar ${event.title}`}>×</button></>}
      </div>
    </article>
  );
}
