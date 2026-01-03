import './LogoLoader.css';

export function LogoLoader() {
  return (
    <div className="loader-container">
      <svg
        viewBox="0 0 114 114"
        className="logo-loader"
        role="status"
        aria-busy="true"
      >
        <circle cx="57" cy="57" r="10" className="circle core" />
        <circle cx="57" cy="57" r="20" className="circle ring r1" />
        <circle cx="57" cy="57" r="30" className="circle ring r2" />
        <circle cx="57" cy="57" r="40" className="circle ring r3" />
        <circle cx="57" cy="57" r="50" className="circle ring r4" />
      </svg>
    </div>
  );
}
