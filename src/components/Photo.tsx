interface PhotoProps {
  src: string | null
  label: string
  alt?: string
}

/** Grayscale image, or a striped placeholder when no image is provided yet. */
export function Photo({ src, label, alt = '' }: PhotoProps) {
  return (
    <div className="photo">
      {src ? (
        <img src={src} alt={alt || label} loading="lazy" decoding="async" />
      ) : (
        <div className="photo__placeholder mono">{label}</div>
      )}
    </div>
  )
}
