import React, { useState } from 'react';
import { authService } from '../../services/authService';
import type { AdminUser } from '../../services/authService';
import logoImg from '../../assets/logo.png';
import { 
  X, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminUser) => void;
  onOpenSqlModal: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenSqlModal,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const isSupabase = authService.isConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const admin = await authService.login(email, password);
      onLoginSuccess(admin);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Informe o e-mail cadastrado para recuperação.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await authService.resetPassword(email);
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Falha ao solicitar recuperação de senha.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@7gamer.com');
    setPassword('7gamer123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="bg-gamer-dark-900 border border-gamer-dark-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-gamer-dark-850 to-gamer-dark-950 border-b border-gamer-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={logoImg}
              alt="7 GAMER"
              className="h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,30,66,0.4)]"
            />
            <div>
              <h3 className="text-lg font-bold text-white font-orbitron">
                {isResetMode ? 'Recuperação de Senha' : 'Painel Administrativo'}
              </h3>
              <p className="text-xs text-slate-400">
                Acesso restrito a administradores autorizados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-gamer-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supabase Status Banner */}
        <div className="px-6 py-2.5 bg-gamer-dark-950 border-b border-gamer-dark-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSupabase ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300">
              {isSupabase ? 'Supabase Conectado' : 'Modo Demonstração Ativo'}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenSqlModal}
            className="text-gamer-red-400 hover:text-gamer-red-300 underline font-mono text-[11px]"
          >
            Configurar SQL
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="m-6 mb-0 p-3 rounded-xl bg-gamer-red-500/15 border border-gamer-red-500/30 text-gamer-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Reset Success Feedback */}
        {resetSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-orbitron">
              Instruções Enviadas!
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Se o e-mail informado estiver registrado como administrador, as instruções para redefinição de senha foram encaminhadas com segurança.
            </p>
            <button
              onClick={() => {
                setIsResetMode(false);
                setResetSuccess(false);
                setError(null);
              }}
              className="px-5 py-2 rounded-xl bg-gamer-dark-800 hover:bg-gamer-dark-700 text-slate-200 text-xs font-semibold"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="p-6 space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>E-mail do Administrador</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@7gamer.com"
                  className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gamer-red-500"
                />
              </div>
            </div>

            {/* Password (if not reset mode) */}
            {!isResetMode && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setError(null);
                    }}
                    className="text-[11px] text-gamer-red-400 hover:text-gamer-red-300"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gamer-dark-950 border border-gamer-dark-750 focus:border-gamer-red-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gamer-red-500"
                  />
                </div>
              </div>
            )}

            {/* Quick credentials shortcut for testing demo mode */}
            {!isSupabase && !isResetMode && (
              <div className="p-3 rounded-xl bg-gamer-dark-950 border border-gamer-dark-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Teste local: <code className="text-slate-200">admin@7gamer.com</code> / <code className="text-slate-200">7gamer123</code></span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="px-2 py-0.5 rounded bg-gamer-red-600/20 text-gamer-red-400 hover:bg-gamer-red-600/30 font-semibold"
                >
                  Preencher
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gamer-red-600 hover:bg-gamer-red-500 disabled:opacity-50 text-white font-bold font-orbitron text-xs tracking-wider uppercase transition-all shadow-glow-red-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Verificando autorização...' : isResetMode ? 'Enviar Instruções' : 'Acessar Painel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isResetMode && (
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError(null);
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white py-1"
              >
                Voltar para tela de login
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
