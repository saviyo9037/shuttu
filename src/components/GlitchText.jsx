export default function GlitchText({ children, as: Tag = 'h1', className = '' }) {
  return (
    <Tag className={`glitch ${className}`} data-text={children}>
      {children}
    </Tag>
  )
}
