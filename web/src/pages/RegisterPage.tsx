import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, User, Phone, Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // This is a mock registration flow since our backend auto-creates users on login.
        // In a real app, this would hit a specific register endpoint or just redirect to login with pre-fill.
        // For MVP, we'll just redirect to login with a message or simulate the first step.

        try {
            // Check if user exists or just trigger OTP
            await api.post('/auth/otp', { phone });
            // Navigate to login with query param (optional) or just let them login
            // Ideally we'd pass the phone to login page
            navigate('/login');
        } catch (err) {
            setError('Failed to start registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="card w-full max-w-md animate-fade-in relative z-10 bg-white">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-0 left-0 -mt-12 text-gray-500 hover:text-gray-900 flex items-center gap-1 font-semibold"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
                    <p className="text-muted">Junte-se a maior rede de peças do Brasil</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label className="input-label">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-muted w-5 h-5" />
                            <input
                                type="text"
                                className="input-field pl-10"
                                placeholder="João da Silva"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">WhatsApp</label>
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

                    {error && <p className="text-error text-center text-sm mb-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={clsx('btn btn-primary w-full shadow-lg hover:shadow-xl transition-all', loading && 'opacity-70')}
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Continuar'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted">
                            Já tem uma conta?
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary font-semibold ml-1 hover:underline"
                            >
                                Entrar
                            </button>
                        </p>
                    </div>
                </form>
            </div>

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            </div>
        </div>
    );
}
