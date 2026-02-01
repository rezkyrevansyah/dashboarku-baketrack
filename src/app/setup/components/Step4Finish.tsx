import { FiCheckCircle, FiLock, FiCopy, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type Props = {
  t: any;
  copyAdminEmail: () => void;
  copyAdminPass: () => void;
};

export function Step4Finish({ t, copyAdminEmail, copyAdminPass }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{t.allSet}</h2>
        <p className="text-gray-600 text-lg max-w-md">
          {t.dashConnected}
        </p>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white text-gray-800 p-6 rounded-2xl shadow-xl max-w-sm mx-auto transform transition hover:scale-105 duration-300 border border-pink-100">
        <div className="flex items-center gap-2 mb-4 justify-center text-pink-600">
             <FiLock className="w-5 h-5" />
             <span className="font-bold tracking-wider text-sm uppercase">{t.defCreds}</span>
        </div>
        
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex items-center justify-between group hover:border-pink-300 transition-colors">
                <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{t.email}</p>
                    <p className="font-mono text-lg font-medium text-gray-800">admin@admin.com</p>
                </div>
                <button 
                  onClick={copyAdminEmail} 
                  className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all" 
                  title="Copy Email"
                >
                    <FiCopy size={18} />
                </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex items-center justify-between group hover:border-pink-300 transition-colors">
                <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{t.pass}</p>
                    <p className="font-mono text-lg font-medium text-gray-800">admin</p>
                </div>
                <button 
                  onClick={copyAdminPass} 
                  className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all" 
                  title="Copy Password"
                >
                    <FiCopy size={18} />
                </button>
            </div>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 italic">
          {t.changeLater}
        </p>
      </div>

      <button
        onClick={() => router.push('/login')}
        className="w-full max-w-sm bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 mx-auto"
      >
        {t.btnLogin} <FiArrowRight />
      </button>
    </div>
  );
}
