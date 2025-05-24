import { useState } from "react";
import { RavenMatrixPage } from "@/pages/RavenMatrixPage.tsx";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import Welcome from "@/pages/Welcome";
import Footer from "@/components/Footer";

enum Page {
  HOME,
  RAVEN_MATRIX,
  END,
  DASHBOARD,
}

interface StudentData {
  nombres: string;
  apellidos: string;
  sexo: string;
  rut: string;
  direccion: string;
  grado: string;
  telefono: string;
  correo: string;
  razon: string;
}

export default function App() {
  const [page, setPage] = useState<Page>(Page.HOME);
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  // Cuando el usuario termina el formulario y acepta, se guarda y avanza al test
  const handleStartTest = (data: StudentData) => {
    setStudentData(data);
    setPage(Page.RAVEN_MATRIX);
  };

  // Cuando termina el test, va a la página final
  const handleEndTest = () => {
    setPage(Page.END);
  };

  // Volver al inicio
  const handleBackToHome = () => {
    setStudentData(null);
    setPage(Page.HOME);
  };

  // Dashboard (opcional)
  const handleDashboard = () => {
    setPage(Page.DASHBOARD);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {page === Page.HOME && (
        <Welcome goToStartPage={handleStartTest} />
      )}
      {page === Page.RAVEN_MATRIX && (
        <RavenMatrixPage
          studentData={studentData}
          goToNextPage={handleEndTest}
        />
      )}
      {page === Page.END && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h1>¡Gracias por completar el test!</h1>
          <h2>Estos son tus datos:</h2>
          {studentData && (
            <ul style={{ textAlign: "left" }}>
              <li><b>Nombres:</b> {studentData.nombres}</li>
              <li><b>Apellidos:</b> {studentData.apellidos}</li>
              <li><b>Sexo:</b> {studentData.sexo}</li>
              <li><b>RUT:</b> {studentData.rut}</li>
              <li><b>Dirección:</b> {studentData.direccion}</li>
              <li><b>Grado académico:</b> {studentData.grado}</li>
              <li><b>Teléfono:</b> {studentData.telefono}</li>
              <li><b>Correo:</b> {studentData.correo}</li>
              <li><b>Razón de examen:</b> {studentData.razon}</li>
            </ul>
          )}
          <button onClick={handleBackToHome} style={{ marginTop: 24 }}>Volver al inicio</button>
        </div>
      )}
      {page === Page.DASHBOARD && (
        <AnalyticsDashboard onBack={handleBackToHome} />
      )}
      <Footer />
    </div>
  );
}