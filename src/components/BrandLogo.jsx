export default function BrandLogo({
  className = '',
  alt = 'Logo Molige ERP',
}) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={className}
      draggable="false"
    />
  );
}
