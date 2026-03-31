// Shared hero banner used at the top of every interior page.
// Usage:
//   <PageHero title="Events" imageSrc="/heroes/events.jpg" imageAlt="Boats on the water" />
// Leave imageSrc undefined to show a placeholder until a photo is ready.

export default function PageHero({ title, imageSrc, imageAlt = '', objectPosition = 'center center' }) {
  return (
    <div style={{
      position: 'relative',
      height: '320px',
      backgroundColor: '#1e3a5f',
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition, opacity: 0.55,
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.18)', fontSize: '13px', fontStyle: 'italic',
        }}>
          [ photo goes here ]
        </div>
      )}
      <div style={{ position: 'relative', padding: '28px 40px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
          {title}
        </h1>
      </div>
    </div>
  );
}
