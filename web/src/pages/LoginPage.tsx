
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowRight, Lock, Phone, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function LoginPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/otp', { phone });
            setStep('OTP');
        } catch (err) {
            setError('Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { phone, code: otp });
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid code. Please check console (Dev Mode).');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="card w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Mosca Branca</h1>
                    <p className="text-muted">Auto parts marketplace</p>
                </div>

                {step === 'PHONE' ? (
                    <form onSubmit={handleRequestOtp}>
                        <div className="input-group">
                            <label className="input-label">WhatsApp Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-muted w-5 h-5" />
                                <input
                                    type="tel"
                                    className="input-field pl-10"
                                    placeholder="+55 11 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={clsx('btn btn-primary w-full', loading && 'opacity-70')}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Code'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="text-center mb-6">
                            <p className="text-sm text-muted">Enter the code sent to {phone}</p>
                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="text-primary text-sm hover:underline mt-1"
                            >
                                Change number
                            </button>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Access Code</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted w-5 h-5" />
                                <input
                                    type="text"
                                    className="input-field pl-10 text-center tracking-widest text-xl"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-error text-center text-sm mb-4">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className={clsx('btn btn-primary w-full', loading && 'opacity-70')}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enter App'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
