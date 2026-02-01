import { usePreferences } from '@/context/PreferencesContext';

type Props = {
  t: any;
};

export function Step1Language({ t }: Props) {
  const { language, setLanguage } = usePreferences();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{t.selectLang}</h2>
        <p className="text-gray-500">{t.chooseLang}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setLanguage('ID')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
            language === 'ID' 
              ? 'border-pink-500 bg-pink-50/50 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <span className="font-semibold text-gray-700 text-lg">ID - Indonesia</span>
        </button>

        <button
          onClick={() => setLanguage('EN')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
            language === 'EN' 
              ? 'border-pink-500 bg-pink-50/50 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <span className="font-semibold text-gray-700 text-lg">ENG - English</span>
        </button>
      </div>
    </div>
  );
}
