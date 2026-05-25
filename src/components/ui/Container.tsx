export default function Container({ children }: any) {
  return (
    <div style={{ padding: '80px', border: '10px solid red' }}>
      {children}
    </div>
  )
}