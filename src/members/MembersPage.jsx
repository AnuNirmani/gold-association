import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../homepage/Navbar/Navbar';
import Footer from '../homepage/Footer/Footer';
import placeholder from '../assets/member-placeholder.svg';
import { fetchEmployeeById, fetchEmployees } from './membersApi';
import './MembersPage.css';

function formatPrice(value) {
  const price = typeof value === 'number' || (typeof value === 'string' && value.trim()) ? Number(value) : NaN;
  return Number.isFinite(price) ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price) : 'Price unavailable';
}

function MembersPage() {
  const { id } = useParams();
  const requestKey = id ?? 'all';
  const [search, setSearch] = useState('');
  const [result, setResult] = useState({ id: null, employees: [], error: '' });
  const [retry, setRetry] = useState(0);
  const loading = result.id !== requestKey;
  const employees = result.id === requestKey ? result.employees : [];
  const filteredEmployees = employees.filter(employee => `${employee.name} ${employee.position ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()));
  const error = result.id === requestKey ? result.error : '';

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('timeout'), 25000);
    const request = id ? fetchEmployeeById(id, { signal: controller.signal }).then(employee => [employee]) : fetchEmployees({ signal: controller.signal });
    request.then(employees => { if (!controller.signal.aborted) setResult({ id: requestKey, employees, error: '' }); })
      .catch(error => {
        if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
        setResult({ id: requestKey, employees: [], error: controller.signal.reason === 'timeout' ? 'Request timed out. Please try again.' : error instanceof TypeError ? 'Unable to connect to the employee API. Check the backend connection.' : error.message });
      }).finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [id, requestKey, retry]);

  function reload() {
    setResult({ id: null, employees: [], error: '' });
    setRetry(value => value + 1);
  }

  return (
    <>
      <Navbar />
      <main className="members-page">
        <section className="members-hero" aria-labelledby="members-title">
          <div className="members-container">
            <p className="members-eyebrow">GOLD ASSOCIATION</p>
            <h1 id="members-title">Meet our <span>members.</span></h1>
            <p>The people behind our association, united by a commitment to excellence in the gold trade.</p>
          </div>
        </section>
        <section className="members-directory members-container" aria-label="Member directory" aria-busy={loading}>
          <div className="members-toolbar">
            <div><h2>Member directory</h2><p>Our members and their gold prices.</p></div>
            <div className="members-filters">
              <label><span>Search members</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name or position" /></label>
            </div>
          </div>
          {loading && <p className="members-count" role="status">Loading members...</p>}
          {error && <div className="members-empty" role="alert"><h3>Unable to show member</h3><p>{error}</p><button className="btn-primary" onClick={reload}>Try again</button></div>}
          {!loading && !error && <p className="members-count" role="status">{filteredEmployees.length} {filteredEmployees.length === 1 ? 'member' : 'members'}</p>}
          {!loading && !error && filteredEmployees.length === 0 && <div className="members-empty"><h3>No members found</h3><p>{search ? 'Try another name or position.' : 'No members are available yet.'}</p></div>}
          {filteredEmployees.length > 0 && <div className="members-grid members-results">
            {filteredEmployees.map(employee => (
            <article className="member-card" key={employee.id}>
              <img className="member-card__image" src={employee.photo || placeholder} alt={employee.name} width="480" height="360" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = placeholder; }} />
              <div className="member-card__details">
                <p className="member-card__position">{employee.position || 'Position unavailable'}</p>
                <h3>{employee.name}</h3>
                <div className="member-card__gold"><span>Gold type</span><strong>{employee.gold_price?.karat || 'Not assigned'}</strong></div>
                <div className="member-card__price"><span>Gold price</span><strong>{formatPrice(employee.gold_price?.price)}</strong>{employee.gold_price?.unit && <small>{employee.gold_price.unit}</small>}</div>
              </div>
            </article>
            ))}
          </div>}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MembersPage;
