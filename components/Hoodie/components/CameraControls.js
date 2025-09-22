import { useState } from "react";
import styles from "./CameraControls.module.css";

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
          <button onClick={() => onZoom("in")} className={styles.zoomButton}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_626_1045"
                style={{maskType: "alpha"}}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="40"
                height="40"
              >
                <rect
                  width="40"
                  height="40"
                  transform="matrix(-1 0 0 1 40 0)"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_626_1045)">
                <path
                  d="M12.7568 29.4821C13.6894 30.2696 14.7719 30.8862 16.0043 31.332C17.2366 31.7775 18.5479 32.0002 19.9381 32.0002C23.3093 32.0002 26.1625 30.8318 28.4979 28.4949C30.8329 26.1584 32.0004 23.3269 32.0004 20.0005C32.0004 16.6741 30.8319 13.8424 28.4951 11.5056C26.1585 9.16868 23.3217 8.00024 19.9847 8.00024C16.6481 8.00024 13.8166 9.16868 11.4903 11.5056C9.16367 13.8424 8.00037 16.6756 8.00037 20.0051C8.00037 21.3491 8.21798 22.6377 8.65321 23.8709C9.08844 25.1039 9.72061 26.2386 10.5497 27.275C11.3788 28.3115 11.8242 28.6947 12.7568 29.4821ZM19.9694 28.8913C17.5081 28.8913 15.4162 28.0235 13.6936 26.2878C11.9708 24.5522 11.1093 22.4564 11.1093 20.0005C11.1093 17.5445 11.9708 15.4486 13.6936 13.7126C15.4162 11.977 17.5081 11.1092 19.9694 11.1092C22.4477 11.1092 24.5544 11.977 26.2894 13.7126C28.0241 15.4486 28.8914 17.5445 28.8914 20.0005C28.8914 22.4564 28.0241 24.5522 26.2894 26.2878C24.5544 28.0235 22.4477 28.8913 19.9694 28.8913ZM21.5548 25.3165V21.5235H25.3474V18.415H21.5548V14.6532H18.4459V18.415H14.6846V21.5235H18.4459V25.3165H21.5548Z"
                  fill="#2E3228"
                />
              </g>
            </svg>
          </button>
          <span className={styles.zoomLabel}>Zoom In</span>
        </div>

        <div className={styles.zoomControl}>
          <button onClick={() => onZoom("out")} className={styles.zoomButton}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_626_1051"
                style={{maskType: "alpha"}}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="40"
                height="40"
              >
                <rect
                  width="40"
                  height="40"
                  transform="matrix(-1 0 0 1 40 0)"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_626_1051)">
                <path
                  d="M12.7568 29.4821C13.6894 30.2696 14.7719 30.8862 16.0043 31.332C17.2366 31.7775 18.5479 32.0002 19.9381 32.0002C23.3093 32.0002 26.1625 30.8318 28.4978 28.4949C30.8329 26.1584 32.0004 23.3269 32.0004 20.0005C32.0004 16.6741 30.8319 13.8424 28.4951 11.5056C26.1585 9.16868 23.3217 8.00024 19.9847 8.00024C16.6481 8.00024 13.8166 9.16868 11.4903 11.5056C9.16367 13.8424 8.00036 16.6756 8.00036 20.0051C8.00036 21.3491 8.21798 22.6377 8.65321 23.8709C9.08844 25.1039 9.72061 26.2386 10.5497 27.275C11.3788 28.3115 11.8242 28.6947 12.7568 29.4821ZM19.9694 28.8913C17.5081 28.8913 15.4162 28.0235 13.6936 26.2878C11.9708 24.5522 11.1093 22.4564 11.1093 20.0005C11.1093 17.5445 11.9708 15.4486 13.6936 13.7126C15.4162 11.977 17.5081 11.1092 19.9694 11.1092C22.4477 11.1092 24.5544 11.977 26.2894 13.7126C28.0241 15.4486 28.8914 17.5445 28.8914 20.0005C28.8914 22.4564 28.0241 24.5522 26.2894 26.2878C24.5544 28.0235 22.4477 28.8913 19.9694 28.8913ZM24.6946 21.5235V18.415H15.3374V21.5235H24.6946Z"
                  fill="#2E3228"
                />
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
