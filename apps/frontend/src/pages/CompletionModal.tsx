// Modal de finalización del test: muestra agradecimiento, datos del usuario y opciones

import { useTheme } from "@/hooks/useTheme";
import { UserData } from "@/types/user";
import type { UserSummary } from "@/api/types.gen";
import {
  faChartLine,
  faCheck,
  faEnvelope,
  faHome,
  faIdCard,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import sdk from "@/api";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import React, { useState } from "react";

// Props del modal de finalización
type CompletionModalProps = {
  userData: UserData | null;
  onBackToHome: () => void;
};

// Componente principal del modal de finalización
export function CompletionModal({
  userData,
  onBackToHome,
}: CompletionModalProps) {
  const { isDarkMode } = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userResult, setUserResult] = useState<UserSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserResult = async () => {
    if (!userData) return;
    setLoading(true);
    setError(null);
    try {
      // getSummary retorna { data: Summary, ... }
      const res = await sdk.getSummary();
      const summary = res?.data;
      if (summary && summary.users) {
        let user: UserSummary | undefined;
        if (!userData.anonymous && userData.email) {
          user = summary.users.find((u) => u.email === userData.email);
        } else {
          user = summary.users.find((u) => u.id === userData.id);
        }
        setUserResult(user || null);
      } else {
        setUserResult(null);
      }
    } catch {
      setError("No se pudo obtener el resultado. Intenta de nuevo.");
      setUserResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className={`min-vh-100 d-flex align-items-center justify-content-center py-5 ${isDarkMode ? "bg-dark" : "bg-light"
        }`}
    >
      {/* Fondo decorativo */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: isDarkMode
            ? "radial-gradient(circle, rgba(121, 132, 255, 0.05) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>

      <Row
        className="justify-content-center w-100 position-relative"
        style={{ zIndex: 1 }}
      >
        <Col xs={12} md={8} lg={6} xl={5}>
          {/* Card principal */}
          <Card
            className={`shadow-lg border-0 rounded-4 overflow-hidden text-center ${isDarkMode ? "bg-dark text-light" : ""
              }`}
            style={{
              boxShadow: isDarkMode
                ? "0 0 30px rgba(121, 132, 255, 0.2), 0 0 10px rgba(0, 0, 0, 0.3)"
                : "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Encabezado con ícono y mensaje */}
            <div
              className={`${isDarkMode ? "bg-primary" : "bg-success"
                } text-white py-4 position-relative`}
              style={{
                borderBottom: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
              }}
            >
              {/* Fondo SVG decorativo */}
              <div
                className="position-absolute start-0 top-0 bottom-0 end-0"
                style={{
                  background: isDarkMode
                    ? "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPjxjaXJjbGUgcj0iNyIgY3g9IjE1IiBjeT0iMTUiLz48Y2lyY2xlIHI9IjciIGN4PSI0NSIgY3k9IjE1Ii8+PGNpcmNsZSByPSI3IiBjeD0iNzUiIGN5PSIxNSIvPjxjaXJjbGUgcj0iNyIgY3g9IjEwNSIgY3k9IjE1Ii8+PGNpcmNsZSByPSI3IiBjeD0iMTM1IiBjeT0iMTUiLz48Y2lyY2xlIHI9IjciIGN4PSIxNSIgY3k9IjQ1Ii8+PGNpcmNsZSByPSI3IiBjeD0iNDUiIGN5PSI0NSIvPjxjaXJjbGUgcj0iNyIgY3g9Ijc1IiBjeT0iNDUiLz48Y2lyY2xlIHI9IjciIGN4PSIxMDUiIGN5PSI0NSIvPjxjaXJjbGUgcj0iNyIgY3g9IjEzNSIgY3k9IjQ1Ii8+PGNpcmNsZSByPSI3IiBjeD0iMTUiIGN5PSI3NSIvPjxjaXJjbGUgcj0iNyIgY3g9IjQ1IiBjeT0iNzUiLz48Y2lyY2xlIHI9IjciIGN4PSI3NSIgY3g9Ijc1Ii8+PGNpcmNsZSByPSI3IiBjeD0iMTA1IiBjeT0iNzUiLz48Y2lyY2xlIHI9IjciIGN4PSIxMzUiIGN5PSI3NSIvPjxjaXJjbGUgcj0iNyIgY3g9IjE1IiBjeT0iMTA1Ii8+PGnpcmNsZSByPSI3IiBjeD0iNDUiIGN5PSIxMDUiLz48Y2lyY2xlIHI9IjciIGN4PSI3NSIgY3k9IjEwNSIvPjxjaXJjbGUgcj0iNyIgY3g9IjEwNSIgY3k9IjEwNSIvPjxjaXJjbGUgcj0iNyIgY3g9IjEzNSIgY3k9IjEwNSIvPjxjaXJjbGUgcj0iNyIgY3g9IjE1IiBjeT0iMTM1Ii8+PGNpcmNsZSByPSI3IiBjeD0iNDUiIGN5PSIxMzUiLz48Y2lyY2xlIHI9IjciIGN4PSI3NSIgY3g9IjEzNSIvPjxjaXJjbGUgcj0iNyIgY3g9IjEwNSIgY3k9IjEzNSIvPjxjaXJjbGUgcj0iNyIgY3g9IjEzNSIgY3k9IjEzNSIvPjwvZz48L3N2Zz4=')"
                    : "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+CiAgPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEwIiBjeT0iMTAiLz4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjQwIiBjeT0iMTAiLz4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjcwIiBjeT0iMTAiLz4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEwMCIgY3k9IjEwIi8+CiAgICA8Y2lyY2xlIHI9IjUiIGN4PSIxMzAiIGN5PSIxMCIvPgogICAgCiAgICA8Y2lyY2xlIHI9IjUiIGN4PSIxMCIgY3k9IjQwIi8+CiAgICA8Y2lyY2xlIHI9IjUiIGN4PSI0MCIgY3k9IjQwIi8+CiAgICA8Y2lyY2xlIHI9IjUiIGN4PSI3MCIgY3k9IjQwIi8+CiAgICA8Y2lyY2xlIHI9IjUiIGN4PSIxMDAiIGN5PSI0MCIvPgogICAgPGnpcmNsZSByPSI1IiBjeD0iMTMwIiBjeT0iNDAiLz4KICAgIAogICAgPGnpcmNsZSByPSI1IiBjeD0iMTAiIGN5PSI3NSIvPgogICAgPGNpcmNsZSByPSI1IiBjeD0iNDAiIGN5PSI3NSIvPgogICAgPGnpcmNsZSByPSI1IiBjeD0iNzAiIGN5PSI3NSIvPgogICAgPGnpcmNsZSByPSI1IiBjeD0iMTAwIiBjeT0iNzUiLz4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEzMCIgY3k9Ijc1Ii8+CiAgICAKICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEwIiBjeT0iMTAwIi8+CiAgICA8Y2lyY2xlIHI9IjUiIGN4PSI0MCIgY3k9IjEwMCIvPgogICAgPGNpcmNsZSByPSI1IiBjeD0iNzAiIGN5PSIxMDAiLz4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEwMCIgY3k9IjEwMCIvPgogICAgPGNpcmNsZSByPSI1IiBjeD0iMTMwIiBjeT0iMTAwIi8+CiAgICAKICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEwIiBjeT0iMTMwIi8+CiAgICA8Y2lyY2xlIHI9IjUiIGN4PSI0MCIgY3k9IjEzMCIvPgogICAgPGNpcmNsZSByPSI1IiBjeD0iNzAiIGN5PSIxMzAiLz4KICAgIDxjaXJjbGUgcj0iNSIgY3g9IjEwMCIgY3k9IjEzMCIvPgogICAgPGNpcmNsZSByPSI1IiBjeD0iMTMwIiBjeT0iMTMwIi8+CiAgPC9nPgo8L3N2Zz4=')",
                  opacity: 0.7,
                }}
              />
              <div className="position-relative">
                <div
                  className={`mb-3 d-inline-flex p-3 rounded-circle ${isDarkMode
                    ? "bg-primary-subtle"
                    : "bg-success bg-opacity-25"
                    }`}
                  style={{
                    boxShadow: isDarkMode
                      ? "0 0 20px rgba(121, 132, 255, 0.4)"
                      : "0 0 20px rgba(76, 201, 162, 0.4)",
                  }}
                >
                  <FontAwesomeIcon icon={faTrophy} className="fa-3x" />
                </div>
                <h2 className="h3 mb-0">{config.t("completion.testCompleted")}</h2>
                <Badge
                  bg={isDarkMode ? "primary" : "light"}
                  text={isDarkMode ? "light" : "success"}
                  className="mt-2"
                  style={{
                    boxShadow: isDarkMode
                      ? "0 0 10px rgba(121, 132, 255, 0.3)"
                      : "0 0 10px rgba(76, 201, 162, 0.3)",
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} className="me-1" />
                  {config.t("completion.successfullySubmitted")}
                </Badge>
              </div>
            </div>

            {/* Cuerpo del card */}
            <Card.Body className={`p-4 p-md-5 ${isDarkMode ? "bg-dark" : ""}`}>
              <div className="mb-4">
                {userData && (
                  <h4 className="h5 mb-4">
                    {config.t("completion.thankYou", !userData.anonymous ? userData.name : "")}
                  </h4>
                )}

                <p className="lead">
                  {config.t("completion.successfullyCompleted", config.title)}
                </p>
              </div>

              {/* Card de información del usuario */}
              {userData && !userData.anonymous && (
                <Card
                  className={`mb-4 border ${isDarkMode
                    ? "bg-dark border-primary border-opacity-25"
                    : "bg-light"
                    }`}
                  style={{
                    boxShadow: isDarkMode
                      ? "0 0 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(121, 132, 255, 0.1)"
                      : "0 0 10px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Card.Body>
                    <Card.Title className="h6 mb-3 text-start d-flex align-items-center">
                      <span
                        className={`me-2 badge ${isDarkMode
                          ? "bg-primary-subtle text-primary-emphasis"
                          : "bg-light text-secondary"
                          }`}
                      >
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        {config.t("completion.userInfo")}
                      </span>
                      {config.t("completion.registrationInformation")}
                    </Card.Title>
                    <div>
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className={`me-3 p-2 rounded-circle ${isDarkMode
                            ? "bg-primary bg-opacity-10 text-primary"
                            : "bg-light text-success"
                            }`}
                          style={{
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="text-start">
                          <div
                            className={`small ${isDarkMode
                              ? "text-primary-emphasis"
                              : "text-secondary"
                              }`}
                          >
                            {config.t("completion.name")}
                          </div>
                          <div className={isDarkMode ? "text-light" : ""}>
                            {userData.name}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <div
                          className={`me-3 p-2 rounded-circle ${isDarkMode
                            ? "bg-primary bg-opacity-10 text-primary"
                            : "bg-light text-success"
                            }`}
                          style={{
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faIdCard} />
                        </div>
                        <div className="text-start">
                          <div
                            className={`small ${isDarkMode
                              ? "text-primary-emphasis"
                              : "text-secondary"
                              }`}
                          >
                            {config.t("completion.identification")}
                          </div>
                          <div className={isDarkMode ? "text-light" : ""}>
                            {userData.id}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <div
                          className={`me-3 p-2 rounded-circle ${isDarkMode
                            ? "bg-primary bg-opacity-10 text-primary"
                            : "bg-light text-success"
                            }`}
                          style={{
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <div className="text-start">
                          <div
                            className={`small ${isDarkMode
                              ? "text-primary-emphasis"
                              : "text-secondary"
                              }`}
                          >
                            {config.t("completion.email")}
                          </div>
                          <div className={isDarkMode ? "text-light" : ""}>
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Card de opciones adicionales */}
              <Card
                className={`mb-4 border ${isDarkMode
                  ? "border-primary border-opacity-25 bg-dark"
                  : "bg-light"
                  }`}
                style={{
                  boxShadow: isDarkMode
                    ? "0 0 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(121, 132, 255, 0.1)"
                    : "0 0 10px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Card.Body className="p-3">
                  <Card.Title className="h6 mb-3 text-start">
                    {config.t("completion.additionalOptions")}
                  </Card.Title>
                  <Row className="g-2">
                    <Col xs={12}>
                      <Button
                        variant={isDarkMode ? "outline-primary" : "outline-success"}
                        className="w-100 py-2 mb-2"
                        size="sm"
                        onClick={() => {
                          if (!showResults) fetchUserResult();
                          setShowResults((prev) => !prev);
                        }}
                      >
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />
                        {showResults ? "Ocultar resultados" : config.t("completion.viewResults")}
                      </Button>
                    </Col>
                  </Row>
                  {/* Modal simple para mostrar resultados */}
                  {showResults && (
                    <div
                      className={`mt-3 p-4 rounded-4 position-relative ${isDarkMode ? "bg-dark text-light border border-primary border-opacity-50" : "bg-light border"}`}
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(121,132,255,0.10) 0%, rgba(40,45,80,0.95) 100%)"
                          : undefined,
                        boxShadow: isDarkMode
                          ? "0 0 24px 4px #7984ff55, 0 2px 16px 0 #0008"
                          : "0 0 10px #4cc9a255",
                        border: isDarkMode ? "1.5px solid #7984ff88" : undefined,
                        overflow: "hidden",
                      }}
                    >
                      <h5 className="mb-4 fw-bold d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faChartLine} className="text-primary fa-lg" />
                        Resultados de tu test
                      </h5>
                      {loading && <div>Obteniendo resultados...</div>}
                      {error && <div className="text-danger">{error}</div>}
                      {!loading && !error && userResult && (() => {
                        const totalQuestions = config.getTotalQuestions?.(userResult.group);
                        const omitidas = typeof totalQuestions === "number" ? totalQuestions - userResult.questionsAnswered : null;
                        return (
                          <ul className="list-unstyled mb-0">
                            <li className="mb-3 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faCheck} className="text-success fa-lg" />
                              <span>
                                <strong>Preguntas correctas:</strong> {userResult.correctQuestions}
                                {typeof totalQuestions === "number"
                                  ? ` de ${totalQuestions}`
                                  : ` de ${userResult.questionsAnswered} (respondidas)`}
                              </span>
                            </li>
                            {typeof totalQuestions === "number" && (
                              <li className="mb-3 d-flex align-items-center gap-2 border-top border-primary border-opacity-25 pt-3">
                                <FontAwesomeIcon icon={faCheck} className="text-secondary fa-lg" />
                                <span>
                                  <strong>Preguntas omitidas:</strong> {omitidas}
                                </span>
                              </li>
                            )}
                            <li className="mb-3 d-flex align-items-center gap-2 border-top border-primary border-opacity-25 pt-3">
                              <FontAwesomeIcon icon={faTrophy} className="text-warning fa-lg" />
                              <span>
                                <strong>Porcentaje de aciertos:</strong> {typeof totalQuestions === "number" && totalQuestions > 0
                                  ? ((userResult.correctQuestions / totalQuestions) * 100).toFixed(1)
                                  : userResult.questionsAnswered > 0
                                    ? ((userResult.correctQuestions / userResult.questionsAnswered) * 100).toFixed(1)
                                    : "0.0"}%
                              </span>
                            </li>
                            <li className="d-flex align-items-center gap-2 border-top border-primary border-opacity-25 pt-3">
                              <FontAwesomeIcon icon={faChartLine} className="text-info fa-lg" />
                              <span>
                                <strong>Tiempo total:</strong> {(userResult.timeTaken / 1000).toFixed(1)} segundos
                              </span>
                            </li>
                          </ul>
                        );
                      })()}
                      {!loading && !error && !userResult && (
                        <div>No se encontraron resultados para este usuario.</div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>

              <p
                className={`small mb-4 ${isDarkMode ? "text-light opacity-75" : "text-secondary"
                  }`}
              >
                {config.t("completion.resultsRecorded")}
              </p>

              {/* Botón para regresar a la página principal */}
              <div className="d-grid">
                <Button
                  variant={isDarkMode ? "primary" : "success"}
                  size="lg"
                  className="rounded-pill py-3"
                  onClick={onBackToHome}
                  style={{
                    boxShadow: isDarkMode
                      ? "0 0 20px rgba(121, 132, 255, 0.4)"
                      : "0 0 20px rgba(76, 201, 162, 0.3)",
                    background: isDarkMode
                      ? "linear-gradient(135deg, #7984ff 0%, #5465e6 100%)"
                      : "linear-gradient(135deg, #4cc9a2 0%, #38b385 100%)",
                    border: "none",
                  }}
                >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  {config.t("completion.backToHome")}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
