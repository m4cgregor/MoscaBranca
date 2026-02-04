
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Truck, CheckCircle, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

interface RequestDetail {
    id: string;
    readableId: string;
    make: string;
    model: string;
    year: number;
    color: string;
    partName: string;
    description: string;
    status: 'OPEN' | 'CLOSED' | 'EXPIRED';
    createdAt: string;
    photoUrl?: string;
    user?: { phone: string; name: string; address: string };
    deliveries: any[]; // Placeholder for delivery log
}

export default function RequestDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchRequest(id);
    }, [id]);

    const fetchRequest = async (requestId: string) => {
        try {
            const res = await api.get(`/requests/${requestId}`);
            setRequest(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [closing, setClosing] = useState(false);

    const handleCloseRequest = async () => {
        if (!request) return;
        if (!confirm('Tem certeza que deseja encerrar esta cotação? Isso indica que você já comprou a peça.')) return;

        setClosing(true);
        try {
            await api.patch(`/requests/${request.id}/status`, { status: 'CLOSED' });
            // Refresh
            fetchRequest(request.id);
        } catch (err) {
            console.error(err);
            alert('Falha ao encerrar cotação');
        } finally {
            setClosing(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isVendor = user.role === 'VENDOR';

    // ... (rest of code)

    const handleContact = () => {
        if (!request || !request.user?.phone) return;
        const phone = request.user.phone.replace(/\D/g, '');
        const text = encodeURIComponent(`Olá, vi sua cotação de *${request.partName}* para *${request.make} ${request.model}* no Mosca Branca. Tenho interesse.`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    if (loading) return <div className="p-8 text-center text-muted">Carregando...</div>;
    if (!request) return <div className="p-8 text-center text-error">Cotação não encontrada</div>;

    return (
        <div className="container py-8 max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(isVendor ? '/dashboard' : '/requests')} className="btn btn-outline p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {request.readableId}
                            <span className={clsx(
                                'text-xs px-2 py-0.5 rounded font-mono',
                                request.status === 'OPEN' && 'bg-green-100 text-green-700',
                                request.status === 'CLOSED' && 'bg-gray-200 text-gray-500'
                            )}>
                                {request.status === 'CLOSED' ? 'ENCERRADA' : request.status}
                            </span>
                        </h1>
                        <p className="text-muted text-sm">Criado em {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {isVendor && request.status === 'OPEN' ? (
                    <button
                        onClick={handleContact}
                        className="btn btn-primary bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg flex gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Enviar Mensagem
                    </button>
                ) : (
                    request.status === 'OPEN' && (
                        <button
                            onClick={handleCloseRequest}
                            disabled={closing}
                            className="btn bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                        >
                            {closing ? 'Encerrando...' : 'Encerrar Cotação'}
                        </button>
                    )
                )}
            </div>

            <div className="grid gap-6">
                {/* Main Info Card */}
                <div className="card">
                    <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Veículo e Peça</h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-xs text-muted uppercase font-bold">Veículo</label>
                            <p className="text-lg">{request.make} {request.model} <span className="text-muted">({request.year})</span></p>
                        </div>
                        <div>
                            <label className="text-xs text-muted uppercase font-bold">Cor</label>
                            <p className="text-lg">{request.color || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-muted uppercase font-bold">Peça</label>
                        <p className="text-xl font-bold text-primary">{request.partName}</p>
                    </div>

                    <div>
                        <label className="text-xs text-muted uppercase font-bold">Descrição</label>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded mt-1 border border-gray-200">
                            {request.description || 'Nenhuma descrição fornecida.'}
                        </p>
                    </div>
                </div>

                {/* Creator Info (For Vendors) */}
                {isVendor && request.user && (
                    <div className="card animate-fade-in">
                        <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Informações do Comprador</h2>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs text-muted uppercase font-bold">Nome</label>
                                <p className="text-lg font-medium">{request.user.name || 'Não informado'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-muted uppercase font-bold">Endereço</label>
                                <p className="text-gray-900">{request.user.address || 'Endereço não informado'}</p>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={handleContact}
                                    className="text-primary hover:underline text-sm font-bold flex items-center gap-1"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Conversar no WhatsApp ({request.user.phone})
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status / Distribution Card */}
                <div className="card">
                    <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">Status da Distribuição</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-bold">Cotação Criada</p>
                                <p className="text-xs text-muted">{new Date(request.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 opacity-50">
                            <Truck className="w-5 h-5 text-muted mt-0.5" />
                            <div>
                                <p className="font-bold">Distribuição WhatsApp</p>
                                <p className="text-xs text-muted">Pendente (Simulação de envio)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
