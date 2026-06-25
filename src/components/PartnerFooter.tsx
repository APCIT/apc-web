import React from "react";

const PartnerFooter: React.FC = () => {
  return (
    <div className="ua_minerva">
      <section className="ua_brand-footer">
        <div className="ua_brand-footer_content">
          <div className="ua_brand-footer_logo-copyright">
            <img
              src="https://assetfiles.ua.edu/brand/logos/Capstone_A-White.svg"
              alt="The University of Alabama Logo"
            />
            <p>
              <span>
                <a href="https://www.ua.edu/copyright">Copyright © 2026</a>{" "}
                <a href="https://www.ua.edu">The University of Alabama</a>
              </span>
              <span>Alabama Productivity Center</span>
              <span>
                <a href="tel:+12053488956">(205) 348-8956</a>
              </span>
              <span>
                <a href="mailto:culverhouse-apcstaff@ua.edu">
                  culverhouse-apcstaff@ua.edu
                </a>
              </span>
            </p>
          </div>

          <nav aria-label="Footer Links">
            <ul className="ua_brand-footer_link-list">
              <li><a href="http://www.awtc.aidt.edu/">AWTC</a></li>
              <li><a href="http://www.nist.gov/mep/">MEP</a></li>
              <li><a href="http://www.aidt.edu/">AIDT</a></li>
              <li><a href="http://www.atn.org/">ATN</a></li>
              <li><a href="https://uasystem.edu/">UA System</a></li>
              <li><a href="https://accessibility.ua.edu/statement/">Accessibility</a></li>
              <li><a href="https://oie.ua.edu/accreditation">SACSCOC</a></li>
              <li><a href="http://eop.ua.edu/">Equal Opportunity</a></li>
              <li><a href="https://www.ua.edu/disclaimer">Disclaimer</a></li>
              <li><a href="https://www.ua.edu/privacy">Privacy</a></li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default PartnerFooter;