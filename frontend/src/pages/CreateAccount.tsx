import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';

function CreateAccount() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      age,
      gender,
      password,
    };

    console.log('New user:', newUser);
    // TODO: Send data to backend
  };

  return (
    <>
      <div className="create-page">
        <div className="create-title">CineNiche</div>
        <form className="create-form" onSubmit={handleSubmit}>
          <h2>Create An Account</h2>

          <label>
            First Name:
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Age:
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </label>

          <label>
            Gender:
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm Password:
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Create Account</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CreateAccount;
