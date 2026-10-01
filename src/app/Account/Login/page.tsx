'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LOGIN_API } from '@/lib/api';

/** Safe redirect: same-origin path only (no open redirect). */
function getSafeReturnUrl(returnUrl: string | null): string {
  if (!returnUrl || typeof returnUrl !== 'string') return '/';
  const trimmed = returnUrl.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  return '/';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

      const returnUrl = searchParams.get('returnUrl');
      const targetPath = getSafeReturnUrl(returnUrl);
      router.push(targetPath);
      router.refresh();
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

      const labelStyle: React.CSSProperties = {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#ffffff',
      fontWeight: 700,
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem 0.9rem',
      marginBottom: '1.25rem',
      fontSize: '1rem',
      color: '#35363B',
      backgroundColor: '#ffffff',
      border: '2px solid #9E1B32',
    };

    const errorTextStyle: React.CSSProperties = {
      color: '#fecaca',
      fontSize: '0.85rem',
      marginTop: '-0.75rem',
      marginBottom: '1rem',
    };

      return (
        <div style={{ backgroundColor: '#A7ABA9', padding: '4rem 1.5rem 5rem' }}>
          <section
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'proxima-nova, sans-serif',
                marginBottom: '0.5rem',
                textShadow: '2px 2px 0 #000000',
              }}
            >
              Log In
            </h1>

            <div
              style={{
                width: '320px',
                maxWidth: '80%',
                height: '5px',
                backgroundColor: '#212124',
                margin: '0 auto 2.5rem',
              }}
            />

            <div
              style={{
                maxWidth: '520px',
                margin: '0 auto',
                backgroundColor: '#212124',
                padding: '2.75rem 3rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              }}
            >
              <form onSubmit={handleSubmit} style={{fontFamily: 'proxima-nova, sans-serif', textAlign: 'left' }}>
                {errors.general && (
                  <div
                    role="alert"
                    style={{
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px',
                      color: '#b91c1c',
                    }}
                  >
                    {errors.general}
                  </div>
                )}

                <label htmlFor="username" style={labelStyle}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? "username-error" : undefined}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    ...inputStyle,
                    border: errors.username ? '2px solid #ef4444' : inputStyle.border,
                  }}
                />

                {errors.username && <p id="username-error" role="alert" style={errorTextStyle}>{errors.username}</p>}

                <label htmlFor="password" style={labelStyle}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    ...inputStyle,
                    border: errors.password ? '2px solid #ef4444' : inputStyle.border,
                  }}
                />

                {errors.password && <p id="password-error" role="alert" style={errorTextStyle}>{errors.password}</p>}

                <label
                  htmlFor="rememberMe"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '1.5rem 0',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontFamily: 'proxima-nova, sans-serif',
                  }}
                >
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Remember me?
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#9E1B32',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    fontFamily: 'proxima-nova, sans-serif',
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <p
                style={{
                  textAlign: 'center',
                  color: '#ffffff',
                  marginTop: '1.75rem',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  fontFamily: 'proxima-nova, sans-serif',
                }}
              >
                Forgotten your password?<br />
                Let the administrators know using our{' '}
                <Link href="/#contact" style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>
                  Contact Form
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      );
  }