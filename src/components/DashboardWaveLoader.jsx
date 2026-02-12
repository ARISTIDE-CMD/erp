export default function DashboardWaveLoader({
  label = 'Chargement du tableau de bord...',
  fullScreen = false,
  showLogo = false,
}) {
  return (
    <div
      className={`wave-loader-screen ${fullScreen ? 'wave-loader-screen-full' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="wave-loader-content">
        {showLogo && (
          <div className="wave-loader-logo-wrap" aria-hidden="true">
            <div className="wave-loader-logo">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
              </svg>
            </div>
          </div>
        )}
        <div className="wave-loader-title">Molige ERP</div>
        <div className="wave-loader-subtitle">{label}</div>
      </div>
      <div className="wave-loader-waves" aria-hidden="true">
        <svg viewBox="0 0 1200 240" preserveAspectRatio="none">
          <path
            className="wave-path wave-path-1"
            d="M0,96L40,90.7C80,85,160,75,240,80C320,85,400,107,480,106.7C560,107,640,85,720,90.7C800,96,880,128,960,133.3C1040,139,1120,117,1160,106.7L1200,96L1200,240L1160,240C1120,240,1040,240,960,240C880,240,800,240,720,240C640,240,560,240,480,240C400,240,320,240,240,240C160,240,80,240,40,240L0,240Z"
          />
          <path
            className="wave-path wave-path-2"
            d="M0,144L40,133.3C80,123,160,101,240,101.3C320,101,400,123,480,128C560,133,640,123,720,106.7C800,91,880,69,960,74.7C1040,80,1120,112,1160,128L1200,144L1200,240L1160,240C1120,240,1040,240,960,240C880,240,800,240,720,240C640,240,560,240,480,240C400,240,320,240,240,240C160,240,80,240,40,240L0,240Z"
          />
          <path
            className="wave-path wave-path-3"
            d="M0,176L40,165.3C80,155,160,133,240,117.3C320,101,400,91,480,101.3C560,112,640,144,720,149.3C800,155,880,133,960,138.7C1040,144,1120,176,1160,192L1200,208L1200,240L1160,240C1120,240,1040,240,960,240C880,240,800,240,720,240C640,240,560,240,480,240C400,240,320,240,240,240C160,240,80,240,40,240L0,240Z"
          />
        </svg>
      </div>
    </div>
  );
}
