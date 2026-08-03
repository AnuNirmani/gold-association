import membersImg from '../../assets/members.jpg';
import './MembershipBenefits.css';

const benefits = [
  'Trusted network & referrals',
  'Training workshops & certifications',
  'Industry updates & regulations',
  'Member profile listing & credibility badge',
];

function MembershipBenefits() {
  return (
    <section className="mb-section" id="members">
      <div className="mb-inner">
        <h3 className="mb-title">Membership Benefits</h3>

        <div className="mb-grid">
          {/* Left image card */}
          <div className="card mb-img-card">
            <img src={membersImg} alt="Members networking" className="mb-img" />
          </div>

          {/* Right content card */}
          <div className="card mb-content-card">
            <h4 className="mb-card-heading">Why Join Gold Association?</h4>

            <div className="mb-benefits">
              {benefits.map(b => (
                <div key={b} className="mb-benefit">✅ {b}</div>
              ))}
            </div>

            <a href="#membership" className="btn-primary mb-join-btn">Join Membership</a>

            {/* Mini stats */}
            <div className="mb-stats">
              {[['500+','Members'],['25+','Years'],['Verified','Standards']].map(([v,l]) => (
                <div key={l} className="mb-stat">
                  <div className="mb-stat__value">{v}</div>
                  <div className="mb-stat__label">{l}</div>
                </div>
              ))}
            </div>

            {/* Trust line */}
            <div className="mb-trust">
              <div className="mb-trust__icon">🏅</div>
              <div>
                <div className="mb-trust__title">Official Member Recognition</div>
                <div className="mb-trust__body">
                  Get listed as a verified member and display the association badge to increase customer trust.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MembershipBenefits;
