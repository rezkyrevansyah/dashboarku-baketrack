import { FiDatabase, FiCopy, FiInfo } from 'react-icons/fi';

type Props = {
  t: any;
};

export function Step2Database({ t }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{t.createDb}</h2>
        <p className="text-gray-500">{t.needSheet}</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <FiDatabase size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{t.officialTempl}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t.weHavePrep}
            </p>
          </div>
        </div>

        <a 
          href="https://docs.google.com/spreadsheets/d/1fUzvyAYXWr56PWEVIGTRN21-lhsfcYAWmIaGHcWmwgA/copy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <FiCopy />
          {t.copyTempl}
        </a>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-700">
        <FiInfo className="shrink-0 mt-0.5" />
        <p>{t.afterCopy}</p>
      </div>
    </div>
  );
}
