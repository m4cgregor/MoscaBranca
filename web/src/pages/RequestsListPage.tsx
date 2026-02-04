
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Plus } from 'lucide-react';
import clsx from 'clsx';

interface Request {
    id: string;
    readableId: string;
    make: string;
    model: string;
    year: number;
    partName: string;
    status: 'OPEN' | 'CLOSED' | 'EXPIRED';
    createdAt: string;
}

export default function RequestsListPage() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-outline p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold">Minhas Cotações</h1>
                </div>
                <button onClick={() => navigate('/requests/new')} className="btn btn-primary text-sm">
                    <Plus className="w-4 h-4" /> Nova
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted">Carregando cotações...</div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 card">
                    <p className="text-muted mb-4">Você ainda não criou nenhuma cotação.</p>
                    <button onClick={() => navigate('/requests/new')} className="btn btn-primary">
                        Criar sua primeira cotação
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <div key={req.id} className="card flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-lg">{req.partName}</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-mono">
                                        {req.readableId}
                                    </span>
                                    <span
                                        className={clsx(
                                            'text-xs px-2 py-0.5 rounded font-bold',
                                            req.status === 'OPEN' && 'bg-green-100 text-green-700',
                                            req.status === 'CLOSED' && 'bg-gray-200 text-gray-500',
                                            req.status === 'EXPIRED' && 'bg-red-100 text-red-700'
                                        )}
                                    >
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted">
                                    {req.make} {req.model} ({req.year})
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/requests/${req.id}`)}
                                className="btn btn-outline text-sm"
                            >
                                Ver
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
