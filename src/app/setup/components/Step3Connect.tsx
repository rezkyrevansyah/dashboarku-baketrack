import { FiInfo, FiServer } from 'react-icons/fi';

type Props = {
  t: any;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  testStatus: 'idle' | 'testing' | 'success' | 'error';
  setTestStatus: (status: 'idle' | 'testing' | 'success' | 'error') => void;
  testMessage: string;
  handleTestConnection: () => void;
};

export function Step3Connect({ 
  t, 
  apiUrl, 
  setApiUrl, 
  testStatus, 
  setTestStatus, 
  testMessage, 
  handleTestConnection 
}: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
       <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{t.connectApi}</h2>
        <p className="text-gray-500">{t.deployScript}</p>
      </div>

      <div className="space-y-4">
         {/* Desktop Recommendation */}
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-left">
           <div className="text-blue-600 shrink-0 mt-1">
             <FiServer size={20} />
           </div>
           <div>
             <h4 className="font-bold text-blue-800 text-sm mb-1">{t.desktopRecTitle}</h4>
             <p className="text-xs text-blue-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.desktopRecText.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
           </div>
         </div>

        {/* Google Warning Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-left">
           <div className="text-amber-600 shrink-0 mt-1">
             <FiInfo size={20} />
           </div>
           <div>
             <h4 className="font-bold text-amber-800 text-sm mb-1">{t.googleWarnTitle}</h4>
             <p className="text-xs text-amber-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.googleWarnText.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
           </div>
        </div>

        {/* Accordion Guide */}
        <details className="group bg-white border border-gray-200 rounded-lg open:ring-2 open:ring-pink-100">
          <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-800">
             <span>{t.howTo}</span>
             <span className="transition group-open:rotate-180">▼</span>
          </summary>
          <div className="p-4 pt-0 text-sm text-gray-600 space-y-2 border-t mt-2 pt-4">
            <p dangerouslySetInnerHTML={{ __html: t.step1.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: t.step2.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: t.step3.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: t.step4.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: t.step5.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
          </div>
        </details>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {t.labelUrl}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiServer />
                </div>
                <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => {
                        setApiUrl(e.target.value);
                        setTestStatus('idle'); // Reset test status on change
                    }}
                    placeholder={t.placeholderUrl}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:ring-2 outline-none transition-all text-gray-800 placeholder-gray-400 ${
                        testStatus === 'error' ? 'border-red-500 focus:ring-red-200' : 
                        testStatus === 'success' ? 'border-green-500 focus:ring-green-200' : 
                        'border-gray-300 focus:ring-pink-500'
                    }`}
                />
            </div>
            
            {/* Validation / Test Message */}
            <div className="flex items-center justify-between min-h-[24px]">
                <p className="text-xs text-gray-400">{t.urlHint}</p>
                {testStatus === 'error' && <span className="text-xs text-red-500 font-medium">{testMessage}</span>}
                {testStatus === 'success' && <span className="text-xs text-green-500 font-medium">{testMessage}</span>}
            </div>

            {/* Test Button */}
            <button
                onClick={handleTestConnection}
                disabled={!apiUrl || testStatus === 'testing'}
                className="text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 disabled:opacity-50"
            >
                {testStatus === 'testing' ? t.testing : t.testConn}
            </button>
        </div>
      </div>
    </div>
  );
}
