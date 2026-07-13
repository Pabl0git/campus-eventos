import { render, screen } from "@testing-library/react";
import EventCard from "./EventCard";

test("muestra la información principal de un evento", () => {
  const event = { id: 1, title: "Taller React", type: "Taller", date: "2026-08-20", time: "10:00", location: "Laboratorio", speaker: "Docente", capacity: 30 };
  render(<EventCard event={event} onEnroll={() => {}} />);
  expect(screen.getByText("Taller React")).toBeInTheDocument();
  expect(screen.getByText((_, element) => element?.textContent === "30 cupos disponibles")).toBeInTheDocument();
});
