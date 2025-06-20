import styles from "@/styles/TestPage/TestPageNavigation.module.css";
import { faAngleLeft, faAngleRight, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";

type TestPageNavigationProps = {
  onPreviousPhase: () => void;
  onNextPhase: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  disablePreviousPhase: boolean;
  disablePreviousQuestion: boolean;
  disableNextQuestion: boolean;
  disableNextPhase: boolean;
  hidePreviousPhase: boolean;
  hidePreviousQuestion: boolean;
  hideNextPhase: boolean;
  isDarkMode: boolean;
};

export function TestPageNavigation({
  onPreviousPhase,
  onNextPhase,
  onPreviousQuestion,
  onNextQuestion,
  disablePreviousPhase,
  disablePreviousQuestion,
  disableNextQuestion,
  disableNextPhase,
  hidePreviousPhase,
  hidePreviousQuestion,
  hideNextPhase,
  isDarkMode,
}: TestPageNavigationProps) {
  return (
    <div
      className={[
        styles.navigationContainer,
        isDarkMode ? styles.dark : styles.light,
      ].join(" ")}
    >
      <div className={styles.navGroup}>
        <button
          className={[styles.navButton, styles.secondaryOutline].join(" ")}
          onClick={onPreviousPhase}
          disabled={disablePreviousPhase}
          hidden={hidePreviousPhase}
        >
          <FontAwesomeIcon icon={faArrowLeft} className={styles.iconLeft}/>
          {config.t("test.previousPhase")}
        </button>
      </div>

      <div className={styles.navGroup}>
        <button
          className={[styles.navButton, styles.primaryOutline].join(" ")}
          onClick={onPreviousQuestion}
          disabled={disablePreviousQuestion}
          hidden={hidePreviousQuestion}
        >
          <FontAwesomeIcon icon={faAngleLeft} className={styles.iconLeft}/>
          {config.t("test.previousQuestion")}
        </button>

        <button
          className={[styles.navButton, styles.primary].join(" ")}
          onClick={onNextQuestion}
          disabled={disableNextQuestion}
        >
          {config.t("test.nextQuestion")}
          <FontAwesomeIcon icon={faAngleRight} className={styles.iconRight}/>
        </button>
      </div>

      <div className={styles.navGroup}>
        <button
          className={[styles.navButton, styles.secondaryOutline].join(" ")}
          onClick={onNextPhase}
          disabled={disableNextPhase}
          hidden={hideNextPhase}
        >
          {config.t("test.nextPhase")}
          <FontAwesomeIcon icon={faArrowRight} className={styles.iconRight}/>
        </button>
      </div>
    </div>
  );
}
