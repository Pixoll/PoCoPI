import { useState } from "react";
import ConsentPop from "../components/ConsentPop";
import CustomTextField from "../components/CustomTextField";

interface WelcomeProps {
  goToStartPage: (data: any) => void;
}

function Welcome({ goToStartPage }: WelcomeProps) {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [studentData, setStudentData] = useState({
    nombres: "",
    apellidos: "",
    sexo: "",
    rut: "",
    direccion: "",
    grado: "",
    telefono: "",
    correo: "",
    razon: "",
  });

  const handleConsent = (accepted: boolean) => {
    setConsentGiven(accepted);
    setShowConsent(false);
  };

  const handleChange = (field: string, value: string) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consentGiven) {
      goToStartPage(studentData);
    } else {
      alert("Debes aceptar los términos y condiciones para continuar.");
    }
  };

  return (
    <div className="general-welcome">
      {!showForm ? (
        <div className="welcome-container">
          <h1>¡Bienvenido al Test!</h1>
          <h2>Estamos encantados de que hayas decidido participar. ¡Muchas Gracias!</h2>
          {!consentGiven && (
            <button onClick={() => setShowConsent(true)}>Mostrar Términos y Condiciones</button>
          )}
          {consentGiven && <p>Has aceptado los Términos y Condiciones.</p>}
          <button onClick={() => setShowForm(true)}>Ir al Formulario</button>
        </div>
      ) : (
        <form className="general-form" onSubmit={handleSubmit}>
          <div className="content-form">
            <div className="information-form">
              <h1>Ingrese sus<br />Datos</h1>
              <h2>Complete todos los campos antes de continuar con la encuesta</h2>
            </div>
            <div className="data-form">
              <div className="data-container-form">
                <div>
                  <CustomTextField width="45%" height="100%" hintText="Nombres" value={studentData.nombres} onChange={e => handleChange("nombres", e.target.value)} />
                  <CustomTextField width="45%" height="100%" hintText="Apellidos" value={studentData.apellidos} onChange={e => handleChange("apellidos", e.target.value)} />
                </div>
                <div>
                  <CustomTextField width="45%" height="100%" hintText="Sexo" value={studentData.sexo} onChange={e => handleChange("sexo", e.target.value)} />
                  <CustomTextField width="45%" height="100%" hintText="Rut" value={studentData.rut} onChange={e => handleChange("rut", e.target.value)} />
                </div>
                <div>
                  <CustomTextField width="45%" height="100%" hintText="Direccion" value={studentData.direccion} onChange={e => handleChange("direccion", e.target.value)} />
                  <CustomTextField width="45%" height="100%" hintText="Grado academico" value={studentData.grado} onChange={e => handleChange("grado", e.target.value)} />
                </div>
                <div>
                  <CustomTextField width="45%" height="100%" hintText="Numero de telefono" value={studentData.telefono} onChange={e => handleChange("telefono", e.target.value)} />
                  <CustomTextField width="45%" height="100%" hintText="correo electronico" value={studentData.correo} onChange={e => handleChange("correo", e.target.value)} />
                </div>
                <div>
                  <CustomTextField width="95%" height="100%" hintText="Razon de examen" value={studentData.razon} onChange={e => handleChange("razon", e.target.value)} />
                </div>
                <div style={{ margin: "20px 0" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={e => setConsentGiven(e.target.checked)}
                      required
                    />{" "}
                    He leído y acepto el consentimiento informado
                  </label>
                </div>
                <button type="submit">Comenzar Test</button>
                <button type="button" onClick={() => setShowForm(false)}>Volver</button>
              </div>
            </div>
          </div>
        </form>
      )}
      {showConsent && (
        <ConsentPop
          onClose={() => setShowConsent(false)}
          onAccept={() => handleConsent(true)}
          onReject={() => handleConsent(false)}
        />
      )}
    </div>
  );
}

export default Welcome;