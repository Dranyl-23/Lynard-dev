import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, contactProjectTypes } from '../../data/portfolioData';
import { SectionHeader } from '../ui/SectionHeader';
import { FadeIn, EXPO_OUT } from '../ui/FadeIn';
import { CustomSelect } from '../ui/CustomSelect';
import { Mail, Phone, MapPin, ArrowUpRight, Check } from '../icons/UIIcons';
import { sendInquiry } from '../../services/contactService';
import { RecaptchaWidget } from '../ui/RecaptchaWidget';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });
  const [botcheck, setBotcheck] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [providerUsed, setProviderUsed] = useState<string>('');
  const interactionStartTime = useRef<number | null>(null);

  const markInteraction = () => {
    if (!interactionStartTime.current) {
      interactionStartTime.current = Date.now();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // 1. Anti-Flood Rate Limiting: 45-second submission cooldown
    try {
      const lastSubmit = localStorage.getItem('alfie_contact_last_ts');
      if (lastSubmit) {
        const elapsed = Date.now() - Number(lastSubmit);
        const cooldown = 45000;
        if (elapsed < cooldown) {
          const waitSecs = Math.ceil((cooldown - elapsed) / 1000);
          setStatus('error');
          setResultMessage(`Please wait ${waitSecs} seconds before sending another inquiry.`);
          return;
        }
      }
    } catch {
      // Ignore localStorage access issues
    }

    // 2. Anti-Bot Timing Heuristic: Automated headless bots submit forms within < 1.5 seconds
    if (interactionStartTime.current && Date.now() - interactionStartTime.current < 1500) {
      console.warn('Bot submission blocked: completed unnaturally fast.');
      setStatus('success');
      setResultMessage('Your inquiry has been received! Alfie will review your details.');
      setFormData({ name: '', email: '', type: '', message: '' });
      return;
    }

    // 3. Google reCAPTCHA Verification Check (enforced when VITE_RECAPTCHA_SITE_KEY is configured)
    const isRecaptchaEnabled = Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
    if (isRecaptchaEnabled && !recaptchaToken) {
      setStatus('error');
      setResultMessage('Please check the "I\'m not a robot" reCAPTCHA box to verify you are human.');
      return;
    }

    setStatus('submitting');
    setResultMessage('');

    try {
      const res = await sendInquiry({
        ...formData,
        botcheck,
        recaptchaToken
      });

      if (res.success) {
        setStatus('success');
        setResultMessage(res.message);
        setProviderUsed(res.provider);
        setFormData({ name: '', email: '', type: '', message: '' });
        setBotcheck('');
        setRecaptchaToken('');
        interactionStartTime.current = null;
        try {
          localStorage.setItem('alfie_contact_last_ts', String(Date.now()));
        } catch {
          // Ignore
        }
      } else {
        setStatus('error');
        setResultMessage(res.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setResultMessage('Unable to submit inquiry. Please try again or reach out directly.');
    }
  };

  const contactItems = [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <Mail className="h-4 w-4" />
    },
    {
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, '')}`,
      icon: <Phone className="h-4 w-4" />
    },
    {
      label: 'GitHub',
      value: 'github.com/Dranyl-23',
      href: profile.github,
      icon: (
        <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    },
    {
      label: 'Location',
      value: profile.location,
      href: '#contact',
      icon: <MapPin className="h-4 w-4" />
    }
  ];

  return (
    <section id="contact" className="relative">
      <div
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(/clouds.webp)` }}
      >
        <div className="absolute inset-0 bg-white/[0.88]" />

        <div className="section-container relative py-16 sm:py-24 lg:py-32">
          <SectionHeader
            ghost="NEXT"
            label="NEXT STEP"
            sub="Websites, mobile apps, and custom systems tailored to your needs."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-5 lg:gap-8">
            {/* Left Column: Direct Reach Out Dark Card */}
            <FadeIn y={36} className="lg:col-span-2">
              <div className="flex h-full flex-col justify-between rounded-3xl bg-[#161616] p-7 text-white sm:rounded-[2rem] sm:p-10">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                    Direct contact
                  </span>
                  <h3 className="font-display display-tight mt-2 text-2xl font-bold uppercase text-white sm:mt-3 sm:text-3xl">
                    Reach out
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    Prefer email or a quick call? Reach out directly and I'll get back to you within 24 hours.
                  </p>

                  <div className="mt-8 space-y-3.5 sm:mt-10 sm:space-y-4">
                    {contactItems.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4.5 py-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10 cursor-pointer sm:px-5 sm:py-4.5"
                      >
                        <div className="flex min-w-0 items-center gap-4 sm:gap-4.5">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-accent group-hover:text-ink">
                            {c.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
                              {c.label}
                            </p>
                            <p className="mt-1 truncate text-sm font-medium tracking-tight text-white sm:text-[14.5px]">
                              {c.value}
                            </p>
                          </div>
                        </div>

                        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="text-xs leading-relaxed text-white/40">
                    Based in Philippines (GMT+8). Available worldwide for remote work.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Right Column: Inquiry Form Card with Animated States */}
            <FadeIn y={36} delay={0.1} className="lg:col-span-3">
              <div className="h-full rounded-3xl border border-line bg-white p-6 sm:rounded-[2rem] sm:p-10">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.5, ease: EXPO_OUT }}
                      className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-8 w-8 stroke-[2.5]" />
                      </div>

                      <h3 className="font-display display-tight mt-6 text-2xl font-bold uppercase text-ink sm:text-3xl">
                        Inquiry Received!
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                        {resultMessage || "Thank you for reaching out! Your project inquiry has been delivered. I will review your requirements and get back to you within 24 hours."}
                      </p>

                      {providerUsed && (
                        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-medium text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>
                            Delivered via {providerUsed === 'web3forms' ? 'Web3Forms' : 'Direct Email'}
                          </span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setStatus('idle')}
                        className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-accent dark:hover:text-neutral-950"
                      >
                        <span>Send Another Inquiry</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      id="contact-form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full flex-col justify-between"
                    >
                      <div>
                        <div className="mb-6">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                            Start a project
                          </span>
                          <h3 className="font-display display-tight mt-2 text-2xl font-bold uppercase text-ink sm:text-3xl">
                            Send an inquiry
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                                Your Name
                              </label>
                              <input
                                type="text"
                                required
                                disabled={status === 'submitting'}
                                placeholder="e.g. Alfie Lynard Polacas"
                                value={formData.name}
                                onFocus={markInteraction}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="w-full rounded-2xl border border-line bg-white px-5 py-3.5 text-sm text-ink placeholder:text-muted/60 transition-all duration-500 focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                                Your Email
                              </label>
                              <input
                                type="email"
                                required
                                disabled={status === 'submitting'}
                                placeholder="e.g. alfielynard23@example.com"
                                value={formData.email}
                                onFocus={markInteraction}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                                }
                                className="w-full rounded-2xl border border-line bg-white px-5 py-3.5 text-sm text-ink placeholder:text-muted/60 transition-all duration-500 focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                              Project Type
                            </label>
                            <CustomSelect
                              value={formData.type}
                              onChange={(val) => {
                                markInteraction();
                                setFormData((prev) => ({ ...prev, type: val }));
                              }}
                              options={contactProjectTypes}
                              placeholder="Select project category..."
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                              Project Details / Message
                            </label>
                            <textarea
                              rows={4}
                              required
                              disabled={status === 'submitting'}
                              placeholder="Tell me about what you are looking to build, deadlines, and key requirements..."
                              value={formData.message}
                              onFocus={markInteraction}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  message: e.target.value
                                }))
                              }
                              className="w-full rounded-2xl border border-line bg-white px-5 py-3.5 text-sm text-ink placeholder:text-muted/60 transition-all duration-500 focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
                            />
                          </div>
                        </div>

                        {/* Invisible Honeypot Trap - bots automatically fill hidden inputs, humans never see it */}
                        <div
                          className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
                          aria-hidden="true"
                        >
                          <label htmlFor="website-honeypot">Do not fill this</label>
                          <input
                            id="website-honeypot"
                            type="text"
                            name="botcheck"
                            tabIndex={-1}
                            autoComplete="off"
                            value={botcheck}
                            onChange={(e) => setBotcheck(e.target.value)}
                          />
                        </div>

                        {/* Google reCAPTCHA Verification Widget */}
                        <div className="mt-5">
                          <RecaptchaWidget
                            onVerify={(token) => {
                              setRecaptchaToken(token);
                              if (status === 'error') setStatus('idle');
                            }}
                            onExpire={() => setRecaptchaToken('')}
                          />
                        </div>
                      </div>

                      {status === 'error' && (
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-500">
                          <span>{resultMessage}</span>
                          <button
                            type="button"
                            onClick={() => setStatus('idle')}
                            className="font-bold underline cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}

                      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-line pt-6">
                        <p className="text-xs text-muted">
                          No spam. Your email is only used to respond to this request.
                        </p>

                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:scale-[1.03] hover:bg-neutral-800 disabled:opacity-60 disabled:pointer-events-none dark:bg-white dark:text-neutral-950 dark:hover:bg-accent dark:hover:text-neutral-950"
                        >
                          {status === 'submitting' ? (
                            <>
                              <svg
                                className="h-4 w-4 animate-spin text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>Sending Inquiry...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Inquiry</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

