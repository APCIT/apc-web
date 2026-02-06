'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LOGIN_API } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};
    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await LOGIN_API({ username, password, rememberMe });

      if (!result.ok) {
        setErrors({ general: result.error });
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-8 py-4">
        {/* Page Title */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5em', fontWeight: 'normal', color: '#333333', fontFamily: 'Roboto, sans-serif', textAlign: 'center' }}>
            Log In
          </h2>
          <hr style={{ marginTop: '0.5rem', borderColor: '#999999', borderWidth: '1px', borderStyle: 'solid', borderBottom: 'none' }} />
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="login-content" style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
          {/* Left Half: Login Form */}
          <div className="login-form-column" style={{ width: '50%', paddingLeft: '5%' }}>
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#b91c1c' }}>
                  {errors.general}
                </div>
              )}

              {/* Username */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                <label htmlFor="username" style={{ width: '100px', textAlign: 'right', paddingRight: '1rem', color: '#333333', fontWeight: 500 }}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '200px',
                    height: '30px',
                    padding: '0 8px',
                    fontSize: '14px',
                    color: '#333333',
                    backgroundColor: '#ffffff',
                    border: errors.username ? '1px solid #ef4444' : '1px solid #cccccc',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                <label htmlFor="password" style={{ width: '100px', textAlign: 'right', paddingRight: '1rem', color: '#333333', fontWeight: 500 }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '200px',
                    height: '30px',
                    padding: '0 8px',
                    fontSize: '14px',
                    color: '#333333',
                    backgroundColor: '#ffffff',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #cccccc',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ width: '100px' }}></div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ marginLeft: '8px', color: '#333333', fontSize: '14px' }}>Remember me?</span>
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100px' }}></div>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    color: '#990000',
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #990000',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Half: Password Recovery */}
          <div className="login-recovery-column" style={{ width: '50%', paddingRight: '5%' }}>
            <p style={{ color: '#333333' }}>
              Forgotten your password?<br />
              Let the administrators know at our{' '}
              <Link href="/#contact" style={{ color: '#990000', textDecoration: 'underline' }}>
                Contact form
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
