import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
export default function Start() {
  return <main className="start-page">
    <header className="start-header"><Link to="/" className="brand">Uber</Link></header>
    <div className="start-content">
      <section>
        <span className="eyebrow">A LITTLE CLOSER TO WHERE YOU WANT TO BE</span>
        <h1>Your day.<br/>Your destination.</h1>
        <p>Head across town or find your next opportunity behind the wheel. Your journey starts here.</p>
        <Link to="/login" className="primary-button">Continue <span aria-hidden="true" className="ml-4">→</span></Link>
        <Link to="/captain-login" className="flex w-fit min-h-11 items-center mt-3 underline underline-offset-4">Drive with us</Link>
      </section>
      <div className="start-art" aria-hidden="true"><i className="ri-taxi-line"/></div>
    </div>
  </main>;
}
