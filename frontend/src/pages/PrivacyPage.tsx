import { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

function PrivacyPage() {
  useEffect(() => {
    // Add override class to <body> on mount
    document.body.classList.add('static-body');

    // Clean up on unmount
    return () => document.body.classList.remove('static-body');
  }, []);

  return (
    <>
      <Header />
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p>Effective Date: April 7, 2025</p>

        <p>
          At <strong>CineNiche</strong>, your privacy is our priority. This
          Privacy Policy explains how we collect, use, and protect your
          information...
        </p>

        <h2>1. Information We Collect</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>
            <strong>Account Information:</strong> When you create an account, we
            collect your name, email address, and login credentials.
          </li>
          <li>
            <strong>Viewing Activity:</strong> We track the films you watch,
            your ratings and reviews, and your viewing history to enhance your
            experience.
          </li>
          <li>
            <strong>Device & Usage Data:</strong> We gather data about the
            device you use, your app interactions, and session details.
          </li>
          <li>
            <strong>User Preferences:</strong> We may collect favorite genres,
            content ratings, or talent interests to personalize recommendations.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>To deliver and maintain a high-quality streaming experience.</li>
          <li>
            To offer personalized recommendations based on your preferences and
            activity.
          </li>
          <li>To improve our catalog, features, and performance.</li>
          <li>To communicate updates, promotions, and support messages.</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>
          We do not sell your personal information. We may share data with
          trusted third-party providers only when necessary and with safeguards.
        </p>

        <h2>4. Cookies and Tracking Technologies</h2>
        <p>
          CineNiche uses cookies to remember preferences, analyze usage, and
          personalize recommendations.
        </p>

        <h2>5. Your Rights and Choices</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>You can update or delete your account at any time.</li>
          <li>You can opt out of promotional emails.</li>
          <li>You can request a copy of your stored data.</li>
        </ul>

        <h2>6. Data Security</h2>
        <p>
          We use reasonable measures to protect your data. While no system is
          100% secure, we strive to keep your information safe.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
          CineNiche is not intended for children under 13. We do not knowingly
          collect data from children without parental consent.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this policy. If significant changes are made, we will
          notify you through the app or site.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, email us at{' '}
          <a href="mailto:privacy@cineniche.com">privacy@cineniche.com</a>.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPage;
