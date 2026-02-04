


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import clsx from 'clsx';

type Step = 'VEHICLE' | 'PART' | 'REVIEW';

export default function CreateRequestPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('VEHICLE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        partName: '',
        description: '',
        photoUrl: '', // Mock for now
    });


    // Common car brands in Brazil
    const BRANDS = [
        'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Toyota',
        'Hyundai', 'Honda', 'Renault', 'Nissan', 'Jeep',
        'Mitsubishi', 'BMW', 'Mercedes-Benz', 'Audi', 'Citroën',
        'Peugeot', 'Kia', 'Land Rover', 'Volvo', 'Chery', 'Outra'
    ].sort();

    const MODELS_BY_BRAND: Record<string, string[]> = {
        'Volkswagen': ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Nivus', 'Jetta', 'Saveiro', 'Amarok', 'Voyage', 'Fox', 'Up!', 'Tiguan', 'Passat'],
        'Chevrolet': ['Onix', 'Onix Plus', 'Tracker', 'S10', 'Spin', 'Cruze', 'Montana', 'Equinox', 'Trailblazer', 'Camaro'],
        'Fiat': ['Strada', 'Mobi', 'Argo', 'Cronos', 'Toro', 'Pulse', 'Fastback', 'Fiorino', 'Ducato', 'Uno', 'Palio', 'Siena'],
        'Ford': ['Ranger', 'Maverick', 'Mustang', 'Territory', 'Bronco', 'Ka', 'Ka Sedan', 'EcoSport', 'Fiesta', 'Focus', 'Fusion'],
        'Toyota': ['Corolla', 'Corolla Cross', 'Hilux', 'Yaris', 'Yaris Sedan', 'SW4', 'RAV4', 'Camry', 'Etios'],
        'Hyundai': ['HB20', 'HB20S', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Azera', 'HR', 'IX35'],
        'Honda': ['Civic', 'City', 'City Hatch', 'HR-V', 'ZR-V', 'CR-V', 'Fit', 'WR-V', 'Accord'],
        'Renault': ['Kwid', 'Sandero', 'Logan', 'Duster', 'Oroch', 'Captur', 'Master', 'Stepway', 'Clio'],
        'Nissan': ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March'],
        'Jeep': ['Renegade', 'Compass', 'Commander', 'Grand Cherokee', 'Wrangler'],
        'Mitsubishi': ['L200 Triton', 'Pajero Sport', 'Eclipse Cross', 'ASX', 'Outlander'],
        'BMW': ['Série 3', 'X1', 'X3', 'X5', 'Série 1', 'Série 5'],
        'Mercedes-Benz': ['Classe C', 'GLA', 'GLC', 'Classe A', 'GLE', 'Sprinter'],
        'Audi': ['A3', 'A4', 'Q3', 'Q5', 'A5'],
        'Citroën': ['C3', 'C3 Aircross', 'C4 Cactus', 'Jumpy'],
        'Peugeot': ['208', '2008', '3008', 'Expert', 'Partner'],
        'Kia': ['Sportage', 'Cerato', 'Stonic', 'Niro', 'Bongo', 'Picanto', 'Soul'],
        'Land Rover': ['Discovery', 'Defender', 'Range Rover Evoque', 'Range Rover Sport'],
        'Volvo': ['XC40', 'XC60', 'XC90', 'S60'],
        'Chery': ['Tiggo 5x', 'Tiggo 7', 'Tiggo 8', 'Arrizo 6', 'iCar'],
        'Outra': ['Outro']
    };

    const currentYear = new Date().getFullYear();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Clamp year
        if (name === 'year') {
            const valNum = parseInt(value);
            if (!isNaN(valNum) && valNum > currentYear) {
                finalValue = currentYear.toString();
            }
        }

        // Reset model if brand changes
        if (name === 'make' && value !== formData.make) {
            setFormData(prev => ({ ...prev, make: finalValue, model: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: finalValue }));
        }
    };

    const handleNext = () => {
        if (step === 'VEHICLE') setStep('PART');
        else if (step === 'PART') setStep('REVIEW');
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/requests', formData);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to create request.');
            setLoading(false);
        }
    };

    return (
        <div className="container py-8 max-w-lg mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline p-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Nova Cotação</h1>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
                {['VEHICLE', 'PART', 'REVIEW'].map((s, idx) => (
                    <div
                        key={s}
                        className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors bg-white',
                            step === s || (step !== s && idx < ['VEHICLE', 'PART', 'REVIEW'].indexOf(step))
                                ? 'border-primary text-primary'
                                : 'border-gray-300 text-gray-400'
                        )}
                    >
                        {idx + 1}
                    </div>
                ))}
            </div>

            <div className="card animate-fade-in">
                {step === 'VEHICLE' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold mb-2">Dados do Veículo</h2>

                        <div className="input-group">
                            <label className="input-label">Marca</label>
                            <select
                                name="make"
                                value={formData.make}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Selecione a marca...</option>
                                {BRANDS.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Modelo</label>
                            {formData.make && MODELS_BY_BRAND[formData.make] ? (
                                <select
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Selecione o modelo...</option>
                                    {MODELS_BY_BRAND[formData.make].map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                    <option value="Outro">Outro</option>
                                </select>
                            ) : (
                                <input
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder={formData.make ? "Digite o modelo" : "Selecione uma marca primeiro"}
                                    className="input-field"
                                    disabled={!formData.make}
                                />
                            )}
                        </div>

                        <div className="flex gap-4">
                            <div className="input-group w-1/2">
                                <label className="input-label">Ano</label>
                                <input
                                    name="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="input-field"
                                    max={currentYear}
                                />
                            </div>
                            <div className="input-group w-1/2">
                                <label className="input-label">Cor</label>
                                <input
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="Ex: Prata"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <button onClick={handleNext} className="btn btn-primary mt-4">
                            Próximo <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {step === 'PART' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold mb-2">Dados da Peça</h2>

                        <div className="input-group">
                            <label className="input-label">Nome da Peça</label>
                            <input
                                name="partName"
                                value={formData.partName}
                                onChange={handleChange}
                                placeholder="Ex: Parachoque Dianteiro"
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Descrição (Opcional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalhes específicos..."
                                className="input-field h-24 resize-none"
                            />
                        </div>

                        {/* Mock Photo Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50">
                            <Camera className="w-8 h-8 text-muted mx-auto mb-2" />
                            <p className="text-sm text-muted">Toque para tirar uma foto</p>
                            <p className="text-xs text-gray-500 mt-1">(Mock - upload indisponível)</p>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button onClick={() => setStep('VEHICLE')} className="btn btn-outline w-1/2">Voltar</button>
                            <button onClick={handleNext} className="btn btn-primary w-1/2">Revisar</button>
                        </div>
                    </div>
                )}

                {step === 'REVIEW' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold mb-2">Revisar Cotação</h2>

                        <div className="bg-gray-100 p-4 rounded-lg text-sm border border-gray-200">
                            <p><span className="text-muted">Veículo:</span> {formData.make} {formData.model} ({formData.year})</p>
                            <p><span className="text-muted">Cor:</span> {formData.color}</p>
                            <p><span className="text-muted">Peça:</span> {formData.partName}</p>
                            <p><span className="text-muted">Desc:</span> {formData.description || 'Nenhuma'}</p>
                        </div>

                        {error && <p className="text-error text-center text-sm">{error}</p>}

                        <div className="flex gap-2 mt-4">
                            <button onClick={() => setStep('PART')} className="btn btn-outline w-1/2">Voltar</button>
                            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary w-1/2">
                                {loading ? 'Publicando...' : 'Publicar Cotação'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
