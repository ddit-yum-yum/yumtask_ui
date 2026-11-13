import { Link } from 'react-router'

export function HomePage() {
  return (
    <ul className="space-y-2 p-8">
      <li><Link to="/zeenee">zeenee</Link></li>
      <li><Link to="/zenny">zenny</Link></li>
    </ul>
  )
}