import './MembershipBenefits.css';

const benefits = [
  'Trusted network & referrals',
  'Training workshops & certifications',
  'Industry updates & regulations',
  'Member profile listing & credibility badge',
];

function MembershipBenefits() {
  return (
    <section className="membership" id="members">
      <div className="membership__inner">
        <h2 className="membership__title">Membership Benefits</h2>

        <div className="membership__grid">
          <div className="membership__image-wrap">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=640&q=80"
              alt="Gold Association members at a networking event"
              className="membership__image"
            />
          </div>

          <div className="membership__content">
            <h3>Why Join Gold Association?</h3>

            <ul className="membership__benefits">
              {benefits.map(b => (
                <li key={b}>
                  <span className="benefit-check" aria-hidden="true">✅</span>
                  {b}
                </li>
              ))}
            </ul>

            <a href="#membership" className="membership__btn">Join Membership</a>

            <div className="membership__divider" />

            <div className="membership__stats">
              <div className="membership__stat">
                <strong>500+</strong>
                <span>Members</span>
              </div>
              <div className="membership__stat">
                <strong>25+</strong>
                <span>Years</span>
              </div>
              <div className="membership__stat">
                <strong>Verified</strong>
                <span>Standards</span>
              </div>
            </div>

            <div className="membership__badge-block">
              <div className="badge-icon" aria-hidden="true">🥇</div>
              <div>
                <strong>Official Member Recognition</strong>
                <p>
                  Get listed as a <u>verified member</u> and display the association
                  badge to increase customer trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MembershipBenefits;
