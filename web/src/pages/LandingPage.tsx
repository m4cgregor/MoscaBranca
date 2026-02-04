import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Share2, MessageCircle } from 'lucide-react';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">Mosca Branca</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            A rede nº 1 de peças difíceis
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
                            Encontre a peça que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                ninguém tem.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Conectamos oficinas mecânicas diretamente a milhares de auto peças especializadas via WhatsApp. Pare de ligar, comece a encontrar.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
                            <button
                                onClick={() => navigate('/register')}
                                className="h-14 px-8 rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                Começar Agora
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="h-14 px-8 rounded-xl bg-white text-gray-700 text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
                            >
                                Já tenho conta
                            </button>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Como funciona?</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Search,
                                    title: "Você pede a peça",
                                    desc: "Descreva o veículo e a peça que precisa em segundos. É grátis."
                                },
                                {
                                    icon: Share2,
                                    title: "Nós distribuímos",
                                    desc: "Nossa tecnologia envia seu pedido para vendedores especializados na marca."
                                },
                                {
                                    icon: MessageCircle,
                                    title: "Você negocia",
                                    desc: "Receba cotações direto no seu WhatsApp e negocie com o vendedor."
                                }
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <step.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para encontrar aquela peça?</h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Junte-se a centenas de oficinas que economizam tempo todos os dias.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="h-12 px-8 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Criar Conta Grátis
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Mosca Branca. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}
