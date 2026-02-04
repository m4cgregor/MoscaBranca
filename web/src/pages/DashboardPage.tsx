

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, List, Settings, Briefcase } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [requestsCount, setRequestsCount] = useState<number | null>(null);
    const [opportunities, setOpportunities] = useState<any[]>([]);

    useEffect(() => {
        // Fetch own requests count
        api.get('/requests').then(res => {
            setRequestsCount(res.data.length);
        }).catch(console.error);

        // If Vendor, fetch opportunities
        if (user.role === 'VENDOR') {
            api.get('/requests/opportunities').then(res => {
                setOpportunities(res.data);
            }).catch(console.error);
        }
    }, [user.role]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Painel</h1>
                    <p className="text-muted">Bem-vindo, {user.name || user.phone}</p>
                    <span className={clsx(
                        "text-xs font-semibold px-2 py-0.5 rounded uppercase mt-1 inline-block",
                        user.role === 'VENDOR' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    )}>
                        {user.role}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate('/settings')} className="btn btn-outline flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Configurações
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline text-red-600 border-red-200">
                        Sair
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                    className="card flex flex-col items-center justify-center py-10 transition-all hover:bg-gray-50 border-2 border-primary/50 hover:border-primary hover:scale-[1.02] active:scale-[0.98] group cursor-pointer text-left"
                    onClick={() => navigate('/requests/new')}
                >
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Nova Cotação</h3>
                    <p className="text-muted text-sm">Buscar peça para um veículo</p>
                </button>

                <button
                    className="card flex flex-col items-center justify-center py-10 transition-all hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-left"
                    onClick={() => navigate('/requests')}
                >
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <List className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Minhas Cotações</h3>
                    <p className="text-muted text-sm">
                        {requestsCount === null ? 'Carregando...' : `${requestsCount} Cotações Ativas`}
                    </p>
                </button>
            </div>

            {/* Vendor Opportunities Widget */}
            {user.role === 'VENDOR' && (
                <div className="mt-8 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-gray-900">Oportunidades para você</h2>
                    </div>

                    {opportunities.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-muted mb-2">Nenhuma solicitação encontrada para suas marcas.</p>
                            <p className="text-sm text-gray-400">Verifique suas preferências em Configurações.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {opportunities.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => navigate(`/requests/${req.id}`)}
                                    className="card p-4 hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500">
                                            {req.make.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{req.partName}</h3>
                                            <p className="text-sm text-muted">{req.make} {req.model} ({req.year}) • {req.color}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                            NOVO
                                        </span>
                                        <p className="text-xs text-muted mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
