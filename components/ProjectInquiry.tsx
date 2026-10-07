'use client';

import Arrow from '@/components/Arrow';

import { FormEvent, useRef, useState } from 'react';
import { site } from '@/lib/site';

type Field = 'name' | 'company' | 'email' | 'projectType' | 'budget' | 'timeline' | 'details';
const empty = { name: '', company: '', email: '', projectType: '', budget: '', timeline: '', details: '' };
const labels: Record<Field, string> = { name: 'Your name', company: 'Company / brand', email: 'Email address', projectType: 'Project type', budget: 'Estimated budget', timeline: 'Ideal timeline', details: 'Tell us about your project' };

export default function ProjectInquiry() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [prepared, setPrepared] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPrepared(false);
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    (Object.keys(values) as Field[]).forEach((field) => { if (!values[field].trim()) next[field] = 'Please complete this field.'; });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid email address.';
    if (values.details.trim() && values.details.trim().length < 20) next.details = 'Please add a little more detail (at least 20 characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      form.current?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${first}"]`)?.focus();
      setPrepared(false);
      return;
    }
    setPrepared(true);
  }

  const body = `DEMIR DIGITAL — PROJECT ENQUIRY\n\n${(Object.keys(values) as Field[]).map((field) => `${labels[field]}:\n${values[field].trim()}`).join('\n\n')}`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`New project — ${values.company.trim()}`)}&body=${encodeURIComponent(body)}`;

  function downloadBrief() {
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demir-digital-project-brief.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const fieldAttributes = (name: Field) => ({ id: `inquiry-${name}`, name, value: values[name], required: true, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `inquiry-${name}-error` : undefined });
  const error = (name: Field) => errors[name] ? <span className="interior-field-error" id={`inquiry-${name}-error`}>{errors[name]}</span> : null;

  return (
    <form ref={form} className="interior-inquiry" onSubmit={prepare} noValidate>
      <div className="interior-form-heading"><span className="eyebrow">01 / THE INTRODUCTION</span><span>All fields are required</span></div>
      <div className="interior-form-grid">
        <div className="interior-field"><label htmlFor="inquiry-name">Your name</label><input {...fieldAttributes('name')} autoComplete="name" placeholder="A name to remember" onChange={(event) => update('name', event.target.value)} />{error('name')}</div>
        <div className="interior-field"><label htmlFor="inquiry-company">Company / brand</label><input {...fieldAttributes('company')} autoComplete="organization" placeholder="Who are we building for?" onChange={(event) => update('company', event.target.value)} />{error('company')}</div>
        <div className="interior-field interior-field-wide"><label htmlFor="inquiry-email">Email address</label><input {...fieldAttributes('email')} type="email" autoComplete="email" placeholder="you@company.com" onChange={(event) => update('email', event.target.value)} />{error('email')}</div>
      </div>
      <div className="interior-form-heading"><span className="eyebrow">02 / THE AMBITION</span><span>Every great project starts somewhere</span></div>
      <div className="interior-form-grid">
        <div className="interior-field interior-field-wide"><label htmlFor="inquiry-projectType">Project type</label><select {...fieldAttributes('projectType')} onChange={(event) => update('projectType', event.target.value)}><option value="" disabled>Select a direction</option>{['Brand identity', 'Website / digital experience', 'E-commerce', 'Motion & 3D', 'Social media / digital campaign', 'Something else / a combination'].map((item) => <option key={item}>{item}</option>)}</select>{error('projectType')}</div>
        <div className="interior-field"><label htmlFor="inquiry-budget">Estimated budget</label><select {...fieldAttributes('budget')} onChange={(event) => update('budget', event.target.value)}><option value="" disabled>Select a range</option>{['Under €5,000', '€5,000–€10,000', '€10,000–€25,000', '€25,000+', 'Let’s define it together'].map((item) => <option key={item}>{item}</option>)}</select>{error('budget')}</div>
        <div className="interior-field"><label htmlFor="inquiry-timeline">Ideal timeline</label><select {...fieldAttributes('timeline')} onChange={(event) => update('timeline', event.target.value)}><option value="" disabled>When do you have in mind?</option>{['As soon as possible', 'Within 1–3 months', 'Within 3–6 months', 'Exploring possibilities'].map((item) => <option key={item}>{item}</option>)}</select>{error('timeline')}</div>
        <div className="interior-field interior-field-wide"><label htmlFor="inquiry-details">Tell us about your project</label><textarea {...fieldAttributes('details')} rows={5} minLength={20} maxLength={4000} placeholder="The idea, the challenge, the ambition. We’re listening." onChange={(event) => update('details', event.target.value)} />{error('details')}</div>
      </div>
      <div className="interior-form-footer"><p>Your details stay in your browser until you send them from your email app. This form prepares an enquiry; it does not send it automatically.</p><button className="interior-submit" type="submit">Prepare enquiry <span aria-hidden="true"><Arrow /></span></button></div>
      {prepared && <div className="interior-prepared" role="status"><span className="eyebrow">READY WHEN YOU ARE</span><h3>Your next chapter starts here.</h3><p>Your enquiry is ready. Open your email app, review the message and send it to <a href={`mailto:${site.email}`}>{site.email}</a>. If your email app does not open, download your brief and attach it to an email.</p><div><a className="interior-submit" href={mailto}>Open email app <span aria-hidden="true"><Arrow /></span></a><button className="interior-brief-download" type="button" onClick={downloadBrief}>Download project brief <span aria-hidden="true"><Arrow direction="down" /></span></button></div></div>}
    </form>
  );
}
