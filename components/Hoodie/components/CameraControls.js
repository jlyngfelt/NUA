import { useState } from 'react';
import styles from './CameraControls.module.css';

export const CameraControls = ({ onViewChange, onZoom }) => {
  const [activeView, setActiveView] = useState("front");

  const buttons = [
    { key: "front", label: "Front" },
    { key: "3/4-front", label: "3/4 Front" },
    { key: "back", label: "Back" },
    { key: "3/4-back", label: "3/4 Back" },
  ];

  const handleViewChange = (view) => {
    setActiveView(view);
    onViewChange(view);
  };

  const getActivePosition = () => {
    const activeIndex = buttons.findIndex((btn) => btn.key === activeView);
    return activeIndex !== -1 ? activeIndex : 0;
  };

  return (
    <>
      {/* Zoom controls */}
      <div className={styles.zoomControls}>
        <div className={styles.zoomControl}>
          <button
            onClick={() => onZoom('in')}
            className={styles.zoomButton}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_103_131" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" transform="matrix(-1 0 0 1 40 0)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_103_131)">
                <path d="M7 34.9717L17.8054 24.1663C18.6388 24.8699 19.606 25.4208 20.7071 25.8192C21.8082 26.2172 22.9799 26.4163 24.2221 26.4163C27.2343 26.4163 29.7837 25.3722 31.8704 23.2842C33.9568 21.1964 35 18.6664 35 15.6942C35 12.722 33.956 10.1918 31.8679 8.10376C29.7801 6.01571 27.2454 4.97168 24.2637 4.97168C21.2824 4.97168 18.7524 6.01571 16.6737 8.10376C14.5949 10.1918 13.5554 12.7233 13.5554 15.6983C13.5554 16.8992 13.7499 18.0506 14.1388 19.1525C14.5276 20.2542 15.0925 21.2681 15.8333 22.1942L5 32.9717L7 34.9717ZM24.25 23.6383C22.0508 23.6383 20.1817 22.8629 18.6425 21.3121C17.1031 19.7613 16.3333 17.8886 16.3333 15.6942C16.3333 13.4997 17.1031 11.627 18.6425 10.0758C20.1817 8.52501 22.0508 7.7496 24.25 7.7496C26.4644 7.7496 28.3468 8.52501 29.8971 10.0758C31.4471 11.627 32.2221 13.4997 32.2221 15.6942C32.2221 17.8886 31.4471 19.7613 29.8971 21.3121C28.3468 22.8629 26.4644 23.6383 24.25 23.6383ZM25.6667 20.4442V17.055H29.0554V14.2775H25.6667V10.9163H22.8887V14.2775H19.5279V17.055H22.8887V20.4442H25.6667Z" fill="#1C1B1F"/>
              </g>
            </svg>
          </button>
          <span className={styles.zoomLabel}>Zoom In</span>
        </div>

        <div className={styles.zoomControl}>
          <button
            onClick={() => onZoom('out')}
            className={styles.zoomButton}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_103_132" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" transform="matrix(-1 0 0 1 40 0)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_103_132)">
                <path d="M7 34.9717L17.8054 24.1663C18.6388 24.8699 19.606 25.4208 20.7071 25.8192C21.8082 26.2172 22.9799 26.4163 24.2221 26.4163C27.2343 26.4163 29.7837 25.3722 31.8704 23.2842C33.9568 21.1964 35 18.6664 35 15.6942C35 12.722 33.956 10.1918 31.8679 8.10376C29.7801 6.01571 27.2454 4.97168 24.2637 4.97168C21.2824 4.97168 18.7524 6.01571 16.6737 8.10376C14.5949 10.1918 13.5554 12.7233 13.5554 15.6983C13.5554 16.8992 13.7499 18.0506 14.1388 19.1525C14.5276 20.2542 15.0925 21.2681 15.8333 22.1942L5 32.9717L7 34.9717ZM24.25 23.6383C22.0508 23.6383 20.1817 22.8629 18.6425 21.3121C17.1031 19.7613 16.3333 17.8886 16.3333 15.6942C16.3333 13.4997 17.1031 11.627 18.6425 10.0758C20.1817 8.52501 22.0508 7.7496 24.25 7.7496C26.4644 7.7496 28.3468 8.52501 29.8971 10.0758C31.4471 11.627 32.2221 13.4997 32.2221 15.6942C32.2221 17.8886 31.4471 19.7613 29.8971 21.3121C28.3468 22.8629 26.4644 23.6383 24.25 23.6383ZM19.5279 17.055H29.0554V14.2775H19.5279V17.055Z" fill="#1C1B1F"/>
              </g>
            </svg>
          </button>
          <span className={styles.zoomLabel}>Zoom Out</span>
        </div>
      </div>

      {/* View controls */}
      <div className={styles.viewControls}>
        <div className={styles.viewButtons}>
          {buttons.map((button) => (
            <button
              key={button.key}
              onClick={() => handleViewChange(button.key)}
              className={styles.viewButton}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Indicator line */}
        <div className={styles.indicatorContainer}>
          <div
            className={styles.indicatorLine}
            style={{
              left: `${(getActivePosition() * 100) / buttons.length}%`,
              width: `${100 / buttons.length}%`,
            }}
          />
        </div>
      </div>
    </>
  );
};