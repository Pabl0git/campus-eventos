import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  test("muestra el nombre de la aplicación", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Campus Eventos")).toBeInTheDocument();
  });

  test("muestra las opciones de navegación", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Inicio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Eventos" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Participantes" })
    ).toBeInTheDocument();
  });

  test("los enlaces tienen las rutas correctas", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Inicio" }))
      .toHaveAttribute("href", "/");

    expect(screen.getByRole("link", { name: "Eventos" }))
      .toHaveAttribute("href", "/eventos");

    expect(screen.getByRole("link", { name: "Participantes" }))
      .toHaveAttribute("href", "/participantes");
  });
});
