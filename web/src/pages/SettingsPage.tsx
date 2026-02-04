import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Save } from 'lucide-react';
import clsx from 'clsx';

// Reuse the BRANDS list or import it if shared (currently defining locally for speed)
const BRANDS = [
    'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Toyota',
    'Hyundai', 'Honda', 'Renault', 'Nissan', 'Jeep',
    'Mitsubishi', 'BMW', 'Mercedes-Benz', 'Audi', 'Citroën',
    'Peugeot', 'Kia', 'Land Rover', 'Volvo', 'Chery', 'Outra'
].sort();

// Basic Brazilian States & Major Cities
const BRAZIL_STATES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const CITIES: Record<string, string[]> = {
    'SP': ['São Paulo', 'Campinas', 'Guarulhos', 'Ribeirão Preto', 'Sorocaba', 'Outra'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Outra'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Outra'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Outra'],
    'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Outra'],
    'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Outra'],
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Outra'],
    'DF': ['Brasília', 'Outra'],
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Outra'],
    'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Outra'],
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Outra'],
    // Default fallback
    'DEFAULT': ['Capital', 'Interior', 'Outra']
};

export function SettingsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State
    const [role, setRole] = useState<'OFFICE' | 'VENDOR'>('OFFICE');
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState(''); // Street
    const [state, setState] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        api.get('/users/me')
            .then(res => {
                setRole(res.data.role);
                setName(res.data.name || '');
                setEmail(res.data.email || '');
                setAddress(res.data.address || '');
                setState(res.data.state || '');
                setCity(res.data.city || '');
                if (res.data.preferences?.makes) {
                    setSelectedMakes(res.data.preferences.makes);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const toggleMake = (make: string) => {
        if (selectedMakes.includes(make)) {
            setSelectedMakes(prev => prev.filter(m => m !== make));
        } else {
            setSelectedMakes(prev => [...prev, make]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/users/me', {
                role,
                name,
                email,
                address,
                state,
                city,
                makes: role === 'VENDOR' ? selectedMakes : []
            });
            alert('Configurações salvas com sucesso!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    return (
        <div className="container py-8 max-w-lg mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline p-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Configurações de Perfil</h1>
            </div>

            <div className="card space-y-6">

                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Dados Pessoais</h2>

                    <div className="input-group">
                        <label className="input-label">Nome Completo (visível para outros)</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input-field"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="seu@email.com"
                            type="email"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                            <label className="input-label">Estado</label>
                            <select
                                value={state}
                                onChange={e => {
                                    setState(e.target.value);
                                    setCity(''); // Reset city
                                }}
                                className="input-field"
                            >
                                <option value="">Selecione...</option>
                                {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Cidade</label>
                            {state === 'Outro' || (state && !CITIES[state] && !CITIES['DEFAULT']) ? (
                                <input
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    className="input-field"
                                    placeholder="Digite a cidade"
                                />
                            ) : (
                                <select
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    className="input-field"
                                    disabled={!state}
                                >
                                    <option value="">Selecione...</option>
                                    {(CITIES[state] || CITIES['DEFAULT'] || []).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Endereço (Rua, Número, Bairro)</label>
                        <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="input-field"
                            placeholder="Ex: Av. Paulista, 1000, Bela Vista"
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Tipo de Conta</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setRole('OFFICE')}
                            className={clsx(
                                'flex-1 p-4 border-2 rounded-lg text-center font-bold transition-all',
                                role === 'OFFICE' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            )}
                        >
                            Comprador (Oficina)
                        </button>
                        <button
                            onClick={() => setRole('VENDOR')}
                            className={clsx(
                                'flex-1 p-4 border-2 rounded-lg text-center font-bold transition-all',
                                role === 'VENDOR' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            )}
                        >
                            Vendedor (Auto Peças)
                        </button>
                    </div>
                </div>

                {role === 'VENDOR' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded text-sm">
                            Selecione as marcas que você trabalha. Você receberá notificações de cotações apenas destas marcas.
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Marcas de Interesse</label>
                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                                {BRANDS.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => toggleMake(brand)}
                                        className={clsx(
                                            'text-left px-3 py-2 rounded text-sm flex items-center justify-between',
                                            selectedMakes.includes(brand) ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                        )}
                                    >
                                        {brand}
                                        {selectedMakes.includes(brand) && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                    {saving ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Alterações</>}
                </button>

            </div>
        </div>
    );
}
